import type { StateData } from "./index";

export const rajasthanData: StateData = {
  slug: "rajasthan",
  name: "Rajasthan",
  tagline: "The Land of Kings",
  trainProgressRange: [0.0, 0.14],
  mapColor: "#C05C10",

  introScript:
    "Hold on tight — we're rolling into Rajasthan, the Land of Kings! " +
    "See those forts on the horizon? They weren't built for show. " +
    "They were built for survival — out of desert rock, by people who refused to be conquered. " +
    "Let me tell you how this place became what it is today.",

  outroScript:
    "And you know what? The most incredible part — all of this is still alive. " +
    "Let me show you someone who is keeping it alive, right now, with their own two hands.",

  timeline: [
    {
      id: "raj-1",
      title: "Desert Kingdoms",
      period: "6th – 12th Century",
      image: "/Rajasthan/TharDessert.jpg",
      script:
        "Rajput clans carved their kingdoms out of desert and rock. " +
        "Forts weren't vanity — they were survival. No fort, no kingdom.",
      factBadge: "🏰 Fact unlocked: Rajasthan has more forts than any other Indian state",
    },
    {
      id: "raj-2",
      title: "The Fort-Building Age",
      period: "12th – 16th Century",
      image: "/Rajasthan/Jhoroka.jpg",
      script:
        "Chittorgarh, Amber, Jodhpur rise as seats of power. " +
        "The jharokha arch is born here — defence and decoration in the same breath.",
      factBadge: "🏛️ Craft spotted: The Jharokha window arch originates in this era",
    },
    {
      id: "raj-3",
      title: "Rajput–Mughal Era",
      period: "16th – 18th Century",
      image: "/Rajasthan/RajputsAndMugals.jpg",
      script:
        "Courts began exchanging artists and ideas. " +
        "Mughal brushstrokes blended with Rajput boldness into miniature paintings like nothing the world had seen.",
      factBadge: "🎨 Did you know: Rajput-Mughal miniatures show both Indian and Persian influences",
    },
    {
      id: "raj-4",
      title: "The Princely States Era",
      period: "18th – 20th Century",
      image: "/Rajasthan/SepiaphotoofJaipurroyalcourt.jpg",
      script:
        "Under the British Raj, Rajasthan became a patchwork of 19 princely states. " +
        "Forts shifted from battlefield to ballroom.",
    },
    {
      id: "raj-5",
      title: "Integration into India",
      period: "1947 – 1949",
      image: "/Rajasthan/MapOf19States.jpg",
      script:
        "In just two years after Independence, 19 kingdoms unified into one state. " +
        "It was the largest political integration in modern Indian history.",
      factBadge: "🗺️ Fact unlocked: Rajasthan was formed through 7 stages of merger between 1948 and 1949",
    },
    {
      id: "raj-6",
      title: "Present Day",
      period: "Today",
      image: "/Rajasthan/HandBlockPrint.jpg",
      script:
        "The turbans, the block prints, the folk dances — all still here, still made by hand, still told by the people. " +
        "This is living heritage.",
    },
  ],

  artisan: {
    name: "Ramesh Chippa",
    craft: "Block-Print Textiles",
    state: "Rajasthan",
    quote: "Every block I press has a story my grandfather pressed before me.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // placeholder — replace with real artisan video
    buyUrl: "https://www.tribesindia.com",
    donateUrl: "https://www.pmvishwakarma.gov.in",
  },

  mascotPoses: [
    { image: "/masscots/Rajasthan_Greeting.png",     label: "greeting"     },
    { image: "/masscots/Rajasthan_pointing.png",     label: "pointing"     },
    { image: "/masscots/Rajasthan_StoryTelling.png", label: "storytelling" },
  ],
};
