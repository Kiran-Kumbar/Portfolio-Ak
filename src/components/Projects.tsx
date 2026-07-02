"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface ProjectData {
  title: string;
  description: string;
  tags: string[];
  year: string;
  caseStudy: {
    problem: string;
    role: string;
    outcome: string;
  };
}

const projects: ProjectData[] = [
  {
    title: "eDealIndia",
    description: "Architected a production-grade, multi-tenant e-commerce and gamification platform featuring live draw ceremonies, animated slot machines, real-time leaderboards, and a jewellery marketplace.",
    tags: ["Next.js 16", "NestJS 11", "TypeScript", "MongoDB", "Redis"],
    year: "2026",
    caseStudy: {
      problem: "Needed a gamified e-commerce platform handling live draw ceremonies with concurrent viewers and real-time leaderboard accuracy.",
      role: "Engineered Lucky Draw and Reward Coin systems with full backend logic, Redis caching, and TanStack Query, cutting redundant API calls. Delivered a cinematic 'Digital Atelier' UI with Framer Motion and Three.js 3D components.",
      outcome: "Improved performance at scale and maintained strict TypeScript type safety across the full stack while delivering a high-end visual experience.",
    },
  },
  {
    title: "InmarServ",
    description: "Engineered full-stack modules for a globally deployed maritime SaaS platform managing end-to-end ship servicing operations and diversion workflows.",
    tags: ["Next.js", "NestJS", "PostgreSQL", "MongoDB"],
    year: "2025",
    caseStudy: {
      problem: "A maritime logistics company needed to digitize and track complex operational workflows, vessel diversion, and ship servicing operations globally.",
      role: "Built REST APIs, real-time dashboards, and secure data pipelines using NestJS, PostgreSQL, and MongoDB. Translated complex operational workflows into intuitive, production-grade interfaces.",
      outcome: "Delivered reliable, scalable features under strict production constraints in a global, mission-critical maritime operations environment.",
    },
  },
  {
    title: "Freight-IQ",
    description: "AI-Powered Logistics SaaS for small and mid-sized Indian transport companies, covering fleet, trip, and freight management workflows.",
    tags: ["TypeScript", "Next.js", "NestJS", "MongoDB"],
    year: "2026",
    caseStudy: {
      problem: "Small to mid-sized Indian transport companies face operational pain points around trip tracking and freight visibility.",
      role: "Designing and building the core platform by applying real-world domain knowledge from the transport industry to shape features.",
      outcome: "Providing an AI-powered logistics platform that optimizes trip, fleet, and freight management workflows.",
    },
  },
  {
    title: "XAU-USD-Signal-Bot",
    description: "Algorithmic XAU/USD (Gold) trading bot applying Smart Money Concepts (SMC), market structure analysis, and Fair Value Gaps (FVG).",
    tags: ["Python", "Telegram API"],
    year: "2026",
    caseStudy: {
      problem: "Needed an automated system to identify high-probability trading setups based on algorithmic logic and Smart Money Concepts.",
      role: "Built an algorithmic trading signal bot utilizing market structure analysis and FVG to find high-probability setups.",
      outcome: "Successfully deployed the bot on Railway for continuous operation, featuring automated signal delivery via Telegram alerts.",
    },
  },
  {
    title: "Lumina Commerce",
    description: "High-end, editorial-style e-commerce interface driven by fluid animations, scroll interactions, and a refined visual design system.",
    tags: ["Next.js", "TypeScript", "Framer Motion"],
    year: "2025",
    caseStudy: {
      problem: "Standard e-commerce sites lack premium editorial feel and motion-first interactive experiences.",
      role: "Focused on motion-first UI patterns using Framer Motion to create a premium, magazine-like browsing experience.",
      outcome: "Built a high-end editorial e-commerce interface with fluid animations and a highly refined visual design system.",
    },
  },
  {
    title: "BioVoting",
    description: "Secure, lightweight biometric voting system with election officer controls, voter registration, and real-time result viewing.",
    tags: ["Python", "Flask", "SQLite"],
    year: "2024",
    caseStudy: {
      problem: "Required a secure and easy-to-use biometric voting system with real-time tracking.",
      role: "Built the core election workflows with an emphasis on data integrity and straightforward officer administration.",
      outcome: "Delivered a lightweight system with secure election officer controls, voter registration, and live result viewing.",
    },
  },
  {
    title: "Stock Market Analyzer",
    description: "Retrieves historical OHLCV data, applying technical indicators and predictive models to forecast stock prices.",
    tags: ["Python", "yfinance", "LSTM", "Matplotlib"],
    year: "2024",
    caseStudy: {
      problem: "Needed to analyze historical stock data and forecast prices using technical indicators and machine learning models.",
      role: "Retrieved and analyzed historical OHLCV data, applying technical indicators and predictive models including Linear Regression and LSTM.",
      outcome: "Successfully simulated trading strategies and visualized model performance metrics.",
    },
  }
];

/* ── Case Study Modal ─────────────────────────────────── */
function CaseStudyModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto bg-background rounded-2xl p-8 md:p-12 z-10"
        initial={{ y: 40, scale: 0.95, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-baseline gap-4 mb-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{project.title}</h2>
          <span className="text-sm font-mono text-muted">{project.year}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium border border-surface px-3 py-1 rounded-full text-muted">{tag}</span>
          ))}
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Problem</h3>
            <p className="text-muted leading-relaxed">{project.caseStudy.problem}</p>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-3">My Role &amp; Approach</h3>
            <p className="text-muted leading-relaxed">{project.caseStudy.role}</p>
          </div>
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-3">Outcome</h3>
            <p className="text-muted leading-relaxed">{project.caseStudy.outcome}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Divider ──────────────────────────────────────────── */
function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="w-full overflow-hidden">
      <motion.div className="h-px bg-surface"
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: EASE }} style={{ transformOrigin: "left" }} />
    </div>
  );
}

/* ── Project Card ─────────────────────────────────────── */
function ProjectCard({ project, index, onOpen }: { project: ProjectData; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovering, setHovering] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const labelX = useSpring(0, { stiffness: 200, damping: 20 });
  const labelY = useSpring(0, { stiffness: 200, damping: 20 });

  useEffect(() => { labelX.set(mouse.x); labelY.set(mouse.y); }, [mouse.x, mouse.y, labelX, labelY]);

  return (
    <>
      <motion.div ref={ref} data-cursor-hover
        className="group relative py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 cursor-pointer"
        initial={{ y: 40, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ duration: 0.7, delay: index * 0.15, ease: EASE }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
        onClick={onOpen}
      >
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-4 mb-4">
            <motion.h3 className="text-3xl md:text-4xl font-bold tracking-tight transition-colors duration-300"
              animate={{ scale: hovering ? 1.02 : 1, color: hovering ? "var(--color-accent)" : "var(--color-foreground)" }}
              transition={{ duration: 0.25 }}>
              {project.title}
            </motion.h3>
            <span className="text-sm font-mono text-muted">{project.year}</span>
          </div>
          <p className="text-lg text-muted mb-6 leading-[1.6]">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, ti) => (
              <motion.span key={tag} className="text-xs font-medium border border-surface text-muted px-3 py-1 rounded-full"
                animate={hovering ? { y: -2 } : { y: 0 }}
                transition={{ delay: ti * 0.03, type: "spring", stiffness: 300, damping: 15 }}>
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
        <motion.div className="hidden md:flex gap-4"
          animate={{ opacity: hovering ? 1 : 0, x: hovering ? 0 : -16 }}
          transition={{ duration: 0.3, ease: EASE }}>
          <div className="w-12 h-12 rounded-full border border-surface flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
            <ExternalLink size={18} />
          </div>
        </motion.div>
      </motion.div>

      {hovering && (
        <motion.div className="fixed top-0 left-0 pointer-events-none z-[100]"
          style={{ x: labelX, y: labelY }}
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}>
          <div className="bg-foreground text-background text-sm font-medium px-4 py-2 rounded-full -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
            View Case Study →
          </div>
        </motion.div>
      )}

      <AnimatedDivider />
    </>
  );
}

export default function Projects() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });
  const [activeProject, setActiveProject] = useState<number | null>(null);

  return (
    <section id="projects" className="px-6 md:px-12 lg:px-24 py-[100px] bg-background">
      <motion.h2 ref={headingRef} className="text-4xl md:text-5xl font-bold tracking-tight mb-16"
        initial={{ y: 30, opacity: 0 }}
        animate={headingInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE }}>
        Selected Work
      </motion.h2>
      <div className="flex flex-col">
        {projects.map((p, i) => (
          <ProjectCard key={i} project={p} index={i} onOpen={() => setActiveProject(i)} />
        ))}
      </div>

      <AnimatePresence>
        {activeProject !== null && (
          <CaseStudyModal project={projects[activeProject]} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
