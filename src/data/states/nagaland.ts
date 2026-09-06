import type { StateData } from "./index";

export const nagalandData: StateData = {
  slug: "nagaland",
  name: "Nagaland",
  tagline: "Sixteen Tribes, One Spirit",
  trainProgressRange: [0.44, 0.60],
  mapColor: "#4A7C59",

  introScript:
    "The train is climbing into the hills now — and everything changes. " +
    "Nagaland is like nowhere else in India. No empires here. No forts. No written history for most of its story. " +
    "Sixteen tribes, each with their own language, their own weaving patterns, and their own way of remembering who they are. " +
    "The shawl you wore here told people everything about you — before you said a single word.",

  outroScript:
    "And right now, today, the threads are still being woven. " +
    "Let me show you someone who has dedicated their life to keeping this art alive.",

  timeline: [
    {
      id: "nag-1",
      title: "The Sixteen Tribes",
      period: "Ancient — No Single Start Date",
      image: "/Nagaland/NagatribeShawl.jpg",
      script:
        "Nagaland never had one kingdom — it had sixteen. " +
        "Each tribe carried its entire history in its shawl patterns, not on stone. Your shawl was your identity.",
      factBadge: "🧵 Fact unlocked: Each of Nagaland's 16 tribes has a unique, non-interchangeable shawl pattern",
    },
    {
      id: "nag-2",
      title: "Pre-Colonial Autonomy",
      period: "Before the 19th Century",
      image: "/Nagaland/HillTopNagaVillage.jpg",
      script:
        "Self-governing hilltop communities, connected by oral tradition and trade. " +
        "No outside power had reached these hills — and the tribes intended to keep it that way.",
    },
    {
      id: "nag-3",
      title: "Colonial Contact",
      period: "19th Century",
      image: "/Nagaland/BritishSurveyMap.jpg",
      script:
        "In the 1800s, British expeditions arrived in the Naga Hills for the first time. " +
        "It was the beginning of written records — and a long, complex story the tribes never asked to be part of.",
      factBadge: "📜 Fact unlocked: The first British contact with the Nagas was in 1832",
    },
    {
      id: "nag-4",
      title: "Statehood — 1963",
      period: "1 December 1963",
      image: "/Nagaland/NagalandMap.jpg",
      script:
        "Nagaland became the 16th state of India on 1st December 1963 — " +
        "the youngest on this entire journey, and one of the most distinct.",
      factBadge: "🗓️ Fact unlocked: Nagaland Day is celebrated on December 1st every year",
    },
    {
      id: "nag-5",
      title: "Present Day",
      period: "Today",
      image: "/Nagaland/HornBilFestival.jpg",
      script:
        "The Hornbill Festival brings all sixteen tribes together every December. " +
        "The shawl patterns survive. The songs survive. The stories survive. The people are still telling them.",
    },
  ],

  artisan: {
    name: "Visakhulu Khose",
    craft: "Traditional Naga Shawl Weaving",
    state: "Nagaland",
    quote: "When I weave, I'm writing down our history in thread.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // placeholder
    buyUrl: "https://www.tribesindia.com",
    donateUrl: "https://www.pmvishwakarma.gov.in",
  },

  mascotPoses: [
    { image: "/masscots/Nagaland_welcome.png",      label: "welcome"      },
    { image: "/masscots/Nagaland_Hills.png",        label: "hills"        },
    { image: "/masscots/Nagaland_Storytelling.png", label: "storytelling" },
  ],
};
