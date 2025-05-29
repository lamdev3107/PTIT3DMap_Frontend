import { Player } from "./Player";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  Environment,
  Sky,
  PointerLockControls,
  KeyboardControls,
} from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Model } from "../Model";
import { Suspense, useState } from "react";

export const MainScene = () => {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
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
          <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />

          {/* Physics engine với trọng lực */}
          <Physics gravity={[0, -30, 0]}>
            <Player /> {/* Component người chơi */}
            {/* RigidBody cho mô hình 3D */}
            <RigidBody type="fixed" colliders="trimesh">
              <Model
                position={[0, 0, 0]}
                scale={[2, 2, 2]}
                linkFile={"/School.glb"}
              />
              {/* Collider cho mặt đất */}
              {/* 
                CuboidCollider tạo một khối va chạm hình hộp chữ nhật
                args: [width, height, depth] - kích thước của khối va chạm
                - width = 1000: chiều rộng 1000 đơn vị
                - height = 2: chiều cao 2 đơn vị 
                - depth = 1000: chiều sâu 1000 đơn vị
                position: [x, y, z] - vị trí của khối va chạm
                - x = 0: giữa theo trục x
                - y = -3: thấp hơn mặt đất 3 đơn vị
                - z = 0: giữa theo trục z
                Khối va chạm này đóng vai trò như mặt đất để người chơi không rơi xuống
              */}
              <CuboidCollider args={[1000, 2, 1000]} position={[0, -3, 0]} />
            </RigidBody>
          </Physics>

          {/* Điều khiển con trỏ chuột */}
          <PointerLockControls />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
};
export const FirstPersonExp = () => {
  const [ready, set] = useState(false);
  return (
    <>
      <div
        className={`fullscreen backdrop-blur-md ${
          ready ? "hidden" : "notready"
        } ${ready && "clicked"}`}
      >
        <div className="stack">
          <button
            className="cursor-pointer px-5 py-3.5 text-sm flex items-center gap-2 text-red-700 rounded-2xl shadow-md text-color-text bg-white hover:bg-red-primary hover:text-white transition-all duration-300"
            onClick={() => set(true)}
          >
            Bắt đầu trải nghiệm
          </button>
        </div>
      </div>
      <MainScene />
    </>
  );
};
