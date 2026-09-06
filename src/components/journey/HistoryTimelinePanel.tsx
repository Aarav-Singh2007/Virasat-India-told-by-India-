"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { TimelineEra } from "@/data/states";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TimelineCard — single era card within the history panel
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  era?: TimelineEra;
  index: number;
  total: number;
  direction: number;
}

const cardVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.96 }),
};

export function TimelineCard({ era, index, total, direction }: CardProps) {
  // Guard: era can be undefined during AnimatePresence exit transitions
  if (!era) return null;

  return (
    <motion.div
      key={era.id}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.38, ease: [0.32, 0, 0.67, 0] }}
      className="w-full flex flex-col md:flex-row gap-6 items-center"
    >
      {/* Image */}
      <div className="relative w-full md:w-1/2 h-56 md:h-80 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
        <Image
          src={era.image}
          alt={era.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171512]/60 to-transparent" />
        {/* Period badge */}
        <span className="absolute bottom-3 left-3 bg-[#A23E33]/90 text-[#E9E4D8] text-xs font-bold px-3 py-1 rounded-full font-sans">
          {era.period}
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#A23E33]" : "w-1.5 bg-[#6B6355]"
              }`}
            />
          ))}
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-[#A23E33] font-serif mb-2 leading-tight">
          {era.title}
        </h3>
        <p className="text-[#E9E4D8] text-base md:text-lg font-sans leading-relaxed mt-2">
          {era.script}
        </p>

        {/* Fact badge */}
        {era.factBadge && (
          <motion.div
            className="mt-4 inline-block bg-[#D9A404]/20 border border-[#D9A404]/40 rounded-xl px-4 py-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-[#D9A404] text-xs font-bold font-sans">{era.factBadge}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HistoryTimelinePanel — full-screen overlay for a state's history
// ─────────────────────────────────────────────────────────────────────────────

interface PanelProps {
  isOpen: boolean;
  stateName: string;
  tagline: string;
  timeline: TimelineEra[];
  onClose: () => void;
  onComplete: () => void;          // called when user reaches last card and clicks "Next"
  onCardChange?: (era: TimelineEra) => void; // called when card changes — for narrator
}

export default function HistoryTimelinePanel({
  isOpen,
  stateName,
  tagline,
  timeline,
  onClose,
  onComplete,
  onCardChange,
}: PanelProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  // Reset when panel opens for a new state
  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setDirection(1);
    }
  }, [isOpen, stateName]);

  // Fire onCardChange whenever card changes
  React.useEffect(() => {
    if (isOpen && timeline[currentIndex]) {
      onCardChange?.(timeline[currentIndex]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isOpen]);

  const goNext = () => {
    if (currentIndex < timeline.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  };

  const isLast = currentIndex === timeline.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#171512]/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-4xl mx-4 md:mx-8 bg-[#1E1A16] rounded-3xl 
                       border border-[#6B6355]/40 shadow-2xl overflow-hidden"
            initial={{ y: 60, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 60, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#6B6355]/30">
              <div>
                <p className="text-[#6B6355] text-xs font-sans tracking-widest uppercase">
                  History of
                </p>
                <h2 className="text-2xl font-bold text-[#E9E4D8] font-serif">
                  {stateName}
                  <span className="text-[#A23E33] ml-2 text-lg">— {tagline}</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#6B6355] hover:text-[#E9E4D8] transition-colors p-2 rounded-full hover:bg-[#6B6355]/20"
                aria-label="Close timeline"
              >
                ✕
              </button>
            </div>

            {/* Card area */}
            <div className="px-6 py-6 min-h-[360px] flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                {timeline[currentIndex] && (
                  <TimelineCard
                    key={timeline[currentIndex].id}
                    era={timeline[currentIndex]}
                    index={currentIndex}
                    total={timeline.length}
                    direction={direction}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-6 pb-6">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#6B6355] 
                           hover:text-[#E9E4D8] hover:bg-[#6B6355]/20 disabled:opacity-30 
                           disabled:cursor-not-allowed transition-all font-sans text-sm"
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <span className="text-[#6B6355] text-xs font-sans">
                {currentIndex + 1} / {timeline.length}
              </span>

              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold font-sans text-sm
                           bg-[#A23E33] hover:bg-[#8a3329] text-white transition-all 
                           hover:scale-105 active:scale-95 shadow-md"
              >
                {isLast ? "Meet the Artisan →" : "Next"}
                {!isLast && <ChevronRight size={18} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
