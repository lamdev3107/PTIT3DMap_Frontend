import React, { useState, useEffect } from "react";
import { X, MapPin, Info, Navigation, Users, Home } from "lucide-react";
import { BUILDINGS } from "./MainMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ROUTES } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ImageZoom } from "./ImageZoom";
import { motion, AnimatePresence } from "framer-motion";

const BuildingInfo = ({ building, selectedFloor }) => {
  const navigate = useNavigate();
  const getBuildingCategoryIcon = (category) => {
    switch (category) {
      case "administrative":
        return <Home className="h-5 w-5" />;
      case "library":
        return <Info className="h-5 w-5" />;
      case "science":
        return <Navigation className="h-5 w-5" />;
      case "student":
        return <Users className="h-5 w-5" />;
      case "engineering":
        return <MapPin className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

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
    <AnimatePresence>
      {building && (
        <motion.div
          className="float-right mt-12 h-full z-30 w-1/3 relative"
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
            <div className="flex items-center justify-between py-8 ml-10 border-b border-gray-200/20">
              <div className="flex items-center">
                {/* <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-2"
                  style={{ backgroundColor: building.color }}
                >
                  {getBuildingCategoryIcon(building.category)}
                </div> */}
                <h2 className="text-3xl text-red-primary font-semibold">
                  {building.name}
                </h2>
              </div>
            </div>

            <>
              {/* <div className="px-4 pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Thông tin</TabsTrigger>
                  <TabsTrigger value="rooms">Phòng</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="info" className="p-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Mô tả</h3>
                  <p className="text-sm text-gray-600">
                    {building.description || "Không có thông tin mô tả."}
                  </p>
                </div>

             
              </TabsContent> */}

              <div className="px-10">
                {selectedFloor ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <h3 className="font-medium mb-3">{selectedFloor.name}</h3>

                    {/* Floor plan would go here in a real implementation */}
                    <div className="bg-black/10 h-40 rounded-lg mb-4 flex items-center justify-center">
                      {selectedFloor.image ? (
                        <ImageZoom
                          src={selectedFloor.image}
                          className={"h-full object-contain"}
                        />
                      ) : (
                        <p className="text-sm text-center">
                          Sơ đồ mặt bằng sẽ hiển thị ở đây
                        </p>
                      )}
                    </div>

                    <h4 className="font-medium mb-2">Danh sách phòng:</h4>
                    <div className="h-36 overflow-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-h-fit h-24 overflow-y-auto">
                        {selectedFloor?.rooms?.length > 0 ? (
                          selectedFloor?.rooms?.map((room, index) => (
                            <motion.div
                              key={room.id}
                              className="p-3 bg-white/40 rounded-lg hover:bg-white/75 transition cursor-pointer"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: 0.5 + index * 0.1,
                                duration: 0.5,
                              }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <p className="font-medium">{room.name}</p>
                              <p className="text-xs text-gray-500">
                                {room.type}
                              </p>
                            </motion.div>
                          ))
                        ) : (
                          <p>Không có thông tin về phòng.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <p>Không có thông tin về tầng.</p>
                )}
              </div>
            </>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuildingInfo;
