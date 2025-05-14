import React, { useEffect, useState } from "react";
import MainMap from "@/components/MainMap";
import Navbar from "@/components/Navbar";
import BuildingInfo from "@/components/BuildingInfo";
import FloorSelector from "@/components/FloorSelector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LoadingDetailBuilding from "@/components/LoadingDetailBuilding";
import { InstructionDialog } from "@/components/InstructionDialog";
import { AiOutlineInfo } from "react-icons/ai";
import { AnimatePresence } from "framer-motion";
import { RoomCategory } from "@/components/RoomCategory";
import { useApp } from "@/provider/AppProvider";

const FinalHome = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [start, setStart] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [openRoomCategory, setOpenRoomCategory] = useState(false);
  const { setSelectedRoom } = useApp();
  useEffect(() => {
    setSelectedRoom(null);
  }, []);

  const handleSelectBuilding = (id) => {
    setSelectedBuilding(id);
    setSelectedFloor(null); // Reset selected floor when a new building is selected
    setShowScrollHint(false);
    setShowTourHint(false);
  };

  const handleSelectFloor = (floorLevel) => {
    setSelectedFloor(floorLevel);
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-white to-[#e5ecff] z-[-2]" />

        {/* 3D Campus */}
        <MainMap
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
        />

        {/* Overlay UI Elements */}
        <Navbar
          openRoomCategory={openRoomCategory}
          setOpenRoomCategory={setOpenRoomCategory}
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

        {/* Instructions Button */}
        <div className="fixed bottom-8 right-8 z-20">
          <Dialog
            className=""
            open={instructionsOpen}
            onOpenChange={setInstructionsOpen}
          >
            <DialogTrigger asChild>
              <Button className="rounded-full h-9 bg-white px-4 shadow-md hover:bg-blue-50 text-red-primary hover:text-red-primary  ">
                <AiOutlineInfo classdName="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <InstructionDialog />
          </Dialog>
        </div>
      </div>
      <LoadingDetailBuilding started={start} onStarted={() => setStart(true)} />

      <AnimatePresence>
        {openRoomCategory && (
          <RoomCategory onClose={() => setOpenRoomCategory(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default FinalHome;
