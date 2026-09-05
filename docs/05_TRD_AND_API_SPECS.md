# 05 - Technical Requirements & API Specs

## 1. Core API Endpoints (REST Example)

### `GET /api/v1/states`
*   **Description:** Fetches all states for rendering the initial map.
*   **Response:** Array of state objects with basic metadata.

### `GET /api/v1/states/:state_id/dashboard`
*   **Description:** Fetches the deep-dive content for a specific state (e.g., Rajasthan).
*   **Response:** Includes live events, historical hooks, and initial Heritage Genome nodes.

### `GET /api/v1/genome/:node_id/chain`
*   **Description:** Fetches the connected nodes (ancestors and descendants) for a given Heritage Node to render the Genome view.
*   **Response:** Graph-like structure of linked nodes.

### `POST /api/v1/users/personalize`
*   **Description:** Submits user details (surname, state) to receive personalized cultural recommendations.

## 2. Technical Constraints
*   **Performance:** Map animations must run at 60fps. Avoid heavy 3D models on the initial load; rely on vector maps and CSS animations.
*   **Audio:** Ambient audio and Guru narratives must have clear play/pause controls and respect device volume settings.
