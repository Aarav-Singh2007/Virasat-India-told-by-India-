"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";
import { geoMercator } from "d3-geo";

// The route connects: Rajasthan (Jaipur) → UP (Lucknow) → Bihar (Patna) → 
// Sikkim → Nagaland (Kohima) → Odisha → Telangana → Kerala (Trivandrum)
const routeWaypoints: [number, number][] = [
  // Rajasthan
  [75.79, 26.91],   // Jaipur (START)
  // To Lucknow
  [78.50, 26.80],   // UP
  [80.95, 26.85],   // Lucknow
  // To Patna
  [83.00, 26.00],   // UP/Bihar
  [85.14, 25.59],   // Patna
  // To Sikkim
  [87.00, 26.00],   // Bihar
  [88.40, 26.70],   // Siliguri corridor
  [88.51, 27.33],   // Sikkim
  // To Kohima
  [88.60, 26.60],   // Siliguri down
  [91.70, 26.20],   // Guwahati
  [93.00, 26.00],   // Assam
  [94.10, 25.67],   // Kohima
  // Return down to Odisha
  [93.00, 25.80],   // Assam return
  [91.70, 26.00],   // Guwahati return
  [89.50, 26.20],   // Assam/WB border
  [88.40, 26.50],   // Siliguri corridor return
  [88.00, 24.50],   // WB inland
  [87.30, 22.50],   // WB inland
  [86.50, 21.20],   // Odisha border
  [85.82, 20.30],   // Bhubaneswar (Odisha)
  // To Telangana
  [84.00, 19.00],   // AP border
  [81.50, 18.00],   // Telangana border
  [78.48, 17.38],   // Hyderabad (Telangana)
  // To Kerala
  [78.00, 15.50],   // AP/Karnataka
  [77.50, 13.00],   // Karnataka
  [77.00, 11.00],   // TN border
  [76.94,  8.52],   // Trivandrum (Kerala)
];

// Only the 4 required stations are visible
const stations = [
  { name: "Jaipur",     state: "Rajasthan", coordinates: [75.79, 26.91] as [number, number], dx: -15, dy: -10, anchor: "end" },
  { name: "Patna",      state: "Bihar",     coordinates: [85.14, 25.59] as [number, number], dx:  0,  dy: -15, anchor: "middle" },
  { name: "Kohima",     state: "Nagaland",  coordinates: [94.10, 25.67] as [number, number], dx:  15, dy:  5,  anchor: "start" },
  { name: "Trivandrum", state: "Kerala",    coordinates: [76.94,  8.52] as [number, number], dx:  15, dy:  5,  anchor: "start" },
];

const MAP_SCALE = 1100;
const MAP_CENTER: [number, number] = [80, 22];

/**
 * Build a smooth cubic-bezier SVG path through projected waypoints.
 * Uses Catmull-Rom → cubic-bezier conversion with LOW tension (0.25)
 * to prevent curves from overshooting into the ocean.
 */
function buildSmoothPath(
  waypoints: [number, number][],
  projection: (coords: [number, number]) => [number, number] | null
): string {
  const pts = waypoints
    .map((w) => projection(w))
    .filter((p): p is [number, number] => p !== null);

  if (pts.length < 2) return "";

  let d = `M ${pts[0][0]},${pts[0][1]}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];

    // Low tension (0.25) keeps curves tight to the waypoints
    const t = 0.25;
    const cp1x = p1[0] + (p2[0] - p0[0]) * t / 3;
    const cp1y = p1[1] + (p2[1] - p0[1]) * t / 3;
    const cp2x = p2[0] - (p3[0] - p1[0]) * t / 3;
    const cp2y = p2[1] - (p3[1] - p1[1]) * t / 3;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }

  return d;
}

export default function IndiaMap() {
  const [geographies, setGeographies] = useState<any[]>([]);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    fetch("/india.topo.json")
      .then((res) => res.json())
      .then((data) => {
        const topoFeature = feature(data, data.objects.default) as any;
        setGeographies(topoFeature.features || []);
      })
      .catch((err) => console.error("Error loading map data:", err));
  }, []);

  // Build the projection and smooth path once
  const trackPath = useMemo(() => {
    const projection = geoMercator()
      .scale(MAP_SCALE)
      .center(MAP_CENTER)
      .translate([400, 300]); // EXACTLY matches ComposableMap default 800x600 SVG

    return buildSmoothPath(routeWaypoints, projection as any);
  }, []);

  return (
    <div className="relative w-full h-[90vh] flex flex-col items-center overflow-hidden">
      {/* Info Card — translucent panel, bottom-left, part of the map */}
      <div className="absolute bottom-6 left-6 z-10 bg-[#171512]/70 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-[#6B6355]/50 w-72 pointer-events-none">
        <h2 className="text-2xl font-bold text-[#A23E33] font-serif">
          Virasat
        </h2>
        <p className="text-sm text-[#E9E4D8] mt-1 font-sans">
          India told by India
        </p>
        <div className="mt-6">
          <p className="text-sm font-semibold text-[#6B6355] font-sans">Active Route:</p>
          <p className="text-sm text-[#E9E4D8] font-sans">
            Grand Heritage Trail
          </p>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold text-[#6B6355] font-sans">Location:</p>
          <div className="text-sm text-[#E9E4D8] font-sans h-6 flex items-center">
            {tooltipContent || <span className="opacity-50 font-light italic">Explore the map...</span>}
          </div>
        </div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: MAP_SCALE,
          center: MAP_CENTER,
        }}
        className="w-full h-full object-contain outline-none"
      >
        {/* SVG defs for the railroad cross-ties pattern and train */}
        <defs>
          {/* Railroad tie pattern — short perpendicular lines across the track */}
          <pattern
            id="railTies"
            patternUnits="userSpaceOnUse"
            width="12"
            height="6"
            patternTransform="rotate(0)"
          >
            <line x1="6" y1="0" x2="6" y2="6" stroke="#A23E33" strokeWidth="1.5" opacity="0.6" />
          </pattern>
        </defs>

        {/* Map geography */}
        <Geographies geography={geographies}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const stateName =
                geo.properties.name || geo.properties["hc-key"] || "State";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setTooltipContent(stateName)}
                  onMouseLeave={() => setTooltipContent("")}
                  style={{
                    default: {
                      fill: "#6B6355",
                      stroke: "#171512",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "#6B6355",
                      stroke: "#171512",
                      strokeWidth: 0.5,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#6B6355",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* ── Railway Track ────────────────────────────────── */}
        {/* Outer rail — thicker, darker */}
        <path
          d={trackPath}
          fill="none"
          stroke="#3D3428"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cross-ties — dashed pattern in between */}
        <path
          d={trackPath}
          fill="none"
          stroke="url(#railTies)"
          strokeWidth={8}
          strokeLinecap="butt"
          strokeDasharray="2 10"
        />
        {/* Inner rail — thinner, madder red */}
        <path
          id="train-track"
          d={trackPath}
          fill="none"
          stroke="#A23E33"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── Animated Orange Vande Bharat Train ─────────── */}
        <g>
          <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
            <mpath href="#train-track" />
          </animateMotion>
          {/* Train body — orange Vande Bharat livery */}
          <g transform="translate(-18, -8) scale(0.6)">
            {/* Main body — saffron orange */}
            <rect x="0" y="4" width="60" height="14" rx="4" fill="#E87722" stroke="#C05C10" strokeWidth="1" />
            {/* Gold accent stripe */}
            <rect x="0" y="14" width="60" height="3" rx="0" fill="#D9A404" />
            {/* Nose — aerodynamic tip */}
            <path d="M60,4 Q72,11 60,18" fill="#E87722" stroke="#C05C10" strokeWidth="1" />
            {/* Windows */}
            <rect x="4"  y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="14" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="24" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="34" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="44" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            {/* Headlight */}
            <circle cx="65" cy="11" r="1.5" fill="#FFFACD" />
            {/* Wheels */}
            <circle cx="10" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
            <circle cx="25" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
            <circle cx="40" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
            <circle cx="55" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
          </g>
        </g>

        {/* ── Station Markers ─────────────────────────────── */}
        {stations.map((station, i) => (
          <Marker
            key={`station-${i}`}
            coordinates={station.coordinates}
            onMouseEnter={() => setTooltipContent(`${station.name}, ${station.state}`)}
            onMouseLeave={() => setTooltipContent("")}
          >
            {/* Outer glow ring */}
            <circle r={6} fill="none" stroke="#A23E33" strokeWidth={1} opacity={0.4} />
            {/* Station dot */}
            <circle
              r={4}
              fill="#171512"
              stroke="#E9E4D8"
              strokeWidth={1.5}
              className="cursor-pointer"
            />
            {/* Label */}
            <text
              textAnchor={(station.anchor as any) || "middle"}
              x={station.dx || 0}
              y={station.dy || -10}
              className="text-[7px] font-medium fill-[#E9E4D8] pointer-events-none font-sans"
            >
              {station.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
