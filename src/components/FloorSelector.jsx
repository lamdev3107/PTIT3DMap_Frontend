import React from "react";
import { BUILDINGS } from "./MainMap";
import { Button } from "./ui/button";
import { Layers } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const FloorSelector = ({ buildingId, selectedFloor, onSelectFloor }) => {
  if (!buildingId) return null;

  const building = BUILDINGS.find((b) => b.id === buildingId);
  if (!building || !building.floors || building.floors.length <= 1) return null;

  // Sort floors from highest to lowest
  const floors = [...building.floors].sort((a, b) => b.level - a.level);

  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30 transition-opacity duration-700 ease-in-out">
      <div className="glassmorphism p-2 rounded-xl flex flex-col items-center gap-2 animate-fade-in">
        <div className="flex items-center justify-center mb-2">
          <Layers className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Tầng</span>
        </div>

        {floors.map((floor) => (
          <Tooltip key={floor.level}>
            <TooltipTrigger asChild>
              <Button
                variant={selectedFloor === floor.level ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectFloor(floor.level)}
                className={`w-12 h-12 rounded-full transition-all duration-300 ${
                  selectedFloor === floor.level
                    ? "scale-110"
                    : "hover:scale-105"
                }`}
              >
                {floor.level}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{floor.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default FloorSelector;
