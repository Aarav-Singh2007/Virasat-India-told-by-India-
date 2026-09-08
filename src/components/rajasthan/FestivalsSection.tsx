"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  RAJASTHAN_FESTIVALS,
  getFestivalsThisMonth,
  getNextFestival,
  type FestivalEntry,
} from "@/data/rajasthan-festivals";

function CountdownBadge({ daysAway }: { daysAway: number }) {
  if (daysAway === 0) return (
    <span className="text-[#6ABF6A] font-bold font-sans text-xs uppercase tracking-widest">
      🟢 Happening today!
    </span>
  );
  if (daysAway <= 7) return (
    <span className="text-[#E87722] font-bold font-sans text-xs uppercase tracking-widest">
      ⏳ In {daysAway} day{daysAway !== 1 ? "s" : ""}
    </span>
  );
  return (
    <span className="text-[#6B6355] font-sans text-xs">
      {daysAway} days away
    </span>
  );
}

export default function FestivalsSection() {
  const thisMonth = useMemo(() => getFestivalsThisMonth(), []);
  const next = useMemo(() => getNextFestival(), []);

  return (
    <section id="festivals" className="relative w-full bg-[#0D0700] pt-20 pb-32">
      {/* Header */}
      <div className="px-6 md:px-16 text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#A23E33] text-xs font-bold tracking-[0.3em] uppercase font-sans mb-3"
        >
          Chapter VI
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-[#E9E4D8] font-serif mb-4"
        >
          Always Alive
        </motion.h2>
        <p className="text-[#6B6355] text-lg max-w-xl mx-auto font-sans">
          Something is always happening in Rajasthan. Not recreated for tourists — actually happening,
          in the streets, in the temples, in the desert.
        </p>
      </div>

      {/* Live ticker */}
      {thisMonth.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-6 md:mx-16 mb-10 rounded-2xl border border-[#6ABF6A]/30 bg-[#1A3A1A]/40 p-5 flex items-center gap-4"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#6ABF6A] animate-pulse flex-shrink-0" />
          <div>
            <p className="text-[#6ABF6A] text-xs font-bold uppercase tracking-widest font-sans mb-0.5">
              Live — happening this month
            </p>
            <p className="text-[#E9E4D8] font-sans text-base">
              {thisMonth.map((f) => f.name).join(" · ")} — Rajasthan
            </p>
          </div>
        </motion.div>
      )}

      {/* Next festival countdown */}
      {next && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-6 md:mx-16 mb-14 rounded-2xl border border-[#D9A404]/20 bg-[#1A1008] p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
        >
          <div className="flex-1">
            <p className="text-[#D9A404] text-xs font-bold uppercase tracking-widest font-sans mb-1">
              Next festival
            </p>
            <h4 className="text-2xl font-bold text-[#E9E4D8] font-serif mb-1">{next.festival.name}</h4>
            <p className="text-[#A89880] font-sans text-sm">{next.festival.location} · {next.festival.duration}</p>
          </div>
          <div className="text-right">
            <CountdownBadge daysAway={next.daysAway} />
          </div>
        </motion.div>
      )}

      {/* Festival cards grid */}
      <div className="px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {RAJASTHAN_FESTIVALS.map((fest, i) => (
          <motion.div
            key={fest.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl group cursor-default"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <Image
                src={fest.image}
                alt={fest.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0700] via-[#0D0700]/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="bg-[#0D0700] border border-[#1E1208] border-t-0 rounded-b-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="text-xl font-bold text-[#E9E4D8] font-serif">{fest.name}</h4>
                <span className="flex-shrink-0 text-[#6B6355] text-xs font-sans bg-[#1E1208] px-2.5 py-1 rounded-full">
                  {new Date(2026, fest.month - 1).toLocaleString("en-IN", { month: "long" })}
                </span>
              </div>
              <p className="text-[#D9A404] font-sans text-sm font-semibold mb-2 italic">
                "{fest.highlight}"
              </p>
              <p className="text-[#6B6355] font-sans text-sm leading-relaxed">{fest.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Closing statement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-20 px-6 md:px-16 max-w-3xl mx-auto text-center"
      >
        <p className="text-[#6B6355] font-sans text-sm uppercase tracking-widest mb-4">
          — The thread continues with you —
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-[#E9E4D8] font-serif mb-6">
          This is living heritage.
          <span className="text-[#A23E33]"> Not a museum.</span>
        </h3>
        <p className="text-[#A89880] font-sans text-base leading-relaxed mb-10">
          The turbans, the block prints, the Ghoomar, the Phad scrolls — all still here, still made
          by hand, still told by the people. You've seen Rajasthan. Now continue the journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/journey"
            className="inline-block px-8 py-3.5 bg-[#A23E33] hover:bg-[#8a3329] text-white
                       font-bold font-sans rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#A23E33]/20"
          >
            🚂 Back to the Journey
          </Link>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 border border-[#3D3428] text-[#A89880]
                       hover:border-[#A23E33]/50 hover:text-[#E9E4D8] font-sans font-semibold
                       rounded-full transition-all"
          >
            Explore the Map
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
