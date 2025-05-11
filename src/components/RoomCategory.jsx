import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftIcon, X } from "lucide-react";
import { FaAngleRight } from "react-icons/fa";
import { useApp } from "@/provider/AppProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
export const RoomCategory = ({ onClose }) => {
  const { navigationList, setSelectedRoom } = useApp();
  const containterRef = useRef(null);
  const navigate = useNavigate();
  const [selectedNavigation, setSelectedNavigation] = useState(null);
  const [roomsData, setRoomsData] = useState();
  const handleClickOutside = (event) => {
    if (
      containterRef.current &&
      !containterRef.current.contains(event.target)
    ) {
      onClose();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  const slideInVariants = {
    initial: {
      x: "100%",
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };

  const fetchNavigationRooms = async (navigationId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/navigations/${navigationId}/rooms`
      );
      const data = response.data.data;
      setRoomsData(data);
    } catch (error) {
      console.log("Check error", error);
    }
  };
  //   console.log("Check roomCatei", navigationList)
  const handleClickNavigation = (navigation) => {
    setSelectedNavigation(navigation.name);
    fetchNavigationRooms(navigation.id);
  };
  return (
    navigationList.length > 0 && (
      <motion.div
        className="fixed right-0 top-0 bottom-0 h-full p-2 bg-gradient-to-b from-red-700/85 to-red-500/85 shadow-lg z-50 min-w-[400px] "
        variants={slideInVariants}
        initial="initial"
        animate="animate"
        ref={containterRef}
        exit="exit"
      >
        <div className=" pt-16 pb-8 ">
          <div className="px-10 mb-5 flex justify-between items-center">
            {selectedNavigation ? (
              <div className="group flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedNavigation(null);
                    setRoomsData(null);
                  }}
                  className="bg-transparent text-red-300 hover:text-white cursor-pointer   animate-fadeIn   rounded-full border-none flex justify-center items-center w-9 h-9 p-2"
                >
                  <ArrowLeftIcon />
                </button>
                <h2 className="text-xl font-semibold  text-white mb-0">
                  {selectedNavigation}
                </h2>
              </div>
            ) : (
              <h2 className="text-xl font-semibold  text-white mb-0">
                Danh mục phòng ban
              </h2>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="rounded-full p-3 border border-gray-300 hover:border-white group cursor-pointer"
            >
              <X className="h-4 w-4 text-gray-300 group-hover:text-white" />
            </motion.button>
          </div>

          <ul className="space-y-5 h-[calc(100vh-220px)] overflow-y-auto px-12">
            {!roomsData &&
              navigationList.map((navigation, index) => (
                <motion.div
                  key={navigation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                >
                  <div
                    onClick={() => handleClickNavigation(navigation)}
                    className="group cursor-pointer flex items-center py-4 relative justify-between gap-2 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-white/50 before:transition-all before:duration-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full"
                  >
                    <div className="flex items-center gap-3">
                      <p className="text-md  text-white/70 group-hover:text-white">
                        {navigation.name}
                      </p>
                    </div>

                    <FaAngleRight className="group-hover:text-white text-white/70 h-5 w-5" />
                  </div>
                </motion.div>
              ))}
            {roomsData &&
              roomsData.length > 0 &&
              roomsData.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.2 }}
                >
                  <div
                    onClick={() => {
                      setSelectedRoom(room);
                      setTimeout(() => {
                        navigate(
                          ROUTES.BUILDING_DETAIL.replace(
                            ":id",
                            room.floor.buildingId
                          )
                        );
                      }, 1200); // Wait 1.2 seconds for animation to complete
                    }}
                    className="group cursor-pointer flex items-center py-2 relative justify-between gap-2 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-white/50 before:transition-all before:duration-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-500 hover:after:w-full"
                  >
                    <div className="flex items-center gap-3">
                      <p className="text-md  text-white/70 group-hover:text-white">
                        {room.name}
                      </p>
                    </div>

                    <FaAngleRight className="group-hover:text-white text-white/70 h-5 w-5" />
                  </div>
                </motion.div>
              ))}
          </ul>
        </div>
      </motion.div>
    )
  );
};
