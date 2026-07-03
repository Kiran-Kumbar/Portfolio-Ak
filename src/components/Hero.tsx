"use client";

import { useRef } from "react";

import { motion } from "framer-motion";
import ScrollIndicator from "./ScrollIndicator";
import GlassTerminal from "./GlassTerminal";
import TechPillar from "./TechPillar";
import HeroWave from "./HeroWave";



const EASE = [0.16, 1, 0.3, 1] as const;

function WordReveal({ word, index, startDelay = 0, outlined = false }: { word: string; index: number; startDelay?: number; outlined?: boolean }) {
  return (
    <span className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
      <motion.span 
        className={`inline-block ${outlined ? 'text-transparent opacity-80' : ''}`}
        style={outlined ? { WebkitTextStroke: "2px var(--color-accent)" } : {}}
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

  const introWords = ["Hi,", "I'm", "Kiran."];
  const roleWords = ["Full-Stack", "Engineer."];
  const introDuration = introWords.length * 0.08 + 0.7;
  const roleStart = introDuration + 0.1;
  const subtextStart = roleStart + roleWords.length * 0.08 + 0.7 + 0.1;

  return (
    <section ref={containerRef}
      className="relative w-full min-h-[100dvh] md:h-screen h-auto flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 pt-32 pb-24 md:pt-24 md:pb-12 overflow-hidden overflow-y-auto">



      {/* ── Code-Driven Dark Theme Aurora ── */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        {/* Subtle radial glow blob at the right side */}
        <div className="absolute top-1/2 left-[65%] -translate-y-1/2 w-[600px] h-[600px] bg-accent opacity-[0.07] rounded-full filter blur-[120px] pointer-events-none" />

        {/* Particle wave canvas */}
        <HeroWave />

        {/* Extremely subtle noise/grain texture overlay (3-4% opacity) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.035] mix-blend-overlay pointer-events-none z-10" />
      </div>

      <div className="w-full max-w-[1600px] z-20 relative grid grid-cols-1 lg:grid-cols-[1.2fr_auto_1.4fr] gap-8 lg:gap-10 items-center mx-auto">
        {/* Left Column: Typography */}
        <div>
          <h1 className="flex flex-col text-[clamp(3rem,4.5vw,6rem)] leading-[1.05] font-bold tracking-tighter mb-10 text-foreground">
          <div className="flex items-center flex-wrap pb-2">
            {introWords.map((word, i) => (
              <WordReveal key={word} word={word} index={i} startDelay={0.3} />
            ))}
            {/* Accent square bullet */}
            <motion.span className="inline-block w-[0.15em] h-[0.15em] bg-accent rounded-sm ml-1"
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: introDuration + 0.3, duration: 0.5, ease: EASE }} />
          </div>
          <div className="flex flex-wrap pb-2 text-accent">
            {roleWords.map((word, i) => (
              <WordReveal key={word} word={word} index={i} startDelay={roleStart} outlined={i === 0} />
            ))}
          </div>
        </h1>

        <motion.div 
          className="flex flex-col gap-10 mb-12 mt-6"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: subtextStart, duration: 0.8, ease: EASE }}
        >
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-xl leading-relaxed">
            Architecting scalable backend systems and crafting cinematic, pixel-perfect user interfaces.
          </p>

          {/* Animated Live Status Pill */}
          <div className="flex items-center gap-3 w-fit px-4 py-2 rounded-full border border-success/20 bg-success/5 backdrop-blur-md shadow-[0_0_15px_var(--color-success)] shadow-success/10">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <motion.span 
                animate={{ scale: [1, 1.8], opacity: [1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inline-flex h-full w-full rounded-full bg-success"
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success shadow-[0_0_8px_var(--color-success)]"></span>
            </span>
            <span className="text-sm font-medium text-success">
              Available for new opportunities
            </span>
          </div>
        </motion.div>

        {/* Resume download — ghost button */}
        <motion.a href="/Kiran_Kumbar_Resume.pdf" download="Kiran_Kumbar_Resume.pdf" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-strong bg-transparent text-sm font-medium text-text-secondary hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300"
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ delay: subtextStart + 0.2, duration: 0.6, ease: EASE }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
            Resume
          </motion.a>
        </div>

        {/* Middle Column: Floating Tech Pillar */}
        <TechPillar />

        {/* Right Column: Glass Terminal */}
        <div className="w-full mt-10 lg:mt-0">
          <GlassTerminal />
        </div>
      </div>

      <ScrollIndicator />

      {/* Bottom Right: Current Role / Daylink */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 hidden md:flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
      >
        <span className="text-[10px] font-mono text-muted uppercase tracking-widest">Currently</span>
        <div className="h-[1px] w-6 bg-border-strong"></div>
        <span className="text-xs font-medium text-text-secondary">Building SaaS @ Daylink Techlabs</span>
      </motion.div>
    </section>
  );
}
