"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PROJECTS, createParticles, lerp, easeInOutCubic,
  drawMacBook, drawIPhone, drawParticles, drawVignette,
  drawAccentGlow, drawGrain, drawCursor, drawProgressDots,
  type Particle,
} from "@/lib/projectsCanvas";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Projects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(true);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCountRef = useRef(0);

  const mouseRef = useRef({ x: -100, y: -100 });
  const smoothMouseRef = useRef({ x: -100, y: -100 });
  const smoothTiltRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: -100, y: -100 });

  const [activeProject, setActiveProject] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const activeRef = useRef(0);
  const transitionRef = useRef({
    progress: 1, from: 0, to: 0, startTime: 0,
  });

  // Sync state to ref
  useEffect(() => { activeRef.current = activeProject; }, [activeProject]);

  // Touch detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Image preloading
  useEffect(() => {
    let mounted = true;
    const imgs: (HTMLImageElement | null)[] = [];
    let loaded = 0;
    PROJECTS.forEach((p, i) => {
      const img = new Image();
      img.src = p.screenshot;
      img.onload = () => { imgs[i] = img; loaded++; if (loaded === PROJECTS.length && mounted) { imagesRef.current = imgs; setImagesLoaded(true); } };
      img.onerror = () => { imgs[i] = null; loaded++; if (loaded === PROJECTS.length && mounted) { imagesRef.current = imgs; setImagesLoaded(true); } };
    });
    // Timeout fallback
    const t = setTimeout(() => { if (mounted && !imagesLoaded) { imagesRef.current = imgs; setImagesLoaded(true); } }, 3000);
    return () => { mounted = false; clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Canvas setup + animation loop
  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // CRITICAL: Reset running flag so the loop survives effect re-runs
    runningRef.current = true;

    // Grain canvas
    const gc = document.createElement("canvas");
    gc.width = 200; gc.height = 150;
    grainCanvasRef.current = gc;

    let w = 0, h = 0;
    const dprCap = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dprCap; 
      canvas.height = h * dprCap;
      canvas.style.width = w + "px"; 
      canvas.style.height = h + "px";
      ctx.setTransform(dprCap, 0, 0, dprCap, 0, 0);
      particlesRef.current = createParticles(w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    // Mouse tracking
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", onMove);

    // Scroll tracking for project transitions
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollY = -rect.top;
      const totalScroll = rect.height - window.innerHeight;
      
      if (scrollY >= 0 && scrollY <= totalScroll) {
        const progress = scrollY / totalScroll;
        const maxIndex = PROJECTS.length - 1;
        // Calculate the nearest project based on scroll progress
        let targetIndex = Math.min(maxIndex, Math.max(0, Math.round(progress * maxIndex)));
        
        if (targetIndex !== activeRef.current) {
          transitionRef.current = { 
            progress: 0, 
            from: activeRef.current, 
            to: targetIndex, 
            startTime: performance.now() 
          };
          setActiveProject(targetIndex);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const render = (time: number) => {
      if (!runningRef.current) return;
      frameCountRef.current++;
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = "#0C0B09";
      ctx.fillRect(0, 0, w, h);

      const active = activeRef.current;
      const proj = PROJECTS[active];
      const accent = proj.accent;

      // Smooth mouse
      smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, mouseRef.current.x, 0.08);
      smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, mouseRef.current.y, 0.08);

      // Tilt (sanitized to prevent NaN canvas matrix corruption)
      const rawTiltX = isNaN(w) || w === 0 ? 0 : Math.max(-0.8, Math.min(0.8, (smoothMouseRef.current.x - w / 2) / (w / 2)));
      const rawTiltY = isNaN(h) || h === 0 ? 0 : Math.max(-0.8, Math.min(0.8, (smoothMouseRef.current.y - h / 2) / (h / 2)));
      smoothTiltRef.current.x = lerp(smoothTiltRef.current.x, rawTiltX || 0, 0.06);
      smoothTiltRef.current.y = lerp(smoothTiltRef.current.y, rawTiltY || 0, 0.06);
      const tX = smoothTiltRef.current.x || 0;
      const tY = smoothTiltRef.current.y || 0;

      // Cursor smoothing
      cursorRef.current.x = lerp(cursorRef.current.x, mouseRef.current.x, 0.1);
      cursorRef.current.y = lerp(cursorRef.current.y, mouseRef.current.y, 0.1);

      // Vignette
      drawVignette(ctx, w, h);

      // Device center & dimensions — large and prominent like the reference
      const devCX = w * 0.58;
      const devCY = h * 0.40;
      const devW = Math.min(w * 0.55, 900);
      const phoneW = Math.min(w * 0.065, 80);
      const phoneCX = devCX + devW * 0.56;
      const phoneCY = devCY - devW * 0.08;

      // Accent glow (scaled to match bigger device)
      drawAccentGlow(ctx, devCX, devCY, accent);

      // Particles
      ctx.save();
      drawParticles(ctx, particlesRef.current, w, h, accent, time * 0.001);
      ctx.restore();

      // Simple safe offset instead of complex matrix transform
      const offsetX = tX * -15;
      const offsetY = tY * -25;

      // Transition state
      const tr = transitionRef.current;
      if (tr.progress < 1) {
        const elapsed = (time - tr.startTime) / 450;
        tr.progress = Math.min(1, elapsed);
        const p = easeInOutCubic(tr.progress);

        // Draw outgoing
        ctx.save();
        ctx.translate(devCX + offsetX, devCY + offsetY);
        drawMacBook(ctx, 0, 0, devW, imagesRef.current[tr.from] || null, PROJECTS[tr.from].accent, 1 - p, 1 - p * 0.06);
        ctx.restore();

        // Draw incoming
        ctx.save();
        ctx.translate(devCX + offsetX, devCY + offsetY);
        drawMacBook(ctx, 0, 0, devW, imagesRef.current[tr.to] || null, PROJECTS[tr.to].accent, p, 0.94 + p * 0.06);
        ctx.restore();
      } else {
        // Static draw
        ctx.save();
        ctx.translate(devCX + offsetX, devCY + offsetY);
        drawMacBook(ctx, 0, 0, devW, imagesRef.current[active] || null, accent, 1, 1);
        ctx.restore();
      }

      // iPhone
      const iphoneOffsetX = tX * -8;
      const iphoneOffsetY = tY * -12;
      ctx.save();
      ctx.translate(phoneCX + iphoneOffsetX, phoneCY + iphoneOffsetY);
      drawIPhone(ctx, 0, 0, phoneW, time * 0.001, accent, tX, tY);
      ctx.restore();

      // Film grain (every 5 frames)
      if (frameCountRef.current % 5 === 0 && grainCanvasRef.current) {
        drawGrain(grainCanvasRef.current);
      }
      if (grainCanvasRef.current) {
        ctx.save();
        ctx.globalAlpha = 0.025;
        ctx.drawImage(grainCanvasRef.current, 0, 0, w, h);
        ctx.restore();
      }

      // Progress dots
      ctx.save();
      drawProgressDots(ctx, active, PROJECTS.length, w * 0.05, h * 0.9, accent);
      ctx.restore();

      // Custom cursor (only if mouse is on canvas)
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0 &&
          mouseRef.current.x < w && mouseRef.current.y < h) {
        drawCursor(ctx, cursorRef.current.x, cursorRef.current.y, accent);
      }

      // Loading state — check ref directly so it updates without effect re-run
      const anyImageLoaded = imagesRef.current.some(img => img && img.complete && img.naturalWidth > 0);
      if (!anyImageLoaded) {
        ctx.save();
        ctx.fillStyle = '#77746E';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Loading assets...', w / 2, h - 30);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMove);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const proj = PROJECTS[activeProject];

  // ── MOBILE FALLBACK ──
  if (isMobile) {
    return (
      <section id="projects" className="px-5 py-20" style={{ background: '#0C0B09' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#77746E', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32 }}>
          SELECTED WORK
        </p>
        <div style={{ display: 'grid', gap: 20 }}>
          {PROJECTS.map((p) => (
            <a key={p.num} href={p.link} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block', borderRadius: 16,
                border: `1px solid ${p.accent}33`,
                background: '#131210', padding: 24,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
              }}>
              <div style={{ width: '100%', height: 3, background: p.accent, borderRadius: 2, marginBottom: 16 }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: p.accent }}>{p.num}</span>
              <h3 style={{ color: '#F5F3EE', fontSize: 22, fontWeight: 500, margin: '6px 0 4px', letterSpacing: '-0.03em' }}>{p.name}</h3>
              <p style={{ color: '#77746E', fontSize: 12, margin: '0 0 12px' }}>{p.role}</p>
              <p style={{ color: '#77746E', fontSize: 11, lineHeight: 1.6, marginBottom: 14 }}>{p.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {p.stack.map((s) => (
                  <span key={s} style={{
                    fontSize: 10, fontFamily: 'monospace',
                    border: `1px solid ${p.accent}44`, color: p.accent,
                    padding: '3px 8px', borderRadius: 99,
                  }}>{s}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>
    );
  }

  // ── DESKTOP CANVAS ──
  return (
    <section id="projects" ref={sectionRef} style={{ position: 'relative', height: '500vh' }}>
      {/* Section label (scrolls away) */}
      <p style={{
        fontFamily: 'monospace', fontSize: 10, color: '#77746E',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        padding: '40px 5%', position: 'relative', zIndex: 5,
      }}>
        SELECTED WORK
      </p>

      {/* Sticky container */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Canvas */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'none' }} />
        </div>

        {/* Left info overlay */}
        <div style={{
          position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, pointerEvents: 'none', maxWidth: 320,
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {/* Number */}
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: proj.accent }}>{proj.num}</span>
              {/* Accent line */}
              <div style={{ width: 40, height: 1.5, background: proj.accent, margin: '8px 0' }} />
              {/* Name */}
              <h2 style={{
                fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 500,
                color: '#F5F3EE', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.1,
              }}>{proj.name}</h2>
              {/* Role */}
              <p style={{ fontSize: 13, color: '#77746E', margin: '6px 0 0' }}>{proj.role}</p>
              {/* Year pill */}
              <span style={{
                display: 'inline-block', marginTop: 10,
                fontSize: 10, fontFamily: 'monospace',
                color: proj.accent,
                background: proj.accent + '1A',
                border: `1px solid ${proj.accent}4D`,
                padding: '3px 10px', borderRadius: 99,
              }}>{proj.year}</span>
              {/* Desc */}
              <p style={{
                fontSize: 12, color: '#77746E', maxWidth: 280,
                marginTop: 12, lineHeight: 1.6,
              }}>{proj.desc}</p>
              {/* Stack pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                {proj.stack.map(s => (
                  <span key={s} style={{
                    fontSize: 9, fontFamily: 'monospace', color: '#B8B4AC',
                    border: '1px solid rgba(245,243,238,0.10)',
                    padding: '2px 7px', borderRadius: 99,
                  }}>{s}</span>
                ))}
              </div>
              {/* Scroll hint */}
              <p style={{
                fontSize: 9, fontFamily: 'monospace', color: '#77746E',
                marginTop: 20, letterSpacing: '0.1em',
              }}>SCROLL TO NAVIGATE ↕</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom-right action buttons */}
        <div style={{
          position: 'absolute', bottom: 32, right: '5%', zIndex: 15,
          display: 'flex', gap: 10,
        }}>
          <a href={proj.link} target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: 'monospace', fontSize: 11, color: proj.accent,
              border: `1px solid ${proj.accent}66`,
              padding: '8px 16px', borderRadius: 6,
              textDecoration: 'none', transition: 'all 0.2s',
              background: 'rgba(0,0,0,0.4)',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = proj.accent + '22'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(0,0,0,0.4)'; }}
          >View on GitHub →</a>
          <a href={proj.link} target="_blank" rel="noopener noreferrer"
            style={{
              fontFamily: 'monospace', fontSize: 11, color: proj.accent,
              border: `1px solid ${proj.accent}66`,
              padding: '8px 16px', borderRadius: 6,
              textDecoration: 'none', transition: 'all 0.2s',
              background: 'rgba(0,0,0,0.4)',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = proj.accent + '22'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(0,0,0,0.4)'; }}
          >Live Demo →</a>
        </div>
      </div>
    </section>
  );
}
