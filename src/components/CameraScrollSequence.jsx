import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  PerspectiveCamera,
  Html,
} from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function CameraSequenceScroll() {
  const camRef = useRef();
  const lookAtTarget = useRef(new THREE.Vector3());
  const scroll = useScroll();
  const { set } = useThree();

  // Trigger state để ví dụ log khi qua điểm
  const lastIndexRef = useRef(-1);

  const sequence = [
    { position: [0, 0, 10], lookAt: [0, 0, 0], content: "Start" },
    { position: [2, 1, 9], lookAt: [0, 1, 0], content: "Step 1" },
    { position: [4, 2, 8], lookAt: [0, 2, 0], content: "Step 2" },
    { position: [6, 3, 7], lookAt: [0, 3, 0], content: "Step 3" },
    { position: [8, 4, 6], lookAt: [0, 4, 0], content: "Step 4" },
    { position: [10, 5, 5], lookAt: [0, 5, 0], content: "Step 5" },
    { position: [8, 4, 4], lookAt: [0, 4, 0], content: "Step 6" },
    { position: [6, 3, 3], lookAt: [0, 3, 0], content: "Step 7" },
    { position: [4, 2, 2], lookAt: [0, 2, 0], content: "Step 8" },
    { position: [2, 1, 1], lookAt: [0, 1, 0], content: "Step 9" },
    { position: [0, 0, 0], lookAt: [0, 0, 0], content: "Step 10" },
    { position: [-2, -1, -1], lookAt: [0, -1, 0], content: "End" },
  ];

  useFrame(() => {
    const t = scroll.offset;
    const camera = camRef.current;
    set({ camera });

    const segmentCount = sequence.length - 1;
    const segLength = 1 / segmentCount;
    const index = Math.min(Math.floor(t / segLength), segmentCount - 1);
    const segmentT = (t - index * segLength) / segLength;

    const from = sequence[index];
    const to = sequence[index + 1];

    const fromPos = new THREE.Vector3(...from.position);
    const toPos = new THREE.Vector3(...to.position);
    const fromLook = new THREE.Vector3(...from.lookAt);
    const toLook = new THREE.Vector3(...to.lookAt);

    camera.position.lerpVectors(fromPos, toPos, segmentT);
    lookAtTarget.current.lerpVectors(fromLook, toLook, segmentT);
    camera.lookAt(lookAtTarget.current);

    // Trigger event khi chuyển qua điểm mới
    if (index !== lastIndexRef.current) {
      lastIndexRef.current = index;
      console.log("📌 Đã đến điểm", index, "-", sequence[index].content);
      // Ví dụ: gọi API, play âm thanh, mở UI...
    }
  });

  return (
    <>
      <PerspectiveCamera ref={camRef} fov={60} />

      {/* Light */}
      <ambientLight intensity={0.5} />

      {/* Nội dung Html tại mỗi điểm */}
      {sequence.map((point, i) => (
        <Html
          key={i}
          position={point.position}
          style={{
            background: "white",
            padding: "6px 12px",
            borderRadius: "8px",
            boxShadow: "0 0 5px rgba(0,0,0,0.2)",
            fontSize: "14px",
            whiteSpace: "nowrap",
          }}
        >
          {point.content}
        </Html>
      ))}

      {/* Object mẫu ở giữa */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
}

export default function App() {
  return (
    <Canvas>
      <ScrollControls pages={3} damping={0.1}>
        <CameraSequenceScroll />
      </ScrollControls>
    </Canvas>
  );
}
