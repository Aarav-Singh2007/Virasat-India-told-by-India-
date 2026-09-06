"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// JourneyPassport — sticky bottom stamp book (localStorage-backed)
// Earns a new stamp every time a state is completed
// ─────────────────────────────────────────────────────────────────────────────

const STAMPS = [
  { slug: "rajasthan", label: "Rajasthan", image: "/tickets/Rajasthan_ticket.png" },
  { slug: "bihar",     label: "Bihar",     image: "/tickets/Bihar_ticket.png"     },
  { slug: "nagaland",  label: "Nagaland",  image: "/tickets/Nagaland_ticket.png"  },
  { slug: "kerala",    label: "Kerala",    image: "/tickets/Kerela_ticket.png"    },
];

const STORAGE_KEY = "virasat_passport";

function loadEarned(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveEarned(slugs: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

interface Props {
  newlyEarnedSlug?: string | null;
}

export default function JourneyPassport({ newlyEarnedSlug }: Props) {
  const [earned, setEarned] = useState<string[]>([]);
  const [justEarned, setJustEarned] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setEarned(loadEarned());
  }, []);

  // When a new stamp arrives, add it
  useEffect(() => {
    if (!newlyEarnedSlug) return;
    setEarned((prev) => {
      if (prev.includes(newlyEarnedSlug)) return prev;
      const updated = [...prev, newlyEarnedSlug];
      saveEarned(updated);
      return updated;
    });
    setJustEarned(newlyEarnedSlug);
    setIsOpen(true); // auto-open passport to show new stamp
    const t = setTimeout(() => setJustEarned(null), 3000);
    return () => clearTimeout(t);
  }, [newlyEarnedSlug]);

  return (
    <>
      {/* ── "Just Earned" toast ─────────────────────────────── */}
      <AnimatePresence>
        {justEarned && (
          <motion.div
            key="stamp-toast"
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#D9A404] text-[#171512] 
                       px-5 py-3 rounded-2xl shadow-xl font-bold font-sans text-sm flex items-center gap-3"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
          >
            🎟️ Passport stamp earned:{" "}
            <span className="font-black">
              {STAMPS.find((s) => s.slug === justEarned)?.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Passport toggle tab ─────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 bg-[#1E1A16] border 
                   border-[#6B6355]/40 border-b-0 rounded-t-2xl px-6 py-2 text-[#D9A404] 
                   font-bold font-sans text-xs tracking-widest uppercase hover:bg-[#252118] 
                   transition-colors flex items-center gap-2 shadow-lg"
      >
        🎟️ My Passport
        <span className="bg-[#A23E33] text-white text-xs rounded-full px-1.5 py-0.5 font-black">
          {earned.length}/{STAMPS.length}
        </span>
      </button>

      {/* ── Passport drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-30 bg-[#1E1A16] border-t border-[#6B6355]/40 
                       shadow-2xl px-6 pt-4 pb-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-[#E9E4D8] font-serif font-bold text-lg">Journey Passport</h4>
                  <p className="text-[#6B6355] font-sans text-xs">Collect all 4 stamps</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[#6B6355] hover:text-[#E9E4D8] transition-colors p-1"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {STAMPS.map((stamp) => {
                  const isEarned = earned.includes(stamp.slug);
                  const isNew = justEarned === stamp.slug;
                  return (
                    <motion.div
                      key={stamp.slug}
                      className="flex flex-col items-center gap-1"
                      animate={isNew ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <div
                        className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          isEarned
                            ? "border-[#D9A404] shadow-[0_0_12px_rgba(217,164,4,0.4)]"
                            : "border-[#6B6355]/30 opacity-30 grayscale"
                        }`}
                      >
                        <Image
                          src={stamp.image}
                          alt={stamp.label}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {!isEarned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#171512]/60">
                            <span className="text-2xl">🔒</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-xs font-sans font-medium text-center ${isEarned ? "text-[#D9A404]" : "text-[#6B6355]"}`}>
                        {stamp.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {earned.length === STAMPS.length && (
                <motion.p
                  className="text-center text-[#D9A404] font-serif italic text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  🌟 Full journey complete! India, told by India.
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
