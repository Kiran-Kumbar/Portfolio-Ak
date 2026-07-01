"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function TiltPill({ skill }: { skill: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const smoothRX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const smoothRY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 8);
    rotateX.set(-((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 8);
  };
  const onLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.div ref={ref}
      className="skill-pill text-sm font-medium border border-[var(--surface)] text-[var(--foreground)] py-3 px-4 rounded-xl flex items-center justify-center cursor-default select-none hover:border-[var(--accent)] transition-colors duration-300"
      style={{ perspective: 600, rotateX: smoothRX, rotateY: smoothRY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >{skill}</motion.div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const kkY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: containerRef.current, start: "top top", end: "bottom bottom", pin: visualRef.current, pinSpacing: false });
      gsap.set(".skill-pill", { opacity: 0, y: 15 });
      gsap.to(".skill-pill", { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power4.out", scrollTrigger: { trigger: ".skills-grid", start: "top 80%", toggleActions: "play none none none" } });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const skills = [
    "Next.js", "React.js", "TypeScript", "JavaScript", "Tailwind CSS", "Framer Motion", "Three.js", "React Three Fiber",
    "Node.js", "NestJS", "REST APIs", "WebSockets", "MongoDB", "PostgreSQL", "Redis", "MySQL",
    "Python", "SQL", "Pandas", "LSTM", "Git", "Vercel"
  ];

  return (
    <section ref={containerRef} className="relative w-full px-6 md:px-12 lg:px-24 py-[100px] flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-1/2 min-h-screen pt-32">
        <div ref={headingRef}>
          <motion.h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8"
            initial={{ y: 30, opacity: 0 }} animate={headingInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}>The Process &amp; Tech</motion.h2>
          <motion.p className="text-lg text-[var(--muted)] mb-6 leading-[1.6]"
            initial={{ y: 20, opacity: 0 }} animate={headingInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}>
            With 1+ year of production experience building SaaS platforms, e-commerce systems, and maritime applications at Daylink Techlabs, I specialize in owning features end-to-end.
          </motion.p>
          <motion.p className="text-lg text-[var(--muted)] mb-12 leading-[1.6]"
            initial={{ y: 20, opacity: 0 }} animate={headingInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}>
            I combine a sharp eye for UI aesthetics with solid full-stack engineering fundamentals to deliver cinematic digital experiences.
          </motion.p>
        </div>
        <div className="skills-grid grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((s) => <TiltPill key={s} skill={s} />)}
        </div>
      </div>
      <div className="hidden md:flex w-full md:w-1/2 h-screen items-center justify-center pointer-events-none relative" style={{ zIndex: -1 }}>
        <motion.div ref={visualRef} className="w-64 h-64 bg-[var(--surface)] rounded-3xl flex items-center justify-center relative overflow-hidden" style={{ y: kkY }}>
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at center, var(--accent) 0%, transparent 70%)" }} />
          <motion.span className="text-8xl font-bold opacity-10"
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}>KK</motion.span>
        </motion.div>
      </div>
    </section>
  );
}
