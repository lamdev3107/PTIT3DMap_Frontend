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
} from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { HOTSPOTS } from "@/utils/hotspotData";
import mainsheet from "@/theatre/sheets/mainsheet";
import Indicator from "./Indicator";
import Hotspot from "./Hotspot";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import { Model } from "./Model";
import { ROUTES } from "@/utils/constants";
import { BuildingList } from "./BuildingList";
import { FaAngleRight } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

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

const SEQUENCE_LENGTH = 26;
const Scene = ({ handleHotspotClick, resetCamera, zoomToPosition }) => {
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

  // Handle zoom to hotspot
  useEffect(() => {
    if (zoomToPosition) {
      const targetPosition = [...zoomToPosition];
      // Điều chỉnh vị trí để camera nhìn vào hotspot từ góc đẹp hơn
      targetPosition[0] += 1; // Thêm offset X
      targetPosition[1] += 1; // Thêm offset Y
      targetPosition[2] += 3; // Thêm offset Z để camera không quá gần

      // Tạo animation zoom
      let startTime = null;
      const duration = 1000; // 1 giây

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Tính toán vị trí camera theo tiến trình
        const startPos = new THREE.Vector3(
          camera.position.x,
          camera.position.y,
          camera.position.z
        );
        const endPos = new THREE.Vector3(
          targetPosition[0],
          targetPosition[1],
          targetPosition[2]
        );
        const newPos = new THREE.Vector3().lerpVectors(
          startPos,
          endPos,
          progress
        );

        // Cập nhật vị trí camera
        camera.position.copy(newPos);

        // Nhìn vào vị trí hotspot
        camera.lookAt(zoomToPosition[0], zoomToPosition[1], zoomToPosition[2]);
        camera.updateProjectionMatrix();

        // Tiếp tục animation nếu chưa hoàn thành
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [zoomToPosition, camera]);

  return (
    <>
      <ambientLight intensity={1} />
      <e.directionalLight
        theatreKey="directionalLight"
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* <fog attach="fog" args={["#ecf4ff", 10, 35]} /> */}
      <group>
        <PerspectiveCamera
          theatreKey="Camera"
          fov={75}
          position={[0, 1.6, 15]}
          makeDefault
        />
      </group>
      <Environment>
        <mesh position={[0, 0, -100]}>
          <planeGeometry args={[500, 500]} />
          <meshBasicMaterial>
            <GradientTexture
              attach="map"
              stops={[0, 1]} // Gradient stops
              colors={["#4a90e2", "#f39c12"]} // Blue to orange gradient
            />
          </meshBasicMaterial>
        </mesh>
      </Environment>
      <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
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

const MainMap = ({ selectedBuilding, onSelectBuilding }) => {
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

  // Add the missing handleHotspotClick function
  // ... existing code ...

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
    console.log("check buidling", buildingId);
    // Set zoom position to trigger animation
    setZoomToPosition(position);

    // After animation completes, navigate to detail page
    setTimeout(() => {
      navigate(ROUTES.BUILDING_DETAIL.replace(":id", buildingId));
    }, 1500); // Wait 1.2 seconds for animation to complete
  };
  const containerRef = useRef(null);
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
                selectedBuilding={selectedBuilding}
                handleHotspotClick={handleHotspotClick}
                sequence={sequence}
                scrollPosition={scrollPosition}
                resetCamera={resetTrigger}
                zoomToPosition={zoomToPosition}
              />
            </SheetProvider>
          </Suspense>
        </Canvas>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <Indicator
          total={totalSections}
          activeIndex={currentSection}
          progress={sectionProgress}
          onSectionClick={handleSectionClick}
        />
      </div>

      {/* Reset Camera Button */}
      <div className="absolute bottom-8 right-[88px] z-10">
        <Button
          onClick={handleResetCamera}
          className="bg-red-primary text-white h-9 hover:bg-red-primary/70 rounded-full px-4 shadow-md"
          title="Trở về vị trí đầu"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      <div className="fixed bottom-8 left-8 z-20 flex items-center gap-3">
        <p className="text-white drop-shadow-md text-sm">
          Xem danh sách tòa nhà
        </p>
        <Button
          onClick={() => {
            setOpenBuildingList(true);
          }}
          className="rounded-full bg-white px-4 hover:bg-blue-50 h-9 text-red-primary hover:text-red-primary  "
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
