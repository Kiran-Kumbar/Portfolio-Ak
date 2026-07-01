"use client";

import { useRef } from "react";

import { motion } from "framer-motion";
import ScrollIndicator from "./ScrollIndicator";



const EASE = [0.16, 1, 0.3, 1] as const;

function WordReveal({ word, index, startDelay = 0 }: { word: string; index: number; startDelay?: number }) {
  return (
    <span className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
      <motion.span className="inline-block"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 0.7, delay: startDelay + index * 0.08, ease: EASE }}>
        {word}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const headlineWords = ["Kiran", "Kumbar."];
  const sublineWords = ["Full-Stack", "Engineer."];
  const headlineDuration = headlineWords.length * 0.08 + 0.7;
  const sublineStart = headlineDuration + 0.1;
  const subtextStart = sublineStart + sublineWords.length * 0.08 + 0.7 + 0.1;

  return (
    <section ref={containerRef}
      className="relative h-screen flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 pt-24 pb-12 overflow-hidden">



      {/* Soft radial gradient behind text for legibility */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, var(--background) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl w-full z-10 relative">
        <h1 className="flex flex-col text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-bold tracking-tighter mb-8">
          <div className="flex items-center flex-wrap pb-2">
            {headlineWords.map((word, i) => (
              <WordReveal key={word} word={word} index={i} startDelay={0.3} />
            ))}
            {/* Accent square bullet */}
            <motion.span className="inline-block w-[0.15em] h-[0.15em] bg-[var(--accent)] rounded-sm ml-1"
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: headlineDuration + 0.3, duration: 0.5, ease: EASE }} />
          </div>
          <div className="flex flex-wrap pb-2 text-[var(--accent)]">
            {sublineWords.map((word, i) => (
              <WordReveal key={word} word={word} index={i} startDelay={sublineStart} />
            ))}
          </div>
        </h1>

        <motion.p className="text-xl md:text-2xl text-[var(--muted)] font-light max-w-2xl mb-8"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: subtextStart, duration: 0.8, ease: EASE }}>
          Crafting pixel-perfect UIs with Framer Motion &amp; Three.js alongside
          robust backend APIs and scalable architectures.
        </motion.p>

        {/* Resume download — ghost button */}
        <motion.a href="/Kiran_Kumbar_Resume.pdf" download="Kiran_Kumbar_Resume.pdf" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--foreground)]/20 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-300"
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: subtextStart + 0.2, duration: 0.6, ease: EASE }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Resume
        </motion.a>
      </div>

      <ScrollIndicator />
    </section>
  );
}
