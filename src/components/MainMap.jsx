import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import cameraSequence from "../assets/demoScroll.json";
import { editable as e } from "@theatre/r3f";
import {
  OrbitControls,
  ScrollControls,
  Text,
  useScroll,
  GizmoHelper,
  GizmoViewport,
  CameraControls,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { Building } from "./Building";
import { angleToRadian } from "@/utils/angleToRadian";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getProject } from "@theatre/core";
import { BUILDINGS } from "@/utils/fakeData";

const Hotspot = ({ position, description, buildingId }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color={hovered ? "#ff0000" : "#ffffff"} />
      </mesh>

      {hovered && (
        <Html position={[0, 1, 0]}>
          <div className="bg-white p-4 rounded-lg shadow-lg min-w-[200px]">
            <p className="text-gray-700 mb-2">{description}</p>
            {/* <Link
            to={`/building/${buildingId}`}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            Chi tiết <FaExternalLinkAlt className="ml-1" />
          </Link> */}
          </div>
        </Html>
      )}
    </group>
  );
};

const BuildingGroup = ({
  position,
  rotation,
  color,
  scale,
  name,
  id,
  isSelected,
  onClick,
  description,
}) => {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      if (isSelected) {
        ref.current.scale.setScalar(
          Math.sin(state.clock.elapsedTime * 2) * 0.05 + 1.05
        );
      } else if (hover) {
        ref.current.scale.setScalar(1.05);
      } else {
        ref.current.scale.setScalar(1);
      }
    }
  });

  return (
    <e.group
      theatreKey={`building-${id}`}
      position={position}
      onClick={() => onClick(id)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Building scale={scale} rotation={rotation} />
      <Text
        position={[0, scale[1] / 2 + 0.2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>
      {/* <Hotspot
        position={[0, scale[1] + 0.5, 0]}
        description={description}
        buildingId={id}
      /> */}
    </e.group>
  );
};

const Ground = () => {
  return (
    <e.mesh
      theatreKey="ground"
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#dde6ed" />
    </e.mesh>
  );
};

const Scene = ({ selectedBuilding, onSelectBuilding, sequence }) => {
  const { camera } = useThree();
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(-1);
  const isAnimatingRef = useRef(false);

  const camRef = useRef();
  const lookAtTarget = useRef(new THREE.Vector3());
  const scroll = useScroll();
  useFrame(() => {
    const scrollProgress = scroll.offset; // Từ 0 đến 1
    const duration = sequence.length || 12; // Thời lượng sequence, đơn vị: giây
    sequence.position = scrollProgress * duration;
  });
  console.log(sequence);

  // Trigger state để ví dụ log khi qua điểm

  return (
    <>
      {/* <axesHelper args={[5]} /> */}
      <ambientLight intensity={0.5} />
      <e.directionalLight
        theatreKey="directionalLight"
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <group>
        <PerspectiveCamera
          theatreKey="Camera"
          fov={50}
          position={[0, 1.6, 15]}
          makeDefault
        />
      </group>

      {/* Hiển thị helper cho camera */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>

      <mesh theatreKey="point" position={[0, 0, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshBasicMaterial color="blue" />
      </mesh>

      <Ground />

      {BUILDINGS.map((building) => (
        <BuildingGroup
          key={building.id}
          id={building.id}
          name={building.name}
          rotation={building.rotation}
          position={building.position}
          color={building.color}
          scale={building.scale}
          description={building.description}
          isSelected={
            building.id === selectedBuilding ||
            (isTourActive && BUILDINGS[currentTourIndex].id === building.id)
          }
          onClick={onSelectBuilding}
        />
      ))}

      <color attach="background" args={["#eff6ff"]} />

      {isTourActive && (
        <group position={[0, 2, 0]}>
          <mesh position={[0, 5, 0]} scale={[6, 1, 0.1]}>
            <boxGeometry />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text
            position={[0, 5, 0.1]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="bottom"
          >
            Tour khuôn viên đang hoạt động ({currentTourIndex + 1}/
            {BUILDINGS.length})
          </Text>
        </group>
      )}
    </>
  );
};

const MainMap = ({ selectedBuilding, onSelectBuilding }) => {
  // Tạo project Theatre.js
  const theatreProject = getProject("Scroll Camera Sequence", {
    state: cameraSequence,
  });
  theatreProject.ready.then(() => console.log("Project loaded!"));
  const cameraSheet = theatreProject.sheet("Camera Movement");
  const sequence = cameraSheet.sequence;

  // Bắt đầu phát sequence
  // sequence.play();
  console.log(cameraSequence);

  // Tạm dừng sequence
  // sequence.pause();
  return (
    <div className="campus-canvas bg-blue-50 h-screen w-full absolute top-0 left-0 z-10">
      <Canvas shadows dpr={[1, 2]}>
        <SheetProvider sheet={cameraSheet}>
          <ScrollControls pages={12} damping={0.5}>
            <Scene
              selectedBuilding={selectedBuilding}
              onSelectBuilding={onSelectBuilding}
              sequence={sequence}
            />
          </ScrollControls>
        </SheetProvider>
      </Canvas>
    </div>
  );
};

export default MainMap;
export { BUILDINGS };
