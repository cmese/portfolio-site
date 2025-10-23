import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Skills from "@/sections/Skills";
import Experience from "@/sections/Experience";
import Contact from "@/sections/Contact";
import Footer from "@/components/Footer";
import { TimelineProgressProvider } from "@/contexts/TimelineProgress";

export default function HomePage() {
  return (
    <TimelineProgressProvider>
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </TimelineProgressProvider>
  );
}
