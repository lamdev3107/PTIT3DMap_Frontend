import React, { useState, useEffect } from "react";
import { X, MapPin, Info, Navigation, Users, Home } from "lucide-react";
import { BUILDINGS } from "./MainMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const BuildingInfo = ({
  buildingId,
  onClose,
  selectedFloor,
  onSelectFloor,
}) => {
  const [building, setBuilding] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [currentFloor, setCurrentFloor] = useState(null);

  useEffect(() => {
    if (buildingId) {
      const foundBuilding = BUILDINGS.find((b) => b.id === buildingId) || null;
      setBuilding(foundBuilding);

      // Set default floor if no floor is selected
      if (
        foundBuilding &&
        foundBuilding.floors &&
        foundBuilding.floors.length > 0
      ) {
        const defaultFloor = selectedFloor || foundBuilding.floors[0].level;
        onSelectFloor(defaultFloor);
      }
    } else {
      setBuilding(null);
      setCurrentFloor(null);
    }
  }, [buildingId, selectedFloor, onSelectFloor]);

  useEffect(() => {
    if (building && building.floors && selectedFloor !== null) {
      const floor =
        building.floors.find((f) => f.level === selectedFloor) || null;
      setCurrentFloor(floor);
    } else {
      setCurrentFloor(null);
    }
  }, [building, selectedFloor]);

  if (!building) return null;

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

  return (
    <>
      {building && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 w-96 max-w-sm">
          <div className="glassmorphism rounded-xl overflow-hidden shadow-xl animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-200/20">
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: building.color }}
                >
                  {getBuildingCategoryIcon(building.category)}
                </div>
                <h2 className="text-xl font-semibold">{building.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-200/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 pt-2">
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

                <div>
                  <h3 className="font-medium mb-2">Vị trí</h3>
                  <div className="bg-black/10 p-3 rounded-lg">
                    <p className="text-sm">
                      Tọa độ: X: {building.position[0]}, Y:{" "}
                      {building.position[1]}, Z: {building.position[2]}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="p-4">
                {currentFloor ? (
                  <div>
                    <h3 className="font-medium mb-3">{currentFloor.name}</h3>

                    {/* Floor plan would go here in a real implementation */}
                    <div className="bg-black/10 h-40 rounded-lg mb-4 flex items-center justify-center">
                      <p className="text-sm text-center">
                        Sơ đồ mặt bằng sẽ hiển thị ở đây
                      </p>
                    </div>

                    <h4 className="font-medium mb-2">Danh sách phòng:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-h-fit max-h-h-44 overflow-y-auto">
                      {currentFloor.rooms.map((room) => (
                        <div
                          key={room.id}
                          className="p-3 bg-white/40 rounded-lg hover:bg-white/75  transition cursor-pointer"
                        >
                          <p className="font-medium">{room.name}</p>
                          <p className="text-xs text-gray-500">{room.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>Không có thông tin về tầng.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default BuildingInfo;
