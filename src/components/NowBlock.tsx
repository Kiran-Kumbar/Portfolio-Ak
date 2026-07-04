"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function NowBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-[100px]">
      <motion.div
        ref={ref}
        className="max-w-xl bg-surface rounded-2xl p-6 md:p-8"
        initial={{ y: 20, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="live-dot" />
          <span className="text-xs font-mono uppercase tracking-widest text-muted">
            Now
          </span>
        </div>
        <p className="text-lg font-medium leading-relaxed">
          Currently building{" "}
          <span className="text-accent font-bold">FreightIQ</span>, a
          full-stack logistics platform.
        </p>
      </motion.div>
    </section>
  );
}
