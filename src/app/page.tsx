import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import About from "@/components/About";
import Experience from "@/components/Experience";
import NowBlock from "@/components/NowBlock";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ClientShell from "@/components/ClientShell";
import Showreel from "@/components/Showreel";

export default function Home() {
  return (
    <ClientShell>
      <main className="flex min-h-screen w-full flex-col justify-between selection:bg-foreground selection:text-(--background)">
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <NowBlock />
        <Showreel />
        <Projects />
        <Contact />
      </main>
    </ClientShell>
  );
}
