import type { StateData } from "./index";

export const rajasthanData: StateData = {
  slug: "rajasthan",
  name: "Rajasthan",
  tagline: "The Land of Kings",
  trainProgressRange: [0.0, 0.14],
  mapColor: "#C05C10",

  introScript:
    "Hold on tight — we're rolling into Rajasthan, the Land of Kings! " +
    "See those massive battlements on the horizon? They weren't built for decoration — they were built for pure survival out of desert rock. " +
    "Let me tell you the real stories of this land — the colossal forts, unyielding honor, vibrant attire, royal flavors, and songs that never die.",

  outroScript:
    "And you know what? The most incredible part — all of this is still alive today in the streets, hearths, and workshops of Rajasthan. " +
    "Let me show you someone who keeps this eternal fire burning with their own two hands.",

  timeline: [
    // ── 1. FORTS & ARCHITECTURE ──
    {
      id: "raj-forts",
      title: "Forts of Desert Stone",
      period: "7th – 16th Century",
      subCategory: "Forts & Architecture",
      image: "/Rajasthan/Chittorgarh_panorama.jpg",
      model3d: {
        path: "/models/bagan_temple_aerial_scan.glb",
        title: "Sun Temple & Fort Citadel 3D Scan",
      },
      images: [
        "/Rajasthan/Chittorgarh_panorama.jpg",
        "/Rajasthan/AmberFort_SheeshMahal.jpg",
        "/Rajasthan/Mehrangarh_CliffView.jpg",
        "/Rajasthan/Kumbhalgarh_Wall.jpg",
      ],
      script:
        "Look at Chittorgarh spanning 700 acres, and Amber's Sheesh Mahal where a single candle flame turns into ten thousand reflected stars! " +
        "Mehrangarh perches on a sheer 400-foot cliff with 36-meter thick walls, while Kumbhalgarh boasts the second-longest continuous wall on Earth after the Great Wall of China.",
      factBadge: "🏰 Wonder: Kumbhalgarh's 36-km wall is the 2nd longest continuous wall in the world! Rotate the 3D Citadel Scan on the left.",
    },

    // ── 2. VALOR & CODES OF HONOR ──
    {
      id: "raj-valor",
      title: "Legends of Honor & Chetak",
      period: "1576 & Beyond",
      subCategory: "Valor & Codes of Honor",
      image: "/Rajasthan/MaharanaPratap_Portrait.jpg",
      images: [
        "/Rajasthan/MaharanaPratap_Portrait.jpg",
        "/Rajasthan/HaldighatiMap.jpg",
        "/Rajasthan/Chetak_Statue.jpg",
      ],
      script:
        "At the Battle of Haldighati in 1576, Maharana Pratap stood unbowed against overwhelming odds. " +
        "His legendary steed Chetak carried his wounded master across enemy lines before breathing his last. " +
        "Yet Rajput honor is equally defined by hospitality — 'Padharo Mhare Desh', where even an enemy arriving as a guest is protected as God.",
      factBadge: "⚔️ Code of Honor: 'Padharo Mhare Desh' is a sacred code — a guest is revered above all else.",
    },

    // ── 3. ATTIRE & ADORNMENT ──
    {
      id: "raj-attire",
      title: "Colors of the Turbans & Kundan",
      period: "Centuries of Living Adornment",
      subCategory: "Attire & Adornment",
      image: "/Rajasthan/Pagdi_Varieties.jpg",
      images: [
        "/Rajasthan/Pagdi_Varieties.jpg",
        "/Rajasthan/Borla_LaacBangles.jpg",
        "/Rajasthan/Pagdi_AROverlay.png",
      ],
      script:
        "Every twist and vibrant hue of a Rajasthani Pagdi tells a story — signaling region, clan, and festive season before words are even spoken! " +
        "From Jaipur's world-renowned Kundan-Meenakari jewelcraft to everyday lac bangles and the proud forehead Borla, Rajasthan wears its soul.",
      factBadge: "👑 Visual Identity: Each twist of the Pagdi reveals a person's exact district & occasion.",
    },

    // ── 4. FOOD & DESERT DELICACIES ──
    {
      id: "raj-food",
      title: "Flavors Born of the Desert",
      period: "Royal & Nomadic Heritage",
      subCategory: "Food & Sensory",
      image: "/Rajasthan/DalBaatiChurma.jpg",
      images: [
        "/Rajasthan/DalBaatiChurma.jpg",
        "/Rajasthan/GatteKiSabzi.jpg",
        "/Rajasthan/LaalMaas.jpg",
        "/Rajasthan/Ghewar.jpg",
      ],
      script:
        "Desert scarcity sparked culinary magic! Wheat baatis baked in hot embers doused in pure ghee, alongside gram-flour Gatte ki Sabzi born when fresh greens were rare. " +
        "Dare to taste the fiery red-chili Mathania heat of royal hunting-camp Laal Maas, followed by honeycomb-textured festive Ghewar.",
      factBadge: "🌶️ Desert Genius: Gatte ki Sabzi was created to survive water and vegetable scarcity.",
    },

    // ── 5. MUSIC, DANCE & LIVING FOLK ART ──
    {
      id: "raj-music",
      title: "Rhythms, Dance & Phad Scrolls",
      period: "Living Performances",
      subCategory: "Music, Dance & Craft",
      image: "/Rajasthan/PhadPainting_Scroll.jpg",
      images: [
        "/Rajasthan/PhadPainting_Scroll.jpg",
        "/Rajasthan/Ghoomar_Dance.jpg",
        "/Rajasthan/Kalbelia_Dancer.jpg",
        "/Rajasthan/Kamaicha_Instrument.jpg",
        "/Rajasthan/Morchang_Khartal.jpg",
      ],
      script:
        "Hear the soulful resonance of the Kamaicha, Morchang, and clattering Khartal played by Manganiyar masters! " +
        "Watch the swirling elegance of Ghoomar and the spine-bending serpentine grace of UNESCO-honored Kalbelia, while Bhopa bards unroll giant Phad scrolls to sing ancient epics under starlit skies.",
      factBadge: "📜 Living Art: In Phad painting, the scroll IS the stage backdrop while the bard sings.",
    },

    // ── 6. FESTIVALS & LIVING TRADITIONS ──
    {
      id: "raj-festivals",
      title: "Celebrations That Never Sleep",
      period: "Throughout the Year",
      subCategory: "Festivals & Live Traditions",
      image: "/Rajasthan/PushkarCamelFair.jpg",
      images: [
        "/Rajasthan/PushkarCamelFair.jpg",
        "/Rajasthan/Teej_Festival.jpg",
        "/Rajasthan/GangaurProcession.jpg",
        "/Rajasthan/RajasthanFolkFestival.jpg",
      ],
      script:
        "From the monsoon swings of Teej and the 18-day clay idol processions of Gangaur, to 50,000 camels under the full moon at Pushkar and Sufi notes floating off Mehrangarh ramparts during RIFF — Rajasthan's calendar never rests.",
      factBadge: "🐪 Always Alive: Pushkar brings 50,000 decorated camels to a sacred desert oasis.",
    },
  ],

  artisan: {
    name: "Ramesh Chippa",
    craft: "Hand Block-Print Textiles",
    state: "Rajasthan",
    quote: "Every carved wooden block I press carries the heartbeat and colors my grandfather carved before me.",
    videoUrl: "/videos/RajasthanStory.mp4",
    buyUrl: "https://www.tribesindia.com",
    donateUrl: "https://www.pmvishwakarma.gov.in",
  },

  mascotPoses: [
    { image: "/masscots/Rajasthan_Greeting.png", label: "greeting" },
    { image: "/masscots/Rajasthan_pointing.png", label: "pointing" },
    { image: "/masscots/Rajasthan_StoryTelling.png", label: "storytelling" },
  ],
};
