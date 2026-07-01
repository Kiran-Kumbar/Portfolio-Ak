import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import About from "@/components/About";
import Experience from "@/components/Experience";
import NowBlock from "@/components/NowBlock";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ClientShell from "@/components/ClientShell";

export default function Home() {
  return (
    <ClientShell>
      <main className="flex min-h-screen flex-col items-center justify-between selection:bg-[var(--foreground)] selection:text-[var(--background)]">
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <NowBlock />
        <Projects />
        <Contact />
      </main>
    </ClientShell>
  );
}
