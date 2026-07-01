"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
} from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Simple layered-sine noise (no dependency needed) ──────────
function noise3D(x: number, y: number, z: number): number {
  return (
    Math.sin(x * 1.27 + y * 2.37 + z * 0.73) * 0.5 +
    Math.sin(x * 2.91 + y * 0.41 + z * 1.83) * 0.25 +
    Math.sin(x * 0.53 + y * 1.79 + z * 2.61) * 0.25
  );
}

// ─── Ease-out expo (for entrance stagger) ─────────────────────
function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ─── The InstancedMesh particle system ────────────────────────
function Particles({
  count,
  mouse,
  reducedMotion,
}: {
  count: number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const entranceStartRef = useRef(performance.now());

  // Pre-compute resting positions + per-particle data
  const particleData = useMemo(() => {
    const rest = new Float32Array(count * 3);
    const offsets = new Float32Array(count * 3); // noise phase offsets
    const speeds = new Float32Array(count);       // drift speed per particle
    const sizes = new Float32Array(count);         // scale per particle

    for (let i = 0; i < count; i++) {
      // Spread in a wide volume around the hero area
      // x: -6..6, y: -3..3, z: -3..1
      rest[i * 3 + 0] = (Math.random() - 0.5) * 12;
      rest[i * 3 + 1] = (Math.random() - 0.5) * 6;
      rest[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;

      offsets[i * 3 + 0] = Math.random() * 100;
      offsets[i * 3 + 1] = Math.random() * 100;
      offsets[i * 3 + 2] = Math.random() * 100;

      speeds[i] = 0.3 + Math.random() * 0.7;
      sizes[i] = 0.02 + Math.random() * 0.025;
    }
    return { rest, offsets, speeds, sizes };
  }, [count]);

  // Color buffer — 70% near-black, 30% accent
  const colorArray = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const dark = new THREE.Color("#0E0E0E");
    const accent = new THREE.Color("#BB5A2C");
    for (let i = 0; i < count; i++) {
      const c = Math.random() < 0.3 ? accent : dark;
      // Apply varied opacity by mixing toward background
      const bg = new THREE.Color("#FAF9F6");
      const opacity = 0.3 + Math.random() * 0.5;
      const mixed = c.clone().lerp(bg, 1 - opacity);
      colors[i * 3 + 0] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }
    return colors;
  }, [count]);

  // Current positions (mutable, updated each frame)
  const currentPos = useRef(new Float32Array(count * 3));

  // Initialize positions to start-scatter (far out)
  useEffect(() => {
    const pos = currentPos.current;
    for (let i = 0; i < count; i++) {
      if (reducedMotion) {
        // Static: place at rest immediately
        pos[i * 3 + 0] = particleData.rest[i * 3 + 0];
        pos[i * 3 + 1] = particleData.rest[i * 3 + 1];
        pos[i * 3 + 2] = particleData.rest[i * 3 + 2];
      } else {
        // Scattered: start from origin cluster
        pos[i * 3 + 0] = (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 2] = -2 + Math.random() * 0.5;
      }
    }
    entranceStartRef.current = performance.now();
  }, [count, particleData, reducedMotion]);

  // Set instance colors once
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    for (let i = 0; i < count; i++) {
      mesh.setColorAt(
        i,
        new THREE.Color(
          colorArray[i * 3 + 0],
          colorArray[i * 3 + 1],
          colorArray[i * 3 + 2]
        )
      );
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, colorArray]);

  // Temp objects for matrix composition (reused, never allocate in frame loop)
  const tempObj = useMemo(() => new THREE.Object3D(), []);

  // 3D mouse position in scene coords
  const mouseVec = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const elapsed = state.clock.getElapsedTime();
    const pos = currentPos.current;
    const { rest, offsets, speeds, sizes } = particleData;

    // Entrance progress (0 → 1 over ~2s, staggered by particle index)
    const entranceElapsed = (performance.now() - entranceStartRef.current) / 1000;

    // Project mouse into scene space (approximate)
    const mx = mouse.current.x * 5;  // normalized -1..1 → scene units
    const my = mouse.current.y * 3;
    mouseVec.current.set(mx, my, 0);

    // Slow group rotation
    if (!reducedMotion) {
      mesh.rotation.y = elapsed * 0.02;
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Per-particle entrance stagger
      const stagger = (i / count) * 0.8; // 0..0.8s spread
      const entranceT = reducedMotion
        ? 1
        : easeOutExpo(Math.max(0, Math.min(1, (entranceElapsed - stagger) / 1.5)));

      // Resting position
      const rx = rest[i3 + 0];
      const ry = rest[i3 + 1];
      const rz = rest[i3 + 2];

      // Ambient drift (noise-based sine)
      let driftX = 0, driftY = 0, driftZ = 0;
      if (!reducedMotion) {
        const t = elapsed * speeds[i] * 0.3;
        const ox = offsets[i3 + 0];
        const oy = offsets[i3 + 1];
        const oz = offsets[i3 + 2];
        driftX = noise3D(t + ox, oy, oz) * 0.15;
        driftY = noise3D(ox, t + oy, oz) * 0.12;
        driftZ = noise3D(ox, oy, t + oz) * 0.08;
      }

      // Target position = rest + drift
      let tx = rx + driftX;
      let ty = ry + driftY;
      let tz = rz + driftZ;

      // Mouse repulsion
      if (!reducedMotion) {
        const dx = tx - mouseVec.current.x;
        const dy = ty - mouseVec.current.y;
        const dz = tz - mouseVec.current.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const repulsionRadius = 1.8;
        if (dist < repulsionRadius && dist > 0.01) {
          const force = (1 - dist / repulsionRadius) * 1.2;
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;
          tx += nx * force;
          ty += ny * force;
          tz += nz * force;
        }
      }

      // Blend from scatter start to target based on entrance progress
      const startX = (Math.random() - 0.5) * 0.01; // tiny jitter for stability
      pos[i3 + 0] += ((rx * entranceT + tx * (entranceT > 0.99 ? 1 : 0)) - pos[i3 + 0]) * 0.08;
      pos[i3 + 1] += ((ry * entranceT + ty * (entranceT > 0.99 ? 1 : 0)) - pos[i3 + 1]) * 0.08;
      pos[i3 + 2] += ((rz * entranceT + tz * (entranceT > 0.99 ? 1 : 0)) - pos[i3 + 2]) * 0.08;

      // Once entrance is done, lerp toward drift+repulsion target
      if (entranceT > 0.99) {
        pos[i3 + 0] += (tx - pos[i3 + 0]) * 0.06;
        pos[i3 + 1] += (ty - pos[i3 + 1]) * 0.06;
        pos[i3 + 2] += (tz - pos[i3 + 2]) * 0.06;
      }

      // Depth-based subtle scale pulse
      const depthFactor = 1 + (pos[i3 + 2] + 3) * 0.05;
      const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * 2 + i * 0.1) * 0.1;
      const s = sizes[i] * depthFactor * pulse;

      tempObj.position.set(pos[i3 + 0], pos[i3 + 1], pos[i3 + 2]);
      tempObj.scale.setScalar(s);
      tempObj.updateMatrix();
      mesh.setMatrixAt(i, tempObj.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

// ─── Camera micro-parallax ────────────────────────────────────
function CameraRig({
  mouse,
  reducedMotion,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (reducedMotion) return;
    // Max ~4 degrees rotation based on mouse
    const targetX = -mouse.current.y * 0.07;
    const targetY = mouse.current.x * 0.07;
    camera.rotation.x += (targetX - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetY - camera.rotation.y) * 0.05;
  });

  return null;
}

// ─── Main exported component ──────────────────────────────────
export default function ParticleField() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [particleCount, setParticleCount] = useState(1000);

  useEffect(() => {
    setMounted(true);

    // Detect reduced motion
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);

    // Responsive particle count
    const updateCount = () => {
      setParticleCount(window.innerWidth < 768 ? 500 : 1000);
    };
    updateCount();
    window.addEventListener("resize", updateCount);

    // Global mouse tracking (normalized -1 to 1)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      mql.removeEventListener("change", handler);
      window.removeEventListener("resize", updateCount);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Particles
          count={particleCount}
          mouse={mouseRef}
          reducedMotion={reducedMotion}
        />
        <CameraRig mouse={mouseRef} reducedMotion={reducedMotion} />
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
