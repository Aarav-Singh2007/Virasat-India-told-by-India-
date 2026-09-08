"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps each chapter section. Provides:
 *  - id anchor for chapter nav
 *  - scroll-triggered fade+rise entrance
 */
export default function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative w-full ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
