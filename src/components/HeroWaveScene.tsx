"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   Premium Minimal Hero Background
   Inspired by: Apple · Linear · Vercel · Raycast
   
   What this does (and does NOT do):
   ✓ Near-black base (#07090F)
   ✓ Two very soft, blurred gradient orbs (10-15% opacity)
   ✓ Subtle CSS mesh gradient that shifts over 30s
   ✓ ~30 tiny twinkle stars
   ✓ Soft particle field at bottom (30px displacement max, opacity < 8%)
   ✓ Radial mouse glow (180px, 10% opacity)
   ✓ Faint noise texture overlay
   ✗ NO neon colors
   ✗ NO bright glow / bloom
   ✗ NO connecting lines
   ✗ NO visible wave
   ✗ NO additive blending explosions
   ✗ NO cyberpunk
───────────────────────────────────────────── */

/* ── Simplex noise (2D, JS) for particle drift ── */
function createNoise2D() {
  const perm = new Uint8Array(512);
  const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,
    140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,
    0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
    174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,
    158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,
    244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,
    169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,
    217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,
    227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,
    163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,
    113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,
    144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,
    181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,
    205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  for (let i = 0; i < 256; i++) perm[i] = perm[i + 256] = p[i];
  const grad = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
  function dot2(g: number[], x: number, y: number) { return g[0]*x + g[1]*y; }
  return function noise(x: number, y: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const s = (x + y) * F2;
    const i = Math.floor(x + s), j = Math.floor(y + s);
    const t = (i + j) * G2;
    const x0 = x - i + t, y0 = y - j + t;
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2*G2, y2 = y0 - 1 + 2*G2;
    const ii = i & 255, jj = j & 255;
    const gi0 = perm[ii + perm[jj]] % 8;
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 8;
    let n0 = 0, n1 = 0, n2 = 0;
    let t0 = 0.5 - x0*x0 - y0*y0;
    if (t0 >= 0) { t0 *= t0; n0 = t0*t0*dot2(grad[gi0], x0, y0); }
    let t1 = 0.5 - x1*x1 - y1*y1;
    if (t1 >= 0) { t1 *= t1; n1 = t1*t1*dot2(grad[gi1], x1, y1); }
    let t2 = 0.5 - x2*x2 - y2*y2;
    if (t2 >= 0) { t2 *= t2; n2 = t2*t2*dot2(grad[gi2], x2, y2); }
    return 70 * (n0 + n1 + n2);
  };
}

const noise2D = createNoise2D();

/* ── Types ── */
interface Star {
  x: number; y: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  size: number;
}

interface Particle {
  x: number; y: number;
  baseX: number; baseY: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  size: number;
  alpha: number;
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Resize ── */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    const W = () => canvas!.offsetWidth;
    const H = () => canvas!.offsetHeight;

    /* ── Mouse ── */
    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    window.addEventListener("mousemove", onMove);

    /* ── Stars (~30) ── */
    const STAR_COUNT = 32;
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H() * 0.75,
      baseAlpha: 0.12 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.008,
      size: 0.6 + Math.random() * 1.1,
    }));

    /* ── Bottom Particle Field (~80 dots) ── */
    const PARTICLE_COUNT = 80;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => {
      const bx = Math.random() * W();
      const by = H() * 0.55 + Math.random() * H() * 0.45;
      return {
        x: bx, y: by,
        baseX: bx, baseY: by,
        noiseOffsetX: Math.random() * 100,
        noiseOffsetY: Math.random() * 100,
        size: 0.8 + Math.random() * 1.2,
        alpha: 0.03 + Math.random() * 0.05, // always under 8%
      };
    });

    /* ── Gradient orb positions (animate slowly) ── */
    let t = 0;

    function drawFrame() {
      const w = W(), h = H();
      t += 0.00028; // full cycle ~30s

      ctx!.clearRect(0, 0, w, h);

      /* 1. Base fill */
      ctx!.fillStyle = "#0C0B09";
      ctx!.fillRect(0, 0, w, h);

      /* 2. Mesh gradient — two slow-moving orbs, 10-15% opacity */
      const orb1X = w * (0.12 + Math.sin(t * 1.0) * 0.06);
      const orb1Y = h * (0.30 + Math.cos(t * 0.7) * 0.08);
      const orb2X = w * (0.78 + Math.cos(t * 0.8) * 0.06);
      const orb2Y = h * (0.55 + Math.sin(t * 1.1) * 0.07);

      // Orb 1 — Champagne glow
      const g1 = ctx!.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, w * 0.45);
      g1.addColorStop(0,   "rgba(200, 184, 154, 0.13)");
      g1.addColorStop(0.5, "rgba(200, 184, 154, 0.05)");
      g1.addColorStop(1,   "rgba(200, 184, 154, 0.00)");
      ctx!.fillStyle = g1;
      ctx!.fillRect(0, 0, w, h);

      // Orb 2 — Champagne soft
      const g2 = ctx!.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, w * 0.40);
      g2.addColorStop(0,   "rgba(200, 184, 154, 0.11)");
      g2.addColorStop(0.5, "rgba(200, 184, 154, 0.04)");
      g2.addColorStop(1,   "rgba(200, 184, 154, 0.00)");
      ctx!.fillStyle = g2;
      ctx!.fillRect(0, 0, w, h);

      /* 3. Twinkle stars */
      for (const s of stars) {
        const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(t * 600 * s.speed + s.phase));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 184, 154, ${alpha})`;
        ctx!.fill();
      }

      /* 4. Bottom particle field — simplex noise drift, <10px displacement */
      const noiseT = t * 18; // slow time for noise
      for (const p of particles) {
        const nx = noise2D(p.noiseOffsetX + noiseT * 0.4, p.noiseOffsetY) * 8;
        const ny = noise2D(p.noiseOffsetX, p.noiseOffsetY + noiseT * 0.3) * 8;
        // Clamp to max 10px displacement
        const dx = Math.max(-10, Math.min(10, nx));
        const dy = Math.max(-10, Math.min(10, ny));
        p.x = p.baseX + dx;
        p.y = p.baseY + dy;

        // Fade particles near top of field
        const fadeY = Math.max(0, Math.min(1, (p.baseY - h * 0.55) / (h * 0.15)));
        const alpha = p.alpha * fadeY;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 184, 154, ${alpha})`; // muted champagne
        ctx!.fill();
      }

      /* 5. Soft radial mouse glow — 180px, 10% opacity max */
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx > -100) {
        const mg = ctx!.createRadialGradient(mx, my, 0, mx, my, 180);
        mg.addColorStop(0,   "rgba(200, 184, 154, 0.10)");
        mg.addColorStop(0.5, "rgba(200, 184, 154, 0.04)");
        mg.addColorStop(1,   "rgba(200, 184, 154, 0.00)");
        ctx!.fillStyle = mg;
        ctx!.fillRect(0, 0, w, h);
      }

      /* 6. Noise texture overlay — very faint grain */
      // Draw grain via tiny random dots (cheap alternative to SVG filter)
      // Only redraw grain every 3 frames to save perf
      if (Math.floor(t * 3600) % 3 === 0) {
        ctx!.save();
        ctx!.globalAlpha = 0.018;
        for (let i = 0; i < 1200; i++) {
          const gx = Math.random() * w;
          const gy = Math.random() * h;
          const v  = Math.random();
          ctx!.fillStyle = `rgb(${Math.floor(v*255)},${Math.floor(v*255)},${Math.floor(v*255)})`;
          ctx!.fillRect(gx, gy, 1, 1);
        }
        ctx!.restore();
      }

      rafRef.current = requestAnimationFrame(drawFrame);
    }

    drawFrame();

    const ro = new ResizeObserver(() => {
      resize();
      // Re-randomize particle base positions on resize
      for (const p of particles) {
        p.baseX = Math.random() * W();
        p.baseY = H() * 0.55 + Math.random() * H() * 0.45;
        p.x = p.baseX;
        p.y = p.baseY;
      }
      for (const s of stars) {
        s.x = Math.random() * W();
        s.y = Math.random() * H() * 0.75;
      }
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}