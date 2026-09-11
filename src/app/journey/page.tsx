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
  const currentDist = t * len;
  const pt = pathEl.getPointAtLength(currentDist);

  // Stable tangent sampling with centered forward/backward chord
  const delta = Math.min(Math.max(len * 0.005, 4), 10);
  const ptAhead = pathEl.getPointAtLength(Math.min(currentDist + delta, len));
  const ptBehind = pathEl.getPointAtLength(Math.max(currentDist - delta, 0));

  const angle = (Math.atan2(ptAhead.y - ptBehind.y, ptAhead.x - ptBehind.x) * 180) / Math.PI;
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

  // Fixed trail state (starts at Rajasthan)
  const [dynamicStates] = useState<StateData[]>(ALL_STATES);
  const [dynamicStations] = useState(DEFAULT_STATIONS);
  const [dynamicRouteWaypoints] = useState<[number, number][]>(DEFAULT_ROUTE_WAYPOINTS);

  // JS-driven train animation
  const [trainProgress, setTrainProgress] = useState(0); // 0 → 1
  const trainPathRef = useRef<SVGPathElement>(null);
  const trainGroupRef = useRef<SVGGElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const isPausedRef = useRef(false);
  const TRAIN_DURATION = 55_000; // 55 s for full route (scenic cruise pace)

  // Journey state machine
  const [stage, setStage] = useState<JourneyStage>("travelling");
  const [activeState, setActiveState] = useState<StateData | null>(null);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
  const [newStamp, setNewStamp] = useState<string | null>(null);

  // Narrator overlay state
  const [isNarratorVisible, setIsNarratorVisible] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [currentFactBadge, setCurrentFactBadge] = useState<string | undefined>();

  // Transit song & voiceover between Rajasthan & Bihar
  const transitAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedBiharTransit = useRef(false);
  const [isTransitActive, setIsTransitActive] = useState(false);

  // Narrator
  const narrator = useNarrator();

  // Active personalized mascot image based on journey stage & state
  const currentMascotImage = useMemo(() => {
    if (isTransitActive) {
      return "/masscots/Bihar_thinking.png";
    }
    if (!activeState) return undefined;

    if (stage === "intro-speaking") {
      const greetingPose = activeState.mascotPoses?.find(
        (p) => p.label === "greeting" || p.label === "welcome" || p.label === "boat" || p.label === "upward"
      );
      return greetingPose?.image || activeState.mascotPoses?.[0]?.image;
    }

    if (stage === "outro-speaking") {
      const outroPose = activeState.mascotPoses?.find(
        (p) => p.label === "storytelling" || p.label === "scroll" || p.label === "pointing"
      );
      return outroPose?.image || activeState.mascotPoses?.[0]?.image;
    }

    return activeState.mascotPoses?.[0]?.image;
  }, [activeState, stage, isTransitActive]);

  // Mascot image for timeline storytelling panel
  const timelineMascotImage = useMemo(() => {
    if (!activeState) return undefined;
    const storytellingPose = activeState.mascotPoses?.find(
      (p) => p.label === "storytelling" || p.label === "scroll" || p.label === "pointing"
    );
    return storytellingPose?.image || activeState.mascotPoses?.[0]?.image;
  }, [activeState]);

  // Clean up transit audio on unmount
  useEffect(() => {
    return () => {
      if (transitAudioRef.current) {
        transitAudioRef.current.pause();
        transitAudioRef.current.src = "";
      }
    };
  }, []);

  // Trigger Chhath folk music & voiceover when departing Rajasthan towards Bihar
  const triggerBiharTransit = useCallback(() => {
    if (hasPlayedBiharTransit.current) return;
    hasPlayedBiharTransit.current = true;
    setIsTransitActive(true);

    narrator.stop();

    // 1. Start Chhath folk song
    const audio = new Audio("/audio/Chaat.mp3");
    transitAudioRef.current = audio;
    audio.volume = 0.55;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay for transit music prevented:", err);
      });
    }

    // 2. Pause transit audio when voiceover begins so no background voice/singing disturbs the narrator
    const timer = setTimeout(() => {
      if (transitAudioRef.current) {
        transitAudioRef.current.pause();
      }

      const transitSpeech =
        "Oh, looks like we are entering Bihar! Listen closely — that is the sacred folk song of Chhath Puja echoing across the Ganges. Next stop: Patna!";

      setIsNarratorVisible(true);
      setSpeechText(transitSpeech);
      setCurrentFactBadge("🌾 Chhath Mahaparv • The ancient solar festival celebrated across Bihar");

      narrator.speak(transitSpeech, () => {
        setIsNarratorVisible(false);
        setSpeechText("");
        setCurrentFactBadge(undefined);

        // Resume transit music gently after voiceover completes
        if (transitAudioRef.current) {
          transitAudioRef.current.volume = 0.30;
          transitAudioRef.current.play().catch(() => {});
        }

        setIsTransitActive(false);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [narrator]);

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

      // Move train SVG element (centered at origin)
      const pathEl = trainPathRef.current;
      const groupEl = trainGroupRef.current;
      if (pathEl && groupEl) {
        const { x, y, angle } = samplePath(pathEl, progressRef.current);
        groupEl.setAttribute(
          "transform",
          `translate(${x}, ${y}) rotate(${angle}) scale(0.55)`
        );
      }

      if (progressRef.current < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, []);

  // Position train at starting station immediately on mount / track ready
  useEffect(() => {
    const pathEl = trainPathRef.current;
    const groupEl = trainGroupRef.current;
    if (pathEl && groupEl) {
      const { x, y, angle } = samplePath(pathEl, progressRef.current);
      groupEl.setAttribute(
        "transform",
        `translate(${x}, ${y}) rotate(${angle}) scale(0.55)`
      );
    }
  }, [trackPath]);

  useEffect(() => {
    const cleanup = animateTrain();
    return cleanup;
  }, [animateTrain]);

  // ── State entry detection ────────────────────────────────────────────────
  const lastDetectedSlug = useRef<string | null>(null);

  useEffect(() => {
    if (stage !== "travelling") return; // only detect while travelling

    // Find the next unvisited state in route order
    const nextState = dynamicStates.find((s) => !visitedSlugs.includes(s.slug));
    if (!nextState) return;

    // Check if train has reached the station's progress threshold
    if (trainProgress < nextState.trainProgressRange[0]) return;
    if (nextState.slug === lastDetectedSlug.current) return;

    // Halt train immediately at the station platform
    isPausedRef.current = true;
    lastDetectedSlug.current = nextState.slug;

    // End transit sequence & cleanly fade out transit music
    setIsTransitActive(false);
    if (transitAudioRef.current) {
      const a = transitAudioRef.current;
      const fadeInterval = setInterval(() => {
        if (a.volume > 0.08) {
          a.volume = Math.max(0, a.volume - 0.08);
        } else {
          clearInterval(fadeInterval);
          a.pause();
          a.currentTime = 0;
        }
      }, 80);
    }

    // Stop any ongoing transit narration and silence background audio
    narrator.stop();
    if (transitAudioRef.current) {
      transitAudioRef.current.pause();
      transitAudioRef.current.src = "";
    }

    // Trigger state welcome
    setActiveState(nextState);
    setStage("intro-speaking");
    setIsNarratorVisible(true);
    setSpeechText(nextState.introScript);
    setCurrentFactBadge(undefined);

    narrator.speak(nextState.introScript, () => {
      // After intro ends → open timeline
      setStage("timeline");
      setIsNarratorVisible(false);
      setSpeechText("");
    });
  }, [trainProgress, stage, visitedSlugs, narrator, dynamicStates]);

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

    const completedSlug = activeState.slug;

    // Award stamp
    setVisitedSlugs((prev) => (prev.includes(completedSlug) ? prev : [...prev, completedSlug]));
    setNewStamp(completedSlug);
    setTimeout(() => setNewStamp(null), 200); // reset after passport picks it up

    setStage("travelling");
    setIsNarratorVisible(false);
    setSpeechText("");
    setCurrentFactBadge(undefined);
    isPausedRef.current = false; // resume train

    // When departing Rajasthan towards Bihar, trigger the festive Chhath audio & voiceover
    if (completedSlug === "rajasthan") {
      triggerBiharTransit();
    }
  }, [activeState, triggerBiharTransit]);

  // ── Timeline close (X) → also resume ─────────────────────────────────────
  const handlePanelClose = useCallback(() => {
    narrator.stop();
    if (activeState) {
      setVisitedSlugs((prev) => (prev.includes(activeState.slug) ? prev : [...prev, activeState.slug]));
    }
    setStage("travelling");
    setIsNarratorVisible(false);
    setSpeechText("");
    isPausedRef.current = false;

    if (activeState?.slug === "rajasthan") {
      triggerBiharTransit();
    }
  }, [activeState, narrator, triggerBiharTransit]);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const isDimmed = stage !== "travelling";

  return (
    <main className="relative w-full min-h-screen bg-[#F9F6F0] overflow-hidden font-sans">
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
            {/* Vande Bharat Gradients */}
            <linearGradient id="vandeBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#F8FAFC" />
              <stop offset="75%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="vandeBlueStripe" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#002878" />
              <stop offset="100%" stopColor="#0C3E9E" />
            </linearGradient>
            <linearGradient id="vandeWindowGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#090D16" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="vandeHeadlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.7" />
              <stop offset="35%" stopColor="#FEF08A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
            </linearGradient>
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

          {/* Authentic Vande Bharat Express Trainset (Centered at 0,0) */}
          <g ref={trainGroupRef as any}>
            {/* Ground Drop Shadow */}
            <ellipse cx="0" cy="7.5" rx="44" ry="3.5" fill="rgba(0,0,0,0.35)" />

            {/* Glowing Forward Headlight Beam */}
            <polygon points="45,-1 90,-12 90,14 45,3" fill="url(#vandeHeadlightBeam)" opacity="0.85" />

            {/* Aerodynamic Undercarriage Skirt */}
            <rect x="-44" y="4.2" width="86" height="3" rx="1" fill="#1E293B" />
            <circle cx="-35" cy="6.6" r="1.6" fill="#475569" />
            <circle cx="-25" cy="6.6" r="1.6" fill="#475569" />
            <circle cx="-8"  cy="6.6" r="1.6" fill="#475569" />
            <circle cx="2"   cy="6.6" r="1.6" fill="#475569" />
            <circle cx="21"  cy="6.6" r="1.6" fill="#475569" />
            <circle cx="31"  cy="6.6" r="1.6" fill="#475569" />

            {/* ── Coach 1: Rear Passenger Coach ── */}
            <path
              d="M -42,-6.5 L -17,-6.5 L -17,4.5 L -42,4.5 C -45,4.5 -46,2 -46,-1 C -46,-4 -45,-6.5 -42,-6.5 Z"
              fill="url(#vandeBodyGrad)"
              stroke="#94A3B8"
              strokeWidth="0.4"
            />
            {/* Navy Blue Window Band */}
            <rect x="-44" y="-3.5" width="27" height="4.8" fill="url(#vandeBlueStripe)" />
            {/* Tinted Panoramic Windows */}
            <rect x="-41"   y="-2.5" width="6.5" height="2.8" rx="0.8" fill="url(#vandeWindowGlass)" />
            <rect x="-32.5" y="-2.5" width="6.5" height="2.8" rx="0.8" fill="url(#vandeWindowGlass)" />
            <rect x="-24"   y="-2.5" width="6"   height="2.8" rx="0.8" fill="url(#vandeWindowGlass)" />
            {/* Saffron Speed Stripe */}
            <rect x="-44" y="2" width="27" height="1.3" fill="#FF671F" />
            {/* Roof Contour */}
            <rect x="-42" y="-7.2" width="24" height="0.8" rx="0.4" fill="#CBD5E1" />

            {/* ── Gangway 1 ── */}
            <rect x="-17" y="-5.5" width="3" height="9.5" rx="0.5" fill="#0F172A" />
            <line x1="-15.5" y1="-5.5" x2="-15.5" y2="4" stroke="#334155" strokeWidth="0.8" />

            {/* ── Coach 2: Middle Executive Coach ── */}
            <rect
              x="-14"
              y="-6.5"
              width="28"
              height="11"
              rx="1"
              fill="url(#vandeBodyGrad)"
              stroke="#94A3B8"
              strokeWidth="0.4"
            />
            {/* Navy Blue Window Band */}
            <rect x="-14" y="-3.5" width="28" height="4.8" fill="url(#vandeBlueStripe)" />
            {/* Windows */}
            <rect x="-11.5" y="-2.5" width="6.5" height="2.8" rx="0.8" fill="url(#vandeWindowGlass)" />
            <rect x="-3"    y="-2.5" width="6.5" height="2.8" rx="0.8" fill="url(#vandeWindowGlass)" />
            <rect x="5.5"   y="-2.5" width="6.5" height="2.8" rx="0.8" fill="url(#vandeWindowGlass)" />
            {/* Saffron Speed Stripe */}
            <rect x="-14" y="2" width="28" height="1.3" fill="#FF671F" />
            {/* Roof AC Unit */}
            <rect x="-8" y="-7.6" width="16" height="1.2" rx="0.6" fill="#94A3B8" />
            {/* Virasat Gold Emblem */}
            <circle cx="0" cy="0.2" r="1" fill="#D97706" />

            {/* ── Gangway 2 ── */}
            <rect x="14" y="-5.5" width="3" height="9.5" rx="0.5" fill="#0F172A" />
            <line x1="15.5" y1="-5.5" x2="15.5" y2="4" stroke="#334155" strokeWidth="0.8" />

            {/* ── Lead Locomotive / Aerodynamic Bullet Nose Engine ── */}
            <path
              d="M 17,-6.5 L 33,-6.5 C 38.5,-6.5 43,-3.5 45.5,0.2 C 46.2,1.2 46,2.6 43,4 C 38.5,5.2 33,4.8 17,4.8 Z"
              fill="url(#vandeBodyGrad)"
              stroke="#94A3B8"
              strokeWidth="0.4"
            />
            {/* Navy Blue Aerodynamic Sweep */}
            <path
              d="M 17,-3.5 L 32,-3.5 C 36.5,-3.5 40.5,-1.2 43,1.2 C 40,2.6 35,3 17,3 Z"
              fill="url(#vandeBlueStripe)"
            />
            {/* Raked Windshield / Cockpit Glass */}
            <path
              d="M 31,-4.5 C 35,-4.5 39,-2.8 41,0 L 37,0.6 C 35.5,-1.2 33.5,-2.2 30.5,-2.2 Z"
              fill="#020617"
              stroke="#38BDF8"
              strokeWidth="0.5"
            />
            {/* Passenger Window */}
            <rect x="19" y="-2.5" width="6.5" height="2.8" rx="0.8" fill="url(#vandeWindowGlass)" />
            {/* Saffron Speed Stripe */}
            <path d="M 17,2 L 35,2 C 38.5,2 41,2.6 42,3.3 L 17,3.3 Z" fill="#FF671F" />
            {/* Twin High-Intensity LED Headlights */}
            <circle cx="43.8" cy="0.4" r="1.3" fill="#FFFFFF" />
            <circle cx="43.8" cy="0.4" r="2.2" fill="#FEF08A" opacity="0.85" />
            <circle cx="43.2" cy="2.2" r="1.3" fill="#FFFFFF" />
            <circle cx="43.2" cy="2.2" r="2.2" fill="#FEF08A" opacity="0.85" />
            {/* Nose Tip Aerodynamic Glint */}
            <circle cx="45" cy="1.2" r="0.8" fill="#FFFFFF" opacity="0.9" />
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
          {stage === "travelling" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-[#171512]/85 backdrop-blur-md border border-[#D9A404]/30 px-6 py-3 rounded-full shadow-2xl pointer-events-none"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E87722] animate-ping" />
              <div className="flex items-center gap-3 text-xs font-sans">
                {isTransitActive ? (
                  <>
                    <span className="text-[#D9A404] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                      🎵 Folk Melody Playing
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-[#E9E4D8]">
                      Approaching: <strong className="text-[#D9A404] font-serif">Patna, Bihar</strong> (Chhath Mahaparv)
                    </span>
                    <span className="text-white/30 hidden sm:inline">•</span>
                    <span className="text-[#8B7D6B] hidden sm:inline">
                      Speed: 110 km/h
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[#D9A404] font-bold uppercase tracking-wider">
                      Express En Route
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-[#E9E4D8]">
                      Approaching: <strong className="text-[#D9A404] font-serif">{dynamicStates.find((s) => !visitedSlugs.includes(s.slug))?.name ?? "Destination"}</strong>
                    </span>
                    <span className="text-white/30 hidden sm:inline">•</span>
                    <span className="text-[#8B7D6B] hidden sm:inline">
                      Speed: 110 km/h
                    </span>
                  </>
                )}
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
        title={isTransitActive ? "En Route to Bihar" : activeState ? (stage === "intro-speaking" ? `Entering ${activeState.name}` : activeState.name) : undefined}
        speechText={speechText}
        factBadge={currentFactBadge}
        mascotImage={currentMascotImage}
        mascotName={activeState ? `Dastaan • ${activeState.name} AI Guide` : "Dastaan • AI Cultural Guide"}
      />

      {/* ── History Timeline Panel ───────────────────────────── */}
      {activeState && (
        <HistoryTimelinePanel
          isOpen={stage === "timeline"}
          stateName={activeState.name}
          tagline={activeState.tagline}
          timeline={activeState.timeline}
          mascotImage={timelineMascotImage}
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
