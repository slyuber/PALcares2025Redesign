// app/page.tsx
import Hero from "./components/Hero";
import NeedWeNoticed from "./components/NeedWeNoticed";
import Storytelling from "./components/Storytelling";
import DeeperContext from "./components/DeeperContext";
import Values from "./components/Values";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import ScrollBackground from "./components/ScrollBackground";

export default function Home() {
  return (
    <main className="relative" id="main-content">
      {/* Scroll-reactive textured background */}
      <ScrollBackground />
      
      {/* Section 1: Hero */}
      <Hero />
      
      {/* Section 2: The Need We Noticed / Where We Started */}
      <NeedWeNoticed />
      
      {/* Section 3: Ecosystem Scroll-Lock (Teams → Research → Labs → Summary) */}
      <Storytelling />
      
      {/* Section 4: The Work Behind It (4 alternating beats) */}
      <DeeperContext />
      
      {/* Section 5: Values (5 values) */}
      <Values />
      
      {/* Partner Stories */}
      <Testimonials />
      
      {/* Section 6: Contact */}
      <Contact />
    </main>
  );
}
