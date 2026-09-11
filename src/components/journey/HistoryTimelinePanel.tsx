"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { TimelineEra } from "@/data/states";
import { ChevronLeft, ChevronRight, Sparkles, Layers, Box, Eye } from "lucide-react";

// Dynamically load the 3D model viewer without SSR
const TempleViewer3D = dynamic(() => import("./TempleViewer3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[360px] md:min-h-[440px] rounded-2xl bg-[#171410] border border-[#3D3428] flex flex-col items-center justify-center gap-3">
      <div className="w-9 h-9 border-2 border-[#D9A404] border-t-transparent rounded-full animate-spin" />
      <span className="text-[#D9A404] text-xs font-sans uppercase tracking-widest font-bold">
        Loading 3D Temple Scan...
      </span>
    </div>
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// TimelineCard — Immersive, Edge-to-Edge Layout with 3D Relic Scan Support
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  era?: TimelineEra;
  index: number;
  total: number;
  direction: number;
  mascotImage?: string;
}

const cardVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 90 : -90, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -90 : 90, opacity: 0, scale: 0.98 }),
};

export function TimelineCard({ era, index, total, direction, mascotImage }: CardProps) {
  if (!era) return null;

  const imageList = era.images && era.images.length > 0 ? era.images : [era.image];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [view3D, setView3D] = useState(false);

  // Auto-cycle images only when not inspecting 3D model
  useEffect(() => {
    setActiveImgIdx(0);
    setView3D(false);
    if (imageList.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImgIdx((prev) => (prev + 1) % imageList.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [era.id, imageList.length]);

  return (
    <motion.div
      key={era.id}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch"
    >
      {/* ── Left Column: Expanded Visual Viewport (Images or 3D Relic) ── */}
      <div className="relative w-full lg:w-7/12 min-h-[340px] sm:min-h-[420px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 bg-[#120F0C] border border-[#3D3428]/60 group">
        {era.model3d && view3D ? (
          /* 3D Model Mode */
          <div className="w-full h-full min-h-[340px] sm:min-h-[420px] lg:min-h-[500px]">
            <TempleViewer3D modelPath={era.model3d.path} title={era.model3d.title} />
          </div>
        ) : (
          /* High-Resolution Morphing Image Gallery */
          <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] lg:min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${era.id}-img-${activeImgIdx}`}
                initial={{ opacity: 0, scale: 1.12, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.94, filter: "blur(3px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={imageList[activeImgIdx]}
                  alt={era.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Atmospheric gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#120F0C] via-transparent to-black/35 pointer-events-none" />

            {/* Thumbnail / Image Layer Dots */}
            {imageList.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[#171512]/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                <Layers size={13} className="text-[#D9A404] mr-0.5" />
                {imageList.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIdx(i);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeImgIdx
                        ? "w-6 bg-[#D9A404]"
                        : "w-2 bg-white/40 hover:bg-white/75"
                    }`}
                    aria-label={`View photo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          {era.subCategory && (
            <span className="bg-[#171512]/85 backdrop-blur-md text-[#D9A404] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#D9A404]/30 shadow-md font-sans flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#D9A404]" />
              {era.subCategory}
            </span>
          )}
          <span className="bg-[#A23E33]/90 backdrop-blur-sm text-[#E9E4D8] text-xs font-bold px-3 py-1.5 rounded-full font-sans shadow-md">
            {era.period}
          </span>
        </div>

        {/* 3D Model Toggle Pill (if available on this card) */}
        {era.model3d && (
          <button
            onClick={() => setView3D((prev) => !prev)}
            className="absolute top-16 right-4 z-20 flex items-center gap-1.5 bg-[#D9A404] hover:bg-[#c49202] text-[#171512] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            {view3D ? (
              <>
                <Eye size={13} />
                <span>Show Photos</span>
              </>
            ) : (
              <>
                <Box size={13} />
                <span>3D Citadel Scan</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Right Column: Rich Narrative & Cultural Lore ── */}
      <div className="relative flex-1 flex flex-col justify-center text-left w-full lg:w-5/12 py-2 overflow-hidden">
        {/* Subtle personalized AI mascot photo in background during storytelling */}
        {mascotImage && (
          <div className="absolute right-0 -bottom-4 w-60 h-72 sm:w-72 sm:h-88 pointer-events-none opacity-[0.16] -z-0 translate-x-4 select-none">
            <Image
              src={mascotImage}
              alt="AI Mascot Dastaan"
              fill
              className="object-contain object-bottom"
            />
          </div>
        )}

        {/* Narrator Active Badge */}
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1 h-3">
            <span className="w-1 h-2 bg-[#D9A404] rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
            <span className="w-1 h-3.5 bg-[#D9A404] rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.2s' }} />
            <span className="w-1 h-2 bg-[#D9A404] rounded-full animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.4s' }} />
          </div>
          <span className="text-[#D9A404] text-xs font-sans font-bold uppercase tracking-wider">
            AI Guide Dastaan Speaking
          </span>
        </div>

        {/* Progress header */}
        <div className="flex items-center gap-2 mb-4 relative z-10">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-[#A23E33]" : "w-2 bg-[#6B6355]/40"
              }`}
            />
          ))}
          <span className="text-[#8B7D6B] text-xs font-sans ml-2 font-medium tracking-wide">
            Story {index + 1} of {total}
          </span>
        </div>

        {/* Headline */}
        <h3 className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F2EDE4] font-serif mb-4 leading-tight tracking-tight">
          {era.title}
        </h3>

        {/* Story Script */}
        <p className="relative z-10 text-[#C4B49A] text-base sm:text-lg lg:text-xl font-sans leading-relaxed">
          {era.script}
        </p>

        {/* Golden Fact Badge */}
        {era.factBadge && (
          <motion.div
            className="relative z-10 mt-6 p-4 rounded-2xl bg-[#D9A404]/10 border border-[#D9A404]/30 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[#D9A404] text-xs sm:text-sm font-semibold font-sans leading-relaxed">
              {era.factBadge}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HistoryTimelinePanel — Full Viewport Modal
// ─────────────────────────────────────────────────────────────────────────────

interface PanelProps {
  isOpen: boolean;
  stateName: string;
  tagline: string;
  timeline: TimelineEra[];
  mascotImage?: string;
  onClose: () => void;
  onComplete: () => void;
  onCardChange?: (era: TimelineEra) => void;
}

export default function HistoryTimelinePanel({
  isOpen,
  stateName,
  tagline,
  timeline,
  mascotImage,
  onClose,
  onComplete,
  onCardChange,
}: PanelProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setDirection(1);
    }
  }, [isOpen, stateName]);

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
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0A0806]/92 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Expanded Panel Container - fills viewport with generous breathing room */}
          <motion.div
            className="relative z-10 w-full max-w-7xl bg-[#171410] rounded-3xl 
                       border border-[#3D3428] shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[95vh]"
            initial={{ y: 30, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-[#3D3428]/60 bg-[#13100D]">
              <div>
                <p className="text-[#D9A404] text-xs font-sans tracking-[0.25em] uppercase font-bold">
                  Chronicles of {stateName}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#F2EDE4] font-serif">
                  {stateName}
                  <span className="text-[#A23E33] ml-2 text-base font-sans">— {tagline}</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#8B7D6B] hover:text-[#F2EDE4] transition-colors p-2 rounded-full hover:bg-white/5"
                aria-label="Close timeline"
              >
                ✕
              </button>
            </div>

            {/* Large Content Viewport */}
            <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                {timeline[currentIndex] && (
                  <TimelineCard
                    key={timeline[currentIndex].id}
                    era={timeline[currentIndex]}
                    index={currentIndex}
                    total={timeline.length}
                    direction={direction}
                    mascotImage={mascotImage}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-4 border-t border-[#3D3428]/60 bg-[#13100D]">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[#8B7D6B] 
                           hover:text-[#F2EDE4] hover:bg-white/5 disabled:opacity-30 
                           disabled:cursor-not-allowed transition-all font-sans text-sm font-medium"
              >
                <ChevronLeft size={18} /> Previous Story
              </button>

              <span className="text-[#8B7D6B] text-xs font-sans hidden sm:inline-block">
                {currentIndex + 1} / {timeline.length}
              </span>

              <button
                onClick={goNext}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold font-sans text-sm
                           bg-[#A23E33] hover:bg-[#8a3329] text-white transition-all 
                           hover:scale-105 active:scale-95 shadow-xl shadow-[#A23E33]/30"
              >
                {isLast ? "Meet the Artisan →" : "Next Story"}
                {!isLast && <ChevronRight size={18} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
