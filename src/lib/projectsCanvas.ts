// Canvas drawing helpers for Projects section

export interface ProjectData {
  num: string; name: string; role: string; desc: string;
  stack: string[]; accent: string; screenshot: string;
  link: string; year: string;
}

export const PROJECTS: ProjectData[] = [
  {
    num: '01', name: 'eDeal India', role: 'E-Commerce & Gamification Platform',
    desc: 'Production-grade multi-tenant e-commerce with Lucky Draw, Reward Coins, and a Jewellery Marketplace. Built with Next.js 15, Redis caching, and Framer Motion animations.',
    stack: ['Next.js', 'MongoDB', 'Redis', 'Framer Motion'],
    accent: '#E85D75', screenshot: '/projects/edeal.png',
    link: 'https://github.com/kirankumbar', year: '2025',
  },
  {
    num: '02', name: 'FreightIQ', role: 'Logistics SaaS Platform',
    desc: 'Full-stack freight operations platform with real-time GPS tracking, digital POD upload, GST auto-invoicing, and WhatsApp notifications.',
    stack: ['Next.js', 'NestJS', 'MongoDB', 'Maps API'],
    accent: '#7B9CDB', screenshot: '/projects/freightiq.png',
    link: 'https://github.com/kirankumbar', year: '2026',
  },
  {
    num: '03', name: 'InmarServ', role: 'Maritime SaaS · Globally Deployed',
    desc: 'Ship diversion and maritime servicing platform. REST APIs, real-time dashboards, secure data pipelines, role-based access control.',
    stack: ['NestJS', 'PostgreSQL', 'MongoDB', 'REST APIs'],
    accent: '#8FA58A', screenshot: '/projects/inmarserv.png',
    link: 'https://github.com/kirankumbar', year: '2025',
  },
  {
    num: '04', name: 'RR Gold ERP', role: 'Jewellery Business Management',
    desc: 'Full ERP for a gold jewellery retailer. Purchase/sale invoicing, karigar ledger, stock reports, GST compliance workflows.',
    stack: ['React', 'Node.js', 'MongoDB', 'GST APIs'],
    accent: '#C8B89A', screenshot: '/projects/rrgold.png',
    link: 'https://github.com/kirankumbar', year: '2025',
  },
];

export interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; phase: number;
}

export function createParticles(w: number, h: number): Particle[] {
  return Array.from({ length: 28 }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    size: 1 + Math.random(), opacity: 0.05 + Math.random() * 0.2,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawFallbackScreen(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, accent: string) {
  ctx.save();
  // Base background (darkest gray)
  ctx.fillStyle = '#080808';
  ctx.fillRect(x, y, w, h);

  // Constants
  const sbW = w * 0.20; // sidebar width
  const pad = w * 0.02; // padding

  // 1. Sidebar
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(x, y, sbW, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath(); ctx.moveTo(x + sbW, y); ctx.lineTo(x + sbW, y + h); ctx.stroke();

  // Logo area
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(x + pad + 6, y + pad + 6, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${h * 0.035}px sans-serif`;
  ctx.fillText('INMARSERV', x + pad + 18, y + pad + 10);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `${h * 0.02}px sans-serif`;
  ctx.fillText('MARITIME PLATFORM', x + pad + 18, y + pad + 20);

  // Nav Items
  const nav = ['Dashboard', 'Vessels', 'Tracking', 'Compliance', 'Crew Management', 'Reports', 'Alerts', 'Settings'];
  nav.forEach((item, i) => {
    const ny = y + pad + 50 + i * (h * 0.06);
    if (i === 0) {
      ctx.fillStyle = accent + '22';
      rr(ctx, x + pad - 4, ny - 10, sbW - pad * 2 + 8, h * 0.05, 4); ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(x + pad - 4, ny - 6, 2, h * 0.035);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
    }
    // Fake icon
    ctx.beginPath(); ctx.arc(x + pad + 4, ny - 3, 3, 0, Math.PI * 2);
    if (i === 0) ctx.fill(); else ctx.stroke();
    
    ctx.font = `${h * 0.025}px sans-serif`;
    ctx.fillText(item, x + pad + 16, ny + 1);
  });

  // 2. Top Header
  const headY = y + pad + 8;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `bold ${h * 0.022}px sans-serif`;
  ctx.fillText('FLEET OPERATIONS', x + sbW + pad, headY);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('• REAL TIME OVERVIEW', x + sbW + pad + 115, headY);

  // Header Dropdown/Search
  ctx.fillStyle = '#111';
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  rr(ctx, x + sbW + pad + 225, headY - 12, w * 0.15, h * 0.04, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = `${h * 0.02}px sans-serif`;
  ctx.fillText('All Vessels', x + sbW + pad + 232, headY - 1);

  // Profile icon
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(x + w - pad - 10, headY - 4, 8, 0, Math.PI * 2); ctx.fill();

  // 3. Main Dashboard Content
  const mainX = x + sbW + pad;
  const mainY = y + pad + 30;
  const mainW = w - sbW - pad * 2;
  const leftW = mainW * 0.72; // Map area
  const rightW = mainW * 0.26; // Stats area

  // World Map Area (Background)
  ctx.fillStyle = '#111';
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  rr(ctx, mainX, mainY, leftW, h * 0.5, 6); ctx.fill(); ctx.stroke();

  // Draw procedural map dots
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 200; i++) {
    const mx = mainX + 20 + Math.random() * (leftW - 40);
    const my = mainY + 20 + Math.random() * (h * 0.5 - 40);
    // Rough shape of continents (very simplified density)
    const normX = (mx - mainX) / leftW;
    const normY = (my - mainY) / (h * 0.5);
    if ((normX > 0.2 && normX < 0.4 && normY > 0.2 && normY < 0.7) || // Americas
        (normX > 0.45 && normX < 0.6 && normY > 0.1 && normY < 0.5) || // Europe/Africa
        (normX > 0.6 && normX < 0.9 && normY > 0.1 && normY < 0.6)) {  // Asia
      ctx.fillRect(mx, my, 2, 2);
    }
  }

  // Draw some active vessel dots and paths
  ctx.strokeStyle = accent + '66';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mainX + leftW * 0.3, mainY + h * 0.2);
  ctx.lineTo(mainX + leftW * 0.5, mainY + h * 0.25);
  ctx.lineTo(mainX + leftW * 0.7, mainY + h * 0.3);
  ctx.stroke();
  
  [ {px: 0.3, py: 0.2}, {px: 0.5, py: 0.25}, {px: 0.7, py: 0.3}, {px: 0.8, py: 0.4} ].forEach(pt => {
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(mainX + leftW * pt.px, mainY + h * 0.5 * pt.py, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = accent + '44';
    ctx.beginPath(); ctx.arc(mainX + leftW * pt.px, mainY + h * 0.5 * pt.py, 8, 0, Math.PI * 2); ctx.fill();
  });

  // Right Side Cards
  const cX = mainX + leftW + (mainW * 0.02);
  const cH1 = h * 0.16;
  
  // Card 1: Vessels at sea
  ctx.fillStyle = '#111';
  rr(ctx, cX, mainY, rightW, cH1, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `bold ${h * 0.02}px sans-serif`;
  ctx.fillText('LIVE VESSELS AT SEA', cX + 10, mainY + 20);
  ctx.font = `bold ${h * 0.06}px sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.fillText('32', cX + 10, mainY + 55);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = `${h * 0.02}px sans-serif`;
  ctx.fillText('/ 48 Total', cX + 45, mainY + 55);

  // Card 2: Operations
  const cY2 = mainY + cH1 + h * 0.01;
  ctx.fillStyle = '#111';
  rr(ctx, cX, cY2, rightW, cH1, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `bold ${h * 0.02}px sans-serif`;
  ctx.fillText('OPERATIONS OVERVIEW', cX + 10, cY2 + 20);
  
  // Circular rings
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#222';
  ctx.beginPath(); ctx.arc(cX + rightW * 0.25, cY2 + 55, 14, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cX + rightW * 0.75, cY2 + 55, 14, 0, Math.PI * 2); ctx.stroke();
  
  ctx.strokeStyle = accent;
  ctx.beginPath(); ctx.arc(cX + rightW * 0.25, cY2 + 55, 14, -Math.PI/2, Math.PI * 1.5); ctx.stroke();
  ctx.strokeStyle = '#22c55e'; // Green for uptime
  ctx.beginPath(); ctx.arc(cX + rightW * 0.75, cY2 + 55, 14, -Math.PI/2, Math.PI * 1.8); ctx.stroke();
  
  ctx.fillStyle = '#fff'; ctx.font = `bold ${h * 0.022}px sans-serif`; ctx.textAlign = 'center';
  ctx.fillText('92%', cX + rightW * 0.25, cY2 + 59);
  ctx.fillText('98%', cX + rightW * 0.75, cY2 + 59);
  ctx.textAlign = 'left';

  // Card 3: Alerts
  const cY3 = cY2 + cH1 + h * 0.01;
  ctx.fillStyle = '#111';
  rr(ctx, cX, cY3, rightW, cH1, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `bold ${h * 0.02}px sans-serif`;
  ctx.fillText('ALERTS', cX + 10, cY3 + 20);
  ctx.fillStyle = '#ef4444'; // Red
  ctx.font = `bold ${h * 0.05}px sans-serif`;
  ctx.fillText('02', cX + 10, cY3 + 55);
  ctx.fillStyle = '#3b82f6'; // Blue
  ctx.fillText('05', cX + rightW * 0.5, cY3 + 55);
  
  // 4. Bottom Area (Recent Activity & Fuel)
  const bY = mainY + h * 0.5 + h * 0.015;
  const bH = h * 0.23;
  
  // Activity Table
  ctx.fillStyle = '#111';
  rr(ctx, mainX, bY, leftW * 0.65, bH, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `bold ${h * 0.02}px sans-serif`;
  ctx.fillText('RECENT ACTIVITY', mainX + 10, bY + 20);
  for(let i=0; i<3; i++) {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `${h * 0.02}px sans-serif`;
    ctx.fillText(`10:${34 + i*5}`, mainX + 10, bY + 45 + i*15);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const texts = ['Vessel Position Updated - MV Oceanic', 'Compliance Document Verified', 'Crew Change Completed - MV Horizon'];
    ctx.fillText(texts[i], mainX + 50, bY + 45 + i*15);
  }

  // Fuel Consumption
  const fX = mainX + leftW * 0.65 + mainW * 0.02;
  const fW = (mainW - (leftW * 0.65 + mainW * 0.02));
  ctx.fillStyle = '#111';
  rr(ctx, fX, bY, fW, bH, 6); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `bold ${h * 0.02}px sans-serif`;
  ctx.fillText('FUEL CONSUMPTION', fX + 10, bY + 20);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${h * 0.045}px sans-serif`;
  ctx.fillText('186.4 MT', fX + 10, bY + 55);
  ctx.fillStyle = '#22c55e';
  ctx.font = `${h * 0.02}px sans-serif`;
  ctx.fillText('+12.4% vs last week', fX + 10, bY + 75);

  ctx.restore();
}

export function drawMacBook(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  devW: number, img: HTMLImageElement | null, accent: string,
  opacity: number, scale: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  // Adjusted proportions for a realistic 16:10 screen aspect ratio
  const lidW = devW; 
  const lidH = devW * 0.64; 
  const baseW = devW * 1.1; 
  const baseH = devW * 0.12;
  const devH = lidH + baseH;

  const lidX = cx - lidW / 2; 
  const lidY = cy - devH * 0.4;
  const baseX = cx - baseW / 2; 
  const baseY = lidY + lidH - 2;

  // Large ambient shadow under the laptop
  ctx.save();
  const shG = ctx.createRadialGradient(cx, baseY + baseH * 0.5, 0, cx, baseY + baseH * 0.5, devW * 0.8);
  shG.addColorStop(0, 'rgba(0,0,0,0.6)'); shG.addColorStop(0.6, 'rgba(0,0,0,0.2)'); shG.addColorStop(1, 'transparent');
  ctx.fillStyle = shG; ctx.fillRect(cx - devW, baseY - 20, devW * 2, devH * 0.7);
  ctx.restore();

  // Screen glow (colored light from screen content)
  ctx.save();
  const glowG = ctx.createRadialGradient(cx, lidY + lidH * 0.4, 0, cx, lidY + lidH * 0.4, devW * 0.55);
  const gr = parseInt(accent.slice(1, 3), 16) || 255;
  const gg = parseInt(accent.slice(3, 5), 16) || 255;
  const gb = parseInt(accent.slice(5, 7), 16) || 255;
  glowG.addColorStop(0, `rgba(${gr},${gg},${gb},0.08)`); glowG.addColorStop(1, 'transparent');
  ctx.fillStyle = glowG;
  ctx.fillRect(cx - devW * 0.6, lidY - devH * 0.2, devW * 1.2, devH * 0.8);
  ctx.restore();

  // Keyboard base
  ctx.save();
  const baseG = ctx.createLinearGradient(baseX, baseY, baseX, baseY + baseH);
  baseG.addColorStop(0, '#363636'); baseG.addColorStop(0.5, '#2A2A2A'); baseG.addColorStop(1, '#1E1E1E');
  ctx.fillStyle = baseG;
  rr(ctx, baseX, baseY, baseW, baseH, 6); ctx.fill();
  
  // Base top edge highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(baseX + 6, baseY); ctx.lineTo(baseX + baseW - 6, baseY); ctx.stroke();
  
  // Trackpad
  const tpW = baseW * 0.35; const tpH = baseH * 0.45;
  const tpX = cx - tpW / 2; const tpY = baseY + baseH * 0.15;
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5;
  rr(ctx, tpX, tpY, tpW, tpH, 4); ctx.fill(); ctx.stroke();
  
  // Notch for opening lid
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  rr(ctx, cx - baseW * 0.08, baseY, baseW * 0.16, baseH * 0.08, 2); ctx.fill();
  ctx.restore();

  // Lid body
  ctx.save();
  const lidG = ctx.createLinearGradient(lidX, lidY, lidX, lidY + lidH);
  lidG.addColorStop(0, '#3A3A3A'); lidG.addColorStop(0.3, '#303030'); lidG.addColorStop(1, '#282828');
  ctx.fillStyle = lidG;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
  rr(ctx, lidX, lidY, lidW, lidH, 12); ctx.fill(); ctx.stroke();
  ctx.restore();

  // Screen area — thin bezel
  const bezelP = 5;
  const scrX = lidX + bezelP; const scrY = lidY + bezelP + 5;
  const scrW = lidW - bezelP * 2; const scrH = lidH - bezelP * 2 - 8;

  // Screen background
  ctx.save();
  ctx.fillStyle = '#0a0a0a';
  rr(ctx, scrX, scrY, scrW, scrH, 4); ctx.fill();

  // Clip + draw screen content (Object-fit: cover)
  ctx.save();
  rr(ctx, scrX, scrY, scrW, scrH, 4); ctx.clip();
  if (img && img.complete && img.naturalWidth > 0) {
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const scrAspect = scrW / scrH;
    let drawW = scrW;
    let drawH = scrH;
    let drawX = scrX;
    let drawY = scrY;

    if (imgAspect > scrAspect) {
      drawH = scrH;
      drawW = img.naturalWidth * (scrH / img.naturalHeight);
      drawX = scrX - (drawW - scrW) / 2;
    } else {
      drawW = scrW;
      drawH = img.naturalHeight * (scrW / img.naturalWidth);
      drawY = scrY - (drawH - scrH) / 2;
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } else {
    drawFallbackScreen(ctx, scrX, scrY, scrW, scrH, accent);
  }
  
  // Very subtle glass reflection — barely visible
  const refG = ctx.createLinearGradient(scrX, scrY, scrX + scrW * 0.3, scrY + scrH);
  refG.addColorStop(0, 'rgba(255,255,255,0.02)'); refG.addColorStop(0.3, 'transparent');
  ctx.fillStyle = refG;
  ctx.fillRect(scrX, scrY, scrW * 0.3, scrH);
  ctx.restore();
  ctx.restore();

  // Screen inner border (subtle)
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.5;
  rr(ctx, scrX, scrY, scrW, scrH, 4); ctx.stroke();
  ctx.restore();

  // Webcam dot
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath(); ctx.arc(cx, lidY + 6, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Hinge line
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(baseX + 15, baseY); ctx.lineTo(baseX + baseW - 15, baseY); ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export function drawIPhone(
  ctx: CanvasRenderingContext2D, cx: number, cy: number,
  phoneW: number, time: number, accent: string, tiltX: number, tiltY: number
) {
  const bobY = Math.sin(time * 0.9 + 1.2) * 6;
  const phoneH = phoneW * 2.1;
  const px = cx - phoneW / 2;
  const py = cy - phoneH / 2 + bobY;

  ctx.save();
  ctx.globalAlpha = 0.85;

  // Frame
  const frameG = ctx.createLinearGradient(px, py, px, py + phoneH);
  frameG.addColorStop(0, '#3A3A3A'); frameG.addColorStop(1, '#252525');
  ctx.fillStyle = frameG;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
  rr(ctx, px, py, phoneW, phoneH, phoneW * 0.16); ctx.fill(); ctx.stroke();

  // Dynamic Island
  const diW = phoneW * 0.28; const diH = 5;
  ctx.fillStyle = '#111';
  rr(ctx, cx - diW / 2, py + 4, diW, diH, 3); ctx.fill();

  // Screen
  const sp = 3;
  const sx = px + sp; const sy = py + sp + 6;
  const sw = phoneW - sp * 2; const sh = phoneH - sp * 2 - 8;
  ctx.save();
  rr(ctx, sx, sy, sw, sh, phoneW * 0.13); ctx.clip();

  // Accent gradient bg
  const sg = ctx.createLinearGradient(sx, sy, sx, sy + sh);
  sg.addColorStop(0, accent + '44'); sg.addColorStop(0.5, '#151515'); sg.addColorStop(1, '#111');
  ctx.fillStyle = sg; ctx.fillRect(sx, sy, sw, sh);

  // Navigation items (like sidebar in reference)
  const navItems = ['Dashboard', 'Vessels', 'Tracking', 'Compliance', 'Crew', 'Reports', 'Alerts', 'Settings'];
  ctx.font = `${Math.max(5, phoneW * 0.08)}px sans-serif`;
  navItems.forEach((item, i) => {
    const itemY = sy + 16 + i * (sh * 0.1);
    if (i === 0) {
      ctx.fillStyle = accent + '33';
      rr(ctx, sx + 3, itemY - 2, sw - 6, sh * 0.08, 2); ctx.fill();
      ctx.fillStyle = accent;
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
    }
    ctx.fillText(item, sx + 6, itemY + 6);
  });

  ctx.restore();
  ctx.restore();
}

export function drawParticles(
  ctx: CanvasRenderingContext2D, particles: Particle[],
  w: number, h: number, accent: string, time: number
) {
  for (const p of particles) {
    p.x += p.vx + Math.sin(time * 0.5 + p.phase) * 0.15;
    p.y += p.vy + Math.cos(time * 0.3 + p.phase) * 0.1;
    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
    ctx.fillStyle = accent;
    ctx.globalAlpha = p.opacity;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const vg = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8);
  vg.addColorStop(0, 'transparent'); vg.addColorStop(1, 'rgba(0,0,0,0.65)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
}

export function drawAccentGlow(ctx: CanvasRenderingContext2D, cx: number, cy: number, accent: string) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 450);
  const r = parseInt(accent.slice(1, 3), 16);
  const gv = parseInt(accent.slice(3, 5), 16);
  const b = parseInt(accent.slice(5, 7), 16);
  g.addColorStop(0, `rgba(${r},${gv},${b},0.18)`); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(cx - 500, cy - 500, 1000, 1000);
}

export function drawGrain(grainCanvas: HTMLCanvasElement) {
  const gctx = grainCanvas.getContext('2d');
  if (!gctx) return;
  const idata = gctx.createImageData(200, 150);
  const buf = new Uint32Array(idata.data.buffer);
  for (let i = 0; i < buf.length; i++) {
    if (Math.random() < 0.08) buf[i] = 0x06ffffff;
  }
  gctx.putImageData(idata, 0, 0);
}

export function drawCursor(
  ctx: CanvasRenderingContext2D, x: number, y: number, accent: string
) {
  ctx.save();
  // Outer ring
  ctx.strokeStyle = accent + '99'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.stroke();
  // Center dot
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
  // Label
  ctx.font = '8px monospace'; ctx.textAlign = 'center';
  ctx.fillText('VIEW', x, y + 26);
  ctx.restore();
}

export function drawProgressDots(
  ctx: CanvasRenderingContext2D, active: number,
  total: number, x: number, y: number, accent: string
) {
  for (let i = 0; i < total; i++) {
    const isActive = i === active;
    ctx.fillStyle = isActive ? accent : 'rgba(245,243,238,0.15)';
    ctx.beginPath();
    ctx.arc(x + i * 20, y, isActive ? 5 : 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
