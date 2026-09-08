"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";

const FORTS = [
  {
    id: "chittorgarh",
    name: "Chittorgarh",
    image: "/Rajasthan/Chittorgarh_panorama.jpg",
    period: "7th Century — onwards",
    hook: "They called it unconquerable.\nThree sieges proved them wrong.\nThey built it again anyway.",
    stat: { value: "700", unit: "acres", label: "Largest fort complex in India" },
    lore: "Chittorgarh is the largest fort complex in India — a walled city on a mesa, built by Guhila rulers over centuries. It saw three Jauhars (mass self-immolations by Rajput women choosing death over conquest). The legend of Rani Padmini was born here. So was the code of Rajput honor.",
    color: "#C05C10",
  },
  {
    id: "amber",
    name: "Amber Fort",
    image: "/Rajasthan/AmberFort_SheeshMahal.jpg",
    period: "16th Century — Rajput-Mughal era",
    hook: "One candle.\nTen thousand stars.\nAll of them in the same room.",
    stat: { value: "Sheesh", unit: "Mahal", label: "Mirror inlay work — 1 flame = infinite reflections" },
    lore: "Amber Fort is where Rajput grandeur met Mughal refinement. The Sheesh Mahal (Hall of Mirrors) was built so that a single oil lamp, lit in the darkened chamber, would reflect off thousands of tiny mirror inlays embedded in the ceiling and walls — turning one flame into a constellation. It still works today.",
    color: "#8B6914",
  },
  {
    id: "mehrangarh",
    name: "Mehrangarh",
    image: "/Rajasthan/Mehrangarh_CliffView.jpg",
    period: "15th Century — Rao Jodha",
    hook: "400 feet of cliff.\nWalls 36 metres thick.\nBuilt in a desert,\nby people who refused to thirst.",
    stat: { value: "36", unit: "metres", label: "Maximum wall thickness at Mehrangarh" },
    lore: "Mehrangarh, perched atop a sheer 120-metre rock outcrop above Jodhpur, is arguably the most dramatic fort in India. Its sandstone walls, up to 36 metres thick in places, were never breached in battle. Inside, seven gates each commemorate a victory. Outside, the Blue City of Jodhpur spreads below like a painted canvas.",
    color: "#A23E33",
  },
  {
    id: "kumbhalgarh",
    name: "Kumbhalgarh",
    image: "/Rajasthan/Kumbhalgarh_Wall.jpg",
    period: "15th Century — Maharana Kumbha",
    hook: "36 kilometres of wall.\nThe second-longest continuous\nfortification on Earth.",
    stat: { value: "36", unit: "km", label: "Perimeter wall — 2nd longest in the world" },
    lore: "Kumbhalgarh's perimeter wall stretches roughly 36 kilometres through the Aravalli hills — the second-longest continuous wall in the world after the Great Wall of China. It contains 360 temples within its boundaries. Maharana Pratap, the greatest Rajput warrior, was born here in 1540.",
    color: "#4A7A3C",
  },
];

function StatCounter({ value, unit, label }: { value: string; unit: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="flex items-baseline gap-2 mb-1"
      >
        <span className="text-5xl md:text-6xl font-bold text-[#D9A404] font-serif">{value}</span>
        <span className="text-xl text-[#A89880] font-serif">{unit}</span>
      </motion.div>
      <p className="text-[#6B6355] text-xs font-sans uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default function FortsSection() {
  const [activeFort, setActiveFort] = useState(0);

  return (
    <section id="forts" className="relative w-full bg-[#0D0700]">
      {/* Section header */}
      <div className="px-6 md:px-16 pt-20 pb-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#A23E33] text-xs font-bold tracking-[0.3em] uppercase font-sans mb-3"
        >
          Chapter I
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-bold text-[#E9E4D8] font-serif mb-4"
        >
          The Bones of Rajasthan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#6B6355] text-lg max-w-xl mx-auto font-sans"
        >
          Not built for show. Built for survival — out of desert rock,
          by people who refused to be conquered.
        </motion.p>
      </div>

      {/* Fort selector tabs */}
      <div className="sticky top-16 z-30 bg-[#0D0700]/95 backdrop-blur-md border-b border-[#1E1208]">
        <div className="flex overflow-x-auto gap-1 px-6 md:px-16 py-3 scrollbar-none">
          {FORTS.map((fort, i) => (
            <button
              key={fort.id}
              onClick={() => setActiveFort(i)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold font-sans transition-all duration-300 ${
                activeFort === i
                  ? "bg-[#A23E33] text-white shadow-lg shadow-[#A23E33]/30"
                  : "text-[#6B6355] hover:text-[#A89880] hover:bg-[#1E1208]"
              }`}
            >
              {fort.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active fort display */}
      <AnimatePresence mode="wait">
        {FORTS.map((fort, i) =>
          i === activeFort ? (
            <motion.div
              key={fort.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen"
            >
              {/* Full-bleed image with morph */}
              <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
                <motion.div
                  key={`img-${fort.id}`}
                  initial={{ scale: 1.08, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={fort.image}
                    alt={fort.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0D0700]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0D0700]/70 via-transparent to-transparent" />
                </motion.div>

                {/* Hook text on image */}
                <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-lg z-10">
                  <motion.p
                    key={`hook-${fort.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="text-2xl md:text-3xl font-serif text-[#E9E4D8] leading-snug whitespace-pre-line"
                  >
                    {fort.hook}
                  </motion.p>
                </div>
              </div>

              {/* Info panel below image */}
              <div className="px-6 md:px-16 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Stat badge */}
                <motion.div
                  key={`stat-${fort.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  <div
                    className="inline-block border-l-4 pl-5 py-1"
                    style={{ borderColor: fort.color }}
                  >
                    <p className="text-[#6B6355] text-xs font-sans uppercase tracking-widest mb-1">
                      {fort.period}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-[#E9E4D8] font-serif">
                      {fort.name}
                    </h3>
                  </div>
                  <StatCounter {...fort.stat} />
                </motion.div>

                {/* Lore text */}
                <motion.div
                  key={`lore-${fort.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-[#A89880] text-base md:text-lg font-sans leading-relaxed">
                    {fort.lore}
                  </p>
                </motion.div>
              </div>

              {/* Fort progress indicator */}
              <div className="flex justify-center gap-2 pb-12">
                {FORTS.map((_, j) => (
                  <button
                    key={j}
                    onClick={() => setActiveFort(j)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      j === activeFort ? "w-8 bg-[#A23E33]" : "w-2 bg-[#6B6355]/40"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </section>
  );
}
