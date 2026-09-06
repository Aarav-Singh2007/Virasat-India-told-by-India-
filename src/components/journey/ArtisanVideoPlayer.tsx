"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ArtisanData } from "@/data/states";
import { X } from "lucide-react";
import { ArtisanProductPage } from "./ArtisanProductPage";

// ─────────────────────────────────────────────────────────────────────────────
// ArtisanVideoPlayer — full-bleed video modal
// ─────────────────────────────────────────────────────────────────────────────

interface VideoPlayerProps {
  isOpen: boolean;
  artisan: ArtisanData;
  onClose: () => void;
  onVideoEnd: () => void;
}

export function ArtisanVideoPlayer({ isOpen, artisan, onClose, onVideoEnd }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // For native video: wire onEnded
  // For YouTube iframe: we rely on a timeout fallback or postMessage (simplified here)

  const isYouTube = artisan.videoUrl.includes("youtube.com/embed");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 
                       text-white transition-all"
            aria-label="Close video"
          >
            <X size={22} />
          </button>

          {/* Artisan label */}
          <div className="absolute top-4 left-4 z-10">
            <p className="text-[#D9A404] text-xs font-bold font-sans tracking-widest uppercase">
              Meet the Artisan
            </p>
            <h3 className="text-white text-xl font-bold font-serif">
              {artisan.name}
            </h3>
            <p className="text-white/60 text-sm font-sans">{artisan.craft} · {artisan.state}</p>
          </div>

          {/* Video */}
          <motion.div
            className="w-full max-w-4xl mx-4 aspect-video rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            {isYouTube ? (
              <iframe
                src={`${artisan.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={`${artisan.name} — ${artisan.craft}`}
              />
            ) : (
              <video
                ref={videoRef}
                src={artisan.videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                controls
                onEnded={onVideoEnd}
              />
            )}
          </motion.div>

          {/* Quote */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-lg px-4">
            <p className="text-white/70 text-sm font-serif italic">
              &ldquo;{artisan.quote}&rdquo;
            </p>
          </div>

          {/* Manual "I've watched it" button for YouTube (no onEnded available) */}
          {isYouTube && (
            <button
              onClick={onVideoEnd}
              className="absolute bottom-14 right-6 px-4 py-2 bg-[#A23E33] hover:bg-[#8a3329] 
                         text-white text-sm font-bold font-sans rounded-xl transition-all 
                         hover:scale-105 active:scale-95 shadow-lg"
            >
              Continue →
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ArtisanSupportCTA — post-video support modal
// ─────────────────────────────────────────────────────────────────────────────

interface CTAProps {
  isOpen: boolean;
  artisan: ArtisanData;
  onContinue: () => void;
}

export function ArtisanSupportCTA({ isOpen, artisan, onContinue }: CTAProps) {
  const [isProductPageOpen, setIsProductPageOpen] = React.useState(false);

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#171512]/80 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-4 mb-4 md:mb-0 bg-[#1E1A16] 
                       border border-[#6B6355]/40 rounded-3xl rounded-b-xl md:rounded-3xl 
                       p-6 shadow-2xl"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            {/* Artisan info */}
            <div className="mb-5 text-center">
              <p className="text-[#6B6355] text-xs font-sans tracking-widest uppercase mb-1">
                🙏 You just met
              </p>
              <h3 className="text-2xl font-bold text-[#E9E4D8] font-serif">{artisan.name}</h3>
              <p className="text-[#A23E33] font-sans text-sm mt-0.5">
                {artisan.craft} · {artisan.state}
              </p>
              <p className="text-[#E9E4D8]/60 font-serif text-sm italic mt-3">
                &ldquo;{artisan.quote}&rdquo;
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#6B6355]/30 mb-5" />

            {/* CTA buttons */}
            <p className="text-[#6B6355] text-xs font-sans text-center mb-3">
              Help keep this craft alive
            </p>
            <div className="flex gap-3 mb-4">
              {artisan.state === "Rajasthan" ? (
                <button
                  onClick={() => setIsProductPageOpen(true)}
                  className="flex-1 text-center py-3 rounded-xl bg-[#A23E33] hover:bg-[#8a3329] 
                             text-white font-bold font-sans text-sm transition-all hover:scale-105 
                             active:scale-95 shadow-md"
                >
                  🛒 Buy Their Work
                </button>
              ) : (
                <a
                  href={artisan.buyUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 relative flex flex-col items-center justify-center text-center py-2 rounded-xl bg-[#A23E33] hover:bg-[#8a3329] 
                             text-white font-bold font-sans text-sm transition-all hover:scale-105 
                             active:scale-95 shadow-md leading-tight"
                >
                  <span>🛒 Buy Their Work</span>
                  <span className="text-[10px] text-white/70 font-normal uppercase tracking-wider mt-0.5">Coming Soon</span>
                </a>
              )}
              <a
                href={artisan.donateUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 rounded-xl bg-[#D9A404]/20 border border-[#D9A404]/50 
                           hover:bg-[#D9A404]/30 text-[#D9A404] font-bold font-sans text-sm 
                           transition-all hover:scale-105 active:scale-95"
              >
                💛 Donate
              </a>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-2.5 rounded-xl text-[#6B6355] hover:text-[#E9E4D8] 
                         text-sm font-sans transition-colors hover:bg-[#6B6355]/10"
            >
              Continue the Journey →
            </button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      <ArtisanProductPage 
        isOpen={isProductPageOpen} 
        artisan={artisan} 
        onClose={() => setIsProductPageOpen(false)} 
      />
    </>
  );
}
