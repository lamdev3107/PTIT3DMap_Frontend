import React, { useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

// The main component you can import and use in your app
const PanasonicHotspotDemo = () => {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "500px" }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset="warehouse" />

        <UI3D />
        <ServerRack />
      </Canvas>
    </div>
  );
};

// UI elements in 3D space
function UI3D() {
  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          fontWeight: "bold",
          fontSize: "24px",
          fontFamily: "Arial",
          pointerEvents: "none",
        }}
      >
        Panasonic CONNECT
      </div>

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          display: "flex",
          gap: "10px",
          pointerEvents: "auto",
        }}
      >
        <button
          style={{
            background: "white",
            color: "#2D6D7B",
            border: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Explore Rooms
        </button>
        <button
          style={{
            background: "transparent",
            color: "white",
            border: "none",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Contact
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          pointerEvents: "auto",
        }}
      >
        <span style={{ color: "white" }}>View all products</span>
        <button
          style={{
            background: "white",
            color: "#2D6D7B",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          &rarr;
        </button>
      </div>
    </Html>
  );
}

// Main server rack component
function ServerRack() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main rack structure */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[3, 4, 0.5]} />
        <meshStandardMaterial color="#7FBEC6" />
      </mesh>

      {/* Server slots */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 1.5 - i * 0.5, 0.26]} receiveShadow>
          <boxGeometry args={[2.8, 0.05, 0.05]} />
          <meshStandardMaterial color="#6BA7AF" />
        </mesh>
      ))}

      {/* Server units */}
      <ServerUnit position={[0, 0.6, 0.3]} />
      <ServerUnit position={[0, 0, 0.3]} isHighlighted={true} />
      <ServerUnit position={[0, -0.6, 0.3]} />

      {/* Hotspots */}
      <Hotspot
        position={[0, 0, 0.5]}
        title="AT-KC2000"
        description="AT-KC2000 Kairos Core Mainframe"
        isNew={true}
      />

      <Hotspot
        position={[0.8, 0.6, 0.5]}
        title="Network Switch"
        description="High-speed network switch for server interconnection"
        isNew={false}
      />

      <Hotspot
        position={[-0.8, 0.6, 0.5]}
        title="Storage Array"
        description="High-capacity storage system with RAID configuration"
        isNew={true}
      />

      <Hotspot
        position={[0, -0.6, 0.5]}
        title="Processing Unit"
        description="Advanced multi-core processing unit for data handling"
        isNew={false}
      />
    </group>
  );
}

// Server unit component
function ServerUnit({ position, isHighlighted = false }) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={[2.5, 0.35, 0.2]} />
      <meshStandardMaterial color={isHighlighted ? "#444" : "#333"} />
    </mesh>
  );
}

// Hotspot component with hover effect
function Hotspot({ position, title, description, isNew }) {
  const [hovered, setHovered] = useState(false);
  const diamondRef = useRef();

  // Rotate the diamond shape
  useFrame(() => {
    if (diamondRef.current && !hovered) {
      diamondRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group position={position}>
      {/* Diamond shape with plus sign */}
      <group
        ref={diamondRef}
        visible={!hovered}
        rotation={[0, 0, Math.PI / 4]}
        onPointerOver={() => setHovered(true)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.4, 0.05]} />
          <meshStandardMaterial color="#3D7C88" />
        </mesh>

        {/* Plus sign */}
        <group>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.2, 0.05, 0.01]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.05, 0.2, 0.01]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      </group>

      {/* Information card on hover */}
      {hovered && (
        <Html
          position={[0, 0, 0]}
          style={{
            width: "220px",
            pointerEvents: "auto",
            transform: "translate(-50%, -100%)",
            marginBottom: "20px",
          }}
          distanceFactor={1.5}
        >
          <div
            style={{
              background: "#2D6D7B",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              fontFamily: "Arial, sans-serif",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {title}
              </h3>

              {isNew && (
                <span
                  style={{
                    background: "#e2e8f0",
                    color: "#334155",
                    fontSize: "12px",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  NEW
                </span>
              )}
            </div>

            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                color: "#e2e8f0",
              }}
            >
              {description}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  background: "#256673",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                →
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default PanasonicHotspotDemo;
