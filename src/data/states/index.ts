// ─────────────────────────────────────────────────────────────────────────────
// Virasat — State Data Types & Barrel Export
// ─────────────────────────────────────────────────────────────────────────────

export interface TimelineEra {
  id: string;
  title: string;
  period: string;
  image: string;        // path relative to /public e.g. "/Rajasthan/TharDessert.jpg"
  script: string;       // 1–2 sentences Dastaan speaks
  factBadge?: string;   // optional gamified pop-up text e.g. "📍 Fact unlocked: ..."
}

export interface ArtisanData {
  name: string;
  craft: string;
  state: string;
  quote: string;
  videoUrl: string;     // YouTube embed 
  buyUrl?: string;
  donateUrl?: string;
}

export interface MascotPose {
  image: string;        // Path to image
  label: "hidden" | "greeting" | "pointing" | "storytelling" | "upward" | "boat" | "hills" | "welcome" | "scroll" | "thinking" | "excited";
}

export interface StateData {
  slug: string;
  name: string;
  tagline: string;
  introScript: string;  // full 3–4 sentence opening narrator speaks when train enters
  outroScript: string;  // line before artisan video
  timeline: TimelineEra[];
  artisan: ArtisanData;
  mascotPoses: MascotPose[];
  trainProgressRange: [number, number]; // [start, end] of t ∈ [0,1] along the route
  mapColor: string;     // highlight colour for this state
}

export { rajasthanData } from "./rajasthan";
export { keralaData }    from "./kerala";
export { biharData }     from "./bihar";
export { nagalandData }  from "./nagaland";

import { rajasthanData } from "./rajasthan";
import { keralaData }    from "./kerala";
import { biharData }     from "./bihar";
import { nagalandData }  from "./nagaland";

export const ALL_STATES: StateData[] = [
  rajasthanData,
  biharData,
  nagalandData,
  keralaData,
];

export function getStateBySlug(slug: string): StateData | undefined {
  return ALL_STATES.find((s) => s.slug === slug);
}

/** Given train progress t ∈ [0,1], return the active state (if any). */
export function getStateAtProgress(t: number): StateData | undefined {
  return ALL_STATES.find(
    (s) => t >= s.trainProgressRange[0] && t <= s.trainProgressRange[1]
  );
}
