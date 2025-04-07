import {
  Float,
  OrbitControls,
  PerspectiveCamera,
  useHelper,
  useScroll,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Airplane } from "./Airplane";
import { Building } from "./Building";
import { angleToRadian } from "@/utils/angleToRadian";

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color={"gray"} />
    </mesh>
  );
}

const sequence = [
  {
    position: new THREE.Vector3(0, 5, 15),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  {
    position: new THREE.Vector3(-10, 5, 5),
    lookAt: new THREE.Vector3(-5, 0, 0),
  },
  {
    position: new THREE.Vector3(0, 8, -5),
    lookAt: new THREE.Vector3(-5, 0, -6),
  },
  {
    position: new THREE.Vector3(10, 5, 5),
    lookAt: new THREE.Vector3(0, 0, 0),
  },
];

export default function CampusMap() {
  const orbitControlsRef = useRef();
  const cameraRef = useRef();
  const scroll = useScroll();

  // Tạo curve cho camera position
  const positionCurve = useMemo(() => {
    const points = sequence.map((seq) => seq.position);
    const curve = new THREE.CatmullRomCurve3(points);
    curve.closed = true;
    return curve;
  }, []);

  // Tạo curve cho lookAt points
  const lookAtCurve = useMemo(() => {
    const points = sequence.map((seq) => seq.lookAt);
    const curve = new THREE.CatmullRomCurve3(points);
    curve.closed = true;
    return curve;
  }, []);

  useFrame((state, delta) => {
    const scrollProgress = scroll.offset;

    // Lấy điểm trên curve dựa vào scroll progress
    const positionOnCurve = positionCurve.getPoint(scrollProgress);
    const lookAtOnCurve = lookAtCurve.getPoint(scrollProgress);

    // Áp dụng cho camera
    if (cameraRef.current) {
      cameraRef.current.position.copy(positionOnCurve);
      cameraRef.current.lookAt(lookAtOnCurve);
    }
  });

  return (
    <>
      <color attach="background" args={["#c9eaef"]} />
      <PerspectiveCamera
        ref={cameraRef}
        position={sequence[0].position}
        fov={50}
        makeDefault
      />
      <group position-y={-2}>
        <group>
          <ambientLight intensity={1} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.5}
            castShadow
          />
          <Building scale={[2, 2, 2]} rotation={[0, Math.PI / 2, 0]} />
          <Building
            position={[-5, 0, 0]}
            scale={[2, 2, 2]}
            rotation={[0, -Math.PI / 2, 0]}
          />
          <Building
            position={[-5, 0, -6]}
            scale={[2, 2, 2]}
            rotation={[0, Math.PI, 0]}
          />
        </group>
      </group>
      <OrbitControls
        maxAzimuthAngle={30}
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        ref={orbitControlsRef}
        onChange={(e) => {
          console.log(
            "position, rotation",
            e.target.object.position,
            e.target.object.rotation
          );
        }}
      />
    </>
  );
}
