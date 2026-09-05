# 07 - Frontend Implementation Details

## 1. Map Interface
*   **Library:** Considering `react-simple-maps` for SVG-based, highly customizable maps that are easy to animate over.
*   **Cinematic Modes:** 
    *   **Train:** A train icon animates along SVG paths between major nodes in the plains.
    *   **Boat:** A boat icon animates along the coastline for coastal states like Kerala.
    *   **Helicopter:** Animates over hilly terrain (Northeast).

## 2. State Dashboard UI
*   **Layout:** Split screen or modal overlay when a state is clicked.
*   **Components:**
    *   **Live Layer Card:** Highlights current festivals or events.
    *   **Genome Visualizer:** A horizontal scrolling or node-graph component showing the cultural influence chain.
    *   **Guru Connect Player:** A custom audio/video player with subtitles and artisan details.

## 3. Animation Strategy
*   Use Framer Motion for page transitions and component mounting to give the app a premium, "living" feel.
*   Ensure map zoom and pan are fluid.
