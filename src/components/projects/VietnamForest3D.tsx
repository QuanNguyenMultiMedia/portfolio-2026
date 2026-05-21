"use client";

import React, { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerformanceMonitor,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import forestData from "@/data/vietnam-forest-data.json";

function ExtrudedFeature({ feature }: { feature: any }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const coords = feature.geometry.coordinates[0];
    const scale = 0.5;
    const center = [22, 22];

    s.moveTo(
      (coords[0][0] - center[0]) * scale,
      (coords[0][1] - center[1]) * scale,
    );
    for (let i = 1; i < coords.length; i++) {
      s.lineTo(
        (coords[i][0] - center[0]) * scale,
        (coords[i][1] - center[1]) * scale,
      );
    }
    return s;
  }, [feature]);

  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth: feature.properties.height * 0.02,
      bevelEnabled: false,
    }),
    [feature],
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} castShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.1}
        metalness={0.8}
        emissive="#2a56ff"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2a56ff" />

      {forestData.features.map((feature, i) => (
        <ExtrudedFeature key={i} feature={feature} />
      ))}

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4.5}
      />

      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function VietnamForest3D() {
  const [dpr, setDpr] = useState(1); // Start with lower DPR for performance

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        dpr={dpr}
        camera={{ position: [0, 5, 10], fov: 35 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(1.5)}
          onDecline={() => setDpr(1)}
        />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
