import React, { useState, useEffect } from "react";
import { Search, X, Building, DoorClosed } from "lucide-react";
import { BUILDINGS } from "./MainMap";
import { Link } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import logo from "@/assets/logo.png";

const Navbar = ({ onSearch, onSelectBuilding, onSelectRoom }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = [];

      // Search buildings
      BUILDINGS.forEach((building) => {
        if (building.name.toLowerCase().includes(query.toLowerCase())) {
          searchResults.push({
            id: building.id,
            name: building.name,
            type: "building",
          });
        }

        // Search rooms inside buildings
        if (building.floors) {
          building.floors.forEach((floor) => {
            floor.rooms.forEach((room) => {
              if (room.name.toLowerCase().includes(query.toLowerCase())) {
                searchResults.push({
                  id: room.id,
                  name: room.name,
                  type: "room",
                  buildingId: building.id,
                  floorLevel: floor.level,
                });
              }
            });
          });
        }
      });

      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelectResult = (result) => {
    if (result.type === "building") {
      onSelectBuilding(result.id);
    } else if (
      result.type === "room" &&
      result.buildingId &&
      result.floorLevel !== undefined &&
      onSelectRoom
    ) {
      onSelectRoom(result.buildingId, result.id, result.floorLevel);
    }

    setQuery("");
    setIsSearchExpanded(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to={ROUTES.HOME}
              className="text-2xl text-red-primary flex items-center gap-4 font-bold text-gradient"
            >
              <img src={logo} alt="" className="h-12" />
              PTIT 3D MAP
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div
                className={`bg-white shadow-md flex items-center rounded-full transition-all duration-300 ${
                  isSearchExpanded ? "w-64" : "w-10"
                } h-10`}
              >
                <div
                  className="flex items-center justify-center w-10 h-10"
                  onClick={() => setIsSearchExpanded((prev) => !prev)}
                >
                  <Search className="h-4 w-4 text-gray-500" />
                </div>

                {isSearchExpanded && (
                  <>
                    <input
                      type="text"
                      placeholder="Tìm kiếm phòng ban..."
                      className="w-full bg-transparent  border-none focus:outline-none text-foreground pr-3"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      autoFocus
                    />
                    {query && (
                      <button
                        onClick={() => {
                          setQuery("");
                        }}
                        className="p-1 mr-2 rounded-full hover:bg-gray-200/20"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </>
                )}
              </div>

              {isSearchExpanded && results.length > 0 && (
                <div className="absolute top-full right-0  rounded-xl overflow-hidden shadow-lg max-h-60 overflow-y-auto">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors flex items-center"
                    >
                      {result.type === "building" ? (
                        <Building className="h-4 w-4 mr-3" />
                      ) : (
                        <DoorClosed className="h-4 w-4 mr-3" />
                      )}
                      <div>
                        <span>{result.name}</span>
                        {result.type === "room" && (
                          <p className="text-xs text-gray-400">
                            {BUILDINGS.find((b) => b.id === result.buildingId)
                              ?.name || ""}{" "}
                            - Tầng {result.floorLevel}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <nav className="hidden md:flex">
              <ul className="flex space-x-3">
                {["Bản đồ", "Tòa nhà", "Hướng dẫn", "Giới thiệu"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="px-4 py-2.5 rounded-full  shadow-md text-color-text bg-white hover:bg-red-primary hover:text-white transition-all duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
