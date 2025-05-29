import React, { useState, useEffect, Suspense, useRef } from "react";
import BuildingInfo from "@/components/BuildingInfo";
import FloorSelector from "@/components/FloorSelector";
import { Tour360Viewer } from "@/components/Tour360Viewer"; // Import the Tour360Viewer component
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { ROUTES } from "@/utils/constants";
import logo from "@/assets/logo.png";
import { Canvas } from "@react-three/fiber";
import { BuildingModel } from "@/components/BuildingModel";
import { AnimatePresence, motion } from "framer-motion";
import { editable as e } from "@theatre/r3f";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import introDetailBuildingSheet from "@/theatre/sheets/introDetailBulding";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import LoadingDetailBuilding from "@/components/LoadingDetailBuilding";
import { useApp } from "@/provider/AppProvider";
import { TbView360Number } from "react-icons/tb";

const DetailBuilding = () => {
  const [building, setBuilding] = useState(null);
  const [start, setStart] = useState(false);
  const { selectedRoom, setSelectedRoom } = useApp();
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [scenes, setScenes] = useState(null);
  const location = useLocation();

  const [showTour360, setShowTour360] = useState(false); // State to control the 360 tour visibility

  const fetchBuilding = async () => {
    const buildingId = location.pathname.split("/")[2];
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/buildings/${buildingId}`
      );
      setBuilding(response.data.data);
      setSelectedFloor(response.data.data.floors[0]);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi lấy thông tin tòa nhà");
    }
  };
  useEffect(() => {
    fetchBuilding();
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleSelectFloor = (floor) => {
    setSelectedFloor(floor);
    setSelectedRoom(null);
  };
  const controls = useRef();

  useEffect(() => {
    if (start) {
      introDetailBuildingSheet.sequence.play({
        range: [0, 2],
        iterationCount: 1,
      });
    }
  }, [start, selectedRoom]);

  const fetchFloorScenes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/floors/${selectedFloor?.id}/scenes`
      );
      setScenes(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectedFloor) {
      fetchFloorScenes();
    }
  }, [selectedFloor]);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center ">
      <div className="fixed inset-0 bg-gradient-to-b from-blue-50 to-blue-100 z-[-2]" />
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to={ROUTES.HOME}
                className="text-2xl text-red-primary flex items-center gap-4 font-bold text-gradient"
              >
                <img src={logo} alt="" className="h-12" />
                <span className="md:block hidden">BẢN ĐỒ PTIT</span>
              </Link>
            </div>

            {/* Add Tour 360 Button */}
          </div>
        </div>
      </header>
      <div className=" bg-transparent h-screen w-2/3  rounded-md relative ">
        {selectedFloor && (
          <button
            onClick={() => setShowTour360(true)}
            className="absolute z-40 cursor-pointer bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-red-primary rounded-md hover:bg-red-primary hover:text-white shadow-md transition-colors flex items-center gap-2"
          >
            <TbView360Number size={20} />
            Xem Tour 360° {selectedFloor.name}
          </button>
        )}

        {selectedRoom && (
          <p className="text-sm text-gray-500 italic absolute z-40 bottom-5 left-36 -translate-x-1/2">
            Mô hình 3D mang tính chất minh họa
          </p>
        )}

        {!selectedRoom &&
          (building?.modelURL ? (
            <>
              <Canvas shadows dpr={[1, 2]}>
                <SheetProvider sheet={introDetailBuildingSheet}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={1} />
                    <PerspectiveCamera
                      theatreKey="detailBuildingCamera"
                      fov={75}
                      position={[0, 1.6, 15]}
                      makeDefault
                    />
                    <OrbitControls
                      // enabled={orbitEnabled}
                      ref={controls}
                      enableZoom={true}
                      minDistance={10}
                      maxDistance={18}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 2}
                    />
                    <e.group scale={[0, 0, 0]} theatreKey="buildingGroup">
                      <BuildingModel
                        position={[0, 0, 0]}
                        // scale={[0, 0, 0]}
                        linkFile={building?.modelURL}
                        castShadow // Thêm hiệu ứng đổ bóng lên model
                      />
                    </e.group>
                    {/* <ContactShadows
                      scale={15}
                      blur={3}
                      far={10}
                      position={[0, 0, 0]}
                      opacity={0.5}
                      resolution={1024}
                      color="#000000"
                    /> */}
                  </Suspense>
                </SheetProvider>
              </Canvas>
              <LoadingDetailBuilding
                started={start}
                onStarted={() => setStart(true)}
              />
            </>
          ) : (
            <LoadingDetailBuilding
              started={start}
              onStarted={() => setStart(true)}
            />
          ))}

        {selectedRoom &&
          (selectedRoom ? (
            <>
              <Canvas shadows dpr={[1, 2]}>
                <SheetProvider sheet={introDetailBuildingSheet}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={1} />
                    <e.directionalLight
                      theatreKey="directionalLight"
                      position={[5, 5, 5]}
                      intensity={0.5}
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                    />

                    <PerspectiveCamera
                      theatreKey="detailBuildingCamera"
                      fov={75}
                      position={[0, 1.6, 15]}
                      makeDefault
                    />
                    <OrbitControls
                      // enabled={orbitEnabled}
                      ref={controls}
                      enableZoom={true}
                      minDistance={5}
                      maxDistance={15}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 2}
                    />
                    <e.group scale={[0, 0, 0]} theatreKey="selectedRoom">
                      <BuildingModel
                        position={[0, 0, 0]}
                        scale={[0.2, 0.2, 0.2]}
                        linkFile={
                          selectedRoom?.modelURL
                            ? selectedRoom?.modelURL
                            : "https://res.cloudinary.com/dvpbg6p52/image/upload/v1746191298/PTIT3DMap/pycyof4izhgrrny0akke.glb"
                        }
                        rotation={[0, Math.PI, 0]} // Rotate 360 degrees around Y axis
                        castShadow // Thêm hiệu ứng đổ bóng lên model
                      />
                    </e.group>
                    <ContactShadows
                      scale={15}
                      blur={3}
                      far={10}
                      position={[0, 0, 0]}
                      opacity={0.5}
                      resolution={1024}
                      color="#000000"
                    />
                  </Suspense>
                </SheetProvider>
              </Canvas>
              <LoadingDetailBuilding
                started={start}
                onStarted={() => setStart(true)}
              />
            </>
          ) : (
            <LoadingDetailBuilding
              started={start}
              onStarted={() => setStart(true)}
            />
          ))}
      </div>
      <FloorSelector
        building={building}
        selectedFloor={selectedFloor}
        onSelectFloor={handleSelectFloor}
      />
      <AnimatePresence>
        <BuildingInfo
          building={building}
          selectedFloor={selectedFloor}
          onSelectRoom={handleSelectRoom}
          selectedRoom={selectedRoom}
        />
      </AnimatePresence>

      {/* Add Tour360Viewer component */}
      {selectedFloor && (
        <Tour360Viewer
          open={showTour360}
          data={scenes}
          setOpen={setShowTour360}
        />
      )}
    </div>
  );
};

export default DetailBuilding;
