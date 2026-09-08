"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, CheckCircle, XCircle } from "lucide-react";

// Audio is sourced from Wikimedia Commons / public domain
// Files to place in /public/Rajasthan/audio/
const INSTRUMENTS = [
  {
    id: "kamaicha",
    name: "Kamaicha",
    image: "/Rajasthan/Kamaicha_Instrument.jpg",
    audio: "/Rajasthan/audio/kamaicha_clip.mp3",
    community: "Manganiyar",
    description:
      "A bowed string instrument with a round resonator, played by the Manganiyar community of western Rajasthan. The body is carved from a single piece of mango wood, with a goatskin membrane.",
    fact: "The Manganiyars have performed for Rajput courts for over 800 years. Their music was passed orally — no written notation. Every song exists only in memory.",
    options: ["Kamaicha", "Sarangi", "Ektara"],
    answer: 0,
  },
  {
    id: "morchang",
    name: "Morchang",
    image: "/Rajasthan/Morchang_Khartal.jpg",
    audio: "/Rajasthan/audio/morchang_clip.mp3",
    community: "Langa musicians",
    description:
      "A jaw harp — a small iron frame held between the teeth, with a thin metal tongue plucked with a finger. The mouth acts as the resonator. Sounds unearthly.",
    fact: "The morchang requires no external resonator — your skull IS the resonator. By shaping your mouth and throat, you change the pitch. The technique takes years to master.",
    options: ["Morchang", "Dholak", "Been"],
    answer: 0,
  },
  {
    id: "khartal",
    name: "Khartal",
    image: "/Rajasthan/Morchang_Khartal.jpg",
    audio: "/Rajasthan/audio/khartal_clip.mp3",
    community: "Manganiyar & Langa",
    description:
      "Wooden clappers held between the fingers, struck rhythmically. Khartal literally means 'hand-clapper' (khar = hand, taal = rhythm). Looks simple. Is not.",
    fact: "A master khartal player can produce 12 distinct rhythmic patterns without losing the beat. They are used in both devotional music and dance accompaniment.",
    options: ["Khartal", "Manjira", "Khomok"],
    answer: 0,
  },
];

const DANCE_ITEMS = [
  {
    id: "ghoomar",
    name: "Ghoomar",
    image: "/Rajasthan/Ghoomar_Dance.jpg",
    badge: "Traditional Rajput",
    body: "Ghoomar is performed in a sweeping circular motion — the ghagra (long skirt) fans out as the dancer spins, her hands moving in precise mudras. It was traditionally performed by Rajput women inside palace zenanas, celebrating festivals and weddings.",
    body2:
      "Today it is practiced across communities and regions, and became globally recognized after a 2018 Bollywood film — but the form has been alive in Rajasthan for at least 400 years.",
  },
  {
    id: "kalbelia",
    name: "Kalbelia",
    image: "/Rajasthan/Kalbelia_Dancer.jpg",
    badge: "UNESCO Intangible Heritage",
    body: "Kalbelia comes from the snake-charming Kalbelia community of Rajasthan. The dance mimics the movement of a cobra — the spine curves, the hips swing, the hands undulate without pause.",
    body2:
      "UNESCO listed Kalbelia on its Intangible Cultural Heritage list in 2010. The community has danced this way for centuries. The costumes are embroidered in black and red — colors of the cobra.",
  },
  {
    id: "phad",
    name: "Phad Painting",
    image: "/Rajasthan/PhadPainting_Scroll.jpg",
    badge: "Living art form",
    body: "A Phad is a large cloth scroll painting — a portable mural of the folk epic of the deity Pabuji (or Devnarayan). Bhopa priests carry it from village to village.",
    body2:
      "The bhopa unrolls the scroll at night, lights a lamp to illuminate it, and sings the epic while pointing to each scene. The painting IS the stage. The singer IS the narrator. The art and the story are the same act — which is what this entire app is trying to do.",
  },
];

export default function MusicSection() {
  const [activeInstrument, setActiveInstrument] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [guessed, setGuessed] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [activeDance, setActiveDance] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const instrument = INSTRUMENTS[activeInstrument];
  const dance = DANCE_ITEMS[activeDance];

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          // Audio file not found — handle gracefully
          setHasPlayed(true);
        });
        setIsPlaying(true);
        setHasPlayed(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  const handleGuess = (i: number) => {
    setGuessed(i);
    setShowReveal(true);
  };

  const nextInstrument = () => {
    setActiveInstrument((i) => (i + 1) % INSTRUMENTS.length);
    setIsPlaying(false);
    setHasPlayed(false);
    setGuessed(null);
    setShowReveal(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  };

  return (
    <section id="music" className="relative w-full bg-[#0A0500] py-20">
      {/* Header */}
      <div className="px-6 md:px-16 text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#A23E33] text-xs font-bold tracking-[0.3em] uppercase font-sans mb-3"
        >
          Chapter V
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-[#E9E4D8] font-serif mb-4"
        >
          Still Playing
        </motion.h2>
        <p className="text-[#6B6355] text-lg max-w-xl mx-auto font-sans">
          Not museum pieces. Not archived recordings. These musicians played last night.
          They'll play again tomorrow.
        </p>
      </div>

      {/* === INSTRUMENTS GAME === */}
      <div className="max-w-5xl mx-auto px-6 md:px-16 mb-20">
        <h3 className="text-[#D9A404] font-bold font-sans text-xs tracking-widest uppercase mb-6">
          Tap to hear — then guess the instrument
        </h3>

        {/* Instrument selector */}
        <div className="flex gap-2 mb-8">
          {INSTRUMENTS.map((inst, i) => (
            <button
              key={inst.id}
              onClick={() => {
                setActiveInstrument(i);
                setIsPlaying(false);
                setHasPlayed(false);
                setGuessed(null);
                setShowReveal(false);
                if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-sans transition-all ${
                activeInstrument === i
                  ? "bg-[#A23E33] text-white"
                  : "border border-[#3D3428] text-[#6B6355] hover:text-[#A89880]"
              }`}
            >
              {inst.name}
            </button>
          ))}
        </div>

        {/* Hidden audio element */}
        <audio ref={audioRef} src={instrument.audio} preload="none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={instrument.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Image + play button */}
            <div className="flex flex-col gap-4">
              <div className="relative h-56 rounded-2xl overflow-hidden">
                <Image
                  src={instrument.image}
                  alt={instrument.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Blur if not yet played */}
                {!hasPlayed && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-[#0A0500]/50 flex items-center justify-center">
                    <p className="text-[#A89880] text-sm font-sans">Hear it first — then guess</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0500]/70 to-transparent" />
              </div>

              {/* Play button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePlay}
                className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl
                            font-bold font-sans text-sm transition-all ${
                              isPlaying
                                ? "bg-[#E87722] text-white shadow-lg shadow-[#E87722]/30"
                                : "bg-[#1E1208] border border-[#3D3428] text-[#D9A404] hover:border-[#D9A404]/50"
                            }`}
              >
                {isPlaying ? (
                  <><Volume2 size={18} className="animate-pulse" /> Listening...</>
                ) : (
                  <><Play size={18} /> {hasPlayed ? "Play again" : "🎵 Tap to hear"}</>
                )}
              </motion.button>

              {/* Community badge */}
              <div className="text-center text-xs text-[#6B6355] font-sans">
                Played by the <span className="text-[#A89880] font-semibold">{instrument.community}</span> community
              </div>
            </div>

            {/* Guess or reveal panel */}
            <div className="flex flex-col gap-4">
              {!showReveal ? (
                <>
                  <p className={`text-sm font-sans font-semibold ${
                    hasPlayed ? "text-[#D9A404]" : "text-[#3D3428]"
                  } uppercase tracking-widest`}>
                    {hasPlayed ? "Which instrument is this?" : "Play the audio first ↑"}
                  </p>
                  <div className="flex flex-col gap-2">
                    {instrument.options.map((opt, i) => (
                      <motion.button
                        key={i}
                        whileHover={hasPlayed ? { scale: 1.02 } : {}}
                        whileTap={hasPlayed ? { scale: 0.97 } : {}}
                        disabled={!hasPlayed}
                        onClick={() => hasPlayed && handleGuess(i)}
                        className={`w-full py-3.5 px-5 rounded-xl border text-left text-sm font-semibold font-sans
                                    transition-all ${
                                      hasPlayed
                                        ? "border-[#3D3428] text-[#A89880] hover:border-[#A23E33]/60 hover:text-[#E9E4D8] hover:bg-[#A23E33]/10 cursor-pointer"
                                        : "border-[#1E1208] text-[#3D3428] cursor-not-allowed"
                                    }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Result */}
                  <div className={`rounded-xl p-4 border flex items-start gap-3 ${
                    guessed === instrument.answer
                      ? "bg-[#1A3A1A] border-[#4A7A3C]/50"
                      : "bg-[#3A1A0A] border-[#A23E33]/40"
                  }`}>
                    {guessed === instrument.answer
                      ? <CheckCircle size={18} className="text-[#6ABF6A] mt-0.5 flex-shrink-0" />
                      : <XCircle size={18} className="text-[#E87722] mt-0.5 flex-shrink-0" />
                    }
                    <div>
                      <p className={`font-bold text-sm font-sans ${
                        guessed === instrument.answer ? "text-[#6ABF6A]" : "text-[#E87722]"
                      }`}>
                        {guessed === instrument.answer
                          ? "That's the Kamaicha!"
                          : `It's the ${instrument.name}.`}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#A89880] font-sans text-sm leading-relaxed">
                    {instrument.description}
                  </p>

                  {/* Fact */}
                  <div className="bg-[#1A1008] border border-[#D9A404]/20 rounded-xl p-4">
                    <p className="text-[#D9A404] text-xs font-bold uppercase tracking-widest font-sans mb-1">Community lore</p>
                    <p className="text-[#A89880] font-sans text-sm leading-relaxed">{instrument.fact}</p>
                  </div>

                  <button
                    onClick={nextInstrument}
                    className="w-full py-3 rounded-xl bg-[#A23E33] hover:bg-[#8a3329] text-white
                               font-bold font-sans transition-all hover:scale-[1.02]"
                  >
                    Next instrument →
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* === DANCE & PHAD SECTION === */}
      <div className="px-6 md:px-16 max-w-6xl mx-auto">
        <h3 className="text-[#D9A404] font-bold font-sans text-xs tracking-widest uppercase mb-8">
          Dance & Living Art
        </h3>

        {/* Dance tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {DANCE_ITEMS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActiveDance(i)}
              className={`px-5 py-2 rounded-full text-sm font-semibold font-sans transition-all ${
                activeDance === i
                  ? "bg-[#A23E33] text-white"
                  : "border border-[#3D3428] text-[#6B6355] hover:text-[#A89880]"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={dance.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            {/* Image */}
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={dance.image}
                alt={dance.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0500]/60 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#A23E33] text-white text-xs font-bold px-3 py-1 rounded-full font-sans">
                  {dance.badge}
                </span>
              </div>
            </div>

            {/* Text */}
            <div>
              <h4 className="text-3xl font-bold text-[#E9E4D8] font-serif mb-4">{dance.name}</h4>
              <p className="text-[#A89880] font-sans text-base leading-relaxed mb-4">{dance.body}</p>
              <p className={`font-sans text-base leading-relaxed ${
                dance.id === "phad" ? "text-[#D9A404] font-semibold" : "text-[#A89880]"
              }`}>
                {dance.body2}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
