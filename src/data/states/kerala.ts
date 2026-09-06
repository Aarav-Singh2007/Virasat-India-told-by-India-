import type { StateData } from "./index";

export const keralaData: StateData = {
  slug: "kerala",
  name: "Kerala",
  tagline: "God's Own Country",
  trainProgressRange: [0.85, 1.0],
  mapColor: "#2E7D32",

  introScript:
    "Last stop — and what a stop it is. Kerala. " +
    "The rest of India was being built inland. Kerala was already talking to the whole world. " +
    "Arab traders, Roman merchants, Chinese sailors — they all found their way to this coastline, " +
    "drawn by a spice so small it fits in your palm: pepper. " +
    "And out of all those arrivals, something extraordinary happened — people of different faiths built their lives side by side.",

  outroScript:
    "A thousand years of trade, faith, and craft — and it's all still here. " +
    "Before anyone alive can remember it starting, let me show you someone who is still weaving it.",

  timeline: [
    {
      id: "ker-1",
      title: "Ancient Maritime Era",
      period: "Before 1st Century CE",
      image: "/Kerela/DhowShpis.jpg",
      script:
        "Kerala's coastline was a magnet for the ancient world — Roman merchants, Arab traders, Chinese sailors all came for pepper. " +
        "This is where India first met the globe.",
      factBadge: "🌶️ Did you know: Kerala supplied over 90% of Europe's pepper in the 1st century CE",
    },
    {
      id: "ker-2",
      title: "The Chera Dynasty",
      period: "1st – 12th Century CE",
      image: "/Kerela/KerelaTemple.jpg",
      script:
        "The Chera kings shaped the land's language, its temple music, and its distinct architecture — " +
        "a story entirely separate from the north Indian fort narrative.",
      factBadge: "🛕 Fact unlocked: Malayalam — Kerala's language — is over 1,000 years old",
    },
    {
      id: "ker-3",
      title: "Zamorin & the Port Cities",
      period: "14th – 16th Century",
      image: "/Kerela/CalicutHarbourEye.jpg",
      script:
        "Calicut ruled the seas. Weaving became an economic craft, not just a tradition — " +
        "Kasavu cloth was traded on global markets before it was ever called heritage.",
    },
    {
      id: "ker-4",
      title: "The Colonial Era",
      period: "16th – 20th Century",
      image: "/Kerela/KochiWaterfront.jpg",
      script:
        "Portuguese, Dutch, British — all arrived at Kerala's ports. " +
        "The result: India's most diverse coastline, with some of the world's oldest churches, mosques, and synagogues on the same street.",
      factBadge: "✝️🕌🕍 Fact unlocked: Kochi's Paradesi Synagogue, built in 1568, is one of the oldest in Asia",
    },
    {
      id: "ker-5",
      title: "Integration & Land Reforms",
      period: "1947 – 1960s",
      image: "/Kerela/landReformEraBlackAndWhite.jpg",
      script:
        "Post-1947, Kerala chose a different path: land reforms, near-universal literacy, and a public health model that other states studied. " +
        "Development without oil wells, built on education.",
      factBadge: "📖 Fact unlocked: Kerala has India's highest literacy rate — over 96%",
    },
    {
      id: "ker-6",
      title: "Present Day",
      period: "Today",
      image: "/Kerela/Kathakali.jpg",
      script:
        "Kathakali, Onam, Kasavu weaving — traditions that survived spice trade, colonialism, and modernity. " +
        "Still practiced. Still alive. Still Kerala.",
    },
  ],

  artisan: {
    name: "Lekha Warrier",
    craft: "Kasavu Weaving",
    state: "Kerala",
    quote: "Before anyone alive can remember it starting — we were already weaving this.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // placeholder
    buyUrl: "https://www.tribesindia.com",
    donateUrl: "https://www.pmvishwakarma.gov.in",
  },

  mascotPoses: [
    { image: "/masscots/Kerela_boat.png", label: "boat"     },
    { image: "/masscots/Kerela_map.png",  label: "pointing" },
  ],
};
