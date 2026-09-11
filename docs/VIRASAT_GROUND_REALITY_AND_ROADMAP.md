# Virasat — "India, told by India"
## Comprehensive Technical Audit, Ground Reality & Product Architecture

---

## 1. Executive Summary & Product Vision

### The Core Idea
**Virasat** is envisioned as a **living cultural discovery engine** for India, intentionally designed as an antidote to standard "monument-scanner" tourism applications. Instead of static Wikipedia-style listings or 3D scans of empty stones, Virasat aims to connect:
$$\text{Architecture / History} \longrightarrow \text{Motifs \& Symbols} \longrightarrow \text{Living Crafts \& Traditions} \longrightarrow \text{Real Human Artisans}$$

### The Ground Truth Today
The current codebase is a **high-fidelity Next.js 16 (Turbopack) client-side prototype**. It demonstrates great aesthetic design, typography, map projections, 3D Canvas integration, and interactive user flows for **4 states** (with deep interactive content specifically built out for **Rajasthan**).

However, **there is currently zero backend infrastructure, zero database connectivity, and zero live external APIs**. Several features described in early design documents (Supabase, Razorpay e-commerce, face-tracking AR, and dynamic graph databases) are either mocked in client state, hardcoded in local files, or unintegrated.

---

## 2. Architectural Comparison: Planned vs. Actual

| Architectural Pillar | Planned Design (PRD / Docs) | Ground Reality (Codebase Today) | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js App Router, Tailwind CSS, Framer Motion | Next.js 16.3.4 (Turbopack), React 19, Tailwind CSS v4, Framer Motion 13 | 🟢 **100% Implemented & Building Cleanly** |
| **3D Rendering** | Three.js / React Three Fiber for map & relics | `@react-three/fiber` 9.7, `@react-three/drei` 10.7, Three.js 0.185 | 🟢 **Implemented & Functional** |
| **Map Engine** | `react-simple-maps` (2D) & Three.js (3D) | Both 2D SVG route and 3D TopoJSON extruded map exist | 🟢 **Implemented** (Click navigation pending) |
| **Database** | Supabase PostgreSQL (users, states, genome edges, listings) | **None.** `@supabase/supabase-js` is in `package.json` but imported **0 times**. No `.env` file or schema exists. | 🔴 **0% Implemented (Pure Client Data)** |
| **Backend APIs** | REST API (`/api/v1/states`, `/api/v1/genome`, `/api/v1/users/personalize`) | Only **1 API route** exists: `/api/narrator/route.ts` (Google TTS proxy). No state or genome endpoints. | 🔴 **Not Built** |
| **Live Guru Audio/Video** | Authentic recordings from real artisans & locals | Reverse-engineered Google Translate TTS scraper for voice narration; artisan videos are currently placeholders. | 🟡 **Audio Functional via TTS / Videos Need Replacement** |
| **Heritage Genome** | Graph-driven interconnected web of cultural lineage | Hardcoded 4-node linear chain in `@xyflow/react` on an orphan route (`/genome-chain`). | 🟡 **Visual Proof of Concept Only** |
| **Personalization Engine** | Backend matching user surname & home roots | Client-side `localStorage` array shift prepending 1 greeting sentence. | 🟡 **Simple Client Mock** |
| **E-Commerce & Market** | Razorpay integration supporting artisan cooperatives | Placeholder modal in `ArtisanProductPage.tsx` with static "Add to Cart" toggling a boolean. | 🔴 **Mock UI Only** |
| **AR Try-On** | `face-api.js` browser AR pagdi try-on | `face-api.js` installed in `package.json`, but imported **0 times**. Static UI banner only. | 🔴 **Mock UI Only** |

---

## 3. Detailed Route & Feature Audit

### Route 1: Home Page (`/`)
* **Source:** `src/app/page.tsx`
* **Components:** `src/components/IndiaMap3D.tsx`, `src/components/shared/Navbar.tsx`
* **How It Works:**
  - Loads TopoJSON geography from `/india.topo.json` and parses it with `d3-geo`.
  - Extrudes state polygons into 3D meshes in a React Three Fiber `Canvas`.
  - Animates a 3D Vande Bharat train along a 3D Catmull-Rom spline connecting Jaipur, Patna, Kohima, and Trivandrum.
  - States highlight on pointer hover and display names in an informational HUD card.
* **Gaps / Ground Reality:**
  - Clicking on a state or station currently **does nothing** (no router navigation attached to state meshes).
  - Feature cards below the map have static copy with no interactive links.

---

### Route 2: The Grand Heritage Journey (`/journey`)
* **Source:** `src/app/journey/page.tsx`
* **Components:**
  - `src/components/journey/JourneyIntro.tsx` (Boarding pass & state selection)
  - `src/components/journey/RouteNarrator.tsx` (Subtitles & badge notifications)
  - `src/components/journey/HistoryTimelinePanel.tsx` (Chronicles timeline modal)
  - `src/components/journey/TempleViewer3D.tsx` (Interactive 3D model viewer)
  - `src/components/journey/ArtisanVideoPlayer.tsx` (Video modal)
  - `src/components/journey/ArtisanProductPage.tsx` (Artisan item purchase modal)
  - `src/components/shared/JourneyPassport.tsx` (Bottom drawer passport with stamps)
* **How It Works:**
  1. **Onboarding:** Prompts user to pick their home state roots (saved in `localStorage` as `virasat_roots`).
  2. **Train Motion:** Train SVG smoothly advances along an SVG track using `requestAnimationFrame` and Catmull-Rom cubic bezier projection.
  3. **Auto-Stop Stations:** The train automatically pauses when reaching state boundaries (Rajasthan → Bihar → Nagaland → Kerala).
  4. **Voice Narration:** Calls `/api/narrator?text=...` to stream voice audio, automatically falling back to the browser's native `speechSynthesis` if blocked.
  5. **Timeline Card Carousel:** Displays historical eras, morphing image galleries, period badges, and gamified facts.
  6. **Passport Rewards:** Completing each state awards a visual stamp saved in `localStorage` (`virasat_passport`).
* **Gaps / Ground Reality:**
  - **Artisan Videos:** All 4 states currently point to `https://www.youtube.com/embed/dQw4w9WgXcQ` (Rickroll placeholder).
  - **Artisan Product 3D Model:** `<model-viewer src="/models/rajasthan-item.glb">` attempts to load a model that does not exist in `/public/models/`, causing a browser console 404.
  - **Temple 3D Scan:** The model loaded is `/models/bagan_temple_aerial_scan.glb` (an aerial photogrammetry scan of Bagan, Myanmar), labeled as "Sun Temple & Fort Citadel".

---

### Route 3: Rajasthan Deep Dive (`/journey/rajasthan`)
* **Source:** `src/app/journey/rajasthan/page.tsx`
* **Components:**
  - `HeroSection.tsx`: Parallax hero banner with Devanagari typography.
  - `FortsSection.tsx`: Tabbed view of Chittorgarh, Amber, Mehrangarh, and Kumbhalgarh with animated stat counters.
  - `ValorSection.tsx`: Story cards for Maharana Pratap, Chetak, and "Padharo Mhare Desh".
  - `AttireSection.tsx`: Pagdis, Kundan-Meenakari, and Lac jewelry.
  - `FoodSection.tsx`: Interactive trivia game where users guess heat levels of Rajasthani dishes before the reveal.
  - `MusicSection.tsx`: Living performance showcases for Kalbelia, Ghoomar, and Phad painting.
  - `FestivalsSection.tsx`: Live upcoming festival ticker and countdown cards.
  - `ChapterNav.tsx`: Sticky dot navigation synchronized via `IntersectionObserver`.
* **Gaps / Ground Reality:**
  - **Missing Audio Clips:** `MusicSection.tsx` references `/Rajasthan/audio/kamaicha_clip.mp3`, `morchang_clip.mp3`, and `khartal_clip.mp3`. The directory `/public/Rajasthan/audio` does not exist. The code catches the 404 error and fakes the playback so the user can still take the quiz.
  - **AR Pagdi Try-on:** The AR card in `AttireSection.tsx` is static text ("Coming in the Virasat App").

---

### Route 4: Heritage Genome Chain (`/genome-chain`)
* **Source:** `src/app/genome-chain/page.tsx`
* **Components:** `src/components/genome-chain/Nodes.tsx`, `ThreadEdge.tsx`
* **How It Works:**
  - Interactive node-graph built using `@xyflow/react` (React Flow).
  - Features custom node designs (`MotifNode`, `ArtNode`, `CraftNode`, `ArtisanNode`) linked by custom drooping thread curves (`ThreadEdge`).
  - Step-by-step reveal button ("Reveal the connection") uncovering the chain from Jharokha Carving $\to$ Rajput Miniature $\to$ Block-Printed Fabric $\to$ Living Artisan.
* **Gaps / Ground Reality:**
  - **Orphan Page:** There are **zero navigation links** to `/genome-chain` in the Navbar, Home, Journey, or Deep Dive pages.
  - **Single Hardcoded Chain:** Only 1 linear chain exists with 4 hardcoded nodes. No graph database or multi-node branching exists.

---

### Route 5: Audio Narrator API (`/api/narrator`)
* **Source:** `src/app/api/narrator/route.ts`
* **How It Works:**
  - Accepts a `GET ?text=...` parameter.
  - Sanitizes the string, trims it to 300 characters, and queries:
    `https://translate.google.com/translate_tts?ie=UTF-8&q={text}&tl=en-IN&client=tw-ob`
  - Proxies the returned MPEG audio buffer to the client with cache headers.
* **Gaps / Ground Reality:**
  - Texts longer than 300 characters get truncated.
  - It relies on an unofficial, reverse-engineered Google Translate endpoint that could be rate-limited or blocked under heavy traffic.

---

## 4. State-by-State Data Reality

Out of India's **28 states and 8 union territories**, here is what actually has data in `src/data/states/`:

| State | Status in App | Content Available | Missing Pieces |
| :--- | :--- | :--- | :--- |
| **Rajasthan** | 🟢 **Primary Focus** | 6 timeline eras, dedicated 7-chapter deep dive page, food quiz, 4 festivals | Real artisan videos, real audio clips, fix 3D model path |
| **Bihar** | 🟡 **Timeline Only** | 6 timeline eras (Magadha, Maurya, Gupta, Nalanda, Champaran, Madhubani) | No deep dive page, video placeholder |
| **Nagaland** | 🟡 **Timeline Only** | 5 timeline eras (Tribes, Autonomy, British contact, Statehood, Hornbill) | No deep dive page, video placeholder |
| **Kerala** | 🟡 **Timeline Only** | 6 timeline eras (Maritime, Chera, Zamorin, Colonial, Land reforms, Kathakali) | No deep dive page, video placeholder |
| **All Other 24 States** | 🔴 **None** | Extruded shapes appear on the 3D map, but have 0 stories, 0 timeline entries, and 0 artisans | Complete data generation needed |

---

## 5. Master Action Checklist & Quick Fixes

### A. Immediate Fixes (Within 1-2 Hours)
1. **Replace Artisan Videos:**
   - In `src/data/states/rajasthan.ts`, `bihar.ts`, `kerala.ts`, and `nagaland.ts`, replace the placeholder `dQw4w9WgXcQ` with real YouTube embed URLs.
2. **Fix Missing 3D Model in Product Page:**
   - In `src/components/journey/ArtisanProductPage.tsx:57`, change `src="/models/rajasthan-item.glb"` to a valid GLB file or place a craft model into `/public/models/`.
3. **Fix Instrument Audio Files:**
   - Create `public/Rajasthan/audio/` and add 3 short royalty-free MP3 audio samples:
     - `kamaicha_clip.mp3`
     - `morchang_clip.mp3`
     - `khartal_clip.mp3`
4. **Fix Dead Navbar Links:**
   - In `src/components/shared/Navbar.tsx`, wire `Demo` $\to$ `/journey`, add a link for `Genome Chain` $\to$ `/genome-chain`, and link `Rajasthan` $\to$ `/journey/rajasthan`.
5. **Connect Map Clicking:**
   - In `src/components/IndiaMap3D.tsx`, add an `onClick` or `onPointerDown` to `StateMesh` so clicking Rajasthan directly opens `/journey/rajasthan` or `/journey`.

---

### B. Medium-Term Enhancements (For Hackathon Demo Polish)
1. **Real Personalization Flow:**
   - Expand `JourneyIntro.tsx` to let users type their name and pick from a richer list of regions.
2. **Link the Genome Chain:**
   - Add a "View Cultural Influence (Genome)" button directly inside each state timeline card and in the Rajasthan deep-dive footer.
3. **Multi-State Deep Dive Pages:**
   - Create templated pages for Bihar (`/journey/bihar`), Kerala (`/journey/kerala`), and Nagaland (`/journey/nagaland`) reusing the modular components developed for Rajasthan.

---

### C. Long-Term Architecture (Production-Ready Virasat)
1. **Supabase Integration:**
   - Move state records, timeline eras, artisan profiles, and festival dates out of hardcoded TypeScript files into Supabase PostgreSQL tables.
2. **Media CDN:**
   - Host video clips and audio narratives on Cloudinary or Supabase Storage with optimized streaming bitrates (HLS / Opus).
3. **Graph Database for the Genome:**
   - Store node-to-node relationships (`influenced_by`, `material_from`, `practiced_by`) in Neo4j or PostgreSQL recursive CTEs to dynamically generate multi-branch cultural lineages.
4. **Native AR / WebXR:**
   - Implement real camera facial-mesh tracking using WebXR or MediaPipe Face Mesh to dynamically anchor 3D turban models over the user's head.

---
*Document generated as an exact representation of codebase state at commit `f92bee7`.*
