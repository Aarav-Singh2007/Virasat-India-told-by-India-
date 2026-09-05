# 02 - System Architecture

## 1. High-Level Overview
Virasat follows a client-server architecture, designed to serve rich media, interactive maps, and interconnected graph data (The Heritage Genome).

## 2. Components
*   **Client Application (Frontend):** Handles the interactive map (e.g., using React Simple Maps or Mapbox), cinematic animations, and the Heritage Genome UI.
*   **API Gateway / Backend Service:** Serves data to the frontend, handles user authentication, and processes personalization logic.
*   **Relational Database:** Stores structured data like user profiles, states, artifacts, and marketplace listings.
*   **Graph Database (Optional/Future):** Ideal for modeling the Heritage Genome connections natively, though a relational DB can handle the initial MVP.
*   **Media Storage:** Object storage (AWS S3, Cloudinary) for hosting high-quality images, audio narratives (Live Guru Connect), and videos.

## 3. System Flow
1.  Frontend requests state data based on user interaction on the map.
2.  Backend queries the Database for state details and current live events.
3.  Backend retrieves media URLs from Media Storage.
4.  Frontend renders the state dashboard, playing associated audio/video.
