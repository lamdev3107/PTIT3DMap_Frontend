import React, { useState, useEffect } from "react";
import { X, MapPin, Info, Navigation, Users, Home } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ROUTES } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ImageZoom } from "./ImageZoom";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleLeft } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const BuildingInfo = ({
  building,
  selectedFloor,
  selectedRoom,
  onSelectRoom,
}) => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState([]);

  const fetchSelectedRooom = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/rooms/${selectedRoom?.id}`
      );
      setRoomData(response.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi lấy thông tin tòa nhà");
    }
  };
  useEffect(() => {
    fetchSelectedRooom();
  }, [selectedRoom]);

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
  return (
    building && (
      <motion.div
        className=" mt-12 flex-shrink-0 flex-1 h-full min-w-[400px] z-30 w-1/3 relative"
        variants={slideInVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="absolute top-12 -left-9 z-30 rounded-full bg-[#ecf4ff] p-2"
          onClick={() => {
            navigate(ROUTES.HOME);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button className="bg-red-primary text-white rounded-full p-3  hover:bg-red-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </motion.div>

        <motion.div
          className="bg-white rounded-tl-4xl h-[calc(100vh-3rem)] overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between pt-8 pb-4 ml-10 border-b border-gray-200/20">
            <div className="flex items-center">
              <h2 className="text-3xl text-red-primary font-semibold">
                {building.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center mb-3 group line-clamp-1 lg:px-10 md:px-8 px-4 ">
            <h3
              onClick={() => {
                if (selectedRoom) {
                  onSelectRoom(null);
                }
              }}
              className={`font-bold flex-shrink-0 line-clamp-1 ${
                selectedRoom
                  ? "text-gray-500 hover:text-blue-950 cursor-pointer "
                  : "text-blue-950 "
              } flex items-center group`}
            >
              {selectedRoom && (
                <span className="mr-1">
                  <FaAngleLeft
                    className={`text-gray-500 group-hover:text-blue-950 cursor-pointer`}
                  />
                </span>
              )}
              {selectedFloor?.name}
            </h3>
            {roomData &&
              (roomData?.name?.length <= 50 ? (
                <div className=" flex items-center line-clamp-1">
                  <span className="mx-2 group:line-clamp-1">/</span>
                  <h3 className={`font-bold  text-blue-950 line-clamp-1`}>
                    {roomData.name}
                  </h3>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group  flex items-center line-clamp-1">
                      <span className="mx-2 group:line-clamp-1">/</span>
                      <h3 className={`font-bold text-blue-950 line-clamp-1`}>
                        {roomData?.name}
                      </h3>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-red-primary text-white"
                    side="top"
                  >
                    <p>{roomData?.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>

          {selectedFloor ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col lg:px-10 md:px-8 px-4  h-full w-full overflow-y-auto max-h-[calc(100vh-185px)]"
            >
              {/* Image */}
              <div className="bg-black/10 h-40 rounded-lg mb-4 flex items-center justify-center min-h-20">
                {roomData &&
                  (roomData.image ? (
                    <ImageZoom
                      src={roomData.image}
                      className={"h-full object-contain"}
                    />
                  ) : (
                    <p className="text-sm text-center">
                      Sơ đồ mặt bằng sẽ hiển thị ở đây
                    </p>
                  ))}
                {!selectedRoom &&
                  (selectedFloor.image ? (
                    <ImageZoom
                      src={selectedFloor.image}
                      className={"h-full object-contain"}
                    />
                  ) : (
                    <p className="text-sm text-center">
                      Sơ đồ mặt bằng sẽ hiển thị ở đây
                    </p>
                  ))}
              </div>

              {selectedFloor?.description &&
                selectedFloor?.description?.length > 0 &&
                !selectedRoom && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="ql-editor h-fit  overflow-hidden text-gray-600 min-h-fit"
                    dangerouslySetInnerHTML={{
                      __html: selectedFloor?.description,
                    }}
                  ></motion.div>
                )}

              {roomData?.description && roomData?.description?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="ql-editor h-full  overflow-hidden text-gray-600 min-h-fit"
                  dangerouslySetInnerHTML={{
                    __html: roomData?.description,
                  }}
                ></motion.div>
              )}

              {/* Rooms section  */}
              {!roomData ? (
                <>
                  <h4 className="font-bold mb-3 text-blue-950">
                    Danh sách phòng:
                  </h4>
                  <div className="h-full ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 min-h-fit ">
                      {selectedFloor?.rooms?.length > 0 ? (
                        selectedFloor?.rooms?.map((room, index) => (
                          <motion.div
                            onClick={() => {
                              onSelectRoom(room);
                            }}
                            key={room.id}
                            className={`col-span-1 p-3 ${
                              room.id === selectedRoom?.id
                                ? "bg-red-primary text-white"
                                : "text-slate-800 bg-blue-50"
                            }  rounded-lg flex justify-between items-center hover:bg-red-primary group hover:text-white transition cursor-pointer `}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              duration: 0.5,
                            }}
                          >
                            <p className="text-md">{room.name}</p>
                            <p
                              className={`text-xs ${
                                selectedRoom?.id == room.id
                                  ? "text-gray-100"
                                  : "text-gray-500"
                              } group-hover:text-gray-100 `}
                            >
                              {room.roomId}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic w-full col-span-2">
                          Không có thông tin về danh sách phòng.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </motion.div>
          ) : (
            <p>Không có thông tin về tầng.</p>
          )}
        </motion.div>
      </motion.div>
    )
  );
};

export default BuildingInfo;
