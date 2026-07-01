"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface TimelineEntry {
  role: string;
  company: string;
  period: string;
  impact: string;
}

const entries: TimelineEntry[] = [
  {
    role: "FullStack Engineer",
    company: "Daylink Techlabs Pvt. Ltd.",
    period: "Sep 2025 – Present",
    impact: "Engineered scalable SaaS applications end-to-end using Next.js and NestJS. Built premium 3D/animated UI components and designed REST APIs with MongoDB/PostgreSQL.",
  },
  {
    role: "MERN Stack Developer Intern",
    company: "BITS, Belagavi",
    period: "Feb 2025 – May 2025",
    impact: "Revamped company website using React.js, improving responsiveness and UX. Implemented reusable component patterns and maintained a consistent design system.",
  },
];

function TimelineItem({ entry, index }: { entry: TimelineEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 pb-12 last:pb-0"
      initial={{ y: 30, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: EASE }}
    >
      {/* Dot on timeline */}
      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[var(--accent)] border-2 border-[var(--background)]" />

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 mb-1">
        <h3 className="text-lg font-bold">{entry.role}</h3>
        <span className="text-sm text-[var(--muted)] font-mono">{entry.company}</span>
      </div>
      <span className="text-xs text-[var(--muted)] font-mono mb-2 block">{entry.period}</span>
      <p className="text-[var(--muted)] leading-relaxed">{entry.impact}</p>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });

  // Scroll progress for the timeline line draw
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="px-6 md:px-12 lg:px-24 py-[100px]">
      <div ref={headingRef}>
        <motion.h2
          className="text-4xl md:text-5xl font-bold tracking-tight mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={headingInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Experience
        </motion.h2>
      </div>

      <div ref={containerRef} className="relative max-w-2xl">
        {/* Animated vertical line */}
        <div className="absolute left-[5px] top-0 bottom-0 w-px bg-[var(--surface)]">
          <motion.div
            className="w-full bg-[var(--muted)] origin-top"
            style={{ height: lineHeight }}
          />
        </div>

        {entries.map((entry, i) => (
          <TimelineItem key={i} entry={entry} index={i} />
        ))}
      </div>
    </section>
  );
}
