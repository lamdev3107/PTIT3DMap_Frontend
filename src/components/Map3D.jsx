import { useLoader } from "@react-three/fiber";
import React from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const Map3D = () => {
  const gltf = useLoader(GLTFLoader, "/school_building.glb");
  return (
    <primitive
      object={gltf.scene}
      scale={[20, 20, 20]}
      rotation={[0, Math.PI, 0]} // Sửa lỗi bị lật ngược
    />
  );
};
