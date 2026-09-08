"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Float, Html } from "@react-three/drei";
import * as THREE from "three";

function TempleModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.27}
      position={[0, -0.6, 0]}
    />
  );
}

interface TempleViewerProps {
  modelPath?: string;
  title?: string;
}

export default function TempleViewer3D({
  modelPath = "/models/bagan_temple_aerial_scan.glb",
  title = "Sun Temple & Fort Citadel 3D Scan",
}: TempleViewerProps) {
  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1E1914] via-[#120F0C] to-[#0A0806] border border-[#3D3428] shadow-2xl">
      <Canvas
        camera={{ position: [0, 4.0, 9.5], fov: 42 }}
        style={{ width: "100%", height: "100%", outline: "none" }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[6, 8, 5]} intensity={2.4} color="#FFE6C2" />
        <directionalLight position={[-6, -2, -4]} intensity={0.8} color="#D9A404" />
        <pointLight position={[0, 4, 0]} intensity={1.5} color="#FFA500" />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                <div className="w-8 h-8 border-2 border-[#D9A404] border-t-transparent rounded-full animate-spin" />
                <span className="text-[#D9A404] font-sans text-xs uppercase tracking-widest font-bold">
                  Loading 3D Temple Scan...
                </span>
              </div>
            </Html>
          }
        >
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
            <TempleModel path={modelPath} />
          </Float>
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 6}
          minDistance={5.0}
          maxDistance={18.0}
        />
      </Canvas>

      {/* Floating interactive hint badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#171512]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D9A404]/30 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#D9A404] animate-ping" />
        <span className="text-[#D9A404] text-[11px] font-bold tracking-wider uppercase font-sans">
          {title}
        </span>
      </div>

      <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-sans text-[#A89880] pointer-events-none">
        Drag to inspect 360° · Scroll to zoom
      </div>
    </div>
  );
}
