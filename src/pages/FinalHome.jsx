import React, { useState, useEffect } from "react";
import { ArrowDown, MousePointer } from "lucide-react";
import MainMap from "@/components/MainMap";
import Navbar from "@/components/Navbar";
import BuildingInfo from "@/components/BuildingInfo";
import FloorSelector from "@/components/FloorSelector";
import LoadingScreen from "@/components/LoadingScreen";

const FinalHome = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showTourHint, setShowTourHint] = useState(true);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500); // Small delay before hiding loading screen
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleSelectBuilding = (id) => {
    setSelectedBuilding(id);
    setSelectedFloor(null); // Reset selected floor when a new building is selected
    setShowScrollHint(false);
    setShowTourHint(false);
  };

  const handleSelectRoom = (buildingId, roomId, floorLevel) => {
    setSelectedBuilding(buildingId);
    setSelectedFloor(floorLevel);
    setShowScrollHint(false);
    setShowTourHint(false);
  };

  const handleCloseInfo = () => {
    setSelectedBuilding(null);
    setSelectedFloor(null);
  };

  const handleSearch = (query) => {
    // We could implement searching of buildings based on query
    console.log("Search query:", query);
  };

  const handleSelectFloor = (floorLevel) => {
    setSelectedFloor(floorLevel);
  };

  return (
    <>
      {/* {loading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : ( */}
      <div className="relative min-h-screen overflow-hidden ">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-white to-[#e5ecff] z-[-2]" />

        {/* 3D Campus */}
        <MainMap
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
        />

        {/* Overlay UI Elements */}
        <Navbar
          onSearch={handleSearch}
          onSelectBuilding={handleSelectBuilding}
          onSelectRoom={handleSelectRoom}
        />

        {/* Floor selector (now on the left side) */}
        <FloorSelector
          buildingId={selectedBuilding}
          selectedFloor={selectedFloor}
          onSelectFloor={handleSelectFloor}
        />

        {/* Building info (now on the right side) */}
        <BuildingInfo
          buildingId={selectedBuilding}
          selectedFloor={selectedFloor}
          onSelectFloor={handleSelectFloor}
        />

        {/* Scroll hint animation */}
        {showScrollHint && (
          <div className="fixed bottom-12  left-1/2 transform -translate-x-1/2 text-center z-30 animate-bounce">
            <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              <span className="text-sm font-medium">
                Cuộn chuột để tham quan khuôn viên trường
              </span>
            </div>
          </div>
        )}

        {/* Tour hint animation */}

        {/* Instructions overlay */}
        {/* <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-50 z-10">
        <p className="text-lg font-light">Nhấp vào tòa nhà để khám phá</p>
      </div> */}
      </div>
      {/* )} */}
    </>
  );
};

export default FinalHome;
