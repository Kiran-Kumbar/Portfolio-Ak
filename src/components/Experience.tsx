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
      "Also exploring algorithmic GBP/JPY trading with Smart Money Concepts.",
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
          <h3 className="text-[20px] font-bold text-[#F8FAFC] tracking-tight mb-2">Technical Details</h3>
          <p className="text-[13px] font-mono text-[#3B82F6]">{entry.company}</p>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col gap-8">
          {/* Tech Stack */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-[#F8FAFC] mb-4">
              <Box className="w-4 h-4 text-[#3B82F6]" />
              <span className="font-semibold text-[14px] tracking-wide">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {entry.stack.map((s) => (
                <div key={s} className="flex flex-col items-center justify-center gap-2 w-16 h-16 rounded-lg border border-[#94A3B8]/10 bg-[#0A1020]/50">
                  {getStackIcon(s)}
                  <span className="text-[10px] font-mono text-[#94A3B8] text-center px-1 truncate w-full">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div className="pt-2 mt-auto">
            <div className="flex items-center gap-2 text-[#F8FAFC] mb-4">
              <Star className="w-4 h-4 text-[#3B82F6]" />
              <span className="font-semibold text-[14px] tracking-wide">What I Focus On</span>
            </div>
            <div className="flex flex-col gap-3">
              {entry.focus.map((f) => (
                <div key={f} className="flex items-center gap-3 text-[13px] text-[#94A3B8]">
                  <span className="text-[#3B82F6]">✓</span>
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
          <span className="text-[13px] font-mono text-[#3B82F6]">{entry.num}</span>
          <div className="h-px w-8 bg-[#3B82F6]/50" />
          {entry.badge && (
            <span className={`text-[11px] font-mono px-3 py-0.5 rounded-full border ${
              entry.badgeColor === "green"
                ? "border-emerald-500/30 text-emerald-400"
                : "border-blue-500/30 text-blue-400"
            }`}>
              {entry.badge}
            </span>
          )}
        </div>
        <h3 className="text-[26px] xl:text-[32px] font-bold text-[#F8FAFC] leading-tight tracking-tight mb-3">
          {entry.role}
        </h3>
        <div className="flex flex-col gap-2">
          <span className="text-[#3B82F6] font-medium text-[15px]">{entry.company}</span>
          <div className="flex items-center gap-2 text-[#94A3B8] text-[12px] font-mono border border-[#94A3B8]/20 rounded-md px-2 py-1 w-fit bg-[#0A1020]">
            <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
            {entry.date}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        {/* Description Bullets */}
        <div className="space-y-4 text-[13.5px] xl:text-[15px] leading-relaxed text-[#94A3B8]">
          {entry.bullets.map((b, i) => (
            <p key={i} className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
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

  const rawRotate = useTransform(scrollYProgress, [start, end], [0, -180]);
  const rotateY = useSpring(rawRotate, { stiffness: 60, damping: 18, mass: 0.6 });

  // Floppy curl effect during turn
  const rotateX = useTransform(scrollYProgress, [start, mid, end], [0, -5, 0]);
  const skewY = useTransform(scrollYProgress, [start, mid, end], [0, -3, 0]);

  const zIndex = useTransform(
    scrollYProgress,
    [0, mid - 0.001, mid, 1],
    [total - index + 20, total - index + 20, index + 1, index + 1]
  );

  // Light sweep on front as it starts to turn
  const frontGlow = useTransform(scrollYProgress, [start, start + seg * 0.25, mid], [0, 0.12, 0.22]);
  // Back face darkens when freshly revealed, lightens as it settles
  const backDark = useTransform(scrollYProgress, [mid, end], [0.65, 0]);
  // Cast shadow intensity peaks at 90deg
  const shadowAmt = useTransform(scrollYProgress, [start, mid, end], [0, 1, 0]);
  const shadowStr = useTransform(shadowAmt, [0, 1], [
    "none",
    "-35px 0px 50px 5px rgba(0,0,0,0.75), -15px 0px 20px 2px rgba(0,0,0,0.5)",
  ]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        rotateY,
        rotateX,
        skewY,
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
          background: "linear-gradient(160deg, #0D1829 0%, #0A1020 60%, #0D1526 100%)",
          borderRadius: "0 16px 16px 0",
          borderLeft: "none",
          border: "1px solid rgba(148,163,210,0.08)",
          borderLeftColor: "transparent",
        }}
      >
        {/* Subtle dot texture */}
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <PageContent entry={entry} side="right" />

        {/* Light sweep overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: frontGlow,
            background: "linear-gradient(to left, rgba(255,255,255,0.18) 0%, rgba(180,200,255,0.06) 35%, transparent 65%)",
            borderRadius: "0 16px 16px 0",
          }}
        />
        {/* Left spine shadow on front */}
        <div className="absolute inset-y-0 left-0 w-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.45), transparent)" }} />
      </div>

      {/* ── BACK (turned left face) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(160deg, #0A1020 0%, #080E1C 100%)",
          borderRadius: "16px 0 0 16px",
          border: "1px solid rgba(148,163,210,0.06)",
          borderRightColor: "transparent",
        }}
      >
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

        <PageContent entry={entry} side="left" />
        
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: backDark, borderRadius: "16px 0 0 16px" }}
        />
        <div className="absolute inset-y-0 right-0 w-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(0,0,0,0.5), transparent)" }} />
      </div>

      {/* Cast shadow on pages beneath */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: shadowStr, borderRadius: "0 16px 16px 0" }}
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
  const rotateY = useSpring(rawRotate, { stiffness: 60, damping: 18, mass: 0.6 });

  // No floppy curl for hardcover
  const rotateX = 0;
  const skewY = 0;

  const zIndex = useTransform(
    scrollYProgress,
    [0, mid - 0.001, mid, 1],
    [total + 20, total + 20, 1, 1]
  );

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        rotateY,
        rotateX,
        skewY,
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
          background: "linear-gradient(135deg, #05070F 0%, #0A1020 100%)",
          borderRadius: "0 16px 16px 0",
          border: "1px solid rgba(59,130,246,0.15)",
          borderLeftColor: "transparent",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
           <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-6 border border-[#3B82F6]/20">
             <span className="text-[#3B82F6] font-bold text-2xl font-mono">AK</span>
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight mb-2">My Journey</h1>
           <p className="text-[#94A3B8] font-mono text-sm tracking-widest uppercase">Portfolio 2026</p>
        </div>
      </div>

      {/* ── BACK OF COVER (Inside Left Base) ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(160deg, #0A1020 0%, #080E1C 100%)",
          borderRadius: "16px 0 0 16px",
          border: "1px solid rgba(148,163,210,0.08)",
          borderRightColor: "transparent",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
           <span className="text-[120px] font-bold text-white font-mono tracking-tighter -rotate-90">AK</span>
        </div>
        <div className="absolute inset-y-0 right-0 w-10 pointer-events-none"
          style={{ background: "linear-gradient(to left,rgba(0,0,0,0.6),transparent)" }} />
      </div>
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
            background: `rgba(10,14,30,${0.9 - i * 0.12})`,
            border: "1px solid rgba(148,163,210,0.06)",
            boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
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
            backgroundColor: i === active ? "#3B82F6" : "rgba(148,163,210,0.2)",
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
    const segment = Math.min(total - 1, Math.floor(v * total));
    setActive(Math.max(0, segment - 1)); // Map Cover to 0, then 0 to 0, 1 to 1...
  });

  return (
    <section id="experience" className="bg-[#07090F]">
      {/* ── MOBILE ── */}
      <div className="block lg:hidden px-5 py-20 space-y-5">
        <div className="mb-10">
          <p className="text-[10px] font-mono text-[#3B82F6] tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> Experience
          </p>
          <h2 className="text-3xl font-bold text-[#F8FAFC] tracking-tight">
            My Journey of<br />Building &amp; <span className="text-[#3B82F6]">Learning</span>
          </h2>
        </div>
        {entries.map((e) => (
          <div key={e.num} className="rounded-2xl border border-[#94A3B8]/10 overflow-hidden flex flex-col"
            style={{ background: "linear-gradient(135deg,#0D1526,#0A1020)" }}>
            <PageContent entry={e} side="right" />
            <div className="border-t border-[#94A3B8]/10 w-full" />
            <PageContent entry={e} side="left" />
          </div>
        ))}
      </div>

      {/* ── DESKTOP ── */}
      <div
        ref={containerRef}
        className="hidden lg:block relative"
        style={{ height: `${total * 130}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-24 pb-10">
          <div className="w-full max-w-[1300px] mx-auto px-8 xl:px-12 flex items-center gap-10 xl:gap-16">

            {/* ── LEFT NAV ── */}
            <div className="w-[240px] xl:w-[270px] flex-shrink-0 space-y-1">
              <p className="text-[10px] font-mono text-[#3B82F6] tracking-[0.2em] uppercase mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" /> Experience
              </p>
              <h2 className="text-[26px] xl:text-[30px] font-bold text-[#F8FAFC] leading-tight tracking-tight mb-7">
                My Journey of<br />Building &amp;{" "}
                <span className="text-[#3B82F6]">Learning</span>
              </h2>

              <nav className="space-y-4 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-[#3B82F6]/30 via-[#3B82F6]/10 to-transparent -z-10" />
                {NAV.map((n, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 px-3 py-1.5 cursor-default"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      animate={{
                        backgroundColor: i === active ? "#3B82F6" : "rgba(148,163,210,0.2)",
                        scale: i === active ? 1.3 : 1,
                        boxShadow: i === active ? "0 0 12px rgba(59,130,246,0.6)" : "none",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <motion.span
                          className="font-mono text-[12px]"
                          animate={{ color: i === active ? "#3B82F6" : "#475569" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </motion.span>
                        <motion.p
                          className="text-[14.5px] font-medium leading-tight"
                          animate={{ color: i === active ? "#F8FAFC" : "#64748B" }}
                          transition={{ duration: 0.2 }}
                        >
                          {n.label}
                        </motion.p>
                      </div>
                      <p className="text-[12px] text-[#334155] mt-1 ml-7">{n.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </nav>

              {/* Scroll indicator */}
              <div className="pt-8 flex items-center gap-2.5 text-[#334155]">
                <div className="w-5 h-8 rounded-full border border-[#334155]/50 flex items-start justify-center pt-1.5">
                  <motion.div
                    className="w-1 h-1.5 rounded-full bg-[#475569]"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-[11px] font-mono leading-relaxed">
                  Scroll to explore<br />the experience
                </span>
              </div>
            </div>

            {/* ── BOOK ── */}
            <div className="flex-1 flex flex-col items-center gap-7">
              {/* Book container */}
              <div
                style={{
                  width: "min(820px, 100%)",
                  height: "min(600px, 72vh)",
                  perspective: "2200px",
                  position: "relative",
                }}
              >
                {/* Ambient glow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-16 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse,rgba(59,130,246,0.18) 0%,transparent 70%)", filter: "blur(16px)" }} />

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

                  {/* SPINE */}
                  <div
                    style={{
                      width: "8px",
                      flexShrink: 0,
                      background: "linear-gradient(to right,#030509,#0D1526,#030509)",
                      boxShadow: "inset -2px 0 6px rgba(0,0,0,0.9), inset 2px 0 6px rgba(0,0,0,0.9)",
                      zIndex: 500,
                    }}
                  />

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
                        background: "linear-gradient(160deg,#0D1829,#0A1020)",
                        borderRadius: "0 16px 16px 0",
                        border: "1px solid rgba(148,163,210,0.08)",
                        zIndex: 1,
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none p-10 text-center">
                         <span className="text-3xl font-bold text-[#F8FAFC]/20 tracking-tight mb-4">
                           The Journey Continues
                         </span>
                         <div className="w-12 h-px bg-[#3B82F6]/20 mb-4" />
                         <span className="text-[11px] font-mono text-[#94A3B8]/30 tracking-[0.2em] uppercase max-w-[220px] leading-relaxed">
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

              {/* Progress + counter */}
              <div className="flex flex-col items-center gap-3">
                <ProgressDots active={active} total={entries.length} />
                <div className="font-mono text-[13px] flex items-center gap-2">
                  <span className="text-[#F8FAFC] font-semibold">{String(active + 1).padStart(2, "0")}</span>
                  <span className="text-[#334155]">/</span>
                  <span className="text-[#475569]">{String(entries.length).padStart(2, "0")}</span>
                </div>
                <p className="text-[11px] text-[#334155] font-mono text-center leading-relaxed">
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