"use client";

import { useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// NarratorAudio — Web Speech API wrapper
// Exposes: speak(text), stop(), isSpeaking
// ─────────────────────────────────────────────────────────────────────────────

export interface NarratorControls {
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
}

export function useNarrator(): NarratorControls {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Find a warm, natural voice — prefer Indian English if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang === "en-IN" ||
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("rishi") ||
        v.name.toLowerCase().includes("veena")
    );
    if (preferred) utterance.voice = preferred;

    // Warm, deliberate narrator pace
    utterance.rate  = 0.88;   // slightly slower than default
    utterance.pitch = 1.05;   // slightly warm
    utterance.volume = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    // Chrome bug: voices may not be loaded yet, retry after short delay
    setTimeout(() => {
      const latestVoices = window.speechSynthesis.getVoices();
      const latestPref = latestVoices.find(
        (v) =>
          v.lang === "en-IN" ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("rishi") ||
          v.name.toLowerCase().includes("veena")
      );
      if (latestPref) utterance.voice = latestPref;
      window.speechSynthesis.speak(utterance);
    }, 100);
  }, []);

  return { speak, stop };
}
