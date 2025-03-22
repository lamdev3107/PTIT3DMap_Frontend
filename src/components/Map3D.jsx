import { useLoader } from "@react-three/fiber";
import React from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export const Map3D = () => {
  const gltf = useLoader(GLTFLoader, "/school.glb");
  return <primitive object={gltf.scene} rotation={[Math.PI, 1.2, -0.01]} />;
};
