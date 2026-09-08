// Rajasthan Festival Calendar — fixed annual dates (day/month)
// Lunar festivals are approximated for 2026; update per year if needed.

export interface FestivalEntry {
  id: string;
  name: string;
  description: string;
  image: string;
  month: number;   // 1-indexed
  day: number;     // approximate day of month
  duration: string; // e.g. "3 days"
  location: string;
  highlight: string; // one punchy line
}

export const RAJASTHAN_FESTIVALS: FestivalEntry[] = [
  {
    id: "teej",
    name: "Teej",
    description:
      "Celebrated by women for a good monsoon and marital bliss, Teej fills Jaipur with swings hung from trees, women in green sarees, and streets that smell of rain.",
    image: "/Rajasthan/Teej_Festival.jpg",
    month: 8,
    day: 5,
    duration: "3 days",
    location: "Jaipur & across Rajasthan",
    highlight: "The city turns green. Swings appear on every banyan tree.",
  },
  {
    id: "gangaur",
    name: "Gangaur",
    description:
      "A festival of devotion to Goddess Gauri — 18 days of rituals, ending in a grand procession where clay idols are carried through old city lanes.",
    image: "/Rajasthan/GangaurProcession.jpg",
    month: 3,
    day: 25,
    duration: "18 days",
    location: "Udaipur, Jaipur, Jodhpur",
    highlight: "18 days. Clay idols dressed in silver. A city that refuses to stop.",
  },
  {
    id: "pushkar",
    name: "Pushkar Camel Fair",
    description:
      "One of the world's largest camel fairs — 50,000 camels, decorated cattle, folk musicians, and a lake considered sacred by Hindus. Five days of organized chaos.",
    image: "/Rajasthan/PushkarCamelFair.jpg",
    month: 11,
    day: 5,
    duration: "5 days",
    location: "Pushkar, near Ajmer",
    highlight: "50,000 camels. One sacred lake. Absolute chaos. Absolutely worth it.",
  },
  {
    id: "riff",
    name: "Rajasthan International Folk Festival",
    description:
      "RIFF — held at Mehrangarh Fort every October. Manganiyar musicians, Sufi qawwalis, and global artists perform under desert stars on the fort's ancient ramparts.",
    image: "/Rajasthan/RajasthanFolkFestival.jpg",
    month: 10,
    day: 17,
    duration: "5 days",
    location: "Mehrangarh Fort, Jodhpur",
    highlight: "Sufi qawwali under desert stars. On a 400-foot cliff.",
  },
];

/** Returns festivals happening within the current month */
export function getFestivalsThisMonth(): FestivalEntry[] {
  const now = new Date();
  return RAJASTHAN_FESTIVALS.filter((f) => f.month === now.getMonth() + 1);
}

/** Returns the next upcoming festival from today */
export function getNextFestival(): { festival: FestivalEntry; daysAway: number } | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcoming = RAJASTHAN_FESTIVALS.map((f) => {
    const festDate = new Date(today.getFullYear(), f.month - 1, f.day);
    if (festDate < today) festDate.setFullYear(today.getFullYear() + 1);
    const daysAway = Math.ceil((festDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return { festival: f, daysAway };
  }).sort((a, b) => a.daysAway - b.daysAway);

  return upcoming[0] ?? null;
}
