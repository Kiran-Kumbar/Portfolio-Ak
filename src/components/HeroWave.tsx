"use client";

import dynamic from "next/dynamic";

const HeroWaveScene = dynamic(() => import("./HeroWaveScene"), {
  ssr: false,
  loading: () => null,
});

export default function HeroWave() {
  return <HeroWaveScene />;
}
