"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Compass, ArrowRight, Train } from "lucide-react";

interface JourneyIntroProps {
  onComplete: () => void;
}

const STATES = [
  {
    name: "Rajasthan",
    tag: "Land of Kings",
    ticket: "/tickets/Rajasthan_ticket.png",
    color: "#C05C10",
  },
  {
    name: "Bihar",
    tag: "Cradle of Empires",
    ticket: "/tickets/Bihar_ticket.png",
    color: "#994D1C",
  },
  {
    name: "Nagaland",
    tag: "Falcon Hills",
    ticket: "/tickets/Nagaland_ticket.png",
    color: "#1E5128",
  },
  {
    name: "Kerala",
    tag: "God's Own Country",
    ticket: "/tickets/Kerela_ticket.png",
    color: "#1B4965",
  },
];

export default function JourneyIntro({ onComplete }: JourneyIntroProps) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = localStorage.getItem("virasat_intro_seen");
    if (hasSeenIntro) {
      onComplete();
    } else {
      setShow(true);
    }
  }, [onComplete]);

  const handleSelect = (choice: string | null) => {
    localStorage.setItem("virasat_intro_seen", "true");
    if (choice) {
      localStorage.setItem("virasat_roots", choice);
    } else {
      localStorage.removeItem("virasat_roots");
    }
    onComplete();
  };

  if (!mounted || !show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8 bg-[#0C0A08] overflow-hidden font-sans select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C05C10]/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D9A404]/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 relative z-10 my-auto">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-[#1B1713] border border-[#D9A404]/30 px-5 py-2 rounded-full shadow-lg"
        >
          <Compass size={15} className="text-[#D9A404] animate-spin-slow" />
          <span className="text-[#D9A404] text-xs font-bold uppercase tracking-[0.2em] font-sans">
            Grand Heritage Express · Boarding Pass
          </span>
        </motion.div>

        {/* Title */}
        <div className="space-y-3">
          <h1
            className="text-4xl md:text-6xl font-serif text-[#F2EDE4] leading-tight font-bold tracking-tight"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Where are your roots from?
          </h1>
          <p className="text-[#A89880] text-sm md:text-base font-sans max-w-xl mx-auto">
            Select your home state to tailor the cultural train journey, or board right away to experience the entire national trail.
          </p>
        </div>

        {/* State Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {STATES.map((s) => {
            const isHovered = hoveredState === s.name;
            return (
              <motion.button
                key={s.name}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onMouseEnter={() => setHoveredState(s.name)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleSelect(s.name)}
                className="group relative flex flex-col items-center justify-between p-4 md:p-5 rounded-2xl bg-[#181410] border border-[#3D3428] hover:border-[#D9A404] shadow-xl hover:shadow-[0_0_24px_rgba(217,164,4,0.25)] transition-all overflow-hidden text-left"
              >
                <div className="relative w-full h-28 md:h-32 rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/10">
                  <Image
                    src={s.ticket}
                    alt={s.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181410] via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-wider font-bold text-[#D9A404] bg-black/75 px-2 py-0.5 rounded">
                    Passport Stamp
                  </span>
                </div>

                <div className="w-full">
                  <h3 className="text-lg md:text-xl font-bold text-[#F2EDE4] font-serif group-hover:text-[#D9A404] transition-colors flex items-center justify-between">
                    {s.name}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#D9A404]" />
                  </h3>
                  <p className="text-[#8B7D6B] text-xs font-sans mt-0.5 font-medium">
                    {s.tag}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => handleSelect(null)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#A23E33] hover:bg-[#8a3329] text-white text-base font-bold rounded-full shadow-xl shadow-[#A23E33]/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Train size={18} />
            Board Express & Explore All
          </button>

          <button
            onClick={() => handleSelect(null)}
            className="text-[#8B7D6B] hover:text-[#E9E4D8] text-sm tracking-wide transition-colors py-2 px-4"
          >
            Skip personalization
          </button>
        </div>
      </div>
    </motion.div>
  );
}
