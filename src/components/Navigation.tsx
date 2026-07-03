"use client";

import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const DownloadIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Handle background styling
      setScrolled(currentScrollY > 50);

      // Handle visibility (hide on scroll down, show on scroll up)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true);  // Scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled ? "py-4 bg-background/80 backdrop-blur-md border-b border-border" : "py-8 bg-transparent"
    } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="px-6 md:px-12 lg:px-24 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tighter text-foreground z-[60]">
          KK<span className="text-accent">.</span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Desktop Nav: Full Text & Icons */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-6 pr-6 border-r border-slate-700">
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#experience" className="hover:text-blue-400 transition-colors">Experience</a>
              <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
            </div>
            
            <a href="https://github.com/Kiran-Kumbar" target="_blank" rel="noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-2">
              <GithubIcon size={16} /> GitHub
            </a>
            <a href="https://linkedin.com/in/kiran-kumbar" target="_blank" rel="noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-2">
              <LinkedinIcon size={16} /> LinkedIn
            </a>
            <a href="/Kiran_Kumbar_Resume.pdf" download="Kiran_Kumbar_Resume.pdf" target="_blank" rel="noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-2">
              <DownloadIcon size={16} /> Resume
            </a>
          </div>

          {/* Mobile Nav: Icons Only */}
          <div className="flex md:hidden items-center gap-4 text-slate-300">
            <a href="https://github.com/Kiran-Kumbar" target="_blank" rel="noreferrer"
              className="hover:text-blue-400 transition-colors">
              <GithubIcon size={18} />
            </a>
            <a href="https://linkedin.com/in/kiran-kumbar" target="_blank" rel="noreferrer"
              className="hover:text-blue-400 transition-colors">
              <LinkedinIcon size={18} />
            </a>
            <a href="/Kiran_Kumbar_Resume.pdf" download="Kiran_Kumbar_Resume.pdf" target="_blank" rel="noreferrer"
              className="hover:text-blue-400 transition-colors">
              <DownloadIcon size={18} />
            </a>
          </div>

          {/* Contact Button */}
          <MagneticButton onClick={() => window.location.href = "mailto:kirankumbar3703@gmail.com"}>
            Contact
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
}
