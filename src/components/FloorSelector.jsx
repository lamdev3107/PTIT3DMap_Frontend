import React from "react";
import { BUILDINGS } from "./MainMap";
import { Button } from "./ui/button";
import { Layers } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const FloorSelector = ({ building, selectedFloor, onSelectFloor }) => {
  if (!building) return null;

  // Sort floors from highest to lowest
  const floors = [...building.floors].sort((a, b) => b.level - a.level);
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30 transition-opacity duration-700 ease-in-out">
      <div className="bg-white shadow-lg p-3 rounded-xl flex flex-col items-center gap-2 animate-fade-in">
        <div className="flex items-center justify-center mb-2">
          <Layers className="h-5 w-5 mr-2" />
          <span className="text-sm font-semibold text-red">Tầng</span>
        </div>

        {floors.map((floor, index) => (
          <Tooltip key={floor.id}>
            <TooltipTrigger asChild>
              <Button
                // variant={selectedFloor === floor.id ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectFloor(floor)}
                className={`w-12 h-12 rounded-full transition-all duration-300 ${
                  selectedFloor?.id === floor.id
                    ? "  hover:bg-red-primary bg-red-primary text-white"
                    : "hover:scale-105 hover:bg-blue-100 bg-[#f4f5f9] text-color-text"
                }`}
              >
                {floors.length - index}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-red-primary text-white" side="right">
              <p>{floor.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default FloorSelector;
