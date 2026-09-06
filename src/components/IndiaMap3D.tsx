"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { feature } from "topojson-client";
import { geoMercator } from "d3-geo";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Html } from "@react-three/drei";

// The route connects: Rajasthan (Jaipur) → UP (Lucknow) → Bihar (Patna) → 
// Sikkim → Nagaland (Kohima) → Odisha → Telangana → Kerala (Trivandrum)
const routeWaypoints: [number, number][] = [
  [75.79, 26.91],   // Jaipur (START)
  [78.50, 26.80],   // UP
  [80.95, 26.85],   // Lucknow
  [83.00, 26.00],   // UP/Bihar
  [85.14, 25.59],   // Patna
  [87.00, 26.00],   // Bihar
  [88.40, 26.70],   // Siliguri corridor
  [88.51, 27.33],   // Sikkim
  [88.60, 26.60],   // Siliguri down
  [91.70, 26.20],   // Guwahati
  [93.00, 26.00],   // Assam
  [94.10, 25.67],   // Kohima
  [93.00, 25.80],   // Assam return
  [91.70, 26.00],   // Guwahati return
  [89.50, 26.20],   // Assam/WB border
  [88.40, 26.50],   // Siliguri corridor return
  [88.00, 24.50],   // WB inland
  [87.30, 22.50],   // WB inland
  [86.50, 21.20],   // Odisha border
  [85.82, 20.30],   // Bhubaneswar (Odisha)
  [84.00, 19.00],   // AP border
  [81.50, 18.00],   // Telangana border
  [78.48, 17.38],   // Hyderabad (Telangana)
  [78.00, 15.50],   // AP/Karnataka
  [77.50, 13.00],   // Karnataka
  [77.00, 11.00],   // TN border
  [76.94,  8.52],   // Trivandrum (Kerala)
];

const stations = [
  { name: "Jaipur",     state: "Rajasthan", coordinates: [75.79, 26.91] as [number, number] },
  { name: "Patna",      state: "Bihar",     coordinates: [85.14, 25.59] as [number, number] },
  { name: "Kohima",     state: "Nagaland",  coordinates: [94.10, 25.67] as [number, number] },
  { name: "Trivandrum", state: "Kerala",    coordinates: [76.94,  8.52] as [number, number] },
];

const MAP_SCALE = 1100;
const MAP_CENTER: [number, number] = [80, 22];

const projection = geoMercator()
  .scale(MAP_SCALE)
  .center(MAP_CENTER)
  .translate([0, 0]);

function createShapesFromFeature(feature: any) {
  const shapes: THREE.Shape[] = [];

  const createShape = (polygon: number[][][]) => {
    const shape = new THREE.Shape();
    polygon[0].forEach((point, i) => {
      const proj = projection(point as [number, number]);
      if (!proj) return;
      const [x, y] = proj;
      if (i === 0) shape.moveTo(x, -y);
      else shape.lineTo(x, -y);
    });

    for (let j = 1; j < polygon.length; j++) {
      const hole = new THREE.Path();
      polygon[j].forEach((point, i) => {
        const proj = projection(point as [number, number]);
        if (!proj) return;
        const [x, y] = proj;
        if (i === 0) hole.moveTo(x, -y);
        else hole.lineTo(x, -y);
      });
      shape.holes.push(hole);
    }
    return shape;
  };

  if (feature.geometry.type === "Polygon") {
    shapes.push(createShape(feature.geometry.coordinates));
  } else if (feature.geometry.type === "MultiPolygon") {
    feature.geometry.coordinates.forEach((polygon: any) => {
      shapes.push(createShape(polygon));
    });
  }

  return shapes;
}

const StateMesh = ({ geo, setTooltip }: { geo: any; setTooltip: (t: string) => void }) => {
  const [hovered, setHovered] = useState(false);
  const shapes = useMemo(() => createShapesFromFeature(geo), [geo]);
  const name = geo.properties.name || geo.properties["hc-key"] || "State";

  const extrudeSettings = {
    depth: hovered ? 4 : 2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.5,
    bevelThickness: 0.5,
  };

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setTooltip(name);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        setHovered(false);
        setTooltip("");
        document.body.style.cursor = 'auto';
      }}
    >
      {shapes.map((shape, idx) => (
        <mesh key={idx}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial 
            color={hovered ? "#D9CCBA" : "#E6DFD3"} 
            roughness={0.8} 
            metalness={0.05} 
          />
          {/* Edge outline for clearer map borders */}
          <lineSegments>
            <edgesGeometry args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]} />
            <lineBasicMaterial color="#C9BAA3" linewidth={1} opacity={0.6} transparent />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
};

const TrainAnimation = () => {
  const trainRef = useRef<THREE.Group>(null);
  
  const curve = useMemo(() => {
    const points = routeWaypoints.map((w) => {
      const p = projection(w);
      return p ? new THREE.Vector3(p[0], -p[1], 4) : null;
    }).filter(Boolean) as THREE.Vector3[];
    
    // Low tension to match SVG curve
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.25);
  }, []);

  useFrame(({ clock }) => {
    if (!trainRef.current) return;
    const time = (clock.getElapsedTime() % 20) / 20; // 20s loop
    const position = curve.getPointAt(time);
    const tangent = curve.getTangentAt(time).normalize();
    
    trainRef.current.position.copy(position);
    
    // Calculate rotation from tangent
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
    
    // Apply additional rotation if needed to align the train model properly
    trainRef.current.quaternion.copy(quaternion);
  });

  return (
    <group>
      {/* Route track line */}
      <mesh>
        <tubeGeometry args={[curve, 256, 1.2, 8, false]} />
        <meshStandardMaterial color="#D4C9BA" />
      </mesh>
      
      {/* Inner track line */}
      <mesh>
        <tubeGeometry args={[curve, 256, 0.6, 8, false]} />
        <meshStandardMaterial color="#A23E33" />
      </mesh>

      {/* Train object */}
      <group ref={trainRef}>
        <mesh position={[0, 0, 2]}>
          <boxGeometry args={[20, 6, 8]} />
          <meshStandardMaterial color="#E87722" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 6]}>
          <boxGeometry args={[20, 1, 8]} />
          <meshStandardMaterial color="#D9A404" />
        </mesh>
        <mesh position={[9, 0, 2]}>
          <boxGeometry args={[4, 5, 7.5]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[10, 0, 2]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color="#FFFACD" />
        </mesh>
      </group>
    </group>
  );
};

const Stations = () => {
  return (
    <group>
      {stations.map((station, i) => {
        const p = projection(station.coordinates);
        if (!p) return null;
        return (
          <group key={i} position={[p[0], -p[1], 4.5]}>
            <mesh>
              <cylinderGeometry args={[2, 2, 0.5, 16]} />
              <meshStandardMaterial color="#F9F6F0" />
            </mesh>
            <mesh>
              <cylinderGeometry args={[3, 3, 0.2, 16]} />
              <meshStandardMaterial color="#A23E33" transparent opacity={0.8} />
            </mesh>
            <Text
              position={[0, 8, 0]}
              fontSize={7}
              color="#2A241F"
              font="https://fonts.gstatic.com/s/ibmplexsans/v14/zYXgKVElMYYaJe8bpLHnCwDKhdHeEw.woff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.8}
              outlineColor="#FFFFFF"
            >
              {station.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

export default function IndiaMap3D() {
  const [geographies, setGeographies] = useState<any[]>([]);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    fetch("/india.topo.json")
      .then((res) => res.json())
      .then((data) => {
        const topoFeature = feature(data, data.objects.default as any) as any;
        setGeographies(topoFeature.features || []);
      })
      .catch((err) => console.error("Error loading map data:", err));
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center overflow-hidden bg-[#F2EDE4]">
      {/* Info Card */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-[#EAE3D9] w-72 pointer-events-none">
        <h2 className="text-2xl font-bold text-[#A23E33] font-serif">Virasat</h2>
        <p className="text-sm text-[#4A433A] mt-1 font-sans">India told by India</p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-[#8B7D6B] font-sans uppercase tracking-wider text-xs">Active Route</p>
          <p className="text-sm text-[#2A241F] font-sans mt-0.5 font-medium">Grand Heritage Trail (3D)</p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold text-[#8B7D6B] font-sans uppercase tracking-wider text-xs">Location</p>
          <div className="text-sm text-[#2A241F] font-sans h-6 flex items-center mt-0.5 font-medium">
            {tooltipContent || <span className="text-[#8B7D6B] italic font-normal">Rotate and explore...</span>}
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 200, 150], fov: 45 }}
        style={{ width: "100%", height: "100%", outline: "none" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[100, 100, 100]} intensity={1.5} castShadow />
        <pointLight position={[-100, 50, 100]} intensity={1} color="#D9A404" />
        
        {/* Rotate the entire map group -90 degrees on X so it lays flat on the ground (XZ plane) */}
        <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {geographies.map((geo) => (
            <StateMesh key={geo.rsmKey || geo.properties.name} geo={geo} setTooltip={setTooltipContent} />
          ))}
          <TrainAnimation />
          <Stations />
        </group>
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going completely under the map
          minPolarAngle={0}                  // Allow looking straight down from the top
        />
      </Canvas>
    </div>
  );
}
