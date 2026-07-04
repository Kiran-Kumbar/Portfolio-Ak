"use client";

import React, { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PALETTE = {
  bg: "#0B0B0B",
  primary: "#F5F3EE",
  secondary: "#B8B4AC",
  muted: "#77746E",
  accent: "#C8B89A",
  success: "#8FA58A",
  danger: "#B66A62",
};

export default function Showreel({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef({ val: 0 }); // 0 to 6
  
  const timeOffsetRef = useRef(0);
  const isHoveringRef = useRef(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const nextScene = useCallback(() => {
    timeOffsetRef.current += 3000;
  }, []);

  const prevScene = useCallback(() => {
    timeOffsetRef.current -= 3000;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    isHoveringRef.current = true;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 25);
    setRotateY(x / 25);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    setRotateX(0);
    setRotateY(0);
  };
  
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    
    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width || window.innerWidth);
      height = Math.max(1, rect.height || 400); // default height if needed
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    
    // Initial resize needs a slight delay to ensure container is laid out
    setTimeout(resize, 0);
    window.addEventListener("resize", resize);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let startTime = performance.now();
    let grainTime = 0;
    
    // State for transitions
    const sceneOpacities = [1, 0, 0, 0, 0, 0, 0];
    
    // DB Scene state
    const dbRows: any[] = [];
    for (let i = 0; i < 20; i++) {
      dbRows.push({
        op: ["INSERT", "UPDATE", "SELECT", "DELETE", "CACHE"][Math.floor(Math.random() * 5)],
        col: ["users", "orders", "sessions", "products", "logs"][Math.floor(Math.random() * 5)],
        lat: Math.floor(Math.random() * 150) + 10,
        yOffset: i * 40
      });
    }

    // Tech Constellation state
    const techNodes = [
      { name: "Next.js", r: 40, x: 0.5, y: 0.5, type: "center" },
      { name: "NestJS", r: 25, x: 0.3, y: 0.3, type: "orbit" },
      { name: "TypeScript", r: 25, x: 0.7, y: 0.3, type: "orbit" },
      { name: "MongoDB", r: 25, x: 0.8, y: 0.6, type: "orbit" },
      { name: "PostgreSQL", r: 25, x: 0.2, y: 0.6, type: "orbit" },
      { name: "Redis", r: 20, x: 0.35, y: 0.8, type: "orbit" },
      { name: "Docker", r: 25, x: 0.65, y: 0.8, type: "orbit" },
      { name: "Framer Motion", r: 20, x: 0.15, y: 0.45, type: "orbit" },
      { name: "Tailwind", r: 20, x: 0.85, y: 0.45, type: "orbit" },
      { name: "Vercel", r: 25, x: 0.5, y: 0.15, type: "orbit" },
    ];
    
    // Network Scene packets
    const packets = Array.from({ length: 15 }).map(() => ({
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      from: Math.floor(Math.random() * 8),
      to: Math.floor(Math.random() * 8)
    }));

    // 3D Sphere Points
    const numPoints = 120;
    const spherePoints: {x: number, y: number, z: number}[] = [];
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      spherePoints.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi)
      });
    }

    const render = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      if (isHoveringRef.current) {
        timeOffsetRef.current -= dt;
      }
      
      const elapsed = time - startTime + timeOffsetRef.current;
      const totalDuration = 21000; // 3 seconds per scene
      
      // Ensure positive modulo math
      let safeElapsed = elapsed % totalDuration;
      if (safeElapsed < 0) safeElapsed += totalDuration;
      
      let autoProgress = safeElapsed / totalDuration;
      progressRef.current.val = autoProgress * 6.99;
      
      const scrollProgress = progressRef.current.val;
      const activeScene = Math.min(6, Math.max(0, Math.floor(scrollProgress)));
      
      // Update opacities smoothly (0.4s ease approx)
      const transitionSpeed = prefersReducedMotion ? 1 : dt * 0.005;
      for (let i = 0; i < 7; i++) {
        const target = i === activeScene ? 1 : 0;
        sceneOpacities[i] += (target - sceneOpacities[i]) * transitionSpeed;
      }

      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, width, height);

      // Render Scenes
      if (sceneOpacities[0] > 0.01) renderScene1(ctx, width, height, scrollProgress, sceneOpacities[0]);
      if (sceneOpacities[1] > 0.01) renderScene2(ctx, width, height, scrollProgress - 1, sceneOpacities[1]);
      if (sceneOpacities[2] > 0.01) renderScene3(ctx, width, height, elapsed, sceneOpacities[2]);
      if (sceneOpacities[3] > 0.01) renderScene4(ctx, width, height, elapsed, sceneOpacities[3], packets);
      if (sceneOpacities[4] > 0.01) renderScene5(ctx, width, height, elapsed, sceneOpacities[4], dbRows);
      if (sceneOpacities[5] > 0.01) renderScene6(ctx, width, height, elapsed, scrollProgress - 5, sceneOpacities[5], techNodes);
      if (sceneOpacities[6] > 0.01) renderScene7(ctx, width, height, scrollProgress - 6, sceneOpacities[6], elapsed, spherePoints);

      // Global Film Grain
      grainTime += dt;
      if (grainTime > 80 || prefersReducedMotion) {
        grainTime = 0;
        drawGrain(ctx, width, height);
      }

      // HUD
      drawHUD(ctx, width, height, activeScene);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, { scope: containerRef });

  return (
    <div className={`relative w-full h-[400px] lg:h-[500px] flex items-center group ${className}`}>
      
      <button 
        onClick={prevScene} 
        className="absolute left-[-15px] md:left-[-24px] z-30 w-10 h-10 bg-[#1A1916] text-foreground rounded-full border border-border-strong flex items-center justify-center hover:bg-accent hover:text-[#0B0B0B] hover:scale-110 transition-all shadow-xl"
        aria-label="Previous scene"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <div 
        className="relative w-full h-full overflow-hidden rounded-2xl border border-border-strong shadow-2xl transition-transform duration-300 ease-out will-change-transform"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          ref={containerRef} 
          className="relative w-full h-full bg-background transition-transform duration-200 ease-out will-change-transform origin-center"
          style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)` }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
        </div>
      </div>

      <button 
        onClick={nextScene} 
        className="absolute right-[-15px] md:right-[-24px] z-30 w-10 h-10 bg-[#1A1916] text-foreground rounded-full border border-border-strong flex items-center justify-center hover:bg-accent hover:text-[#0B0B0B] hover:scale-110 transition-all shadow-xl"
        aria-label="Next scene"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}

// Helpers
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawGrain(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const gw = Math.max(1, Math.floor(w / 2));
  const gh = Math.max(1, Math.floor(h / 2));
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = gw;
  grainCanvas.height = gh;
  const gctx = grainCanvas.getContext("2d");
  if (!gctx) return;
  
  const idata = gctx.createImageData(gw, gh);
  const buffer32 = new Uint32Array(idata.data.buffer);
  const len = buffer32.length;
  for (let i = 0; i < len; i++) {
    if (Math.random() < 0.1) {
      buffer32[i] = 0x05ffffff; // ~3% white
    }
  }
  gctx.putImageData(idata, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.drawImage(grainCanvas, 0, 0, w, h);
  ctx.restore();
}

function drawHUD(ctx: CanvasRenderingContext2D, w: number, h: number, activeScene: number) {
  ctx.save();
  ctx.fillStyle = PALETTE.secondary;
  ctx.font = "12px var(--font-mono), monospace";
  ctx.textAlign = "left";
  
  const scenes = ["CODING", "BUILD PIPELINE", "SERVER RACK", "GLOBAL NETWORK", "DATABASE", "TECH CONSTELLATION", "CLOSING"];
  ctx.fillText(scenes[activeScene], 40, h - 40);
  
  ctx.textAlign = "right";
  ctx.fillText(`0${activeScene + 1}/07`, w - 40, h - 40);
  
  // Progress dots
  const dotW = 6;
  const activeDotW = 24;
  const gap = 8;
  const totalW = (6 * dotW) + activeDotW + (6 * gap);
  let startX = w / 2 - totalW / 2;
  
  for (let i = 0; i < 7; i++) {
    const isActive = i === activeScene;
    ctx.fillStyle = isActive ? PALETTE.accent : PALETTE.muted;
    const currentW = isActive ? activeDotW : dotW;
    roundRect(ctx, startX, h - 45, currentW, 6, 3);
    ctx.fill();
    startX += currentW + gap;
  }
  ctx.restore();
}

function draw3DCore(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, points: {x:number, y:number, z:number}[]) {
  ctx.save();
  ctx.translate(w / 2, h / 2);
  const radius = Math.min(w, h) * 0.45; // Maximize size
  const rotationY = time * 0.0003;
  const rotationX = time * 0.00015;
  const cameraZ = radius * 3;
  
  const projected = [];
  for(let i=0; i<points.length; i++) {
    const p = points[i];
    const x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
    const z1 = p.x * Math.sin(rotationY) + p.z * Math.cos(rotationY);
    const y1 = p.y;
    
    const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
    const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);
    const x2 = x1;
    
    const perspective = cameraZ / (cameraZ + z2 * radius);
    const px = x2 * radius * perspective;
    const py = y2 * radius * perspective;
    
    if (isFinite(px) && isFinite(py)) {
      projected.push({x: px, y: py, z: z2, p: perspective});
    }
  }
  
  // Connections (Dynamic distance scaling based on screen size)
  ctx.strokeStyle = "rgba(200, 184, 154, 0.25)"; 
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const maxDistSq = Math.pow(radius * 0.35, 2); // Connect nodes that are within 35% of the radius
  for(let i=0; i<projected.length; i++) {
    for(let j=i+1; j<projected.length; j++) {
      const dx = projected[i].x - projected[j].x;
      const dy = projected[i].y - projected[j].y;
      if (dx*dx + dy*dy < maxDistSq) {
        ctx.moveTo(projected[i].x, projected[i].y);
        ctx.lineTo(projected[j].x, projected[j].y);
      }
    }
  }
  ctx.stroke();

  // Points
  for(let i=0; i<projected.length; i++) {
    const proj = projected[i];
    const alpha = Math.max(0.15, (proj.z + 1) / 2); // Increased minimum opacity
    ctx.fillStyle = `rgba(200, 184, 154, ${alpha})`; 
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 3 * proj.p, 0, Math.PI*2); // Even larger dots
    ctx.fill();
  }
  
  ctx.restore();
}

function drawCoder(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Glow from screen
  const glow = ctx.createRadialGradient(0, -10, 0, 0, -10, 60);
  glow.addColorStop(0, "rgba(200, 184, 154, 0.15)");
  glow.addColorStop(1, "rgba(200, 184, 154, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, -10, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PALETTE.muted;
  
  // Head
  ctx.beginPath();
  ctx.arc(0, -50, 22, 0, Math.PI * 2);
  ctx.fill();
  
  // Hoodie/Body
  ctx.beginPath();
  ctx.moveTo(-45, 30);
  ctx.quadraticCurveTo(-35, -25, 0, -25);
  ctx.quadraticCurveTo(35, -25, 45, 30);
  ctx.lineTo(-45, 30);
  ctx.fill();
  
  // Laptop back
  ctx.fillStyle = "#1A1A1A";
  ctx.beginPath();
  ctx.moveTo(-40, 15);
  ctx.lineTo(40, 15);
  ctx.lineTo(45, -15);
  ctx.lineTo(-45, -15);
  ctx.fill();
  
  // Laptop glowing logo
  ctx.fillStyle = PALETTE.accent;
  ctx.beginPath();
  ctx.arc(0, -2, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// --- SCENES ---

function renderScene1(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, opacity: number) {
  ctx.save();
  ctx.globalAlpha = opacity;
  
  const tw = Math.min(800, w);
  const th = Math.max(400, h);
  const tx = w / 2 - tw / 2;
  const ty = h / 2 - th / 2;
  
  // Terminal window
  ctx.fillStyle = "#161616";
  ctx.fillRect(tx, ty, tw, th);
  
  // Traffic lights
  ctx.fillStyle = PALETTE.danger; ctx.beginPath(); ctx.arc(tx + 20, ty + 20, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.accent; ctx.beginPath(); ctx.arc(tx + 40, ty + 20, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.success; ctx.beginPath(); ctx.arc(tx + 60, ty + 20, 6, 0, Math.PI * 2); ctx.fill();

  const code = [
    "import { NextResponse } from 'next/server';",
    "import { PrismaClient } from '@prisma/client';",
    "",
    "const prisma = new PrismaClient();",
    "",
    "export async function GET(req: Request) {",
    "  try {",
    "    const users = await prisma.user.findMany({",
    "      where: { active: true },",
    "      orderBy: { createdAt: 'desc' }",
    "    });",
    "    return NextResponse.json({ success: true, data: users });",
    "  } catch (error) {",
    "    return NextResponse.json({ error: 'Failed' }, { status: 500 });",
    "  }",
    "}"
  ];

  ctx.font = "14px var(--font-mono), monospace";
  
  const totalChars = code.join("").length;
  // Use a clamped local progress, so if we scroll backward it types backward
  const p = Math.max(0, Math.min(1, progress));
  const charsToShow = Math.floor(p * totalChars);
  
  let currentChars = 0;
  let cursorX = tx + 40;
  let cursorY = ty + 70;
  
  for (let i = 0; i < code.length; i++) {
    const line = code[i];
    if (currentChars >= charsToShow) break;
    
    const charsForLine = Math.min(line.length, charsToShow - currentChars);
    const textToDraw = line.substring(0, charsForLine);
    
    // Simple syntax coloring mock
    ctx.fillStyle = textToDraw.includes("import") || textToDraw.includes("export") || textToDraw.includes("return") ? PALETTE.danger :
                    textToDraw.includes("NextResponse") || textToDraw.includes("PrismaClient") ? PALETTE.accent :
                    PALETTE.primary;
                    
    ctx.fillText(textToDraw, tx + 40, ty + 70 + (i * 24));
    
    if (charsForLine === line.length) {
      currentChars += line.length;
      if (currentChars < charsToShow) {
         // Moved to next line
      } else {
         cursorX = tx + 40 + ctx.measureText(textToDraw).width;
         cursorY = ty + 70 + (i * 24);
      }
    } else {
      currentChars += charsForLine;
      cursorX = tx + 40 + ctx.measureText(textToDraw).width;
      cursorY = ty + 70 + (i * 24);
    }
  }

  // Blinking cursor
  if (Math.floor(performance.now() / 500) % 2 === 0) {
    ctx.fillStyle = PALETTE.accent;
    ctx.fillRect(cursorX + 2, cursorY - 12, 8, 16);
  }

  // Draw human coder silhouette
  drawCoder(ctx, tx + tw - 80, ty + th - 20, 1.2);

  ctx.restore();
}

function renderScene2(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, opacity: number) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const tw = Math.min(800, w);
  const th = Math.max(400, h);
  const tx = w / 2 - tw / 2;
  const ty = h / 2 - th / 2;
  
  ctx.fillStyle = "#161616";
  ctx.fillRect(tx, ty, tw, th);
  
  const p = Math.max(0, Math.min(1, progress));
  
  const pipeline = [
    "Initializing build pipeline...",
    "tsc compile --strict",
    "next build",
    "✓ Compiled successfully",
    "Bundling client-side assets...",
    "✓ Route (app)                              Size     First Load JS",
    "✓ ┌ /                                      12.4 kB         102 kB",
    "Running unit tests (Jest)...",
    "✓ All 42 tests passed",
    "docker build -t app:latest .",
    "Pushing image to registry...",
    "✓ Image pushed",
    "DEPLOYING to production...",
    "✓ DEPLOYMENT SUCCESSFUL"
  ];
  
  ctx.font = "14px var(--font-mono), monospace";
  
  const linesToShow = Math.floor(p * pipeline.length);
  
  for (let i = 0; i < pipeline.length; i++) {
    if (i > linesToShow) break;
    const y = ty + 50 + (i * 22);
    
    if (i < linesToShow) {
      ctx.fillStyle = pipeline[i].includes("✓") ? PALETTE.success : PALETTE.muted;
    } else {
      ctx.fillStyle = PALETTE.accent; // Active line
    }
    
    ctx.fillText(pipeline[i], tx + 40, y);
  }
  
  // Scan line
  if (linesToShow > 0 && linesToShow < pipeline.length) {
    const scanY = ty + 50 + (linesToShow * 22);
    const grad = ctx.createLinearGradient(tx, scanY - 20, tx, scanY);
    grad.addColorStop(0, "rgba(200, 184, 154, 0)");
    grad.addColorStop(1, "rgba(200, 184, 154, 0.2)");
    ctx.fillStyle = grad;
    ctx.fillRect(tx, scanY - 20, tw, 24);
    ctx.fillStyle = PALETTE.accent;
    ctx.fillRect(tx, scanY + 4, tw, 1);
  }

  ctx.restore();
}

function renderScene3(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, opacity: number) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const cx = w / 2;
  const cy = h / 2;
  ctx.translate(cx, cy);

  // Dynamic scaling for mobile responsiveness
  const masterScale = Math.min(1, h / 450);
  ctx.scale(masterScale, masterScale);

  // 3D Math configuration
  const rotY = Math.sin(time * 0.0005) * 0.3; // Gentle side-to-side rotation
  const rotX = -0.15 + Math.sin(time * 0.0003) * 0.05; // Gentle up-and-down tilt

  // 3D Projection Engine
  const project = (x: number, y: number, z: number) => {
    let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
    let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);
    let y1 = y;
    
    let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
    let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
    
    const fov = 700;
    const scale = fov / (fov + z2 + 100); 
    return { x: x1 * scale, y: y2 * scale, z: z2, s: scale };
  };

  const drawQuad = (p1: any, p2: any, p3: any, p4: any, color: string, strokeColor: string) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const rackWidth = Math.min(300, w - 40);
  const rackDepth = 250;
  const bladeHeight = 25;
  const gap = 15;
  const numBlades = 8;
  const totalHeight = numBlades * (bladeHeight + gap);
  const startY = -totalHeight / 2;

  const labels = ["nginx·proxy", "next·frontend·1", "next·frontend·2", "nest·api·core", "nest·api·workers", "redis·cache", "postgres·master", "postgres·replica"];

  const blades = [];
  for (let i = 0; i < numBlades; i++) {
    const y = startY + i * (bladeHeight + gap);
    
    // CRAZY 3D EFFECT: Blades dynamically slide out of the rack based on sine waves
    const pullOut = Math.max(0, Math.sin(time * 0.002 + i) * 60); 
    
    const w2 = rackWidth / 2;
    const d2 = rackDepth / 2;
    
    // Calculate 8 corners of the 3D server blade
    const corners = [
      project(-w2, y, -d2 - pullOut),               // 0: front-top-left
      project( w2, y, -d2 - pullOut),               // 1: front-top-right
      project( w2, y + bladeHeight, -d2 - pullOut), // 2: front-bottom-right
      project(-w2, y + bladeHeight, -d2 - pullOut), // 3: front-bottom-left
      project(-w2, y, d2),                          // 4: back-top-left
      project( w2, y, d2),                          // 5: back-top-right
      project( w2, y + bladeHeight, d2),            // 6: back-bottom-right
      project(-w2, y + bladeHeight, d2),            // 7: back-bottom-left
    ];
    
    const centerZ = (corners[0].z + corners[4].z) / 2;
    blades.push({ corners, centerZ, i, pullOut });
  }

  // Painter's Algorithm: Sort blades by Z-depth to render back-to-front
  blades.sort((a, b) => b.centerZ - a.centerZ);

  blades.forEach(blade => {
    const c = blade.corners;
    
    // Top face
    drawQuad(c[0], c[1], c[5], c[4], "#1a1a1a", "#333");
    
    // Side faces (dynamically render left or right based on rotation)
    if (rotY > 0) {
      drawQuad(c[3], c[0], c[4], c[7], "#111", "#333"); // Left Side
    } else {
      drawQuad(c[1], c[2], c[6], c[5], "#111", "#333"); // Right Side
    }
    
    // Front face
    drawQuad(c[0], c[1], c[2], c[3], "#161616", PALETTE.muted);

    // Front details (LEDs, labels) mapped to 3D perspective
    const lerp = (p1: any, p2: any, t: number) => ({ x: p1.x + (p2.x - p1.x)*t, y: p1.y + (p2.y - p1.y)*t });
    
    // Blinking Activity LED
    const active = Math.sin(time * 0.01 + blade.i * 4) > 0;
    const ledTop = lerp(c[0], c[1], 0.05);
    const ledBottom = lerp(c[3], c[2], 0.05);
    const ledCenter = lerp(ledTop, ledBottom, 0.5);
    
    ctx.fillStyle = active ? PALETTE.success : PALETTE.muted;
    ctx.beginPath();
    ctx.arc(ledCenter.x, ledCenter.y, 4 * c[0].s, 0, Math.PI * 2);
    ctx.fill();
    
    // Perspective Text Label
    const labelTop = lerp(c[0], c[1], 0.15);
    const labelBottom = lerp(c[3], c[2], 0.15);
    const labelCenter = lerp(labelTop, labelBottom, 0.5);
    
    ctx.fillStyle = PALETTE.primary;
    ctx.font = `${12 * c[0].s}px var(--font-mono), monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(labels[blade.i], labelCenter.x, labelCenter.y);
  });

  ctx.restore();
}

function renderScene4(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, opacity: number, packets: any[]) {
  ctx.save();
  ctx.globalAlpha = opacity;

  // Grid
  ctx.strokeStyle = "rgba(245, 243, 238, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 60) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
  }
  for (let i = 0; i < h; i += 60) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
  }

  const nodes = [
    { x: w * 0.7, y: h * 0.5, name: "Mumbai" },
    { x: w * 0.5, y: h * 0.3, name: "London" },
    { x: w * 0.8, y: h * 0.6, name: "Singapore" },
    { x: w * 0.3, y: h * 0.4, name: "New York" },
    { x: w * 0.55, y: h * 0.35, name: "Frankfurt" },
    { x: w * 0.85, y: h * 0.4, name: "Tokyo" },
    { x: w * 0.9, y: h * 0.75, name: "Sydney" },
    { x: w * 0.35, y: h * 0.7, name: "São Paulo" }
  ];

  // Draw curves and packets
  packets.forEach(p => {
    const from = nodes[p.from];
    const to = nodes[p.to];
    p.progress += p.speed;
    if (p.progress >= 1) {
      p.progress = 0;
      p.from = Math.floor(Math.random() * 8);
      p.to = Math.floor(Math.random() * 8);
    }
    if (p.from !== p.to) {
      const cx = (from.x + to.x) / 2;
      const cy = Math.min(from.y, to.y) - 100;

      ctx.strokeStyle = "rgba(200, 184, 154, 0.1)";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cx, cy, to.x, to.y);
      ctx.stroke();

      // Packet
      const px = Math.pow(1 - p.progress, 2) * from.x + 2 * (1 - p.progress) * p.progress * cx + Math.pow(p.progress, 2) * to.x;
      const py = Math.pow(1 - p.progress, 2) * from.y + 2 * (1 - p.progress) * p.progress * cy + Math.pow(p.progress, 2) * to.y;
      
      ctx.fillStyle = PALETTE.accent;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Draw nodes
  nodes.forEach((n, i) => {
    ctx.fillStyle = i === 0 ? PALETTE.accent : PALETTE.secondary;
    ctx.beginPath();
    ctx.arc(n.x, n.y, i === 0 ? 8 : 4, 0, Math.PI * 2);
    ctx.fill();

    if (i === 0) {
      const pulse = (time * 0.002) % 1;
      ctx.strokeStyle = `rgba(200, 184, 154, ${1 - pulse})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 8 + pulse * 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = PALETTE.muted;
    ctx.font = "11px var(--font-mono), monospace";
    ctx.fillText(n.name, n.x + 12, n.y + 4);
  });

  // Counter
  ctx.fillStyle = PALETTE.primary;
  ctx.font = "14px var(--font-mono), monospace";
  ctx.textAlign = "center";
  const conns = 12400 + Math.floor(Math.random() * 200);
  const lat = 42 + Math.floor(Math.random() * 10);
  ctx.fillText(`${conns.toLocaleString()} active connections · ${lat}ms avg latency`, w / 2, 80);

  ctx.restore();
}

function renderScene5(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, opacity: number, dbRows: any[]) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const tw = Math.min(800, w);
  const th = Math.max(400, h);
  const tx = w / 2 - tw / 2;
  const ty = h / 2 - th / 2;

  // Header
  ctx.fillStyle = PALETTE.secondary;
  ctx.font = "bold 12px var(--font-mono), monospace";
  ctx.textAlign = "left";
  ctx.fillText("OPERATION", tx + 40, ty + 30);
  ctx.fillText("COLLECTION", tx + 240, ty + 30);
  ctx.fillText("LATENCY", tx + 440, ty + 30);
  ctx.fillText("TYPE", tx + 640, ty + 30);
  
  ctx.strokeStyle = PALETTE.muted;
  ctx.beginPath(); ctx.moveTo(tx + 40, ty + 45); ctx.lineTo(tx + tw - 40, ty + 45); ctx.stroke();

  // Scroll Area Mask
  ctx.save();
  ctx.beginPath();
  ctx.rect(tx, ty + 50, tw, th - 60);
  ctx.clip();

  const totalHeight = 20 * 40; // 20 rows, 40px each

  dbRows.forEach((row, i) => {
    // Stateless vertical scrolling based entirely on elapsed time
    let currentYOffset = (i * 40 - time * 0.05);
    currentYOffset = ((currentYOffset % totalHeight) + totalHeight) % totalHeight;
    currentYOffset -= 40; // Shift up slightly to allow scrolling off the top

    const y = ty + 50 + currentYOffset;
    
    let color = PALETTE.secondary;
    if (row.op === "INSERT" || row.op === "UPDATE" || row.op === "DELETE") color = PALETTE.accent;
    if (row.op === "CACHE") color = PALETTE.success;
    
    ctx.fillStyle = color;
    ctx.font = "14px var(--font-mono), monospace";
    ctx.fillText(row.op, tx + 40, y + 25);
    ctx.fillStyle = PALETTE.primary;
    ctx.fillText(row.col, tx + 240, y + 25);
    ctx.fillText(`${row.lat}ms`, tx + 440, y + 25);
    
    const type = ["INSERT", "UPDATE", "DELETE"].includes(row.op) ? "WRITE" : row.op === "CACHE" ? "CACHE" : "READ";
    ctx.fillText(type, tx + 640, y + 25);
  });
  ctx.restore();

  // Fades
  const topGrad = ctx.createLinearGradient(tx, ty + 50, tx, ty + 90);
  topGrad.addColorStop(0, PALETTE.bg);
  topGrad.addColorStop(1, "rgba(11, 11, 11, 0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(tx, ty + 50, tw, 40);

  const botGrad = ctx.createLinearGradient(tx, ty + th - 50, tx, ty + th - 10);
  botGrad.addColorStop(0, "rgba(11, 11, 11, 0)");
  botGrad.addColorStop(1, PALETTE.bg);
  ctx.fillStyle = botGrad;
  ctx.fillRect(tx, ty + th - 50, tw, 40);

  ctx.restore();
}

function renderScene6(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, progress: number, opacity: number, nodes: any[]) {
  ctx.save();
  ctx.globalAlpha = opacity;

  const cx = w / 2;
  const cy = h / 2;
  
  const p = Math.max(0, Math.min(1, progress));

  // Connections
  ctx.strokeStyle = "rgba(200, 184, 154, 0.2)";
  ctx.lineWidth = 1;
  const centerNode = nodes[0];
  
  nodes.forEach((n, i) => {
    if (i === 0) return;
    const dist = Math.sqrt(Math.pow(n.x * w - cx, 2) + Math.pow(n.y * h - cy, 2));
    const maxDistToDraw = p * w;
    if (dist < maxDistToDraw) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(n.x * w, n.y * h);
      ctx.stroke();
    }
  });

  // Nodes
  nodes.forEach((n, i) => {
    const nx = n.x === 0.5 ? cx : n.x * w;
    const ny = n.y === 0.5 ? cy : n.y * h;
    
    // Scale up based on progress
    const delay = i * 0.1;
    const scaleP = Math.max(0, Math.min(1, (p - delay) * 5));
    
    if (scaleP > 0) {
      const pulse = 1 + Math.sin(time * 0.002 + i) * 0.05;
      const rad = n.r * scaleP * pulse;
      
      ctx.fillStyle = "#1A1A1A";
      ctx.beginPath();
      ctx.arc(nx, ny, rad, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = i === 0 ? PALETTE.accent : PALETTE.muted;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.fillStyle = i === 0 ? PALETTE.accent : PALETTE.primary;
      ctx.font = `${i === 0 ? "bold 16px" : "12px"} var(--font-sans)`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.name, nx, ny);
    }
  });

  ctx.restore();
}

function renderScene7(ctx: CanvasRenderingContext2D, w: number, h: number, progress: number, opacity: number, time: number, points: {x:number, y:number, z:number}[]) {
  ctx.save();
  ctx.globalAlpha = opacity;
  
  // Draw the massive 3D core specifically as the centerpiece of Scene 7
  draw3DCore(ctx, w, h, time, points);

  const cx = w / 2;
  const cy = h / 2;
  
  // Center line
  const p = Math.min(1, Math.max(0, progress * 2));
  const lineW = p * 300;
  
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(cx - lineW / 2, cy, lineW, 1);
  
  // Text
  ctx.fillStyle = PALETTE.primary;
  ctx.font = "bold 18px var(--font-mono), monospace";
  ctx.textAlign = "center";
  ctx.fillText("Designing systems.", cx, cy - 40);
  
  ctx.fillStyle = PALETTE.secondary;
  ctx.font = "16px var(--font-mono), monospace";
  ctx.fillText("Shipping products.", cx, cy + 40);
  
  // Footer
  if (p > 0.9) {
    ctx.globalAlpha = opacity * Math.min(1, (p - 0.9) * 5);
    ctx.fillStyle = PALETTE.accent;
    ctx.font = "12px var(--font-mono), monospace";
    ctx.fillText("KIRAN KUMBAR · FULL-STACK ENGINEER", cx, cy + 100);
  }

  ctx.restore();
}
