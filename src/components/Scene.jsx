import React, { useState } from "react";
import CampusMap from "./CampusMap";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";

export default function Scene() {
  return (
    <>
      <Canvas>
        <color attach="background" args={["#ececec"]} />
        {/* ScrollControls là một component từ @react-three/drei để điều khiển scroll
            - pages={5}: Xác định số trang scroll (chiều dài của scroll là 5 lần chiều cao màn hình)
            - damping={0.3}: Độ mượt của hiệu ứng scroll (0.3 là độ trễ vừa phải) */}
        <ScrollControls pages={20} damping={0.3}>
          <CampusMap />
        </ScrollControls>
      </Canvas>

      {/* Nút điều khiển sequence camera - đặt bên ngoài môi trường Three.js */}
    </>
  );
}
