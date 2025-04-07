import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
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

const BUILDINGS = [
  {
    id: "a",
    name: "Tòa Nhà Hành Chính",
    position: new THREE.Vector3(0, 0, 0),
    rotation: [0, Math.PI / 2, 0],
    color: "#4285F4",
    scale: [1, 1.5, 1],
    category: "administrative",
    description:
      "Tòa nhà chính của khuôn viên, nơi đặt văn phòng hành chính và các dịch vụ sinh viên.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "a1", name: "Phòng Tiếp Sinh Viên", type: "office" },
          { id: "a2", name: "Phòng Đào Tạo", type: "office" },
          { id: "a3", name: "Phòng Tài Chính", type: "office" },
          { id: "a4", name: "Phòng Tài Chính", type: "office" },
          { id: "a5", name: "Phòng Tài Chính", type: "office" },
          { id: "a6", name: "Phòng Tài Chính", type: "office" },
          { id: "a7", name: "Phòng Tài Chính", type: "office" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "a4", name: "Phòng Hiệu Trưởng", type: "office" },
          { id: "a5", name: "Phòng Công Tác Sinh Viên", type: "office" },
          { id: "a6", name: "Phòng Họp", type: "meeting" },
        ],
      },
    ],
  },
  {
    id: "b",
    name: "Thư Viện",
    position: new THREE.Vector3(-2, 0, 2),
    color: "#EA4335",
    scale: [1, 1, 1],
    rotation: [0, Math.PI, 0],
    category: "library",
    description:
      "Trung tâm học tập với hơn 50,000 đầu sách và không gian học tập hiện đại.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "b1", name: "Khu vực Sách Tham Khảo", type: "library" },
          { id: "b2", name: "Khu vực Máy Tính", type: "computer_lab" },
          { id: "b3", name: "Quầy Mượn Trả", type: "service" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "b4", name: "Khu Đọc Sách", type: "reading" },
          { id: "b5", name: "Phòng Học Nhóm", type: "group_study" },
        ],
      },
    ],
  },
  {
    id: "c",
    name: "Trung Tâm Khoa Học",
    position: new THREE.Vector3(3, 0, 6),
    color: "#FBBC05",
    scale: [1.2, 0.8, 1],
    rotation: [0, Math.PI, 0],
    category: "science",
    description:
      "Nơi diễn ra các hoạt động nghiên cứu và thí nghiệm khoa học của trường.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "c1", name: "Phòng Thí Nghiệm Vật Lý", type: "lab" },
          { id: "c2", name: "Phòng Thí Nghiệm Hóa Học", type: "lab" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "c3", name: "Phòng Nghiên Cứu", type: "research" },
          { id: "c4", name: "Phòng Giảng Viên", type: "office" },
        ],
      },
    ],
  },
  {
    id: "d",
    name: "Trung Tâm Sinh Viên",
    position: new THREE.Vector3(-2, 0, -2),
    color: "#34A853",
    rotation: [0, Math.PI, 0],
    scale: [1, 0.7, 1],
    category: "student",
    description:
      "Không gian dành cho sinh viên thư giãn, tổ chức sự kiện và các hoạt động ngoại khóa.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "d1", name: "Căn Tin", type: "cafeteria" },
          { id: "d2", name: "Phòng Hoạt Động Câu Lạc Bộ", type: "club" },
        ],
      },
    ],
  },
  {
    id: "e",
    name: "Khoa Kỹ Thuật",
    position: new THREE.Vector3(2, 0, -2),
    color: "#8AB4F8",
    scale: [0.8, 1.2, 1],
    rotation: [0, -Math.PI, 0],
    category: "engineering",
    description:
      "Tòa nhà dành cho khoa kỹ thuật với các phòng học và phòng thực hành hiện đại.",
    floors: [
      {
        level: 1,
        name: "Tầng 1",
        rooms: [
          { id: "e1", name: "Phòng Máy Tính", type: "computer_lab" },
          { id: "e2", name: "Xưởng Thực Hành", type: "workshop" },
        ],
      },
      {
        level: 2,
        name: "Tầng 2",
        rooms: [
          { id: "e3", name: "Phòng Học", type: "classroom" },
          { id: "e4", name: "Phòng Giảng Viên", type: "office" },
        ],
      },
      {
        level: 3,
        name: "Tầng 3",
        rooms: [
          { id: "e5", name: "Phòng Dự Án", type: "project" },
          { id: "e6", name: "Phòng Họp", type: "meeting" },
        ],
      },
    ],
  },
];

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

const Scene = ({ selectedBuilding, onSelectBuilding }) => {
  const { camera } = useThree();
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourIndex, setCurrentTourIndex] = useState(-1);
  const isAnimatingRef = useRef(false);

  const camRef = useRef();
  const lookAtTarget = useRef(new THREE.Vector3());
  const scroll = useScroll();

  // Trigger state để ví dụ log khi qua điểm

  const sequence = [
    {
      position: new THREE.Vector3(0, 0, 10),
      lookAt: BUILDINGS[0].position,
      message: "Đang đến Tòa Nhà Hành Chính",
    },
    {
      position: new THREE.Vector3(0, 0, 11),
      lookAt: BUILDINGS[1].position,
      message: "Đang đến Thư Viện",
    },
    {
      position: new THREE.Vector3(1.2, 0, 6),
      lookAt: BUILDINGS[2].position,
      message: "Đang đến Trung Tâm Khoa Học",
    },
    {
      position: new THREE.Vector3(0, 2, -2),
      lookAt: BUILDINGS[3].position,
      message: "Đang đến Trung Tâm Sinh Viên",
    },
    {
      position: new THREE.Vector3(0, 2, -2),
      lookAt: BUILDINGS[4].position,
      message: "Đang đến Khoa Kỹ Thuật",
    },
    {
      position: new THREE.Vector3(0, 3, 0),
      lookAt: new THREE.Vector3(0, 0, 0),
      message: "Quay về trung tâm khuôn viên",
    },
  ];

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
  const theatreProject = getProject("Scroll Camera Sequence");
  const cameraSheet = theatreProject.sheet("Camera Movement");
  return (
    <div className="campus-canvas bg-blue-50 h-screen w-full absolute top-0 left-0 z-10">
      <Canvas shadows dpr={[1, 2]}>
        <SheetProvider sheet={cameraSheet}>
          <ScrollControls pages={12} damping={0.5}>
            <Scene
              selectedBuilding={selectedBuilding}
              onSelectBuilding={onSelectBuilding}
            />
          </ScrollControls>
        </SheetProvider>
      </Canvas>
    </div>
  );
};

export default MainMap;
export { BUILDINGS };
