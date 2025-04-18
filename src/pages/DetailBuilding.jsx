import React, { useState, useEffect, Suspense, useRef } from "react";
import theatreProject from "@/theatre/initTheatre";
import BuildingInfo from "@/components/BuildingInfo";
import FloorSelector from "@/components/FloorSelector";

import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { ROUTES } from "@/utils/constants";
import logo from "@/assets/logo.png";
import { Canvas } from "@react-three/fiber";
import { BuildingModel } from "@/components/BuildingModel";
import { motion } from "framer-motion";
import { editable as e } from "@theatre/r3f";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import introDetailBuildingSheet from "@/theatre/sheets/introDetailBulding";
import { ContactShadows, OrbitControls } from "@react-three/drei";

const DetailBuilding = () => {
  const [building, setBuilding] = useState(null);

  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setSpinning(false), 3500);
    return () => clearTimeout(timeout);
  }, []);

  const { pathname } = useLocation();
  const fetchBuilding = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/buildings/4`
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
  // if (import.meta.env.DEV) {
  //   studio.initialize();
  //   studio.extend(extension);
  // }
  const [selectedFloor, setSelectedFloor] = useState(null);
  

  const handleSelectRoom = (buildingId, roomId, floorLevel) => {
    setSelectedBuilding(buildingId);
    setSelectedFloor(floorLevel);
    setShowScrollHint(false);
    setShowTourHint(false);
    â;
  };

  const handleSearch = (query) => {
    // We could implement searching of buildings based on query
    console.log("Search query:", query);
  };

  const handleSelectFloor = (floor) => {
    setSelectedFloor(floor);
  };
  const controls = useRef();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      introDetailBuildingSheet.sequence.play({
        range: [0, 2],
        iterationCount: 1,
      });
    }
  }, [ready]);

  useEffect(() => {
    // Ví dụ: khi model tải xong thì gọi
    setTimeout(() => setReady(true), 2500); // hoặc sau khi asset thực sự load
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden ">
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
                PTIT 3D MAP
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className=" bg-transparent absolute top-0 left-0 bottom-0 right-1/3   rounded-md ">
        {building?.modelURL ? (
          <Canvas className="w-full" shadows dpr={[1, 2]}>
            <SheetProvider sheet={introDetailBuildingSheet}>
              <Suspense fallback={null}>
                <ambientLight intensity={1} />
                {/* <e.directionalLight
                  theatreKey="directionalLight"
                  position={[5, 5, 5]}
                  intensity={1}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                /> */}

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
                  minDistance={3}
                  maxDistance={15}
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
                <ContactShadows
                  scale={15}
                  blur={3}
                  far={10}
                  position={[0, -1.9, 0]}
                  opacity={0.5}
                  resolution={1024}
                  color="#000000"
                />
              </Suspense>
            </SheetProvider>
          </Canvas>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <FloorSelector
        building={building}
        selectedFloor={selectedFloor}
        onSelectFloor={handleSelectFloor}
      />
      <BuildingInfo building={building} selectedFloor={selectedFloor} />
    </div>
  );
};

export default DetailBuilding;
