"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const DISHES = [
  {
    id: "dal-baati",
    name: "Dal Baati Churma",
    image: "/Rajasthan/DalBaatiChurma.jpg",
    description:
      "Wheat dough balls baked in desert sand embers. Cracked open, drowned in ghee, served with five-lentil dal and sweet churma crumble.",
    heatLevel: 1, // 0–4
    heatLabel: "Mild",
    heatExplain:
      "Dal Baati is not spicy at all — it's the comfort food of the desert. The heat comes from the ghee, not the spice. Trick answer for overconfident contestants.",
    origin: "Thar Desert — survival food for soldiers and travelers",
    funFact:
      "The baati was originally baked buried in sand under the embers of a campfire. The Rajput army could make it without pots or pans.",
  },
  {
    id: "gatte-ki-sabzi",
    name: "Gatte ki Sabzi",
    image: "/Rajasthan/GatteKiSabzi.jpg",
    description:
      "Gram flour (besan) cylinders steamed then simmered in spiced yogurt curry. A dish born because the desert has no fresh vegetables.",
    heatLevel: 2,
    heatLabel: "Medium",
    heatExplain:
      "Gatte ki Sabzi has a gentle heat from dried red chilies and coriander. The yogurt cools it down. Medium is correct — though Marwari households vary wildly.",
    origin: "Marwar region — desert-adapted cuisine",
    funFact:
      "Because the Thar Desert grows little green produce, Rajasthani cooking mastered gram flour, dried lentils, and preservation. Gatte keeps for days without refrigeration.",
  },
  {
    id: "laal-maas",
    name: "Laal Maas",
    image: "/Rajasthan/LaalMaas.jpg",
    description:
      "Mutton slow-cooked in a paste of Mathania red chilies — fiery, red, and deeply aromatic. Originally cooked at Rajput hunting camps.",
    heatLevel: 4,
    heatLabel: "🔥 Volcanic",
    heatExplain:
      "Laal Maas uses Mathania chilies from a town near Jodhpur. They are HOT. This is a four-chili dish — if you've ever ordered it not knowing what it is, you know.",
    origin: "Rajput hunting camps — royal forest kitchens",
    funFact:
      "Laal Maas was originally made with wild boar or deer hunted in the Aravalli forests. Mutton became the standard version as game became scarce.",
  },
  {
    id: "ghewar",
    name: "Ghewar",
    image: "/Rajasthan/Ghewar.jpg",
    description:
      "Honeycomb-textured sweet made from flour, ghee, and sugar syrup, deep-fried in a ring mold. Made specifically for Teej and Gangaur — no other time of year.",
    heatLevel: 0,
    heatLabel: "0 — It's a sweet 😄",
    heatExplain:
      "Ghewar is a dessert — completely sweet, zero heat. If you guessed spicy, you've never had it. This is the trick question in the set.",
    origin: "Jaipur — festival sweet for Teej and Gangaur",
    funFact:
      "The honeycomb texture is not decorative — it's structural. The batter is poured into hot ghee in thin streams, which cook and bond into a lattice. No mold creates the pattern.",
  },
];

const HEAT_LEVELS = ["Zero — It's sweet!", "🌶 Mild", "🌶🌶 Medium", "🌶🌶🌶 Hot", "🌶🌶🌶🌶 Volcanic"];

export default function FoodSection() {
  const [activeDish, setActiveDish] = useState(0);
  const [guessed, setGuessed] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  const dish = DISHES[activeDish];

  const handleGuess = (level: number) => {
    setGuessed(level);
    setShowReveal(true);
  };

  const nextDish = () => {
    setActiveDish((i) => (i + 1) % DISHES.length);
    setGuessed(null);
    setShowReveal(false);
  };

  return (
    <section id="food" className="relative w-full bg-[#0D0700] py-20">
      {/* Header */}
      <div className="px-6 md:px-16 text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#A23E33] text-xs font-bold tracking-[0.3em] uppercase font-sans mb-3"
        >
          Chapter IV
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-[#E9E4D8] font-serif mb-4"
        >
          Desert Flavors
        </motion.h2>
        <p className="text-[#6B6355] text-lg max-w-xl mx-auto font-sans">
          A cuisine shaped by sand, scarcity, and the genius of people with nothing to waste.
          Guess the heat before the reveal.
        </p>
      </div>

      {/* Game area */}
      <div className="max-w-5xl mx-auto px-6 md:px-16">
        {/* Dish tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-none">
          {DISHES.map((d, i) => (
            <button
              key={d.id}
              onClick={() => { setActiveDish(i); setGuessed(null); setShowReveal(false); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold font-sans transition-all ${
                activeDish === i
                  ? "bg-[#A23E33] text-white"
                  : "border border-[#3D3428] text-[#6B6355] hover:text-[#A89880]"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            {/* Dish image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0700]/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[#A89880] text-xs font-sans">{dish.origin}</p>
              </div>
            </div>

            {/* Game panel */}
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-2xl font-bold text-[#E9E4D8] font-serif mb-2">{dish.name}</h3>
                <p className="text-[#A89880] font-sans text-sm leading-relaxed">{dish.description}</p>
              </div>

              {!showReveal ? (
                <>
                  <p className="text-[#D9A404] font-bold font-sans text-sm uppercase tracking-widest">
                    How hot is it? Take a guess ↓
                  </p>
                  <div className="flex flex-col gap-2">
                    {HEAT_LEVELS.map((label, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleGuess(i)}
                        className="w-full py-3 px-5 rounded-xl border border-[#3D3428] text-left
                                   text-[#A89880] hover:border-[#A23E33]/60 hover:text-[#E9E4D8]
                                   hover:bg-[#A23E33]/10 transition-all font-sans text-sm font-semibold"
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                  >
                    {/* Result */}
                    <div className={`rounded-2xl p-5 border ${
                      guessed === dish.heatLevel
                        ? "bg-[#1A3A1A] border-[#4A7A3C]/60"
                        : "bg-[#3A1A0A] border-[#A23E33]/40"
                    }`}>
                      <p className={`font-bold font-sans text-sm mb-1 ${
                        guessed === dish.heatLevel ? "text-[#6ABF6A]" : "text-[#E87722]"
                      }`}>
                        {guessed === dish.heatLevel ? "✓ Correct!" : `✗ Actual: ${dish.heatLabel}`}
                      </p>
                      <p className="text-[#A89880] font-sans text-sm leading-relaxed">
                        {dish.heatExplain}
                      </p>
                    </div>

                    {/* Fun fact */}
                    <div className="bg-[#1A1008] border border-[#D9A404]/20 rounded-xl p-4">
                      <p className="text-[#D9A404] text-xs font-bold uppercase tracking-widest font-sans mb-1">
                        Did you know
                      </p>
                      <p className="text-[#A89880] font-sans text-sm leading-relaxed">{dish.funFact}</p>
                    </div>

                    <button
                      onClick={nextDish}
                      className="w-full py-3 rounded-xl bg-[#A23E33] hover:bg-[#8a3329] text-white
                                 font-bold font-sans transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Next dish →
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
