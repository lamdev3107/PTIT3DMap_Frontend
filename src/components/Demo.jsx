import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Scroll,
  ScrollControls,
  useScroll,
} from "@react-three/drei";

function CameraScroller() {
  const { camera } = useThree();
  const scroll = useScroll(); // Lấy giá trị cuộn

  // Định nghĩa các mốc chuyển động của camera
  const keyframes = [
    { position: [0, 5, 10], lookAt: [0, 0, 0] }, // Mốc 1
    { position: [5, 10, 15], lookAt: [5, 0, 0] }, // Mốc 2
    { position: [10, 15, 20], lookAt: [10, 0, 0] }, // Mốc 3
    { position: [15, 20, 25], lookAt: [15, 0, 0] }, // Mốc 4
  ];

  // Cập nhật camera theo scroll
  useFrame(() => {
    const scrollPosition = scroll.range(0, 1); // Lấy giá trị cuộn từ 0 đến 1

    // Tính toán mốc camera dựa trên cuộn
    const totalKeyframes = keyframes.length;
    const frameIndex = Math.floor(scrollPosition * (totalKeyframes - 1)); // Xác định mốc hiện tại
    const nextFrameIndex = Math.min(frameIndex + 1, totalKeyframes - 1); // Mốc tiếp theo

    // Nội suy giữa các mốc
    const frameProgress = scrollPosition * (totalKeyframes - 1) - frameIndex;
    const currentKeyframe = keyframes[frameIndex];
    const nextKeyframe = keyframes[nextFrameIndex];

    // Nội suy (interpolate) giữa các vị trí
    const interpolatedPosition = [
      currentKeyframe.position[0] +
        frameProgress *
          (nextKeyframe.position[0] - currentKeyframe.position[0]),
      currentKeyframe.position[1] +
        frameProgress *
          (nextKeyframe.position[1] - currentKeyframe.position[1]),
      currentKeyframe.position[2] +
        frameProgress *
          (nextKeyframe.position[2] - currentKeyframe.position[2]),
    ];

    // Cập nhật vị trí camera
    camera.position.set(...interpolatedPosition);
    camera.lookAt(...currentKeyframe.lookAt); // Giữ camera luôn hướng về target
  });

  return null;
}

export default function Scene2() {
  return (
    <div style={{ height: "100vh" }}>
      {" "}
      {/* Tăng chiều cao trang để có thể cuộn */}
      <Canvas>
        <ScrollControls pages={4}>
          {" "}
          {/* 'pages' là số lượng trang bạn muốn */}
          <Scroll>
            <>
              <CameraScroller />

              {/* Hình hộp để kiểm tra góc nhìn */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
              </mesh>

              {/* Ánh sáng */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />

              {/* Điều khiển Camera */}
              <OrbitControls />
            </>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
