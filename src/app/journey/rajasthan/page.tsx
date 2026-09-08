"use client";

import React from "react";
import dynamic from "next/dynamic";

import HeroSection     from "@/components/rajasthan/HeroSection";
import FortsSection    from "@/components/rajasthan/FortsSection";
import ValorSection    from "@/components/rajasthan/ValorSection";
import AttireSection   from "@/components/rajasthan/AttireSection";
import FoodSection     from "@/components/rajasthan/FoodSection";
import MusicSection    from "@/components/rajasthan/MusicSection";
import FestivalsSection from "@/components/rajasthan/FestivalsSection";

// ChapterNav uses IntersectionObserver — safe for client, but skip SSR for clean hydration
const ChapterNav = dynamic(() => import("@/components/rajasthan/ChapterNav"), { ssr: false });

export default function RajasthanDeepDivePage() {
  return (
    <>
      {/* Sticky chapter dot navigation */}
      <ChapterNav />

      {/* Main story scroll */}
      <main className="w-full bg-[#0D0700] overflow-x-hidden">
        <HeroSection />
        <FortsSection />
        <ValorSection />
        <AttireSection />
        <FoodSection />
        <MusicSection />
        <FestivalsSection />
      </main>
    </>
  );
}
