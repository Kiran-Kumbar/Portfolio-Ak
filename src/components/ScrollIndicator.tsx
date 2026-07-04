"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <span className="text-xs font-mono uppercase tracking-widest opacity-40">
        Scroll
      </span>
      <motion.div
        className="w-px h-8 bg-foreground origin-top"
        animate={{ scaleY: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.5, 1],
        }}
      />
    </motion.div>
  );
}
