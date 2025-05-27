import React, { useState, useEffect } from "react";
import { Search, X, DoorClosed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import logo from "@/assets/logo.png";
import { RiLayoutGridFill } from "react-icons/ri";
import useDebounce from "@/hooks/useDebounce";
import campusTourData from "@/assets/campus_tour.json";
import Tour360Viewer from "./Tour360Viewer";
import { TbView360Number } from "react-icons/tb";

const Navbar = ({ setOpenRoomCategory }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const [showTour360, setShowTour360] = useState(false);
  const [scenes, setScenes] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setScenes(campusTourData.scenes);
  }, [campusTourData]);

  const fetchData = async (query) => {
    const searchValueParams = {
      name: query,
    };
    try {
      let searchParam = new URLSearchParams(searchValueParams).toString();
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/rooms?" + searchParam
      );
      let data = await response.json();
      data = data?.data;
      if (data) {
        setResults(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
      fetchData();
    }
  };

  const onBlurSearch = () => {
    setTimeout(() => {
      setIsSearchExpanded(false);
      setSearchValue("");
      setResults([]);
    }, 200);
  };

  useEffect(() => {
    if (debouncedValue) {
      fetchData(debouncedValue);
    }
  }, [debouncedValue]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to={ROUTES.HOME}
            className="text-2xl text-red-primary flex items-center gap-4 font-bold text-gradient"
          >
            <img src={logo} alt="" className="h-12" />
            <span className="md:block hidden">BẢN ĐỒ PTIT</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search  */}
          <div className="relative z-50">
            <div
              className={`bg-white  shadow-md flex items-center transition-all duration-300 ${
                isSearchExpanded
                  ? "w-80 rounded-xl hidden"
                  : "w-12 rounded-full hover:bg-red-primary"
              } h-12 z-50`}
            >
              <div
                className="flex group cursor-pointer items-center justify-center w-10 h-10"
                onClick={() => setIsSearchExpanded((prev) => !prev)}
              >
                <Search
                  size={16}
                  className={`font-bold translate-x-0.5 text-red-primary ${
                    !isSearchExpanded && "group-hover:text-white"
                  }`}
                />
              </div>

              {isSearchExpanded && (
                <>
                  <input
                    type="text"
                    onBlur={onBlurSearch}
                    placeholder="Tìm kiếm phòng ban..."
                    className="w-full relative z-20 bg-transparent border-none focus:outline-none text-foreground pr-3"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    autoFocus
                  />
                  {searchValue && (
                    <button
                      onClick={() => {
                        setSearchValue("");
                      }}
                      className="p-1 mr-2 rounded-full hover:bg-gray-200/20"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </>
              )}
            </div>
            {isSearchExpanded && (
              <div>
                <div
                  className="fixed inset-0 bg-black/50 z-10"
                  onClick={onBlurSearch}
                ></div>
                <div
                  className={`bg-white relative  shadow-md flex items-center transition-all duration-300 ${
                    isSearchExpanded
                      ? "w-80 rounded-xl "
                      : "w-12 rounded-full hover:bg-red-primary"
                  } h-12 z-50`}
                >
                  <div
                    className="flex group cursor-pointer items-center justify-center w-10 h-10"
                    onClick={() => setIsSearchExpanded((prev) => !prev)}
                  >
                    <Search
                      size={16}
                      className={`font-bold translate-x-0.5 text-red-primary ${
                        !isSearchExpanded && "group-hover:text-white"
                      }`}
                    />
                  </div>

                  {isSearchExpanded && (
                    <>
                      <input
                        type="text"
                        onBlur={onBlurSearch}
                        placeholder="Tìm kiếm phòng ban..."
                        className="w-full relative z-20 bg-transparent border-none focus:outline-none text-foreground pr-3"
                        value={searchValue}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setSearchValue(e.target.value)}
                        autoFocus
                      />
                      {searchValue && (
                        <button
                          onClick={() => {
                            setSearchValue("");
                          }}
                          className="p-1 mr-2 rounded-full hover:bg-gray-200/20"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                    </>
                  )}
                </div>
                {results.length && searchValue.length > 0 ? (
                  <div className="absolute w-fit top-[calc(100%+2px)] right-0 left-0 bg-white rounded-xl overflow-hidden shadow-lg max-h-60 overflow-y-auto z-50">
                    {results.map((result) => (
                      <button
                        onClick={() => {
                          navigate(
                            ROUTES.BUILDING_DETAIL.replace(
                              ":id",
                              result.floor.buildingId
                            )
                          );
                        }}
                        key={result.id}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors flex items-center"
                      >
                        <DoorClosed className="flex-shrink-0 h-4 w-4 mr-3" />
                        <span>
                          {result.name +
                            " (" +
                            result?.floor?.building?.name +
                            ")"}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : searchValue.length > 0 ? (
                  <div className="absolute w-full top-[calc(100%+2px)] right-0 left-0 bg-white rounded-xl overflow-hidden shadow-lg max-h-60 overflow-y-auto z-50 px-3 py-2">
                    Không tìm thấy kết quả
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowTour360(true)}
            className="cursor-pointer px-5 py-3.5 text-sm flex items-center gap-2 text-red-700 rounded-2xl shadow-md text-color-text bg-white hover:bg-red-primary hover:text-white transition-all duration-300"
          >
            <TbView360Number size={20} />
            <span className="md:block hidden">Tour 360 </span>
          </button>

          {/* Category  */}
          <button
            onClick={() => setOpenRoomCategory(true)}
            className={`cursor-pointer px-5 py-3.5 text-sm flex items-center gap-2 text-red-700 rounded-2xl shadow-md text-color-text bg-white hover:bg-red-primary hover:text-white transition-all duration-300 `}
          >
            <RiLayoutGridFill size={20} />
            <span className={`${!isSearchExpanded && " md:block hidden"}    `}>
              Danh mục phòng ban
            </span>
          </button>
        </div>
      </div>
      <Tour360Viewer
        open={showTour360}
        data={scenes}
        setOpen={setShowTour360}
      />
    </header>
  );
};

export default Navbar;
