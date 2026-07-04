"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500); // wait for exit animation
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-(--background)"
          exit={{ 
            opacity: 0,
            scale: 0.95,
            filter: "blur(5px)" 
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle glowing aura behind the logo */}
          <motion.div
            className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(200,184,154,0.15) 0%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <motion.div
            className="relative flex items-center justify-center"
            initial={{ 
              scale: 1.4, 
              opacity: 0,
              filter: "blur(15px)"
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              filter: "blur(0px)"
            }}
            transition={{ 
              duration: 1.4, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1
            }}
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 20px rgba(200,184,154,0.2))" }}>
              <Image 
                src="/favicon.png" 
                alt="Logo" 
                fill
                priority
                className="object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
