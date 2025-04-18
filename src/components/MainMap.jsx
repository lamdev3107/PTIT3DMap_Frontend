import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import { editable as e } from "@theatre/r3f";
import {
  OrbitControls,
  Text,
  GizmoHelper,
  GizmoViewport,
  CameraControls,
  Html,
  Billboard,
  Environment,
  CameraShake,
} from "@react-three/drei";
import * as THREE from "three";
import { BuildingModel } from "./BuildingModel";
import { angleToRadian } from "@/utils/angleToRadian";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getProject } from "@theatre/core";
import { BUILDINGS } from "@/utils/fakeData";
import scrollSheet from "@/theatre/sheets/scrollSheet";
import ScrollCameraController from "./ScrollCameraController";
import { Background } from "./Background";
import { Model } from "./Model";

// Interactive Hotspot component styled like Panasonic CONNECT
const Hotspot = ({id, position, data, color = "#4ECDC4", onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Handle hover with delay for smooth transition
  useEffect(() => {
    let timer;
    if (hovered) {
      timer = setTimeout(() => {
        setExpanded(true);
      }, 100);
    } else {
      timer = setTimeout(() => {
        setExpanded(false);
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [hovered]);
  console.log("Check expanded", expanded)
  console.log("Check hovered", hovered)
  return (
    <e.group theatreKey={`hotspot-${id}`} position={position}>
      <Billboard
        // visible={!hovered}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        follow={true}
      >
        <Html
          transform
          distanceFactor={1.5}
          occlude
          position={[0, 0, 0]} 
        >
          <div 
            onMouseEnter={() => {
              setHovered(true)
            }}
            onMouseLeave={() => {
              setHovered(false)
            }}
            onClick={onClick}
            style={{
              transformOrigin: "center",
            }}
            className={`
              bg-white rounded-lg shadow-lg
              flex justify-center items-center 
              cursor-pointer relative overflow-hidden h-16
              ${!expanded ? 'w-16 rotate-45 ' : 'animate-rotate-resize px-4'}
             
            `}
          >
           {
             expanded?     <div
             className={`flex gap-2 items-center`}
           >
             <h3
               className="text-md text-gray-800 margin-0 font-bold"
             >
               {"Thông tin về tòa nhà " + id}
             </h3>
             <button
               className="bg-slate-700 text-white rounded-full border-none flex justify-center items-center w-8 h-8 p-2"
             >
               →
             </button>
           </div> : 
            <div 
            className="-rotate-45 text-slate-800 text-4xl font-medium flex justify-center items-center w-full h-full"
          >
            +
          </div>
           }
          </div>
        </Html>
      </Billboard>

      {/* Information card on hover */}
      {/* {hovered && ( */}
        {/* <Html
          occlude
          position={[0, 0, 0]}
          style={{
            opacity: expanded ? 1 : 0,
            transition: "all 0.3s ease-in-out",
            pointerEvents: expanded ? "auto" : "none",
            transform: `scale(${expanded ? 1 : 0.5}) translateX(${expanded ? 0 : -20}px)`,
            transformOrigin: "center",
            visibility: expanded ? "visible" : "hidden",
            width: "fit-content",
            pointerEvents: "auto",
            transform: "translate(-50%, -50%)",
            marginBottom: "0px",
          }}
          
          distanceFactor={1.5}
        >
          <div
            className="bg-white flex justify-between items-center mb-4 shadow-md rounded-lg p-4"
            onMouseLeave={() => setHovered(false)}
          >
            <h3
              className="text-md w-fit text-gray-800 margin-0 font-bold"
            >
              {"Thông tin về tòa nhà " + id}
            </h3>
            <button
              className="bg-slate-700 text-white rounded-full border-none flex justify-center items-center w-8 h-8 p-2"
            >
              →
            </button>
          </div>
        </Html> */}
      {/* )} */}
  </e.group>
  );
};

const BuildingGroup = ({
  position,
  rotation,
  color,
  scale,
  id,
  name,
  linkFile
}) => {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const navigate = useNavigate();
  const buildingInfo = BUILDINGS.find((building) => building.id === id);

  // Show tooltip with a small delay to prevent flickering
  useEffect(() => {
    let timer;
    if (hover) {
      timer = window.setTimeout(() => {
        setTooltipVisible(true);
      }, 200);
    } else {
      setTooltipVisible(false);
    }
    return () => {
      window.clearTimeout(timer);
    };
  }, [hover]);
  return (
    <>
      <e.group
        ref={ref}
        theatreKey={`building-${id}`}
        position={position}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <BuildingModel
          linkFile={linkFile}
          scale={scale}
          rotation={rotation}
          castShadow
        />
      </e.group>
    
      <Hotspot
        id={id}
        key={`hotspot-${id}-`}
        position={position}
        data={name}
        color={color || "#4ECDC4"}
        onClick={() => navigate("/detail-building")}
      />
    </>
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
      <meshStandardMaterial color="#d1e0ee" roughness={1} metalness={0} />
    </e.mesh>
  );
};

const Scene = ({ selectedBuilding, onSelectBuilding, sequence = null, scrollPosition }) => {
  const { camera, mouse } = useThree();
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(-1);
  const navigate = useNavigate();

  // Update sequence position based on scrollPosition prop
  useEffect(() => {
    if (sequence && scrollPosition !== undefined) {
      const duration = sequence.length || 10; // Sequence duration in seconds
      sequence.position = scrollPosition * duration;
    }
  }, [scrollPosition, sequence]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <e.directionalLight
        theatreKey="directionalLight"
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <fog attach="fog" args={["#ecf4ff", 10, 25]} />
      <group>
        <PerspectiveCamera
          theatreKey="Camera"
          fov={75}
          position={[0, 1.6, 15]}
          makeDefault
        />
      </group>
      <Environment preset="sunset" />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport labelColor="white" axisHeadScale={1} />
      </GizmoHelper>
      <Ground />
      <Model scale={[1, 1, 1]} linkFile="./small_town.glb" />
      {BUILDINGS.map((building) => (
        <BuildingGroup
          key={building.id}
          id={building.id}
          name={building.name}
          rotation={building.rotation}
          linkFile={building.linkFile}
          position={building.position}
          color={building.color}
          scale={building.scale}
          description={building.description}
          isSelected={
            building.id === selectedBuilding ||
            (isTourActive && BUILDINGS[currentTourIndex].id === building.id)
          }
          onClick={onSelectBuilding}
          camera={camera}
        />
      ))}
    </>
  );
};

const MainMap = ({ selectedBuilding, onSelectBuilding }) => {
  const sequence = scrollSheet.sequence;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [targetScrollPosition, setTargetScrollPosition] = useState(0);
  const wheelSensitivity = 0.01; // Reduced sensitivity for smoother control
  const dampingFactor = 0.05; // Controls how quickly the animation catches up to the target (lower = smoother but slower)
  const containerRef = useRef(null);

  // Handle wheel events to control the sequence
  const handleWheel = (event) => {
    // event.preventDefault();
    // Calculate new target scroll position based on wheel delta
    const delta = event.deltaY > 0 ? wheelSensitivity : -wheelSensitivity;
    let newPosition = targetScrollPosition + delta;
    console.log("Check delta", delta)
    
    // Clamp the value between 0 and 1
    newPosition = Math.max(0, Math.min(1, newPosition));
    
    // Reset to beginning if we reach the end
    if (newPosition >= 0.999) {
      newPosition = 0;
    }
    
    setTargetScrollPosition(newPosition);
  };

  // Apply damping effect using requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    
    const updateScrollPosition = () => {
      // Calculate the difference between current and target positions
      const diff = targetScrollPosition - scrollPosition;
      
      // If the difference is very small, just set to target to avoid tiny endless animations
      if (Math.abs(diff) < 0.001) {
        setScrollPosition(targetScrollPosition);
      } else {
        // Apply damping - move a percentage of the way to the target each frame
        setScrollPosition(scrollPosition + diff * dampingFactor);
      }
      
      animationFrameId = requestAnimationFrame(updateScrollPosition);
    };
    
    animationFrameId = requestAnimationFrame(updateScrollPosition);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollPosition, targetScrollPosition, dampingFactor]);

  return (
    <div 
      className="campus-canvas bg-gradient-to-b from-blue-50 to-indigo-100"
      ref={containerRef}
      onWheel={handleWheel}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas shadows dpr={[1, 2]}>
        <SheetProvider sheet={scrollSheet}>
          <Scene
            selectedBuilding={selectedBuilding}
            onSelectBuilding={onSelectBuilding}
            sequence={sequence}
            scrollPosition={scrollPosition}
          />
        </SheetProvider>
      </Canvas>
    </div>
  );
};

export default MainMap;
export { BUILDINGS };
