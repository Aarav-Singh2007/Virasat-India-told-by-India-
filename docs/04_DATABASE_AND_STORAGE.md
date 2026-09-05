# 04 - Database and Storage Schema

## 1. Relational Entities (Core)

**Users Table**
*   `id` (UUID, Primary Key)
*   `name` (String)
*   `surname` (String, used for personalization)
*   `home_state_id` (Foreign Key)

**States/Regions Table**
*   `id` (String, e.g., 'RJ', 'KL')
*   `name` (String)
*   `description` (Text)
*   `ambient_audio_url` (String)

**Heritage Nodes Table (For the Genome)**
*   `id` (UUID)
*   `state_id` (Foreign Key)
*   `type` (Enum: 'Architecture', 'Motif', 'Textile', 'Artisan', 'Festival')
*   `title` (String)
*   `description` (Text)
*   `media_url` (String - Image/Video)

**Heritage Links Table (Graph edges)**
*   `source_node_id` (Foreign Key)
*   `target_node_id` (Foreign Key)
*   `relationship_type` (String, e.g., 'influenced', 'crafted_by')

**Live Guru Profiles Table**
*   `id` (UUID)
*   `node_id` (Foreign Key)
*   `name` (String)
*   `profession` (String)
*   `audio_narrative_url` (String)
*   `video_url` (String, optional)

## 2. Media Storage Strategy
*   All assets must be compressed for fast loading.
*   Audio files for Live Guru Connect should be highly optimized (e.g., AAC or Opus format).
