import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text3D } from "@react-three/drei";
import * as THREE from "three";
import { Map3D } from "./Map3D";
import gsap from "gsap";
import { Loader2 } from "lucide-react";

// 📌 Danh sách các tòa nhà và điểm camera tương ứng
const BUILDINGS = [
  {
    position: [-10, 3, -50],
    size: [3, 6, 3],
    color: "blue",
    cameraPos: [-30, 15, -50],
  },
  {
    position: [15, 4, -10],
    size: [4, 8, 4],
    clor: "red",
    cameraPos: [25, 15, -20],
  },
  {
    position: [-15, 5, 10],
    size: [3, 7, 3],
    color: "green",
    cameraPos: [-25, 15, 15],
  },
  {
    position: [-10, 3.5, 30],
    size: [5, 10, 5],
    color: "purple",
    cameraPos: [20, 10, 25],
  },
  {
    position: [0, 6, 0],
    size: [6, 12, 6],
    color: "yellow",
    cameraPos: [0, 15, 30],
  },
];

// 📌 Hiển thị các điểm camera (hình cầu màu đỏ, có thể click)
function CameraPoints({ onClick }) {
  const [clicked, setClicked] = useState(false);

  return (
    <>
      {BUILDINGS.map((building, index) => (
        <mesh
          key={index}
          position={new THREE.Vector3(...building.cameraPos)}
          onClick={() => onClick(index)}
        >
          <Text3D
            font={"./fonts/helvetiker_regular.typeface.json"} // Đường dẫn font
            position={[0, 0, 0]}
            size={5}
            height={1} // Độ dày của chữ
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.1}
            bevelSize={0.1}
            bevelSegments={5}
            onClick={() => setClicked(!clicked)}
          >
            {"A" + (index + 1)}
            <meshStandardMaterial color={building.color} />
          </Text3D>
        </mesh>
      ))}
    </>
  );
}
// 📌 Component Tòa Nhà
function Building({ position, size, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// 📌 Camera Controller (di chuyển theo scroll và click)
function CameraController({ currentIndex, setCurrentIndex }) {
  const cameraRef = useRef();

  // 🎯 Xử lý scroll chuột
  // useEffect(() => {
  //   const handleScroll = (event) => {
  //     if (event.deltaY > 0) {
  //       setCurrentIndex((prev) => Math.min(prev + 1, BUILDINGS.length - 1));
  //     } else {
  //       setCurrentIndex((prev) => Math.max(prev - 1, 0));
  //     }
  //   };

  //   window.addEventListener("wheel", handleScroll);
  //   return () => window.removeEventListener("wheel", handleScroll);
  // }, []);

  // 🎯 Cập nhật vị trí camera khi scroll hoặc click
  useEffect(() => {
    if (cameraRef.current) {
      const targetPos = BUILDINGS[currentIndex].cameraPos;
      const lookAtPos = BUILDINGS[currentIndex].position;

      gsap.to(cameraRef.current.position, {
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        duration: 2.5,
        ease: "power2.out",
        onUpdate: () => {
          cameraRef.current.lookAt(lookAtPos[0], lookAtPos[1], lookAtPos[2]); // Hướng vào tòa nhà
        },
      });
    }
  }, [currentIndex]);

  useFrame(({ camera }) => {
    cameraRef.current = camera;
  });

  return null;
}

function CameraHelperComponent() {
  const { camera, scene } = useThree();
  const helperRef = useRef();

  React.useEffect(() => {
    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);
    helperRef.current = helper;

    return () => {
      scene.remove(helper);
    };
  }, [camera, scene]);

  return null;
}
// 📌 Mặt Đất
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <boxGeometry args={[300, 300]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

// 📌 Component Chính
export default function CampusMap() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Canvas camera={{ position: [-30, 10, -30], fov: 50 }} shadows>
      {/* Ánh sáng */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} castShadow />

      {/* Mặt đất */}
      <Ground />

      {/* Các tòa nhà */}
      {BUILDINGS.map((b, index) => (
        <Building
          key={index}
          position={b.position}
          size={b.size}
          color={b.color}
        />
      ))}
      {/* <Suspense fallback={<Loader2 className="animate-spin" />}> */}
      <Map3D />
      {/* </Suspense> */}

      {/* Hiển thị điểm camera (có thể click) */}
      <CameraPoints onClick={setCurrentIndex} />

      {/* Điều khiển camera */}
      <CameraController
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
      <CameraHelperComponent />
      <OrbitControls
        enablePan={true}
        // enableZoom={false}
        // minPolarAngle={Math.PI / 4} // 45 độ
        // maxPolarAngle={Math.PI / 4} // 45 độ
        // minAzimuthAngle={-Math.PI / 2} // -90 độ
        // maxAzimuthAngle={Math.PI / 2} // 90 độ
      />
    </Canvas>
  );
}
