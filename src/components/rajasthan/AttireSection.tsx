"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const ATTIRE_ITEMS = [
  {
    id: "pagdi",
    title: "The Pagdi",
    hindi: "पगड़ी",
    subtitle: "More than a turban — a biography on your head.",
    image: "/Rajasthan/Pagdi_Varieties.jpg",
    facts: [
      "In Rajasthan, the color of your pagdi historically told people your caste, clan, region, and occasion — before you said a word.",
      "A saffron pagdi signals bravery or a warrior's vow. White signals mourning. Pink is worn at weddings. Each style of fold signals a different district.",
      "Jodhpur pagdis fold differently from Jaipur pagdis. A trained eye could tell your hometown from across a courtyard.",
      "The art of pagdi-tying is passed father-to-son. A master can tie one in under two minutes without a mirror.",
    ],
  },
  {
    id: "kundan",
    title: "Kundan & Meenakari",
    hindi: "कुंदन मीनाकारी",
    subtitle: "Jaipur is still the global capital of this craft. Not a historical footnote — right now.",
    image: "/Rajasthan/Jhoroka.jpg",
    facts: [
      "Kundan is a technique of setting uncut gemstones in pure gold foil. The word means 'refined gold.' No solder. No heat. Pure pressure and craft.",
      "Meenakari is enamelwork — the underside of a kundan piece is always enamelled, because the craftsman believed even the part you cannot see must be beautiful.",
      "Jaipur's Pink City still houses over 3,000 active kundan workshops. The craft has been practiced there for over 500 years, largely by the Soni (goldsmith) community.",
      "A single Kundan necklace can take 6 months to complete. Each stone is individually set by hand, then removed and reset after the enamel is fired on the reverse.",
    ],
  },
  {
    id: "borla",
    title: "Borla, Rakhdi & Lac Bangles",
    hindi: "बोरला · राखड़ी · लाख की चूड़ियाँ",
    subtitle: "Not just bridal. These are everyday adornment.",
    image: "/Rajasthan/Borla_LaacBangles.jpg",
    facts: [
      "The borla is a forehead ornament — a large pendant that hangs from the hair parting to the center of the forehead. It signals a married woman in Rajput and Marwari communities.",
      "Unlike what cinema shows, the borla is not bridal-only. It is worn at festivals, prayers, and family occasions across a woman's lifetime.",
      "Lac bangles — made from shellac resin, not glass — are a Rajasthan specialty. They are heavier, warmer to the touch, and richly decorated with mirror chips and silver wire.",
      "Lac bangle-making centers in Jaipur employ thousands of women artisans today. The craft predates the Mughal period.",
    ],
  },
];

export default function AttireSection() {
  const [current, setCurrent] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const item = ATTIRE_ITEMS[current];

  const prev = () => {
    setCurrent((c) => (c - 1 + ATTIRE_ITEMS.length) % ATTIRE_ITEMS.length);
    setFactIdx(0);
  };
  const next = () => {
    setCurrent((c) => (c + 1) % ATTIRE_ITEMS.length);
    setFactIdx(0);
  };
  const nextFact = () => setFactIdx((i) => Math.min(i + 1, item.facts.length - 1));
  const prevFact = () => setFactIdx((i) => Math.max(i - 1, 0));

  return (
    <section id="attire" className="relative w-full bg-[#120B03] py-20">
      {/* Header */}
      <div className="px-6 md:px-16 text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#A23E33] text-xs font-bold tracking-[0.3em] uppercase font-sans mb-3"
        >
          Chapter III
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-[#E9E4D8] font-serif mb-4"
        >
          Worn Identity
        </motion.h2>
        <p className="text-[#6B6355] text-lg max-w-xl mx-auto font-sans">
          Before you said a word, your clothes told the story. In Rajasthan, they still do.
        </p>
      </div>

      {/* Main carousel */}
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            {/* Image */}
            <div className="relative h-72 md:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120B03]/70 to-transparent" />
              {/* Hindi label */}
              <div className="absolute top-4 left-4 bg-[#120B03]/80 backdrop-blur-sm rounded-full px-4 py-1.5">
                <span className="text-[#D9A404] font-serif text-base">{item.hindi}</span>
              </div>
            </div>

            {/* Text content */}
            <div>
              <h3 className="text-3xl font-bold text-[#E9E4D8] font-serif mb-2">{item.title}</h3>
              <p className="text-[#A23E33] text-sm font-sans italic mb-6">{item.subtitle}</p>

              {/* Fact reveal */}
              <div className="bg-[#1A1008] border border-[#3D3428] rounded-2xl p-6 mb-4 min-h-[120px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={factIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-[#A89880] font-sans text-base leading-relaxed"
                  >
                    {item.facts[factIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Fact nav */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevFact}
                  disabled={factIdx === 0}
                  className="p-2 rounded-full border border-[#3D3428] text-[#6B6355] disabled:opacity-30
                             hover:border-[#A23E33]/50 hover:text-[#A89880] transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1.5">
                  {item.facts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFactIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === factIdx ? "w-5 bg-[#A23E33]" : "w-1.5 bg-[#3D3428]"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextFact}
                  disabled={factIdx === item.facts.length - 1}
                  className="p-2 rounded-full border border-[#3D3428] text-[#6B6355] disabled:opacity-30
                             hover:border-[#A23E33]/50 hover:text-[#A89880] transition-all"
                >
                  <ChevronRight size={16} />
                </button>
                <span className="text-[#6B6355] text-xs font-sans ml-2">
                  {factIdx + 1} / {item.facts.length}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Item navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={prev}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#3D3428]
                       text-[#6B6355] hover:text-[#E9E4D8] hover:border-[#A23E33]/50 transition-all font-sans text-sm"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex gap-2">
            {ATTIRE_ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setFactIdx(0); }}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-8 bg-[#A23E33]" : "w-2 bg-[#3D3428]"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#3D3428]
                       text-[#6B6355] hover:text-[#E9E4D8] hover:border-[#A23E33]/50 transition-all font-sans text-sm"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

        {/* AR Placeholder card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-14 relative overflow-hidden rounded-3xl border border-[#D9A404]/30 bg-gradient-to-br from-[#1A1008] to-[#2A1A06] p-8 flex flex-col md:flex-row items-center gap-8"
        >
          {/* Pagdi preview */}
          <div className="relative w-40 h-40 md:w-52 md:h-52 flex-shrink-0">
            <Image
              src="/Rajasthan/Pagdi_AROverlay.png"
              alt="AR Pagdi try-on preview"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="200px"
            />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Sparkles size={18} className="text-[#D9A404]" />
              <span className="text-[#D9A404] text-xs font-bold tracking-widest uppercase font-sans">
                Coming in the Virasat App
              </span>
            </div>
            <h4 className="text-2xl font-bold text-[#E9E4D8] font-serif mb-3">
              Try On a Rajasthani Pagdi — in AR
            </h4>
            <p className="text-[#A89880] font-sans text-base leading-relaxed mb-5">
              Point your phone at your face, and wear a pagdi from any of Rajasthan's 33 districts.
              See which region's style suits you. Share it. Wear it. Know it.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#D9A404]/10 border border-[#D9A404]/30 rounded-full px-5 py-2.5">
              <span className="text-[#D9A404] text-sm font-semibold font-sans">
                Face-filter AR · No install required
              </span>
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D9A404]/10 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
