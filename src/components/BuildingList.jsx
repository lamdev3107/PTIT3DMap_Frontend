import { useApp } from "@/provider/AppProvider";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { FaAngleRight } from "react-icons/fa";
import { HOTSPOTS } from "@/utils/hotspotData";
import { ImageZoom } from "./ImageZoom";

export const BuildingList = ({ onClose, onClick }) => {
  const { buildingList } = useApp();
  const containter = useRef(null);
  const hanndleOnClickOutside = (event) => {
    if (containter.current && !containter.current.contains(event.target)) {
      // onClose();
    }
  };
  useEffect(() => {
    window.addEventListener("click", hanndleOnClickOutside);
    return () => {
      window.removeEventListener("click", hanndleOnClickOutside);
    };
  }, []);
  const slideInVariants = {
    initial: {
      x: "-100%",
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
      x: "-100%",
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };
  return (
    HOTSPOTS.length > 0 && (
      <motion.div
        ref={containter}
        className="fixed left-0 top-0 bottom-0 mt-20 h-full p-2 rounded-tr-4xl bg-white shadow-lg z-50 min-w-[400px] w-1/3 "
        variants={slideInVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <motion.div
          className="absolute top-12 -right-9 z-30 rounded-full bg-[#ecf4ff] p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <button className="bg-red-primary text-white rounded-full p-3  hover:bg-red-600 cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </motion.div>
        <div className=" pt-14 pb-4">
          <h2 className="text-xl font-semibold mb-4 text-red-primary px-12 ">
            Danh sách các tòa nhà
          </h2>
          <motion.ul className="space-y-2 h-[calc(100vh-220px)] overflow-y-auto px-12 ">
            {HOTSPOTS.map((building, index) => (
              <motion.div
                key={building.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
              >
                <div className="group flex items-center space-x-2 py-4 border-b last:border-none gap-2 ">
                  <ImageZoom
                    src={building.thumbnail}
                    alt={building.name}
                    className="w-12 h-12 rounded-md bg-gray-400 object-fit-contain "
                  />
                  <Link
                    onClick={() => {
                      onClick(building.time);
                      onClose();
                    }}
                    href={`/detail-building`}
                    className="flex items-center justify-between w-full"
                  >
                    <p className="text-[14px] text-black group-hover:text-red-primary">
                      {building.name}
                    </p>
                    <Button className="rounded-full border bg-white px-4 group-hover:bg-red-primary hover:bg-red-primary h-8 text-red-primary group-hover:text-white  ">
                      <FaAngleRight className="h-6 w-6" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    )
  );
};
