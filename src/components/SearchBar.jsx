import React, { useState, useEffect } from "react";
import { Search, X, Building, DoorClosed } from "lucide-react";
import { BUILDINGS } from "./MainMap";

const SearchBar = ({ onSelectBuilding, onSelectRoom }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
    setIsExpanded(false);
  };

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 w-11/12 max-w-md transition-all duration-300 ${
        isExpanded ? "scale-105" : "scale-100"
      }`}
    >
      <div className="glassmorphism rounded-xl overflow-hidden transition-all duration-300 shadow-xl">
        <div className="flex items-center p-3">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm tòa nhà, phòng, cơ sở vật chất..."
            className="w-full bg-transparent border-none focus:outline-none text-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
          />
          {isExpanded && (
            <button
              onClick={() => {
                setIsExpanded(false);
                setQuery("");
              }}
              className="p-1 rounded-full hover:bg-gray-200/20"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {isExpanded && results.length > 0 && (
          <div className="max-h-60 overflow-y-auto border-t border-gray-100/20">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-5 py-3 hover:bg-white/10 transition-colors flex items-center"
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
    </div>
  );
};

export default SearchBar;
