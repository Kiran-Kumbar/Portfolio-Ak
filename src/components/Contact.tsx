"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const footerInView = useInView(footerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!headlineRef.current) return;

    const ctx = gsap.context(() => {
      const headline = headlineRef.current!;
      const text = headline.textContent || "";
      const words = text.split(" ");
      headline.innerHTML = words
        .map((w) => `<span class="scrub-word" style="display:inline-block;opacity:0.15;margin-right:0.25em;">${w}</span>`)
        .join("");

      gsap.to(headline.querySelectorAll(".scrub-word"), {
        opacity: 1, stagger: 0.1, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "center center", scrub: true },
      });

      gsap.fromTo(subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.7, y: 0, duration: 0.8, ease: "power4.out",
          scrollTrigger: { trigger: subtextRef.current, start: "top 80%", toggleActions: "play none none none" } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Dark contact section — bg near-black, text off-white */}
      <section ref={sectionRef}
        className="px-6 md:px-12 lg:px-24 py-32 w-full flex flex-col items-center justify-center text-center"
        style={{ background: "#0E0E0E", color: "#FAF9F6" }}>
        <h2 ref={headlineRef} className="text-[clamp(2rem,6vw,5rem)] font-bold tracking-tight mb-8">
          Let&apos;s build something exceptional.
        </h2>
        <p ref={subtextRef} className="text-xl opacity-70 mb-12 max-w-2xl">
          Currently open for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
        </p>
        <MagneticButton
          className="bg-transparent text-[#FAF9F6] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white px-8 py-4 text-lg"
        >
          Say Hello
        </MagneticButton>
      </section>

      <motion.footer ref={footerRef}
        className="w-full py-8 text-center text-sm text-[var(--muted)] flex flex-col md:flex-row justify-between px-6 md:px-12 lg:px-24"
        initial={{ opacity: 0 }} animate={footerInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}>
        <span>© {new Date().getFullYear()} Kiran Kumbar.</span>
        <span>Crafted with Next.js &amp; Framer Motion.</span>
      </motion.footer>
    </>
  );
}
