"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";
import { geoMercator } from "d3-geo";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import { ALL_STATES, getStateAtProgress } from "@/data/states";
import type { StateData, TimelineEra } from "@/data/states";

import { useNarrator } from "@/components/journey/NarratorAudio";
import RouteNarrator from "@/components/journey/RouteNarrator";
import HistoryTimelinePanel from "@/components/journey/HistoryTimelinePanel";
import {
  ArtisanVideoPlayer,
  ArtisanSupportCTA,
} from "@/components/journey/ArtisanVideoPlayer";
import JourneyPassport from "@/components/shared/JourneyPassport";
import JourneyIntro from "@/components/journey/JourneyIntro";

// ─── Map constants (must match IndiaMap.tsx exactly) ─────────────────────────
const MAP_SCALE = 1100;
const MAP_CENTER: [number, number] = [80, 22];

const DEFAULT_ROUTE_WAYPOINTS: [number, number][] = [
  [75.79, 26.91], [78.50, 26.80], [80.95, 26.85],
  [83.00, 26.00], [85.14, 25.59], [87.00, 26.00],
  [88.40, 26.70], [88.51, 27.33], [88.60, 26.60],
  [91.70, 26.20], [93.00, 26.00], [94.10, 25.67],
  [93.00, 25.80], [91.70, 26.00], [89.50, 26.20],
  [88.40, 26.50], [88.00, 24.50], [87.30, 22.50],
  [86.50, 21.20], [85.82, 20.30], [84.00, 19.00],
  [81.50, 18.00], [78.48, 17.38], [78.00, 15.50],
  [77.50, 13.00], [77.00, 11.00], [76.94, 8.52],
];

const DEFAULT_STATIONS = [
  { name: "Jaipur",     state: "Rajasthan", coordinates: [75.79, 26.91] as [number, number], dx: -15, dy: -10, anchor: "end"    },
  { name: "Patna",      state: "Bihar",     coordinates: [85.14, 25.59] as [number, number], dx:   0, dy: -15, anchor: "middle" },
  { name: "Kohima",     state: "Nagaland",  coordinates: [94.10, 25.67] as [number, number], dx:  15, dy:   5, anchor: "start"  },
  { name: "Trivandrum", state: "Kerala",    coordinates: [76.94,  8.52] as [number, number], dx:  15, dy:   5, anchor: "start"  },
];

// ─── SVG path helpers ─────────────────────────────────────────────────────────

function buildSmoothPath(
  waypoints: [number, number][],
  projection: (c: [number, number]) => [number, number] | null
): string {
  const pts = waypoints.map((w) => projection(w)).filter((p): p is [number, number] => p !== null);
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const t = 0.25;
    const cp1x = p1[0] + (p2[0] - p0[0]) * t / 3;
    const cp1y = p1[1] + (p2[1] - p0[1]) * t / 3;
    const cp2x = p2[0] - (p3[0] - p1[0]) * t / 3;
    const cp2y = p2[1] - (p3[1] - p1[1]) * t / 3;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/** Sample (x,y) position and tangent angle along an SVG path at progress t ∈ [0,1] */
function samplePath(
  pathEl: SVGPathElement,
  t: number
): { x: number; y: number; angle: number } {
  const len = pathEl.getTotalLength();
  const pt = pathEl.getPointAtLength(t * len);
  const pt2 = pathEl.getPointAtLength(Math.min((t + 0.001) * len, len));
  const angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
  return { x: pt.x, y: pt.y, angle };
}

// ─── Journey stages ───────────────────────────────────────────────────────────

type JourneyStage =
  | "travelling"        // train is moving, narrator hidden
  | "intro-speaking"    // narrator visible, speaking intro
  | "timeline"          // history cards open
  | "outro-speaking"    // narrator speaking outro before video
  | "video"             // artisan video playing
  | "cta"               // support CTA modal
  | "done";             // journey complete

// ─── Main component ───────────────────────────────────────────────────────────

export default function JourneyPage() {
  // Map data
  const [geographies, setGeographies] = useState<unknown[]>([]);

  // Personalization state
  const [introDone, setIntroDone] = useState(false);
  const [dynamicStates, setDynamicStates] = useState<StateData[]>(ALL_STATES);
  const [dynamicStations, setDynamicStations] = useState(DEFAULT_STATIONS);
  const [dynamicRouteWaypoints, setDynamicRouteWaypoints] = useState<[number, number][]>(DEFAULT_ROUTE_WAYPOINTS);

  const handleIntroComplete = useCallback(() => {
    const rootState = localStorage.getItem("virasat_roots");
    
    if (rootState && rootState !== "Just exploring") {
      let currentStates = JSON.parse(JSON.stringify(ALL_STATES)) as StateData[];
      let currentStations = [...DEFAULT_STATIONS];
      let currentWaypoints = [...DEFAULT_ROUTE_WAYPOINTS];

      const stateIndex = currentStates.findIndex(s => s.name === rootState);
      if (stateIndex > 0) {
        const selectedState = currentStates[stateIndex];
        selectedState.introScript = "This one might be close to home. " + selectedState.introScript;
        
        currentStates.splice(stateIndex, 1);
        currentStates.unshift(selectedState);
        
        const selectedStation = currentStations[stateIndex];
        currentStations.splice(stateIndex, 1);
        currentStations.unshift(selectedStation);
        
        currentWaypoints = currentStations.map(s => s.coordinates);
        
        currentStates[0].trainProgressRange = [0.0, 0.1];
        currentStates[1].trainProgressRange = [0.3, 0.4];
        currentStates[2].trainProgressRange = [0.6, 0.7];
        currentStates[3].trainProgressRange = [0.95, 1.0];
      } else if (stateIndex === 0) {
        currentStates[0].introScript = "This one might be close to home. " + currentStates[0].introScript;
      }
      
      setDynamicStates(currentStates);
      setDynamicStations(currentStations);
      setDynamicRouteWaypoints(currentWaypoints);
    }
    
    setIntroDone(true);
  }, []);

  // JS-driven train animation
  const [trainProgress, setTrainProgress] = useState(0); // 0 → 1
  const trainPathRef = useRef<SVGPathElement>(null);
  const trainGroupRef = useRef<SVGGElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const isPausedRef = useRef(false);
  const TRAIN_DURATION = 40_000; // 40 s for full route

  // Journey state machine
  const [stage, setStage] = useState<JourneyStage>("travelling");
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const [newStamp, setNewStamp] = useState<string | null>(null);

  // Narrator overlay state
  const [isNarratorVisible, setIsNarratorVisible] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [currentFactBadge, setCurrentFactBadge] = useState<string | undefined>();

  // Narrator
  const narrator = useNarrator();

  // Load map
  useEffect(() => {
    fetch("/india.topo.json")
      .then((r) => r.json())
      .then((data) => {
        const f = feature(data, (data as any).objects.default) as any;
        setGeographies(f.features ?? []);
      });
  }, []);

  // ── Build projection + track path (memoised) ────────────────────────────
  const trackPath = useMemo(() => {
    const projection = geoMercator().scale(MAP_SCALE).center(MAP_CENTER).translate([400, 300]);
    return buildSmoothPath(dynamicRouteWaypoints, projection as any);
  }, [dynamicRouteWaypoints]);

  // ── JS-driven animation loop ─────────────────────────────────────────────
  const animateTrain = useCallback(() => {
    let lastTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (isPausedRef.current) {
        lastTimestamp = null;
        animFrameRef.current = requestAnimationFrame(step);
        return;
      }

      if (lastTimestamp === null) { lastTimestamp = timestamp; }
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      progressRef.current = Math.min(progressRef.current + delta / TRAIN_DURATION, 1);
      setTrainProgress(progressRef.current);

      // Move train SVG element
      const pathEl = trainPathRef.current;
      const groupEl = trainGroupRef.current;
      if (pathEl && groupEl) {
        const { x, y, angle } = samplePath(pathEl, progressRef.current);
        groupEl.setAttribute(
          "transform",
          `translate(${x - 18}, ${y - 8}) rotate(${angle}, 18, 8) scale(0.6)`
        );
      }

      if (progressRef.current < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  useEffect(() => {
    if (!introDone) return;
    const cleanup = animateTrain();
    return cleanup;
  }, [animateTrain, introDone]);

  // ── State entry detection ────────────────────────────────────────────────
  const lastDetectedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (stage !== "travelling" || !introDone) return; // only detect while travelling

    const detected = dynamicStates.find(
      (s) => trainProgress >= s.trainProgressRange[0] && trainProgress <= s.trainProgressRange[1]
    );
    if (!detected) return;
    if (detected.slug === lastDetectedSlug.current) return;
    if (visitedSlugs.includes(detected.slug)) return;

    lastDetectedSlug.current = detected.slug;
    isPausedRef.current = true; // pause train
    setActiveState(detected);
    setStage("intro-speaking");
    setIsNarratorVisible(true);
    setSpeechText(detected.introScript);
    setCurrentFactBadge(undefined);

    narrator.speak(detected.introScript, () => {
      // After intro ends → open timeline
      setStage("timeline");
      setIsNarratorVisible(false);
      setSpeechText("");
    });
  }, [trainProgress, stage, visitedSlugs, narrator, introDone, dynamicStates]);

  // ── Timeline card change → narrator reads card script ───────────────────
  const handleCardChange = useCallback(
    (era: TimelineEra) => {
      setSpeechText(era.script);
      setCurrentFactBadge(era.factBadge);
      setIsNarratorVisible(true);
      narrator.speak(era.script);
    },
    [narrator]
  );

  // ── Timeline complete → outro speaking ──────────────────────────────────
  const handleTimelineComplete = useCallback(() => {
    if (!activeState) return;
    setStage("outro-speaking");
    setIsNarratorVisible(true);
    setSpeechText(activeState.outroScript);
    narrator.speak(activeState.outroScript, () => {
      setStage("video");
      setIsNarratorVisible(false);
      setSpeechText("");
    });
  }, [activeState, narrator]);

  // ── Video ends → CTA ────────────────────────────────────────────────────
  const handleVideoEnd = useCallback(() => {
    setStage("cta");
  }, []);

  // ── CTA continue → resume journey ────────────────────────────────────────
  const handleCTAContinue = useCallback(() => {
    if (!activeState) return;

    // Award stamp
    setVisitedSlugs((prev) => [...prev, activeState.slug]);
    setNewStamp(activeState.slug);
    setTimeout(() => setNewStamp(null), 200); // reset after passport picks it up

    setStage("travelling");
    setIsNarratorVisible(false);
    setSpeechText("");
    setCurrentFactBadge(undefined);
    isPausedRef.current = false; // resume train
  }, [activeState]);

  // ── Timeline close (X) → also resume ─────────────────────────────────────
  const handlePanelClose = useCallback(() => {
    narrator.stop();
    setStage("travelling");
    setIsNarratorVisible(false);
    setSpeechText("");
    isPausedRef.current = false;
  }, [narrator]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const isDimmed = stage !== "travelling";

  return (
    <main className="relative w-full min-h-screen bg-[#F9F6F0] overflow-hidden font-sans">
      <AnimatePresence>
        {!introDone && <JourneyIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-6 pt-5 pointer-events-none mt-20">
        <div className="flex items-center gap-3">
          {/* Using text instead of logo image since we don't know if logo is dark-mode specific */}
          <span className="text-[#A23E33] font-serif font-bold text-2xl drop-shadow-sm">Virasat Journey</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-[#EAE3D9] rounded-full px-5 py-2 shadow-sm">
          <p className="text-[#8B7D6B] text-xs font-sans tracking-widest uppercase font-semibold">
            Grand Heritage Trail
          </p>
        </div>
      </header>

      {/* ── Map + Train (full-screen SVG) ────────────────────── */}
      <motion.div
        className="w-full h-screen"
        animate={{ filter: isDimmed ? "brightness(0.7) sepia(0.2)" : "brightness(1)" }}
        transition={{ duration: 0.6 }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: MAP_SCALE, center: MAP_CENTER }}
          className="w-full h-full object-contain outline-none"
        >
          <defs>
            <pattern id="railTies" patternUnits="userSpaceOnUse" width="12" height="6">
              <line x1="6" y1="0" x2="6" y2="6" stroke="#A23E33" strokeWidth="1.5" opacity="0.6" />
            </pattern>
          </defs>

          <Geographies geography={geographies}>
            {({ geographies: geos }: { geographies: any[] }) =>
              geos.map((geo: any) => {
                const name = geo.properties.name ?? "";
                const isActive = dynamicStates.some(
                  (s) => s.name === name && visitedSlugs.includes(s.slug)
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: isActive ? "#A23E33" : "#E6DFD3", stroke: "#C9BAA3", strokeWidth: 0.5, outline: "none" },
                      hover:   { fill: isActive ? "#8A3329" : "#D9CCBA", stroke: "#C9BAA3", strokeWidth: 0.5, outline: "none" },
                      pressed: { fill: "#8A3329", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Track */}
          <path d={trackPath} fill="none" stroke="#3D3428" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <path d={trackPath} fill="none" stroke="url(#railTies)" strokeWidth={8} strokeLinecap="butt" strokeDasharray="2 10" />
          <motion.path
            ref={trainPathRef as any}
            id="train-track-journey"
            d={trackPath}
            fill="none"
            strokeLinecap="round"
            initial={{ strokeWidth: 2, stroke: "#A23E33", opacity: 1, filter: "none" }}
            animate={
              stage === "intro-speaking"
                ? { 
                    strokeWidth: [2, 6, 2], 
                    opacity: [1, 0.8, 1],
                    stroke: ["#A23E33", "#E87722", "#A23E33"],
                    filter: ["drop-shadow(0px 0px 0px #A23E33)", "drop-shadow(0px 0px 8px #A23E33)", "drop-shadow(0px 0px 0px #A23E33)"]
                  }
                : { strokeWidth: 2, stroke: "#A23E33", opacity: 1, filter: "none" }
            }
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* JS-driven train */}
          <g ref={trainGroupRef as any}>
            <rect x="0" y="4" width="60" height="14" rx="4" fill="#E87722" stroke="#C05C10" strokeWidth="1" />
            <rect x="0" y="14" width="60" height="3" fill="#D9A404" />
            <path d="M60,4 Q72,11 60,18" fill="#E87722" stroke="#C05C10" strokeWidth="1" />
            <rect x="4"  y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="14" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="24" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="34" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <rect x="44" y="6" width="7" height="5" rx="1" fill="#1a1a1a" />
            <circle cx="65" cy="11" r="1.5" fill="#FFFACD" />
            <circle cx="10" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
            <circle cx="25" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
            <circle cx="40" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
            <circle cx="55" cy="19" r="2.5" fill="#333" stroke="#222" strokeWidth="0.5" />
          </g>

          {/* Station markers */}
          {dynamicStations.map((station, i) => (
            <Marker key={`st-${i}`} coordinates={station.coordinates}>
              <circle r={6} fill="none" stroke="#A23E33" strokeWidth={1} opacity={0.4} />
              <circle r={4} fill="#171512" stroke="#E9E4D8" strokeWidth={1.5} />
              <text
                textAnchor={(station.anchor as any) ?? "middle"}
                x={station.dx ?? 0}
                y={station.dy ?? -10}
                className="text-[7px] font-medium fill-[#E9E4D8] pointer-events-none font-sans"
              >
                {station.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>

        {/* ── Travelling Live HUD (Active when train moves) ── */}
        <AnimatePresence>
          {stage === "travelling" && introDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-[#171512]/85 backdrop-blur-md border border-[#D9A404]/30 px-6 py-3 rounded-full shadow-2xl pointer-events-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E87722] animate-ping" />
              <div className="flex items-center gap-3 text-xs font-sans">
                <span className="text-[#D9A404] font-bold uppercase tracking-wider">
                  Express En Route
                </span>
                <span className="text-white/30">•</span>
                <span className="text-[#E9E4D8]">
                  Approaching: <strong className="text-[#D9A404] font-serif">{visitedSlugs.length === 0 ? "Jaipur, Rajasthan" : "Next Heritage Station"}</strong>
                </span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="text-[#8B7D6B] hidden sm:inline">
                  Speed: 110 km/h
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Train window frame overlay ────────────────────────── */}
      <AnimatePresence>
        {stage === "intro-speaking" && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Image
              src="/train_transition.png"
              alt="Train window"
              fill
              className="object-cover opacity-30"
              sizes="100vw"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Route Narrator Caption Overlay ─────────────────────── */}
      <RouteNarrator
        isVisible={isNarratorVisible}
        title={activeState ? (stage === "intro-speaking" ? `Entering ${activeState.name}` : activeState.name) : undefined}
        speechText={speechText}
        factBadge={currentFactBadge}
      />

      {/* ── History Timeline Panel ───────────────────────────── */}
      {activeState && (
        <HistoryTimelinePanel
          isOpen={stage === "timeline"}
          stateName={activeState.name}
          tagline={activeState.tagline}
          timeline={activeState.timeline}
          onClose={handlePanelClose}
          onComplete={handleTimelineComplete}
          onCardChange={handleCardChange}
        />
      )}

      {/* ── Artisan Video ────────────────────────────────────── */}
      {activeState && (
        <ArtisanVideoPlayer
          isOpen={stage === "video"}
          artisan={activeState.artisan}
          onClose={() => setStage("cta")}
          onVideoEnd={handleVideoEnd}
        />
      )}

      {/* ── Support CTA ──────────────────────────────────────── */}
      {activeState && (
        <ArtisanSupportCTA
          isOpen={stage === "cta"}
          artisan={activeState.artisan}
          onContinue={handleCTAContinue}
        />
      )}

      {/* ── Journey Passport ─────────────────────────────────── */}
      <JourneyPassport newlyEarnedSlug={newStamp} />

      {/* ── Journey Complete banner ───────────────────────────── */}
      <AnimatePresence>
        {trainProgress >= 0.98 && visitedSlugs.length === dynamicStates.length && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#171512]/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center px-8">
              <p className="text-[#D9A404] font-serif text-xl mb-2">The journey is complete.</p>
              <h2 className="text-5xl font-bold text-[#E9E4D8] font-serif mb-4">
                India, told by India.
              </h2>
              <p className="text-[#6B6355] font-sans mb-8">
                You've collected all 4 stamps. The thread continues with you.
              </p>
              <a
                href="/"
                className="inline-block px-8 py-3 bg-[#A23E33] hover:bg-[#8a3329] text-white 
                           font-bold font-sans rounded-full transition-all hover:scale-105"
              >
                Return to Map
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
