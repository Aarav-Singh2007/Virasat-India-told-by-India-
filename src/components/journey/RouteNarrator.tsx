"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isVisible: boolean;
  title?: string;
  speechText: string;
  factBadge?: string;
  mascotImage?: string;
  mascotName?: string;
}

export default function RouteNarrator({
  isVisible,
  title,
  speechText,
  factBadge,
  mascotImage,
  mascotName = "Dastaan • AI Cultural Guide",
}: Props) {
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

      {/* ── Screen Background Mascot Visual (When the system talks) ── */}
      <AnimatePresence>
        {isVisible && speechText && mascotImage && (
          <motion.div
            key={`bg-mascot-${mascotImage}`}
            className="fixed bottom-0 right-4 sm:right-10 md:right-16 lg:right-24 z-30 pointer-events-none flex flex-col items-center select-none"
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.94 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Heritage aura / glow behind mascot */}
            <div className="absolute bottom-12 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-t from-[#D9A404]/25 via-[#C05C10]/15 to-transparent blur-3xl -z-10" />

            {/* Speaking Status Pill */}
            <motion.div
              className="mb-2 bg-[#171512]/90 backdrop-blur-md border border-[#D9A404]/40 px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Dynamic Sound Wave Bars */}
              <div className="flex items-center gap-1 h-3.5">
                <motion.span
                  className="w-1 bg-[#D9A404] rounded-full"
                  animate={{ height: ["4px", "14px", "6px", "12px", "4px"] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                />
                <motion.span
                  className="w-1 bg-[#D9A404] rounded-full"
                  animate={{ height: ["12px", "4px", "14px", "7px", "12px"] }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.15 }}
                />
                <motion.span
                  className="w-1 bg-[#D9A404] rounded-full"
                  animate={{ height: ["6px", "13px", "4px", "10px", "6px"] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut", delay: 0.3 }}
                />
              </div>
              <span className="text-[#E9E4D8] text-xs font-sans font-bold tracking-wide">
                {mascotName}
              </span>
            </motion.div>

            {/* Mascot Character Image */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
              className="relative w-48 h-64 sm:w-60 sm:h-80 md:w-72 md:h-96 lg:w-80 lg:h-[450px]"
            >
              <Image
                src={mascotImage}
                alt={mascotName}
                fill
                className="object-contain object-bottom drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]"
                priority
                sizes="(max-width: 640px) 192px, (max-width: 768px) 240px, (max-width: 1024px) 288px, 320px"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Narration Caption Card ─────────────────────────────── */}
      <AnimatePresence>
        {isVisible && speechText && (
          <motion.div
            key="narration-card"
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl 
                       bg-[#E9E4D8]/90 backdrop-blur-md border border-[#E9E4D8]/60 
                       px-7 py-5 shadow-2xl pointer-events-none rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Subtle mascot watermark inside the card background */}
            {mascotImage && (
              <div className="absolute right-0 bottom-0 top-0 w-44 sm:w-56 pointer-events-none opacity-[0.14] overflow-hidden select-none">
                <Image
                  src={mascotImage}
                  alt=""
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            )}

            {/* Header with Mascot Avatar */}
            <div className="relative z-10 flex items-center gap-3 mb-2.5">
              {mascotImage && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#D9A404] shadow-md flex-shrink-0 bg-[#171512]">
                  <Image
                    src={mascotImage}
                    alt={mascotName}
                    fill
                    className="object-cover object-top"
                  />
                  {/* Glowing active voice dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400 animate-pulse" />
                </div>
              )}
              <div>
                {title && (
                  <motion.h4 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-[#171512] font-serif text-lg font-bold tracking-tight leading-snug"
                  >
                    {title}
                  </motion.h4>
                )}
                <p className="text-[#A23E33] text-xs font-sans font-bold uppercase tracking-wider">
                  {mascotName}
                </p>
              </div>
            </div>

            {/* Narration script text */}
            <motion.p
              key={speechText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className="relative z-10 text-[#171512] font-sans text-base md:text-lg leading-relaxed font-medium"
            >
              {speechText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
