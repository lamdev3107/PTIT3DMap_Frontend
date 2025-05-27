import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import { editable as e } from "@theatre/r3f";
import * as THREE from "three";
import {
  GizmoHelper,
  GizmoViewport,
  Environment,
  GradientTexture,
  Sky,
  Stars,
} from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { HOTSPOTS } from "@/utils/hotspotData";
import mainsheet from "@/theatre/sheets/mainsheet";
import Indicator from "./Indicator";
import Hotspot from "./Hotspot";
import { Button } from "@/components/ui/button";
import { LucideMouse, Moon, RefreshCw, Sun } from "lucide-react";
import { Model } from "./Model";
import { ROUTES } from "@/utils/constants";
import { BuildingList } from "./BuildingList";
import { FaAngleRight } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

// Interactive Hotspot component styled like Panasonic CONNECT

const Ground = () => {
  return (
    <e.mesh
      theatreKey="ground"
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#41435c" roughness={1} metalness={0} />
    </e.mesh>
  );
};

const SEQUENCE_LENGTH = 25.8;
const Scene = ({ handleHotspotClick, resetCamera, isDay }) => {
  const { camera } = useThree();

  // Handle camera reset
  useEffect(() => {
    if (resetCamera) {
      // Reset camera to initial position directly
      camera.position.set(0, 1.6, 15);
      camera.rotation.set(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [resetCamera, camera]);
  return (
    <>
      {isDay ? (
        <>
          <ambientLight intensity={0.5} />

          <Sky
            // Vị trí của mặt trời trong không gian 3D [x, y, z]
            sunPosition={[50, 20, 100]}
            // Góc nghiêng của mặt trời so với đường chân trời (0-1)
            inclination={0.6}
            // Góc phương vị của mặt trời (0-1)
            azimuth={1}
            // Khoảng cách từ camera đến bầu trời
            distance={1000}
            // Hệ số tán xạ Mie (ảnh hưởng đến độ mờ của khí quyển)
            mieCoefficient={0.003}
            // Hệ số tán xạ hướng Mie (ảnh hưởng đến độ sáng của mặt trời)
            mieDirectionalG={0.1}
            // Hệ số tán xạ Rayleigh - tham số chính ảnh hưởng đến màu sắc của bầu trời
            // Giá trị càng cao thì bầu trời càng xanh đậm
            rayleigh={1}
            // Độ đục của khí quyển (ảnh hưởng đến độ mờ của bầu trời)
            turbidity={0.1}
            // Độ phơi sáng của cảnh (điều chỉnh độ sáng tổng thể)
            exposure={1}
          />

          <Environment
            preset="sunset"
            blue={1}
            backgroundBlurriness={10}
            backgroundIntensity={10}
            environmentIntensity={10}
          />
        </>
      ) : (
        <>
          <ambientLight intensity={0.1} />
          <Sky
            sunPosition={[50, 20, 1000]}
            // Góc phương vị của mặt trời (0-1)
            azimuth={0.4}
            // Khoảng cách từ camera đến bầu trời
            distance={1000}
            // Hệ số tán xạ Mie (ảnh hưởng đến độ mờ của khí quyển)
            mieCoefficient={0.003}
            // Hệ số tán xạ hướng Mie (ảnh hưởng đến độ sáng của mặt trời)
            mieDirectionalG={0.1}
            // Hệ số tán xạ Rayleigh - tham số chính ảnh hưởng đến màu sắc của bầu trời
            // Giá trị càng cao thì bầu trời càng xanh đậm
            rayleigh={0.15}
            // Độ đục của khí quyển (ảnh hưởng đến độ mờ của bầu trời)
            turbidity={0.8}
            // Độ phơi sáng của cảnh (điều chỉnh độ sáng tổng thể)
            exposure={0.1}
          />
          <Stars radius={100} depth={50} count={5000} factor={4} fade />
          <Environment preset="sunset" />
        </>
      )}

      <group>
        <PerspectiveCamera
          theatreKey="Camera"
          fov={75}
          position={[0, 1.6, 15]}
          makeDefault
        />
      </group>

      {/* <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper> */}
      <Ground />
      <e.group theatreKey="map">
        <Model
          // rotation
          position={[0, 0, 0]}
          linkFile={"/School.glb"}
        />
      </e.group>
      {HOTSPOTS.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          id={hotspot.id}
          data={hotspot}
          onClick={handleHotspotClick}
          position={hotspot.position}
        />
      ))}
    </>
  );
};

const TourHint = () => {
  return (
    <div className="fixed bottom-16 left-1/2 w-3/5 transform -translate-x-1/2 bg-transprent rounded-lg  p-4  z-50 flex  flex-col justify-center items-center gap-3">
      <motion.div
        className="w-13 h-13 flex items-center justify-center rounded-xl text-red-primary bg-white shadow-lg  mb-3"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <LucideMouse className="h-6 w-6 d-block m-auto" />
      </motion.div>
      <p className="text-sm text-white drop-shadow-md  w-fit">
        Cuộn chuột để di chuyển camera tham quan học viện
      </p>
    </div>
  );
};
const MainMap = () => {
  const sequence = mainsheet.sequence;
  const [openBuildingList, setOpenBuildingList] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [zoomToPosition, setZoomToPosition] = useState(null);
  const navigate = useNavigate();
  const scrollSpeed = 0.002;
  const damping = 0.04;
  const currentRef = useRef(sequence.position);
  const targetRef = useRef(currentRef.current);
  const totalSections = 5;

  const handleClickBuildingList = (time) => {
    // Tính toán vị trí mục tiêu trong sequence
    const targetPosition = time;

    // Cập nhật targetRef để kích hoạt animation
    targetRef.current = targetPosition;

    // Tính toán section hiện tại dựa trên thời gian
    const sectionSize = 1 / totalSections;
    const newSection = Math.min(
      totalSections - 1,
      Math.floor(time / SEQUENCE_LENGTH / sectionSize)
    );

    // Tính toán progress trong section hiện tại
    const progressInSection =
      (time / SEQUENCE_LENGTH - newSection * sectionSize) / sectionSize;

    // Cập nhật section tracking
    setCurrentSection(newSection);
    setSectionProgress(progressInSection);
  };

  // Cuộn chuột → cập nhật targetRef
  useEffect(() => {
    const handleWheel = (e) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      const sequenceLength = SEQUENCE_LENGTH;
      let next = targetRef.current + direction * scrollSpeed * sequenceLength;

      const normalizedPosition = next / SEQUENCE_LENGTH;

      // Tính toán section hiện tại
      const sectionSize = 1 / totalSections;
      const newSection = Math.min(
        totalSections - 1,
        Math.floor(normalizedPosition / sectionSize)
      );

      // Tính toán progress trong section hiện tại
      const progressInSection =
        (normalizedPosition - newSection * sectionSize) / sectionSize;

      // Cập nhật state
      setCurrentSection(newSection);
      setSectionProgress(progressInSection);

      // loop
      if (next > sequenceLength) {
        next = 0;
        handleResetCamera();
      }
      if (next < 0) {
        next = 0;
      }

      targetRef.current = next;
    };

    containerRef.current.addEventListener("wheel", handleWheel, {
      passive: true,
    });
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [scrollSpeed]);

  // Animation loop
  useEffect(() => {
    let frameId;
    const animate = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      const next = current + (target - current) * damping;
      currentRef.current = next;
      sequence.position = next;
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [damping, sequence]);

  // Function to handle direct navigation to a specific section
  const handleSectionClick = (sectionIndex) => {
    // Tính toán vị trí mục tiêu trong sequence
    const sectionSize = 1 / totalSections;

    // Tính toán vị trí giữa section để camera di chuyển đến
    const targetPosition =
      (sectionIndex * sectionSize + sectionSize * 0.1) * SEQUENCE_LENGTH;

    // Cập nhật targetRef để kích hoạt animation
    targetRef.current = targetPosition;

    // Cập nhật section hiện tại
    setCurrentSection(sectionIndex);

    // Reset progress về đầu section
    setSectionProgress(0.05);
  };

  // Function to reset camera position
  const handleResetCamera = () => {
    // Set reset trigger to true
    setResetTrigger(true);

    // Reset sequence position to 0
    targetRef.current = 0;
    currentRef.current = 0;
    sequence.position = 0;

    // Reset section tracking
    setCurrentSection(0);
    setSectionProgress(0);

    // Reset trigger after a short delay
    setTimeout(() => {
      setResetTrigger(false);
    }, 100);
  };

  // Add the missing handleHotspotClick function
  const handleHotspotClick = (position, buildingId) => {
    // Set zoom position to trigger animation
    setZoomToPosition(position);

    // After animation completes, navigate to detail page
    setTimeout(() => {
      navigate(ROUTES.BUILDING_DETAIL.replace(":id", buildingId));
    }, 1500); // Wait 1.2 seconds for animation to complete
  };

  const containerRef = useRef(null);
  const [isDay, setIsDay] = useState(true);

  return (
    <div className="relative w-screen h-screen">
      <div
        ref={containerRef}
        className="campus-canvas bg-gradient-to-b from-blue-50 to-indigo-100"
        style={{ width: "100%", height: "100%" }}
      >
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <SheetProvider sheet={mainsheet}>
              <Scene
                isDay={isDay}
                handleHotspotClick={handleHotspotClick}
                resetCamera={resetTrigger}
              />
            </SheetProvider>
          </Suspense>
        </Canvas>
      </div>

      {/* Tour Hint */}
      <AnimatePresence>
        {(currentSection === -1 ||
          (currentSection === 0 && sectionProgress < 0.02)) && <TourHint />}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <Indicator
          total={totalSections}
          activeIndex={currentSection}
          progress={sectionProgress}
          onSectionClick={handleSectionClick}
        />
      </div>
      <div className="absolute bottom-8 right-[144px] z-10">
        <Button
          onClick={() => setIsDay(!isDay)}
          className="bg-white text-red-primary h-9 hover:bg-red-primary hover:text-white rounded-full px-4 shadow-md transition-colors"
          title={isDay ? "Chuyển sang chế độ đêm" : "Chuyển sang chế độ ngày"}
        >
          {isDay ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {/* Reset Camera Button */}
      <div className="absolute bottom-8 right-[88px] z-10">
        <Button
          onClick={handleResetCamera}
          className="rounded-full h-9 bg-white px-4 shadow-md hover:bg-red-primary text-red-primary hover:text-white "
          title="Trở về vị trí đầu"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      <div className="fixed bottom-8 left-8 z-20 flex items-center gap-3">
        <p className="text-white hidden md:block drop-shadow-md text-sm">
          Xem danh sách tòa nhà
        </p>
        <Button
          onClick={() => {
            setOpenBuildingList(true);
          }}
          className="rounded-full h-9 bg-white px-4 shadow-md hover:bg-red-primary text-red-primary hover:text-white   "
        >
          <FaAngleRight className="h-6 w-6" />
        </Button>
      </div>
      <AnimatePresence>
        {openBuildingList && (
          <BuildingList
            onClose={() => setOpenBuildingList(false)}
            onClick={handleClickBuildingList}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainMap;
