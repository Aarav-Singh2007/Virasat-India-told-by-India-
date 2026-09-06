"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isVisible: boolean;
  title?: string;
  speechText: string;
  factBadge?: string;
}

export default function RouteNarrator({ isVisible, title, speechText, factBadge }: Props) {
  const [showBadge, setShowBadge] = useState(false);

  // Show fact badge with a delay when new badge arrives
  useEffect(() => {
    if (!factBadge) {
      setShowBadge(false);
      return;
    }
    const t = setTimeout(() => setShowBadge(true), 800);
    return () => clearTimeout(t);
  }, [factBadge]);

  return (
    <>
      {/* ── Fact Badge Pill ────────────────────────────────────── */}
      <AnimatePresence>
        {isVisible && showBadge && factBadge && (
          <motion.div
            key={factBadge}
            className="fixed top-24 right-6 z-50 bg-[#D9A404] rounded-full px-4 py-1.5 shadow-md pointer-events-none"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[#171512] text-xs font-bold font-sans tracking-wide">
              {factBadge}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Narration Caption Card ─────────────────────────────── */}
      <AnimatePresence>
        {isVisible && speechText && (
          <motion.div
            key="narration-card"
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl 
                       bg-[#E9E4D8]/85 backdrop-blur-md border border-[#E9E4D8]/40 
                       px-8 py-5 shadow-2xl pointer-events-none rounded-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {title && (
              <motion.h4 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-[#171512] font-serif text-lg font-bold mb-2 tracking-tight"
              >
                {title}
              </motion.h4>
            )}
            {/* We use a simple fade-in key for the text itself to animate when it changes */}
            <motion.p
              key={speechText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className="text-[#171512] font-sans text-base md:text-lg leading-relaxed font-medium"
            >
              {speechText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
