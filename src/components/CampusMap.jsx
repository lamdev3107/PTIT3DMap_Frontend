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
const LINE_NB_POINTS = 12990;

export default function CampusMap() {
  const orbitControlsRef = useRef();
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -5),
        new THREE.Vector3(10, 0, -5),
        new THREE.Vector3(30, 0, -5),
        new THREE.Vector3(40, 0, -5),
        new THREE.Vector3(30, 0, -5),
        new THREE.Vector3(20, 0, -10),
        new THREE.Vector3(10, 0, -20),
        new THREE.Vector3(-3, 0, -30),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, 0.2);

    return shape;
  }, []); // Đã sửa dependency array, bỏ curve vì không cần thiết

  const cameraGroup = useRef();
  const scroll = useScroll();

  useFrame((_state, delta) => {
    // Tính toán vị trí hiện tại dựa trên scroll offset
    const scrollOffset = Math.min(
      Math.round(scroll.offset * linePoints.length),
      linePoints.length - 1
    );

    // Lấy điểm hiện tại và điểm tiếp theo trên đường curve
    const currentPoint = linePoints[scrollOffset];
    const nextPoint =
      linePoints[Math.min(scrollOffset + 1, linePoints.length - 1)];

    // Tính toán góc xoay dựa trên chênh lệch x giữa 2 điểm
    const xDiff = (nextPoint.x - currentPoint.x) * 80;
    const rotationAngle =
      (xDiff < 0 ? 1 : -1) * Math.min(Math.abs(xDiff), Math.PI / 3);

    // Tạo quaternion cho máy bay và camera
    const planeRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        rotationAngle
      )
    );

    const cameraRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        cameraGroup.current.rotation.x,
        rotationAngle,
        cameraGroup.current.rotation.z
      )
    );

    // Áp dụng xoay mượt cho máy bay và camera
    airplane.current.quaternion.slerp(planeRotation, delta * 2);
    cameraGroup.current.quaternion.slerp(cameraRotation, delta * 2);

    // Di chuyển camera group theo đường curve
    cameraGroup.current.position.lerp(currentPoint, delta * 24);
    cameraGroup.current.lookAt(airplane.current.position);
  });

  const airplane = useRef();
  const cameraRef = useRef(); // Tham chiếu đến camera
  useHelper(cameraRef, THREE.CameraHelper); // Gắn CameraHelper
  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <color attach="background" args={["#c9eaef"]} />
      <group ref={cameraGroup}>
        <PerspectiveCamera
          ref={cameraRef}
          position={[0, 0, 15]}
          rotation-x={angleToRadian(15)}
          fov={30}
          makeDefault
        />
        <group ref={airplane}>
          <Float floatIntensity={2} speed={2}>
            <Airplane
              rotation-y={angleToRadian(90)}
              scale={[0.2, 0.2, 0.2]}
              position-y={0}
            />
          </Float>
        </group>
      </group>
      {/* Sequence camera - chỉ hoạt động khi sequence active */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color={"red"} opacity={0.7} transparent />
        </mesh>
        <group>
          {/* <OrbitControls /> */}
          <ambientLight intensity={1} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.5}
            castShadow
          />

          {/* <Ground /> */}
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
        // autoRotate={true}
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
