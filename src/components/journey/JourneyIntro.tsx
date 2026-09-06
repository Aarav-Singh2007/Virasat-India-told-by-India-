import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface JourneyIntroProps {
  onComplete: () => void;
}

const STATES = ["Rajasthan", "Bihar", "Nagaland", "Kerala"];

export default function JourneyIntro({ onComplete }: JourneyIntroProps) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenIntro = localStorage.getItem("virasat_intro_seen");
    if (hasSeenIntro) {
      onComplete();
    } else {
      setShow(true);
    }
  }, [onComplete]);

  const handleSelect = (choice: string | null) => {
    localStorage.setItem("virasat_intro_seen", "true");
    if (choice) {
      localStorage.setItem("virasat_roots", choice);
    } else {
      localStorage.removeItem("virasat_roots");
    }
    onComplete();
  };

  if (!mounted || !show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F6F0] p-6 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <div className="max-w-2xl w-full text-center space-y-10 relative">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2A241F] leading-tight font-medium" style={{ fontFamily: "Fraunces, serif" }}>
          Where are your roots from?
        </h1>

        <div className="grid grid-cols-2 gap-4 md:gap-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
          {STATES.map((state) => (
            <button
              key={state}
              onClick={() => handleSelect(state)}
              className="p-6 text-lg md:text-xl font-medium bg-white border border-[#EAE3D9] text-[#4A433A] rounded-2xl shadow-sm hover:shadow-md hover:border-[#A23E33] hover:text-[#A23E33] transition-all transform hover:-translate-y-1"
            >
              {state}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleSelect(null)}
          className="mt-6 px-8 py-4 bg-[#A23E33] text-white text-lg font-bold rounded-full shadow-lg shadow-[#A23E33]/20 hover:bg-[#8a3329] transition-all hover:scale-105 active:scale-95"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
        >
          Just exploring
        </button>

        <div className="absolute -bottom-20 left-0 right-0 flex justify-center">
          <button
            onClick={() => handleSelect(null)}
            className="text-[#8B7D6B] hover:text-[#2A241F] underline text-sm tracking-wide"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Skip
          </button>
        </div>
      </div>
    </motion.div>
  );
}
