"use client";

import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distX = e.clientX - (rect.left + rect.width / 2);
      const distY = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(distX * distX + distY * distY);
      if (dist < 60) {
        const pull = (1 - dist / 60) * 8;
        const angle = Math.atan2(distY, distX);
        x.set(Math.cos(angle) * pull);
        y.set(Math.sin(angle) * pull);
      } else {
        x.set(distX * 0.15);
        y.set(distY * 0.15);
      }
    }, [x, y]
  );

  const reset = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.button ref={ref}
      onMouseMove={handleMouse} onMouseLeave={reset} onClick={onClick}
      style={{ x: smoothX, y: smoothY }}
      className={`relative px-6 py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] font-medium text-sm transition-colors hover:bg-[var(--accent)] ${className}`}>
      {children}
    </motion.button>
  );
}
