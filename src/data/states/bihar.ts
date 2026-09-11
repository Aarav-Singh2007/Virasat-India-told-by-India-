import type { StateData } from "./index";

export const biharData: StateData = {
  slug: "bihar",
  name: "Bihar",
  tagline: "The Cradle of Civilisations",
  trainProgressRange: [0.22, 0.36],
  mapColor: "#D9A404",

  introScript:
    "Welcome to Bihar — and take a moment, because this land deserves one. " +
    "What you're looking at is the birthplace of two of the world's greatest religions, " +
    "the source of the decimal system, and the site of the world's oldest university. " +
    "Every mile of this ground has a story older than most nations on earth.",

  outroScript:
    "The past is extraordinary. But so is what's still alive here today. " +
    "Let me introduce you to someone carrying Bihar's art forward.",

  timeline: [
    {
      id: "bih-1",
      title: "Ancient Magadha",
      period: "6th Century BCE",
      image: "/Bihar/PatliputraRiverSide.jpg",
      script:
        "Long before it had a name resembling Bihar, this river plain was the beating heart of early Indian civilisation. " +
        "Magadha — one of the sixteen great kingdoms — ruled from right here.",
      factBadge: "🏛️ Fact unlocked: Magadha was one of the world's first great empires",
    },
    {
      id: "bih-2",
      title: "The Mauryan Empire",
      period: "3rd Century BCE",
      image: "/Bihar/AshokaLionCapital.jpg",
      script:
        "Chandragupta Maurya and Ashoka ruled one of the ancient world's largest empires from Pataliputra. " +
        "Ashoka's lion capital? That's India's national emblem today.",
      factBadge: "🦁 Fact unlocked: Ashoka's edicts were the world's first public policy documents",
    },
    {
      id: "bih-3",
      title: "The Gupta Golden Age",
      period: "4th – 6th Century CE",
      image: "/Bihar/GuptaEraManuscript.jpg",
      script:
        "In the Gupta era, Bihar produced Aryabhatta — the mathematician who gave humanity zero and the decimal system. " +
        "The entire modern world runs on his ideas.",
      factBadge: "🔢 Did you know: Aryabhatta calculated π to 4 decimal places in 499 CE",
    },
    {
      id: "bih-4",
      title: "Nalanda University",
      period: "5th – 12th Century CE",
      image: "/Bihar/Nalanda.jpg",
      script:
        "For 700 years, Nalanda was the world's most prestigious university, drawing students from China, Korea, and Persia. " +
        "No other state on this route can claim that.",
      factBadge: "📚 Fact unlocked: Nalanda had a library of 9 million manuscripts",
    },
    {
      id: "bih-5",
      title: "Colonial Era & Champaran",
      period: "19th – 20th Century",
      image: "/Bihar/ChamparanIndigo.jpg",
      script:
        "The Champaran movement — Gandhi's very first major satyagraha — began right here in 1917, " +
        "over the rights of indigo farmers crushed under British plantation contracts.",
      factBadge: "✊ Fact unlocked: Champaran 1917 was Gandhi's first civil disobedience in India",
    },
    {
      id: "bih-6",
      title: "Present Day",
      period: "Today",
      image: "/Bihar/MadhubaniPainting.jpg",
      script:
        "Madhubani art and Chhath Puja are not museum pieces — they're practiced by millions every year, today. " +
        "This is Bihar's living signature.",
    },
  ],

  artisan: {
    name: "Sunita Devi",
    craft: "Madhubani Painting",
    state: "Bihar",
    quote: "I paint what my grandmother painted — but every line is mine.",
    videoUrl: "/videos/BiharStory.mp4",
    buyUrl: "https://www.tribesindia.com",
    donateUrl: "https://www.pmvishwakarma.gov.in",
  },

  mascotPoses: [
    { image: "/masscots/Bihar_scroll.png",   label: "scroll"  },
    { image: "/masscots/Bihar_upward.png",   label: "upward"  },
    { image: "/masscots/Bihar_thinking.png", label: "thinking" },
  ],
};
