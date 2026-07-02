"use client";

import { motion } from "framer-motion";
import { SiNextdotjs, SiNestjs, SiPostgresql, SiTypescript, SiTailwindcss } from "react-icons/si";

const stack = [
  { id: 'next', icon: SiNextdotjs, label: 'Next.js', color: 'text-white' },
  { id: 'nest', icon: SiNestjs, label: 'NestJS', color: 'text-[#E0234E]' },
  { id: 'postgres', icon: SiPostgresql, label: 'PostgreSQL', color: 'text-[#336791]' },
  { id: 'ts', icon: SiTypescript, label: 'TypeScript', color: 'text-[#3178C6]' },
  { id: 'tailwind', icon: SiTailwindcss, label: 'Tailwind', color: 'text-[#38B2AC]' },
];

export default function TechPillar() {
  return (
    <div className="hidden lg:flex flex-col items-start justify-center relative w-[180px] pl-4">
      
      {/* Dashed background line */}
      <div className="absolute left-[43px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-white/10 -z-10" />

      {/* Flowing current animation (glowing blue line traveling down) */}
      <div className="absolute left-[43px] top-4 bottom-4 w-[2px] overflow-hidden -z-10">
        <motion.div 
          animate={{ y: ["-100%", "500%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/3 bg-gradient-to-b from-transparent via-accent to-transparent opacity-100"
        />
      </div>

      <div className="flex flex-col gap-8 w-full">
        {stack.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 + index * 0.15 }}
              className="flex items-center gap-5 group cursor-default"
            >
              {/* Outer Ring */}
              <div className="w-14 h-14 rounded-full border border-border bg-surface flex items-center justify-center relative shadow-sm group-hover:border-accent group-hover:shadow-[0_0_12px_var(--color-accent-soft)] group-hover:scale-105 transition-all duration-300">
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>

              {/* Text Label */}
              <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-300">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
