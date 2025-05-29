import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Layers } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const FloorSelector = ({ building, selectedFloor, onSelectFloor }) => {
  if (!building) return null;

  // Sort floors from highest to lowest
  const floors = [...building.floors].sort((a, b) => a.id - b.id);
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30 transition-opacity duration-700 ease-in-out max-h-[50vh]">
      <div className="bg-white shadow-lg pb-2 rounded-xl flex flex-col  items-center gap-2 animate-fade-in">
        <div className="flex items-center justify-center mb-2 px-3 pt-3">
          <Layers className="h-5 w-5 mr-2  text-blue-950" />
          <span className="text-sm font-semibold text-blue-950">Tầng</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-h-[400px] overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2 p-3"
        >
          {floors.map((floor, index) => (
            <div
              className=""
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + index * 0.1,
                duration: 0.5,
              }}
              key={floor.id}
            >
              <Tooltip className="h-fit">
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onSelectFloor(floor)}
                    className={`w-12 h-12 rounded-full transition-all duration-300 ${
                      selectedFloor?.id === floor.id
                        ? "  hover:bg-red-primary bg-red-primary text-white"
                        : "hover:scale-105  bg-blue-100 hover:bg-red-primary hover:text-white text-color-text"
                    }`}
                  >
                    {index + 1}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-red-primary text-white"
                  side="right"
                >
                  <p>{floor.name}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FloorSelector;
