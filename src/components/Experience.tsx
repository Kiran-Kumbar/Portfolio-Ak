"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import { Calendar, Box, Star, CheckCircle2 } from "lucide-react";
import { SiNextdotjs, SiNestjs, SiTypescript, SiMongodb, SiPostgresql, SiReact, SiJavascript, SiTailwindcss, SiPython, SiPandas, SiNumpy, SiFramer } from "react-icons/si";

const getStackIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case "next.js": return <SiNextdotjs className="w-5 h-5 text-white" />;
    case "nestjs": return <SiNestjs className="w-5 h-5 text-[#E0234E]" />;
    case "typescript": return <SiTypescript className="w-5 h-5 text-[#3178C6]" />;
    case "mongodb": return <SiMongodb className="w-5 h-5 text-[#47A248]" />;
    case "postgresql": return <SiPostgresql className="w-5 h-5 text-[#336791]" />;
    case "react.js": return <SiReact className="w-5 h-5 text-[#61DAFB]" />;
    case "javascript": return <SiJavascript className="w-5 h-5 text-[#F7DF1E]" />;
    case "css": 
    case "tailwind css":
    case "responsive design": return <SiTailwindcss className="w-5 h-5 text-[#06B6D4]" />;
    case "python": return <SiPython className="w-5 h-5 text-[#3776AB]" />;
    case "pandas": return <SiPandas className="w-5 h-5 text-[#150458]" />;
    case "numpy": return <SiNumpy className="w-5 h-5 text-[#013243]" />;
    case "matplotlib":
    case "seaborn": return <Box className="w-5 h-5 text-[#3B82F6]" />;
    case "framer motion": return <SiFramer className="w-5 h-5 text-[#0055FF]" />;
    default: return <Box className="w-5 h-5 text-[#94A3B8]" />;
  }
};

/* ─── DATA ───────────────────────────────────────────────────────── */
const entries = [
  {
    num: "01",
    role: "Full Stack Engineer",
    company: "Daylink Techlabs Pvt. Ltd.",
    date: "Sep 2025 – Present",
    badge: "Current",
    badgeColor: "blue",
    bullets: [
      "Built scalable SaaS applications end-to-end using Next.js and NestJS.",
      "Developed premium animated UI components and production-ready REST APIs.",
      "Worked with MongoDB and PostgreSQL for complex data workflows.",
      "Focused on reusable architecture, performance, and clean UX.",
    ],
    stack: ["Next.js", "NestJS", "TypeScript", "MongoDB", "PostgreSQL"],
    focus: ["SaaS Architecture", "API Design", "Performance & UX"],
  },
  {
    num: "02",
    role: "Cybersecurity Intern",
    company: "CyberSena Pvt. Ltd.",
    date: "Feb 2025 – May 2025",
    badge: null,
    badgeColor: null,
    bullets: [
      "Analysed network traffic using Wireshark and protocol logs.",
      "Detected anomalies and supported cybersecurity risk assessments.",
      "Performed security testing in controlled lab environments.",
      "Worked with Kali Linux, Nmap, Burp Suite, Metasploit.",
    ],
    stack: ["Network Security", "Vulnerability Assessment", "Traffic Analysis"],
    focus: ["Penetration Testing", "Risk Assessment", "Security Tooling"],
  },
  {
    num: "03",
    role: "MERN Stack Developer Intern",
    company: "BITS, Belagavi",
    date: "Feb 2025 – May 2025",
    badge: null,
    badgeColor: null,
    bullets: [
      "Revamped the company website using React.js.",
      "Improved responsiveness, layout consistency, and user experience.",
      "Built reusable UI components and a clean design system.",
      "Collaborated on frontend implementation and testing.",
    ],
    stack: ["React.js", "JavaScript", "CSS", "Responsive Design"],
    focus: ["Component Architecture", "UI/UX Consistency", "Design Systems"],
  },
  {
    num: "04",
    role: "Internet of Things Intern",
    company: "Dlite",
    date: "Oct 2023 – Nov 2023",
    badge: null,
    badgeColor: null,
    bullets: [
      "Gained hands-on experience in IoT concepts and device connectivity.",
      "Focused on connecting physical devices for seamless data exchange.",
      "Developed foundational skills in IoT architecture and protocols.",
      "Worked on real-time data integration with other systems.",
    ],
    stack: ["IoT Architecture", "Communication Protocols", "Real-time Data"],
    focus: ["Device Connectivity", "Data Integration", "Hardware Concepts"],
  },
  {
    num: "05",
    role: "Data Analyst Intern",
    company: "CoachEd",
    date: "Oct 2022 – Nov 2022",
    badge: null,
    badgeColor: null,
    bullets: [
      "Cleaned and prepared structured datasets using Pandas and NumPy.",
      "Built data visualisations using Matplotlib and Seaborn.",
      "Created summary reports with actionable insights.",
      "Supported data-driven analysis through charts and reporting.",
    ],
    stack: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    focus: ["Data Cleaning", "Visualisation", "Insight Reporting"],
  },
  {
    num: "06",
    role: "Founder & Engineer",
    company: "FreightIQ — Now Building",
    date: "2026",
    badge: "Live",
    badgeColor: "green",
    bullets: [
      "Full-stack logistics SaaS for freight ops, tracking, and digital docs.",
      "AI-powered invoicing, route optimisation, and workflow automation.",
      "Targeting small Indian transport companies.",
    ],
    stack: ["Next.js", "NestJS", "MongoDB", "Framer Motion"],
    focus: ["Product Strategy", "SaaS Architecture", "Logistics Domain"],
  },
];

const NAV = [
  { label: "Daylink Techlabs",   sub: "Full Stack Engineer" },
  { label: "CyberSena Pvt. Ltd.", sub: "Cybersecurity Intern" },
  { label: "BITS, Belagavi",      sub: "MERN Stack Intern" },
  { label: "Dlite",               sub: "IoT Intern" },
  { label: "CoachEd",             sub: "Data Analyst Intern" },
  { label: "Now Building",        sub: "FreightIQ" },
];

/* ─── PAGE CONTENT ───────────────────────────────────────────────── */
function PageContent({ entry, side }: { entry: typeof entries[0]; side: "left" | "right" }) {
  if (side === "left") {
    return (
      <div className="w-full h-full flex flex-col p-8 xl:p-10 overflow-hidden select-none">
        <div className="mb-8 flex-shrink-0">
          <h3 className="text-[20px] font-bold text-foreground tracking-tight mb-2">Technical Details</h3>
          <p className="text-[13px] font-mono text-accent">{entry.company}</p>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col gap-8">
          {/* Tech Stack */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-foreground mb-4">
              <Box className="w-4 h-4 text-accent" />
              <span className="font-semibold text-[14px] tracking-wide">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {entry.stack.map((s) => (
                <div key={s} className="flex flex-col items-center justify-center gap-2 w-16 h-16 rounded-lg border border-accent-soft bg-surface">
                  {getStackIcon(s)}
                  <span className="text-[10px] font-mono text-text-secondary text-center px-1 truncate w-full">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="pt-2 mt-auto">
            <div className="flex items-center gap-2 text-foreground mb-4">
              <Star className="w-4 h-4 text-accent" />
              <span className="font-semibold text-[14px] tracking-wide">What I Focus On</span>
            </div>
            <div className="flex flex-col gap-3">
              {entry.focus.map((f) => (
                <div key={f} className="flex items-center gap-3 text-[13px] text-text-secondary">
                  <span className="text-accent">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8 xl:p-10 overflow-hidden select-none">
      {/* Header */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[13px] font-mono text-accent">{entry.num}</span>
          <div className="h-px w-8 bg-accent-soft" />
          {entry.badge && (
            <span className={`text-[11px] font-mono px-3 py-0.5 rounded-full border ${
              entry.badgeColor === "green"
                ? "border-success/30 text-success"
                : "border-accent/30 text-accent"
            }`}>
              {entry.badge}
            </span>
          )}
        </div>
        <h3 className="text-[26px] xl:text-[32px] font-bold text-foreground leading-tight tracking-tight mb-3">
          {entry.role}
        </h3>
        <div className="flex flex-col gap-2">
          <span className="text-accent font-medium text-[15px]">{entry.company}</span>
          <div className="flex items-center gap-2 text-muted text-[12px] font-mono border border-border-strong rounded-md px-2 py-1 w-fit bg-surface">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            {entry.date}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        {/* Description Bullets */}
        <div className="space-y-4 text-[13.5px] xl:text-[15px] leading-relaxed text-text-secondary">
          {entry.bullets.map((b, i) => (
            <p key={i} className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <span>{b}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── RIGHT PAGE (flipping page) ────────────────────────────────── */
function RightPage({
  entry,
  index,
  total,
  scrollYProgress,
}: {
  entry: typeof entries[0];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = Math.min(1, (index + 1) * seg);
  const mid = (start + end) / 2;
  const quarter = start + seg * 0.25;
  const threeQuarter = start + seg * 0.75;

  // No useSpring — keeps rotation perfectly synced with z-index to prevent overlap
  const rotateY = useTransform(scrollYProgress, [start, end], [0, -180]);

  // Paper curl — gentle bend peaking at 90°
  const rotateX = useTransform(scrollYProgress, [start, quarter, mid, threeQuarter, end], [0, -1.5, -4, -1.5, 0]);
  const skewY = useTransform(scrollYProgress, [start, quarter, mid, threeQuarter, end], [0, -1, -2.5, -1, 0]);

  // Z-index perfectly synced with rotateY (no spring lag)
  const zIndex = useTransform(
    scrollYProgress,
    [0, start, mid - 0.001, mid, mid + 0.001, end, 1],
    [
      total - index + 20,
      total - index + 20,
      total - index + 20,
      total + 50,
      index + 1,
      index + 1,
      index + 1,
    ]
  );

  // === VISUAL CURL EFFECTS ===
  
  // Fold progress: 0 at start → 1 at mid → 0 at end (peaks when page is at 90°)
  const foldIntensity = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  
  // Fold line position — sweeps from right edge to left as page turns
  const foldLineX = useTransform(scrollYProgress, [start, mid], ["100%", "20%"]);
  
  // Light sweep intensity on front
  const frontGlow = useTransform(scrollYProgress, [start, quarter, mid], [0, 0.1, 0.3]);
  
  // Back face shadow — darker when freshly revealed, fades as it settles
  const backDark = useTransform(scrollYProgress, [mid, threeQuarter, end], [0.6, 0.15, 0]);
  
  // Cast shadow — dynamic, peaks at 90°
  const castShadow = useTransform(foldIntensity, (v) => {
    if (v < 0.01) return "none";
    const spread = v * 50;
    const blur = v * 70;
    return `${-spread * 0.7}px ${v * 5}px ${blur}px ${v * 6}px rgba(0,0,0,${v * 0.65})`;
  });

  // Subtle scale lift at peak
  const scale = useTransform(scrollYProgress, [start, mid, end], [1, 1.008, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        rotateY,
        rotateX,
        skewY,
        scale,
        zIndex,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* ── FRONT (current entry) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          background: "var(--color-card)",
          borderRadius: "0 14px 14px 0",
          border: "1px solid var(--color-border-strong)",
          borderLeftColor: "transparent",
        }}
      >
        {/* Paper texture */}
        <div className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <PageContent entry={entry} side="right" />

        {/* === CURL EFFECT: Fold shadow line — sweeps across page === */}
        <motion.div
          className="absolute inset-y-0 pointer-events-none"
          style={{
            right: foldLineX,
            width: "60px",
            opacity: foldIntensity,
            background: "linear-gradient(to right, transparent, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.25) 50%, rgba(245,243,238,0.08) 70%, rgba(245,243,238,0.15) 100%)",
          }}
        />

        {/* === CURL EFFECT: Right edge brightening (paper catching light as it lifts) === */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: frontGlow,
            background: "linear-gradient(105deg, transparent 20%, rgba(245,243,238,0.06) 40%, rgba(245,243,238,0.15) 70%, rgba(245,243,238,0.35) 90%, rgba(245,243,238,0.5) 100%)",
            borderRadius: "0 14px 14px 0",
          }}
        />

        {/* Spine-side crease shadow */}
        <div className="absolute inset-y-0 left-0 w-8 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent)" }} />
      </div>

      {/* ── BACK (turned left face) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "var(--color-surface)",
          borderRadius: "14px 0 0 14px",
          border: "1px solid var(--color-border-strong)",
          borderRightColor: "transparent",
        }}
      >
        <div className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <PageContent entry={entry} side="left" />
        
        {/* === CURL EFFECT: Settling shadow — gradient from spine side === */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ 
            opacity: backDark, 
            borderRadius: "14px 0 0 14px", 
            background: "linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%)" 
          }}
        />

        {/* Spine crease on back */}
        <div className="absolute inset-y-0 right-0 w-8 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(0,0,0,0.4), transparent)" }} />
      </div>

      {/* Cast shadow beneath flipping page */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: castShadow, borderRadius: "0 14px 14px 0" }}
      />
    </motion.div>
  );
}

/* ─── COVER PAGE (Hardcover) ─────────────────────────────────────── */
function CoverPage({ total, scrollYProgress }: { total: number; scrollYProgress: MotionValue<number> }) {
  const index = 0;
  const seg = 1 / total;
  const start = index * seg;
  const end = Math.min(1, (index + 1) * seg);
  const mid = (start + end) / 2;

  const rawRotate = useTransform(scrollYProgress, [start, end], [0, -180]);
  // No spring — perfectly synced with z-index
  const rotateY = rawRotate;

  const zIndex = useTransform(
    scrollYProgress,
    [0, mid - 0.005, mid, mid + 0.005, 1],
    [total + 25, total + 25, total + 55, 1, 1]
  );

  // Cover shadow as it lifts
  const shadowAmt = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  const coverShadow = useTransform(shadowAmt, (v) => {
    const spread = v * 80;
    return `${-spread * 0.5}px 0px ${spread}px ${v * 10}px rgba(0,0,0,${v * 0.8})`;
  });

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        rotateY,
        zIndex,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* ── FRONT OF COVER ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          background: "var(--color-background)",
          borderRadius: "0 14px 14px 0",
          border: "1px solid var(--color-border-strong)",
          borderLeftColor: "transparent",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
           <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mb-6 border border-accent/20">
             <span className="text-accent font-bold text-2xl font-mono">AK</span>
           </div>
           <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">My Journey</h1>
           <p className="text-muted font-mono text-sm tracking-widest uppercase">Portfolio 2026</p>
        </div>
        {/* Spine crease */}
        <div className="absolute inset-y-0 left-0 w-8 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4), transparent)" }} />
      </div>

      {/* ── BACK OF COVER (Inside Left Base) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "var(--color-background)",
          borderRadius: "14px 0 0 14px",
          border: "1px solid var(--color-border-strong)",
          borderRightColor: "transparent",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
           <span className="text-[120px] font-bold text-white font-mono tracking-tighter -rotate-90">AK</span>
        </div>
        <div className="absolute inset-y-0 right-0 w-8 pointer-events-none"
          style={{ background: "linear-gradient(to left,rgba(0,0,0,0.5),transparent)" }} />
      </div>

      {/* Cover cast shadow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: coverShadow, borderRadius: "0 14px 14px 0" }}
      />
    </motion.div>
  );
}

/* ─── STACKED PAGE BACKS (visible thickness) ─────────────────────── */
function PageStack({ total, scrollYProgress }: { total: number; scrollYProgress: MotionValue<number> }) {
  const OFFSETS = [3, 7, 11, 15];
  return (
    <>
      {OFFSETS.map((off, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-r-2xl"
          style={{
            right: `-${off}px`,
            zIndex: 0,
            background: `rgba(26,25,22,${0.9 - i * 0.12})`, /* RGB equivalent of #1A1916 */
            border: "1px solid var(--color-border)",
            boxShadow: "2px 0 8px rgba(0,0,0,0.5)",
          }}
        />
      ))}
    </>
  );
}

/* ─── PROGRESS DOTS ──────────────────────────────────────────────── */
function ProgressDots({ active, total }: { active: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          animate={{
            width: i === active ? 28 : 7,
            height: 7,
            backgroundColor: i === active ? "var(--color-accent)" : "var(--color-accent-soft)",
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────── */
export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = entries.length + 1; // +1 for Cover
  
  // Smooth the horizontal sliding
  const rawBookX = useTransform(scrollYProgress, [0, 1 / total], [-25, 0]);
  const smoothBookX = useSpring(rawBookX, { stiffness: 50, damping: 20 });
  const bookX = useTransform(smoothBookX, (val) => `${val}%`);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Push the state update to the end of the event loop to prevent 
    // "Can't perform a React state update on a component that hasn't mounted yet."
    queueMicrotask(() => {
      const segment = Math.min(total - 1, Math.floor(v * total));
      setActive(Math.max(0, segment - 1)); // Map Cover to 0, then 0 to 0, 1 to 1...
    });
  });

  return (
    <section id="experience" className="bg-background">
      {/* ── RESPONSIVE 3D BOOK EXPERIENCE ── */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${total * 130}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-10 lg:pt-24 lg:pb-10">
          <div className="w-full max-w-[1300px] mx-auto px-4 lg:px-8 xl:px-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 xl:gap-16">

            {/* ── LEFT NAV ── */}
            <div className="w-full lg:w-[240px] xl:w-[270px] flex-shrink-0 space-y-1 text-center lg:text-left flex flex-col items-center lg:items-start">
              <p className="text-[10px] font-mono text-accent tracking-[0.2em] uppercase mb-3 lg:mb-5 flex items-center justify-center lg:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Experience
              </p>
              <h2 className="text-[24px] md:text-[28px] xl:text-[30px] font-bold text-foreground leading-tight tracking-tight mb-4 lg:mb-7">
                My Journey of<br className="hidden lg:block" /> Building &amp;{" "}
                <span className="text-accent">Learning</span>
              </h2>

              <nav className="hidden lg:block space-y-4 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/30 via-accent/10 to-transparent -z-10" />
                {NAV.map((n, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 px-3 py-1.5 cursor-default"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      animate={{
                        backgroundColor: i === active ? "var(--color-accent)" : "var(--color-accent-soft)",
                        scale: i === active ? 1.3 : 1,
                        boxShadow: i === active ? "0 0 12px rgba(200,184,154,0.4)" : "none",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <motion.span
                          className="font-mono text-[12px]"
                          animate={{ color: i === active ? "var(--color-accent)" : "var(--color-muted)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </motion.span>
                        <motion.p
                          className="text-[14.5px] font-medium leading-tight"
                          animate={{ color: i === active ? "var(--color-foreground)" : "var(--color-text-secondary)" }}
                          transition={{ duration: 0.2 }}
                        >
                          {n.label}
                        </motion.p>
                      </div>
                      <p className="text-[12px] text-muted mt-1 ml-7">{n.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </nav>

              {/* Scroll indicator */}
              <div className="pt-4 lg:pt-8 flex items-center justify-center lg:justify-start gap-2.5 text-muted">
                <div className="w-5 h-8 rounded-full border border-border-strong flex items-start justify-center pt-1.5">
                  <motion.div
                    className="w-1 h-1.5 rounded-full bg-text-secondary"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-[11px] font-mono leading-relaxed text-left">
                  Scroll to explore<br />the experience
                </span>
              </div>
            </div>

            {/* ── BOOK ── */}
            <div className="flex-1 w-full flex flex-col items-center justify-center gap-6 lg:gap-7 mt-4 lg:mt-0 overflow-hidden lg:overflow-visible">
              {/* Responsive scaling wrapper */}
              <div className="w-full flex justify-center items-center" 
                   style={{ 
                     transform: "scale(min(1, calc(100vw / 880)))", 
                     transformOrigin: "center center",
                     height: "min(600px, 72vh)",
                   }}>
                {/* Book container */}
                <div
                  style={{
                    width: "820px",
                    height: "min(600px, 72vh)",
                    perspective: "2200px",
                    position: "relative",
                  }}
                >
                  {/* Ambient glow */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-16 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse,rgba(200,184,154,0.15) 0%,transparent 70%)", filter: "blur(16px)" }} />

                  {/* Open book wrapper */}
                  <motion.div
                    className="absolute inset-0 flex"
                    style={{
                      x: bookX,
                      willChange: "transform",
                      filter: "drop-shadow(0 50px 100px rgba(0,0,0,0.7)) drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
                    }}
                  >
                    {/* LEFT SPACE (Transparent, will be filled by the turned Cover) */}
                    <div className="flex-1" />

                    {/* SPINE — Clean Book Crease (Figma-style) */}
                    <div
                      className="relative"
                      style={{
                        width: "10px",
                        flexShrink: 0,
                        zIndex: 500,
                        background: "linear-gradient(to right, #0a0908 0%, #151412 30%, #1a1816 50%, #151412 70%, #0a0908 100%)",
                        boxShadow: "inset 3px 0 8px rgba(0,0,0,0.9), inset -3px 0 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Subtle center highlight — the crease reflection */}
                      <div
                        className="absolute inset-y-0 left-1/2 -translate-x-1/2"
                        style={{
                          width: "1px",
                          background: "linear-gradient(to bottom, transparent 5%, rgba(200,184,154,0.12) 20%, rgba(200,184,154,0.08) 80%, transparent 95%)",
                        }}
                      />
                    </div>

                    {/* RIGHT PAGES (stacked + flipping) */}
                    <div
                      className="flex-1 relative overflow-visible"
                      style={{ perspective: "2200px" }}
                    >
                      {/* Page stack depth effect */}
                      <PageStack total={total} scrollYProgress={scrollYProgress} />

                      {/* RIGHT BASE (Inner Back Cover) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          background: "var(--color-surface)",
                          borderRadius: "0 14px 14px 0",
                          border: "1px solid var(--color-border-strong)",
                          zIndex: 1,
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none p-10 text-center">
                           <span className="text-3xl font-bold text-foreground/20 tracking-tight mb-4">
                             The Journey Continues
                           </span>
                           <div className="w-12 h-px bg-accent/20 mb-4" />
                           <span className="text-[11px] font-mono text-muted tracking-[0.2em] uppercase max-w-[220px] leading-relaxed">
                             Building the future,<br/>one line of code<br/>at a time.
                           </span>
                        </div>
                      </div>

                      {/* Cover Page */}
                      <CoverPage total={total} scrollYProgress={scrollYProgress} />

                      {/* Flipping sheets */}
                      {entries.map((entry, i) => (
                        <RightPage
                          key={entry.num}
                          entry={entry}
                          index={i + 1}
                          total={total}
                          scrollYProgress={scrollYProgress}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Progress + counter */}
              <div className="flex flex-col items-center gap-3">
                <ProgressDots active={active} total={entries.length} />
                <div className="font-mono text-[13px] flex items-center gap-2">
                  <span className="text-foreground font-semibold">{String(active + 1).padStart(2, "0")}</span>
                  <span className="text-muted">/</span>
                  <span className="text-text-secondary">{String(entries.length).padStart(2, "0")}</span>
                </div>
                <p className="text-[11px] text-muted font-mono text-center leading-relaxed">
                  + Each chapter is a part<br />of my professional story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}