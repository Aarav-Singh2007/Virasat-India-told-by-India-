"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHAPTERS = [
  { id: "hero",      label: "Welcome" },
  { id: "forts",     label: "Forts" },
  { id: "valor",     label: "Valor" },
  { id: "attire",    label: "Attire" },
  { id: "food",      label: "Food" },
  { id: "music",     label: "Music" },
  { id: "festivals", label: "Festivals" },
];

export default function ChapterNav() {
  const [active, setActive] = useState("hero");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 items-end"
      aria-label="Chapter navigation"
    >
      {CHAPTERS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-2 group"
            aria-label={label}
          >
            <AnimatePresence>
              {hovered === id && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-xs font-semibold text-[#E9E4D8] bg-[#2A241F]/80 backdrop-blur-sm
                             px-2.5 py-1 rounded-full font-sans pointer-events-none"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              animate={{
                width: isActive ? 28 : 8,
                backgroundColor: isActive ? "#A23E33" : "#6B6355",
                opacity: isActive ? 1 : 0.6,
              }}
              transition={{ duration: 0.3 }}
              className="block h-2 rounded-full cursor-pointer"
            />
          </button>
        );
      })}
    </nav>
  );
}
