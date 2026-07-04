"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, MotionValue, animate } from "framer-motion";
import { IconType } from "react-icons";
import {
  SiNextdotjs, SiReact, SiTypescript, SiNestjs, SiNodedotjs,
  SiMongodb, SiPostgresql, SiTailwindcss, SiFramer,
  SiThreedotjs, SiRedis, SiGit, SiPython, SiDocker, SiVercel,
} from "react-icons/si";
import { TbApi, TbBrandSocketIo, TbRefresh } from "react-icons/tb";
import Showreel from "./Showreel";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.round(latest).toString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [inView, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

/* ── Reveal Line — each line fades up on scroll ── */
function RevealLine({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
      animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── Scroll Matrix Text ── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]";
function ScrollMatrixText({ text, progress }: { text: string; progress: MotionValue<number> }) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      // Decode smoothly across the entire scroll range
      const decodeProgress = Math.min(Math.max(latest * 1.1, 0), 1);
      
      if (decodeProgress === 1) {
        setDisplayText(text);
        return;
      }
      
      if (decodeProgress === 0) {
        setDisplayText(text.split('').map(c => c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
        return;
      }
      
      const revealCount = Math.floor(text.length * decodeProgress);
      const scrambled = text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < revealCount) return char; // Revealed letter
        return CHARS[Math.floor(Math.random() * CHARS.length)]; // Scrambled letter
      }).join('');
      
      setDisplayText(scrambled);
    });
    return () => unsubscribe();
  }, [progress, text]);

  return <>{displayText}</>;
}

/* ── Story Chapter Card ── */
function ChapterCard({
  number,
  title,
  description,
  highlight,
  delay = 0,
}: {
  number: string;
  title: string;
  description: string;
  highlight?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="group relative pl-12 md:pl-16 pb-16 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-1.5 flex flex-col items-center">
        <motion.div
          className="w-3 h-3 rounded-full border-2 border-accent bg-(--background) z-20 group-hover:bg-accent group-hover:shadow-[0_0_12px_var(--accent)] transition-all duration-500"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: delay + 0.2, ease: EASE }}
        />
      </div>

      {/* Chapter number */}
      <span className="text-[11px] font-mono text-accent opacity-60 uppercase tracking-[0.2em] mb-3 block">
        {number}
      </span>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[15px] md:text-base text-muted leading-[1.75] max-w-lg">
        {description}
        {highlight && (
          <span className="text-accent font-medium"> {highlight}</span>
        )}
      </p>
    </motion.div>
  );
}

/* ── Skill Data with Real Logos ── */
interface Skill {
  name: string;
  icon: IconType;
  color: string;
  desc: string;
}

const SKILLS: Skill[] = [
  { name: "Next.js",       icon: SiNextdotjs,    color: "#ffffff",  desc: "The framework that runs this site. SSR, ISR, App Router — I breathe it." },
  { name: "React",         icon: SiReact,        color: "#61DAFB",  desc: "Where it all began. Component-driven thinking changed everything." },
  { name: "TypeScript",    icon: SiTypescript,    color: "#3178C6",  desc: "Type safety isn't optional — it's a superpower. Zero runtime surprises." },
  { name: "NestJS",        icon: SiNestjs,       color: "#E0234E",  desc: "Enterprise backend architecture. Decorators, modules, pure elegance." },
  { name: "Node.js",       icon: SiNodedotjs,    color: "#339933",  desc: "JavaScript on the server. Fast, async, unstoppable." },
  { name: "MongoDB",       icon: SiMongodb,      color: "#47A248",  desc: "Document-based freedom. Schema-flexible, lightning reads." },
  { name: "PostgreSQL",    icon: SiPostgresql,   color: "#4169E1",  desc: "Real relational power. Joins, constraints, bulletproof data." },
  { name: "Tailwind",      icon: SiTailwindcss,  color: "#06B6D4",  desc: "Utility-first CSS that actually ships fast. No naming nightmares." },
  { name: "Framer Motion", icon: SiFramer,        color: "#0055FF",  desc: "Cinematic UI animations with zero compromise. Every pixel dances." },
  { name: "Three.js",      icon: SiThreedotjs,   color: "#ffffff",  desc: "3D worlds in the browser. WebGL magic that makes jaws drop." },
  { name: "REST APIs",     icon: TbApi,          color: "#60A5FA",  desc: "Clean endpoints, solid contracts. The backbone of every product." },
  { name: "WebSockets",    icon: TbBrandSocketIo, color: "#25C2A0", desc: "Real-time, bidirectional data. No polling, pure live sync." },
  { name: "Redis",         icon: SiRedis,        color: "#DC382D",  desc: "In-memory speed demon. Caching, sessions, millisecond responses." },
  { name: "Git",           icon: SiGit,          color: "#F05032",  desc: "Version control is non-negotiable. Clean commits, meaningful history." },
  { name: "Python",        icon: SiPython,       color: "#3776AB",  desc: "Data pipelines, automation, ML prototyping. The Swiss army knife." },
  { name: "Docker",        icon: SiDocker,       color: "#2496ED",  desc: "Containerize everything. Works on my machine? Now it works everywhere." },
  { name: "Vercel",        icon: SiVercel,       color: "#ffffff",  desc: "Deploy in seconds, scale infinitely. The platform behind my best work." },
  { name: "Agile",         icon: TbRefresh,      color: "#A78BFA",  desc: "Ship fast, iterate faster. Sprints, retrospectives — I live it." },
];

/* ── Scroll-Expanding Skill Card (Horizontal Layout) ── */
function ExpandCard({
  skill,
  index,
  progress,
}: {
  skill: Skill;
  index: number;
  progress: MotionValue<number>;
}) {
  // Using grid-flow-col means:
  // index 0 -> col 0, row 0
  // index 1 -> col 0, row 1
  // index 2 -> col 0, row 2
  // index 3 -> col 1, row 0
  // etc.
  const COLS = Math.ceil(SKILLS.length / 3); // 6
  const row = index % 3;
  const col = Math.floor(index / 3);
  const centerCol = (COLS - 1) / 2;
  const centerRow = 1; // Since there are 3 rows (0, 1, 2)

  // Since cards are wider now, collapse distances need to be larger
  const xCollapse = (centerCol - col) * 180;
  const yCollapse = (centerRow - row) * 80;

  const dist = Math.sqrt((col - centerCol) ** 2 + (row - centerRow) ** 2);
  const stagger = Math.min(dist * 0.03, 0.2);

  const x = useTransform(progress, [stagger, 0.6 + stagger * 0.4], [xCollapse, 0]);
  const y = useTransform(progress, [stagger, 0.6 + stagger * 0.4], [yCollapse, 0]);
  const scl = useTransform(progress, [0, 0.5], [0.5, 1]);
  const op = useTransform(progress, [0, 0.35], [0, 1]);
  const rot = useTransform(progress, [0, 0.6], [(col - centerCol) * 2, 0]);

  const Icon = skill.icon;

  return (
    <motion.div
      className="group relative flex flex-col justify-center p-5 rounded-2xl border border-white/5 bg-(--surface)/40 hover:bg-surface hover:border-accent/20 backdrop-blur-md transition-all duration-300 w-[300px] h-[120px] shrink-0 overflow-hidden"
      style={{ x, y, scale: scl, opacity: op, rotate: rot }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2.5 rounded-xl bg-white/2 border border-white/5 group-hover:bg-white/5 transition-colors duration-300 shrink-0">
          <Icon
            className="w-6 h-6 transition-all duration-300 group-hover:scale-110"
            style={{ color: skill.color }}
          />
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors duration-300">
            {skill.name}
          </h4>
          <p className="text-[12px] leading-[1.6] text-muted group-hover:text-foreground transition-colors duration-300">
            {skill.desc}
          </p>
        </div>
      </div>
      
      {/* Subtle hover glow layer */}
      <div className="absolute inset-0 bg-(--accent)/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}

/* ── Main About Section ── */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const arsenalRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: rawArsenalProgress } = useScroll({
    target: arsenalRef,
    offset: ["start 0.6", "start 0.1"],
  });
  const arsenalProgress = useSpring(rawArsenalProgress, {
    stiffness: 50,
    damping: 15,
    restDelta: 0.001
  });

  const { scrollYProgress: rawStoryProgress } = useScroll({
    target: storyRef,
    offset: ["start center", "end center"],
  });
  const storyProgress = useSpring(rawStoryProgress, {
    stiffness: 50,
    damping: 15,
    restDelta: 0.001
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Skills data is defined in the SKILLS constant above

  const chapters = [
    {
      number: "Chapter 01",
      title: "The Foundation",
      description: "Started with a deep curiosity for how things work under the hood. From writing my first API to deploying production databases — every line of code was a step toward mastering the full stack.",
      highlight: "From database design to deployment.",
    },
    {
      number: "Chapter 02",
      title: "The Proving Ground",
      description: "1+ year at Daylink Techlabs Pvt. Ltd., building real products that serve real users. SaaS platforms, e-commerce engines, and maritime logistics systems — each one pushing my engineering skills further.",
      highlight: "Shipping code that matters.",
    },
    {
      number: "Chapter 03",
      title: "The Architect's Stack",
      description: "Backend? NestJS + MongoDB + PostgreSQL for bulletproof, scalable APIs. Frontend? Next.js + TypeScript for production-grade interfaces that feel alive. I own features end-to-end in fast-paced Agile teams.",
      highlight: "Full ownership. Zero excuses.",
    },
    {
      number: "Chapter 04",
      title: "The Creative Edge",
      description: "Engineering alone isn't enough. I bring cinematic craft — Framer Motion for fluid animations, Three.js for immersive 3D experiences. The result? Interfaces that don't just work, they captivate.",
      highlight: "Where engineering meets art.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-background overflow-hidden"
    >
      {/* Subtle background glow */}
      <motion.div
        className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-accent/10 rounded-full filter blur-[150px] pointer-events-none"
        style={{ y: bgY }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 py-32 md:py-44">

        {/* ── Section Header ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-24 md:mb-32">
          <div>
            <RevealLine>
              <span className="text-[11px] font-mono text-accent/70 uppercase tracking-[0.25em] mb-5 block">
                01 — About
              </span>
            </RevealLine>

            <RevealLine delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-8">
                I build things<br />
                <span className="text-accent">that scale.</span>
              </h2>
            </RevealLine>

            <RevealLine delay={0.2}>
              <p className="text-lg md:text-xl text-muted max-w-2xl leading-[1.7] font-light">
                Full-Stack Engineer with production experience building SaaS platforms,
                e-commerce systems, and maritime applications. I combine sharp engineering
                fundamentals with cinematic UI craft to deliver experiences that feel{" "}
                <span className="text-foreground font-medium">alive</span>.
              </p>
            </RevealLine>
          </div>
          
          <RevealLine delay={0.3} className="w-full">
            <Showreel className="w-full max-w-full" />
          </RevealLine>
        </div>

        {/* ── Two-Column Layout: Stats + Story ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 lg:gap-24 mb-32">

          {/* Left: Stats Column */}
          <div className="flex flex-col gap-12">
            <RevealLine>
              <div className="border-l-2 border-accent/30 pl-6">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  <Counter value={1} suffix="+" />
                </div>
                <p className="text-sm text-muted uppercase tracking-wider font-mono">Years Production</p>
              </div>
            </RevealLine>

            <RevealLine delay={0.1}>
              <div className="border-l-2 border-accent/30 pl-6">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  <Counter value={10} suffix="+" />
                </div>
                <p className="text-sm text-muted uppercase tracking-wider font-mono">Projects Shipped</p>
              </div>
            </RevealLine>

            <RevealLine delay={0.2}>
              <div className="border-l-2 border-accent/30 pl-6">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  <Counter value={3} />
                </div>
                <p className="text-sm text-muted uppercase tracking-wider font-mono">Industries Served</p>
              </div>
            </RevealLine>

            <RevealLine delay={0.3}>
              <div className="border-l-2 border-accent/30 pl-6">
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  E2E
                </div>
                <p className="text-sm text-muted uppercase tracking-wider font-mono">Feature Ownership</p>
              </div>
            </RevealLine>
          </div>

          {/* Right: Story Timeline */}
          <div ref={storyRef} className="relative">
            {/* The static background line */}
            <div className="absolute left-[5px] top-4 bottom-8 w-[2px] bg-border-strong" />
            
            {/* The glowing progress line */}
            <motion.div 
              className="absolute left-[5px] top-4 bottom-8 w-[2px] bg-accent origin-top shadow-[0_0_15px_var(--accent)] opacity-80 z-10"
              style={{ scaleY: storyProgress }}
            />

            {chapters.map((ch, i) => (
              <ChapterCard key={ch.number} {...ch} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Skills Grid (Full Width, Horizontally Scrollable, 3 Rows) ── */}
      <div ref={arsenalRef} className="w-full pb-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 mb-10">
          <RevealLine>
            <span className="text-[20px] md:text-[26px] font-mono font-bold text-accent uppercase tracking-[0.3em] block">
              <ScrollMatrixText text="THE ARSENAL" progress={arsenalProgress} />
            </span>
          </RevealLine>
        </div>

        {/* The scrolling track */}
        <div 
          className="w-full overflow-x-auto pb-8 px-6 md:px-12 lg:px-24 cursor-grab active:cursor-grabbing snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          <div className="grid grid-rows-3 grid-flow-col gap-4 w-max min-w-full pb-4">
            {SKILLS.map((skill, i) => (
              <div key={skill.name} className="snap-start">
                <ExpandCard skill={skill} index={i} progress={arsenalProgress} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
