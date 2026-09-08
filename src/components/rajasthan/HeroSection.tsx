"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image with parallax feel */}
      <div className="absolute inset-0">
        <Image
          src="/Rajasthan/TharDessert.jpg"
          alt="Thar Desert — Rajasthan"
          fill
          className="object-cover object-center scale-105"
          priority
          sizes="100vw"
        />
        {/* layered overlays for richness */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1800]/70 via-[#1A0E00]/40 to-[#0D0700]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E00]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Pill label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="inline-block mb-6"
        >
          <span className="text-[#D9A404] text-xs font-bold tracking-[0.25em] uppercase font-sans border border-[#D9A404]/40 px-4 py-1.5 rounded-full">
            The Land of Kings
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl md:text-9xl font-bold text-[#E9E4D8] font-serif mb-6 leading-[0.9]"
        >
          Rajasthan
        </motion.h1>

        {/* Devanagari welcome */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mb-8"
        >
          <p className="text-3xl md:text-4xl text-[#D9A404] font-serif mb-1 leading-tight">
            पधारो म्हारे देश
          </p>
          <p className="text-[#A89880] text-sm tracking-widest font-sans uppercase">
            Padharo Mhare Desh — Welcome to my land
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="text-[#C4B49A] text-lg md:text-xl font-sans max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Six centuries of forts, folklore, spice, and silk — 
          still alive, still made by hand, still told by the people.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex flex-col items-center gap-2 text-[#6B6355]"
        >
          <span className="text-xs tracking-widest uppercase font-sans">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ChevronDown size={24} className="text-[#A23E33]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0700] to-transparent pointer-events-none" />
    </section>
  );
}
