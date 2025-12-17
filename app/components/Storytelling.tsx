// app/components/Storytelling.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Users, Sprout, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

export default function Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  // MODIFICATION: 2024-12-16 - Track fill progress for each content panel's divider
  const [fillProgress, setFillProgress] = useState({ teams: 0, research: 0, labs: 0 });
  // MODIFICATION: 2024-12-16 - Track header height for responsive spacing
  const [headerHeight, setHeaderHeight] = useState(0);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // #region agent log
  useEffect(() => {
    const measureLayout = () => {
      const header = document.querySelector('header');
      const loader = document.querySelector('[class*="z-[999999]"]');
      const stickyEl = stickyRef.current;
      const contentEl = contentRef.current;
      
      if (header) {
        const headerRect = header.getBoundingClientRect();
        const measuredHeight = headerRect.height;
        setHeaderHeight(measuredHeight);
        
        // Set CSS variable for use in styles
        document.documentElement.style.setProperty('--header-height', `${measuredHeight}px`);
        
        if (stickyEl && contentEl) {
          const stickyRect = stickyEl.getBoundingClientRect();
          const contentRect = contentEl.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          const isMobile = viewportWidth < 768;
          const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
          
          const activePanel = contentEl.querySelector('[class*="absolute"][style*="opacity: 1"], [class*="opacity-100"]');
          const activePanelRect = activePanel ? (activePanel as HTMLElement).getBoundingClientRect() : null;
          
          const loaderVisible = loader && window.getComputedStyle(loader as HTMLElement).display !== 'none';
          const loaderZIndex = loader ? window.getComputedStyle(loader as HTMLElement).zIndex : null;
          
          const logData = {
            headerHeight: measuredHeight,
            headerTop: headerRect.top,
            headerBottom: headerRect.bottom,
            stickyTop: stickyRect.top,
            stickyHeight: stickyRect.height,
            stickyBottom: stickyRect.bottom,
            contentTop: contentRect.top,
            contentHeight: contentRect.height,
            contentBottom: contentRect.bottom,
            activePanelTop: activePanelRect?.top || null,
            activePanelBottom: activePanelRect?.bottom || null,
            activePanelVisible: activePanelRect ? (activePanelRect.top >= headerRect.bottom && activePanelRect.bottom <= viewportHeight) : null,
            viewportHeight,
            viewportWidth,
            isMobile,
            isTablet,
            contentOverlap: contentRect.top < headerRect.bottom,
            contentFits: contentRect.height <= (viewportHeight - measuredHeight),
            contentCutoffBottom: contentRect.bottom > viewportHeight,
            loaderVisible,
            loaderZIndex,
            availableHeight: viewportHeight - measuredHeight,
            contentOverflow: contentRect.height - (viewportHeight - measuredHeight)
          };
          
          console.log('[Storytelling Debug]', logData);
          
          fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:measureLayout',message:'Layout measurements',data:logData,timestamp:Date.now(),sessionId:'debug-session',runId:'mobile-fix',hypothesisId:'F,G,H,I,J,K'})}).catch(()=>{});
        }
      }
    };
    
    // Measure on mount and after delays to ensure header is rendered
    measureLayout();
    const timeoutId1 = setTimeout(measureLayout, 100);
    const timeoutId2 = setTimeout(measureLayout, 500);
    const timeoutId3 = setTimeout(measureLayout, 1000);
    
    window.addEventListener('resize', measureLayout);
    window.addEventListener('scroll', measureLayout, { passive: true });
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      window.removeEventListener('resize', measureLayout);
      window.removeEventListener('scroll', measureLayout);
    };
  }, []);
  // #endregion

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const newIndex = Math.min(4, Math.floor(latest * 5));
      setActiveIndex(newIndex);
      
      // Calculate fill progress for each section
      // Each section spans 0.2 of total progress (5 sections)
      // Teams: 0.2-0.4, Research: 0.4-0.6, Labs: 0.6-0.8
      const clamp = (val: number) => Math.max(0, Math.min(1, val));
      setFillProgress({
        teams: clamp((latest - 0.2) / 0.2),
        research: clamp((latest - 0.4) / 0.2),
        labs: clamp((latest - 0.6) / 0.2),
      });
    });
  }, [scrollYProgress]);
  // END MODIFICATION

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const lineOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.3, 0.3, 0]);

  // MODIFICATION: 2024-12-16 - Issue 2: Two-state intro reveal
  // Subtitle fades in after scroll begins, only "ecosystem" word changes color
  const subtitleOpacity = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);
  const smoothSubtitleOpacity = useSpring(subtitleOpacity, { stiffness: 100, damping: 20 });
  const ecosystemColor = useTransform(scrollYProgress, [0.02, 0.08], ["#5C306C", "#FF9966"]);
  // END MODIFICATION

  // Mobile: Simple stacked layout, no scroll-jacking
  if (isMobile) {
    return (
      <section
        ref={containerRef}
        id="storytelling"
        className="relative"
        aria-label="How we work - an ecosystem in three parts"
      >
        <div 
          ref={stickyRef}
          className="w-full"
          style={{
            paddingTop: headerHeight > 0 ? `${Math.max(headerHeight + 16, 80)}px` : '1rem',
          }}
        >
          <div 
            ref={contentRef} 
            className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-8 space-y-16"
          >
            {/* Panel 0: Intro */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h2
                className="font-light text-[#5C306C] tracking-tight leading-[1.15]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                An <span className="text-[#FF9966]">ecosystem</span> in three parts
              </h2>
              <p className="text-[#5C306C]/70 leading-relaxed max-w-2xl mx-auto text-base md:text-lg font-normal">
                Not three separate services—<span className="font-semibold">one approach</span> where each part takes advantage of the others. And where what we build stays with the sector.
              </p>
            </div>

            {/* Panel 1: Teams */}
            <ContentPanelMobile
              icon={<Users className="w-6 h-6 text-[#FF9966]" />}
              label="Embedded Partnerships"
              title="PAL Teams"
              description="PAL Teams embeds technical staff directly within organizations for multi-year partnerships—building the relationships, processes, and infrastructure that let frontline expertise guide technology development."
              secondaryDescription="We structure these as long-term commitments because that's what it takes. Our contracts give room for real flexibility—when priorities shift, when staff go on leave, when funders change requirements. The focus stays on the organization: their context, their work, what they need."
              items={[
                "Multi-year partnerships give time to build relationships and processes",
                "Contracts structured to give room for real flexibility",
                "The focus is on the organization—their context, their uniqueness, what they need"
              ]}
              quote="Once you have shared understanding and working processes in place, iteration becomes more affordable. A report adjustment isn't a new project requiring proposals and budgets—it's a conversation."
            />

            {/* Panel 2: Research */}
            <ContentPanelMobile
              icon={<BookOpen className="w-6 h-6 text-[#FF9966]" />}
              label="Shared Resources"
              title="PAL Research"
              description="PAL Research generalizes solutions built through Teams partnerships and releases them under open license—so what works for one organization can benefit the whole sector."
              secondaryDescription="We work closely with partner organizations through the relationships and channels built by Teams. Organization-specific information and sensitive data gets removed. What remains is the underlying pattern—something others can adapt for their own context."
              items={[
                "Generalizes solutions, removing organization-specific and sensitive information",
                "Works through existing Teams relationships to do this carefully",
                "Released under open license so it stays with the community"
              ]}
              quote="What emerges from embedded work carries weight—it's been tested, refined, shaped by the people doing the work. Open licensing means it stays with the community."
            />

            {/* Panel 3: Labs */}
            <ContentPanelMobile
              icon={<Sprout className="w-6 h-6 text-[#FF9966]" />}
              label="Building Local Capacity"
              title="PAL Labs"
              description="PAL Labs extends technical capacity to smaller organizations through supervised placements—matching real project needs with emerging talent while building on the infrastructure Teams has already established."
              secondaryDescription="Projects come from actual organization requests. We work with universities and co-op programs to match skills to needs—technical, design, evaluation, social work. Labs builds on the infrastructure from Teams work. That's why projects can be scoped to last—it's the groundwork, not magic."
              items={[
                "Projects come from actual organization requests",
                "We work with universities and co-op programs to match skills to needs",
                "Builds on Teams infrastructure—that's why things can be scoped to last"
              ]}
              quote="A computer science student from Waterloo could have worked anywhere in Toronto's tech scene. He chose Edmonton nonprofits while living with family. He was close to the people his work was for—meeting with organization directors who were genuinely interested in his results."
            />

            {/* Panel 4: Ecosystem */}
            <div className="w-full max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-[#5C306C] leading-tight tracking-tight">
                How It Connects
              </h2>
              <p className="text-sm md:text-base text-[#5C306C]/70 leading-relaxed">
                Each part takes advantage of the others. Teams does the foundational work—building relationships, processes, infrastructure. Research generalizes solutions that have been tested through real use and releases them under open license. Labs builds on existing infrastructure to extend capacity.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop: Original scroll-jacking layout
  return (
    <section
      ref={containerRef}
      id="storytelling"
      className="relative h-[500vh]"
      aria-label="How we work - an ecosystem in three parts"
    >
      <div 
        ref={stickyRef} 
        className="sticky top-0 overflow-hidden flex flex-col items-center justify-center"
        style={{
          height: headerHeight > 0 ? `calc(100svh - ${headerHeight}px)` : '100svh',
          paddingTop: headerHeight > 0 ? `${headerHeight}px` : '0px'
        }}
      >
        {/* Subtle warm wash - no hard edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFDFB]/30 to-transparent" />

        {/* Background Orbs - Static blur (no animation, better performance) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#FF9966]/5 blur-3xl opacity-40"
          />
          <div 
            className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-[#5C306C]/5 blur-3xl opacity-35"
          />

          {/* Background Nature Lines - Subtler */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none mix-blend-multiply">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <motion.path
              d="M100,1000 C150,800 50,600 100,400 C150,200 100,0 100,-200"
                stroke="currentColor"
                className="text-[#5C306C]/5"
                strokeWidth="1"
              fill="none"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: prefersReducedMotion ? 1 : smoothProgress, opacity: lineOpacity }}
            />
          </svg>
          </div>
        </div>

        {/* Content Container */}
        <div 
          ref={contentRef} 
          className="relative z-10 w-full max-w-[1200px] px-6 md:px-12 py-8 md:py-12 flex flex-col justify-center min-h-full"
        >
          {/* MODIFICATION: 2024-12-16 - Issue 2: Panel 0 with two-state reveal */}
          <Panel active={activeIndex === 0}>
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h2
                className="font-light text-[#5C306C] tracking-tight leading-[1.15]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                An <motion.span style={{ color: ecosystemColor }}>ecosystem</motion.span> in three parts
              </h2>
              <motion.p
                className="text-[#5C306C]/70 leading-relaxed max-w-2xl mx-auto text-base md:text-lg font-normal"
                style={{ opacity: smoothSubtitleOpacity }}
              >
                Not three separate services—<span className="font-semibold">one approach</span> where each part takes advantage of the others. And where what we build stays with the sector.
              </motion.p>
            </div>
          </Panel>
          {/* END MODIFICATION */}

          {/* Panel 1: Teams */}
          <ContentPanel
            active={activeIndex === 1}
            icon={<Users className="w-6 h-6 text-[#FF9966]" />}
            label="Embedded Partnerships"
            title="PAL Teams"
            description="PAL Teams embeds technical staff directly within organizations for multi-year partnerships—building the relationships, processes, and infrastructure that let frontline expertise guide technology development."
            secondaryDescription="We structure these as long-term commitments because that's what it takes. Our contracts give room for real flexibility—when priorities shift, when staff go on leave, when funders change requirements. The focus stays on the organization: their context, their work, what they need."
            items={[
              "Multi-year partnerships give time to build relationships and processes",
              "Contracts structured to give room for real flexibility",
              "The focus is on the organization—their context, their uniqueness, what they need"
            ]}
            quote="Once you have shared understanding and working processes in place, iteration becomes more affordable. A report adjustment isn't a new project requiring proposals and budgets—it's a conversation."
            prefersReducedMotion={prefersReducedMotion}
            fillProgress={fillProgress.teams}
          />

          {/* MODIFICATION: 2024-12-16 - Issue 3: Added quote to PAL Research */}
          <ContentPanel
            active={activeIndex === 2}
            icon={<BookOpen className="w-6 h-6 text-[#FF9966]" />}
            label="Shared Resources"
            title="PAL Research"
            description="PAL Research generalizes solutions built through Teams partnerships and releases them under open license—so what works for one organization can benefit the whole sector."
            secondaryDescription="We work closely with partner organizations through the relationships and channels built by Teams. Organization-specific information and sensitive data gets removed. What remains is the underlying pattern—something others can adapt for their own context."
            items={[
              "Generalizes solutions, removing organization-specific and sensitive information",
              "Works through existing Teams relationships to do this carefully",
              "Released under open license so it stays with the community"
            ]}
            quote="What emerges from embedded work carries weight—it's been tested, refined, shaped by the people doing the work. Open licensing means it stays with the community."
            prefersReducedMotion={prefersReducedMotion}
            fillProgress={fillProgress.research}
          />
          {/* END MODIFICATION */}

          {/* Panel 3: Labs */}
          <ContentPanel
            active={activeIndex === 3}
            icon={<Sprout className="w-6 h-6 text-[#FF9966]" />}
            label="Building Local Capacity"
            title="PAL Labs"
            description="PAL Labs extends technical capacity to smaller organizations through supervised placements—matching real project needs with emerging talent while building on the infrastructure Teams has already established."
            secondaryDescription="Projects come from actual organization requests. We work with universities and co-op programs to match skills to needs—technical, design, evaluation, social work. Labs builds on the infrastructure from Teams work. That's why projects can be scoped to last—it's the groundwork, not magic."
            items={[
              "Projects come from actual organization requests",
              "We work with universities and co-op programs to match skills to needs",
              "Builds on Teams infrastructure—that's why things can be scoped to last"
            ]}
            quote="A computer science student from Waterloo could have worked anywhere in Toronto's tech scene. He chose Edmonton nonprofits while living with family. He was close to the people his work was for—meeting with organization directors who were genuinely interested in his results."
            prefersReducedMotion={prefersReducedMotion}
            fillProgress={fillProgress.labs}
          />

          {/* MODIFICATION: 2024-12-16 - Issue 1: Updated content, removed "hard" and "It's not magic" */}
          <EcosystemPanel 
            active={activeIndex === 4}
            title="How It Connects"
            description="Each part takes advantage of the others. Teams does the foundational work—building relationships, processes, infrastructure. Research generalizes solutions that have been tested through real use and releases them under open license. Labs builds on existing infrastructure to extend capacity."
            prefersReducedMotion={prefersReducedMotion}
          />
          {/* END MODIFICATION */}
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="relative flex items-center justify-end w-32 group cursor-pointer" onClick={() => {
                // Ideally this would scroll to the section, but we'll just show the visual state for now
            }}>
                <span className={cn(
                    "text-xs font-bold uppercase tracking-widest mr-4 transition-all duration-300",
                    i === activeIndex ? "opacity-100 text-[#5C306C]" : "opacity-0 -translate-x-2 pointer-events-none"
                )}>
                    {["Intro", "Teams", "Research", "Labs", "Connected"][i]}
                </span>
            <motion.div
              className={cn(
                        "w-1.5 rounded-full transition-all duration-500 bg-[#5C306C]",
                        i === activeIndex ? "bg-[#FF9966]" : "bg-[#5C306C]/20 group-hover:bg-[#5C306C]/40"
              )}
                    animate={{ 
                        height: i === activeIndex ? 32 : 6,
                        width: i === activeIndex ? 6 : 6
                    }}
            />
            </div>
          ))}
        </div>

        {/* Screen reader announcement */}
        <div className="sr-only" role="status" aria-live="polite">
          {`Viewing section ${activeIndex + 1} of 5`}
        </div>
        </div>
      </div>
    </section>
  );
}

function Panel({ active, children }: { active: boolean, children: React.ReactNode }) {
  return (
    <div className={cn(
      "absolute top-0 left-0 right-0 w-full flex items-start justify-center px-6 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
      "min-h-full py-8 md:py-0 md:items-center md:bottom-0",
      active ? "opacity-100 translate-y-0 blur-0 pointer-events-auto" : "opacity-0 translate-y-12 blur-sm pointer-events-none"
    )}>
      <div className="w-full max-w-full">
        {children}
      </div>
    </div>
  );
}

interface ContentPanelProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  items: string[];
  quote?: string;
  prefersReducedMotion: boolean | null;
  fillProgress?: number;
}

// Mobile version - simple stacked layout
function ContentPanelMobile({ icon, label, title, description, secondaryDescription, items, quote }: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  items: string[];
  quote?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-[#FF9966]">
        <div className="w-9 h-9 rounded-lg bg-[#FF9966]/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.15em]">
          {label}
        </div>
      </div>
      
      <h2 className="text-3xl font-light text-[#5C306C] leading-tight tracking-tight">
        {title}
      </h2>

      <p className="text-base text-[#5C306C]/85 leading-relaxed">
        {description}
      </p>
      
      {secondaryDescription && (
        <p className="text-sm text-[#5C306C]/80 leading-relaxed">
          {secondaryDescription}
        </p>
      )}
      
      <ul className="space-y-3">
        {items.map((item: string, i: number) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[#5C306C]/85 text-sm"
          >
            <div className="w-5 h-5 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-0.5">
              <ArrowRight className="w-3 h-3 text-[#FF9966]" />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      
      {quote && (
        <blockquote className="mt-6 pl-4 border-l-2 border-[#5C306C]/20 text-[#5C306C]/70 text-base leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>
      )}
    </div>
  );
}

function ContentPanel({ active, icon, label, title, description, secondaryDescription, items, quote, prefersReducedMotion, fillProgress = 0 }: ContentPanelProps) {
  return (
    <Panel active={active}>
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full max-w-[1000px]">
        
        {/* Left Column - Title & Label */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center gap-3 text-[#FF9966]">
             <div className="w-9 h-9 rounded-lg bg-[#FF9966]/10 flex items-center justify-center">
               {icon}
             </div>
             <div className="text-[10px] font-bold uppercase tracking-[0.15em]">
               {label}
             </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light text-[#5C306C] leading-tight tracking-tight">
            {title}
          </h2>

          {quote && (
            <motion.blockquote 
              className="mt-6 pt-6 border-t border-[#5C306C]/20 text-base text-[#5C306C]/70 leading-relaxed hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.4 }}
            >
              &ldquo;{quote}&rdquo;
            </motion.blockquote>
          )}
        </div>

        {/* Right Column - Content with animated divider */}
        <div className="lg:col-span-7 space-y-6 lg:pl-10 relative py-2">
          {/* Base divider track (faint gray) */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-[#5C306C]/15" />
          {/* Animated fill overlay */}
          <motion.div 
            className="hidden lg:block absolute left-0 top-0 w-px bg-gradient-to-b from-[#8FAE8B] via-[#FF9966] to-[#5C306C] origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: active ? fillProgress : 0 }}
            style={{ height: '100%' }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
          <p className="text-base md:text-lg text-[#5C306C]/85 leading-relaxed">
            {description}
          </p>
          {secondaryDescription && (
            <p className="text-sm md:text-base text-[#5C306C]/80 leading-relaxed">
              {secondaryDescription}
            </p>
          )}
          <ul className="space-y-3">
            {items.map((item: string, i: number) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-[#5C306C]/85 text-sm md:text-base group"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: active ? 1 : 0, x: active ? 0 : 20 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.3 + (i * 0.1) }}
              >
                <div className="w-5 h-5 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF9966]/20 transition-colors">
                   <ArrowRight className="w-3 h-3 text-[#FF9966]" />
                </div>
                <span className="group-hover:text-[#5C306C] transition-colors">{item}</span>
              </motion.li>
            ))}
          </ul>
          
          {/* Mobile only quote */}
          {quote && (
             <blockquote className="lg:hidden mt-6 pl-4 border-l-2 border-[#5C306C]/20 text-[#5C306C]/70 text-base leading-relaxed">
               &ldquo;{quote}&rdquo;
             </blockquote>
          )}
        </div>
      </div>
    </Panel>
  );
}

interface EcosystemPanelProps {
  active: boolean;
  title: string;
  description: string;
  prefersReducedMotion: boolean | null;
}

// MODIFICATION: 2024-12-16 - Issue 1: Replaced animated ellipse with simpler static triangular diagram
function EcosystemPanel({ active, title, description, prefersReducedMotion }: EcosystemPanelProps) {
    return (
        <Panel active={active}>
            <div className="w-full max-w-3xl h-full flex flex-col justify-center items-center px-4">
                {/* Header Section */}
                <div className="text-center space-y-3 mb-6 md:mb-10 max-w-xl">
                     <h2 className="text-2xl md:text-3xl font-light text-[#5C306C] leading-tight tracking-tight">
                        {title}
                     </h2>
                     <p className="text-sm md:text-base text-[#5C306C]/70 leading-relaxed">
                        {description}
                     </p>
                </div>

                {/* Simplified static diagram with triangular layout */}
                <div className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center">
                    
                    {/* Static connecting lines - triangular shape */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                        {/* Triangle connecting lines */}
                        <motion.path
                            d="M200,40 L340,230 L60,230 Z"
                            fill="none"
                            stroke="#5C306C"
                            strokeOpacity="0.1"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: active ? 1 : 0 }}
                            transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: "easeOut" }}
                        />
                        
                        {/* Directional flow indicators */}
                        <motion.circle
                            cx="270" cy="135"
                            r="3"
                            fill="#FF9966"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: active ? 0.6 : 0 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
                        />
                        <motion.circle
                            cx="200" cy="230"
                            r="3"
                            fill="#FF9966"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: active ? 0.6 : 0 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.7 }}
                        />
                        <motion.circle
                            cx="130" cy="135"
                            r="3"
                            fill="#FF9966"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: active ? 0.6 : 0 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.9 }}
                        />
                    </svg>

                    {/* Node: Research (Top) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-32 md:w-40 z-10">
                        <motion.div 
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border border-[#5C306C]/10 flex items-center justify-center mb-2 shadow-[0_4px_20px_rgba(92,48,108,0.08)]"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                        >
                            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-[#FF9966]" strokeWidth={1.5} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 5 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
                        >
                            <h3 className="text-sm md:text-base font-medium text-[#5C306C] mb-0.5">Research</h3>
                            <p className="text-[10px] md:text-[11px] text-[#5C306C]/60 leading-snug hidden md:block">
                                Generalizes & shares<br/>under open license
                            </p>
                        </motion.div>
                    </div>

                    {/* Node: Teams (Bottom Left) */}
                    <div className="absolute bottom-[5%] left-[8%] flex flex-col items-center text-center w-32 md:w-40 z-10">
                         <motion.div 
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border border-[#5C306C]/10 flex items-center justify-center mb-2 shadow-[0_4px_20px_rgba(92,48,108,0.08)]"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.4 }}
                        >
                            <Users className="w-5 h-5 md:w-6 md:h-6 text-[#FF9966]" strokeWidth={1.5} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 5 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
                        >
                            <h3 className="text-sm md:text-base font-medium text-[#5C306C] mb-0.5">Teams</h3>
                            <p className="text-[10px] md:text-[11px] text-[#5C306C]/60 leading-snug hidden md:block">
                                Foundational work<br/>relationships & infrastructure
                            </p>
                        </motion.div>
                    </div>

                    {/* Node: Labs (Bottom Right) */}
                    <div className="absolute bottom-[5%] right-[8%] flex flex-col items-center text-center w-32 md:w-40 z-10">
                         <motion.div 
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border border-[#5C306C]/10 flex items-center justify-center mb-2 shadow-[0_4px_20px_rgba(92,48,108,0.08)]"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: active ? 1 : 0.8, opacity: active ? 1 : 0 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.6 }}
                        >
                            <Sprout className="w-5 h-5 md:w-6 md:h-6 text-[#FF9966]" strokeWidth={1.5} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 5 }}
                            transition={{ delay: prefersReducedMotion ? 0 : 0.7 }}
                        >
                            <h3 className="text-sm md:text-base font-medium text-[#5C306C] mb-0.5">Labs</h3>
                            <p className="text-[10px] md:text-[11px] text-[#5C306C]/60 leading-snug hidden md:block">
                                Extends capacity<br/>builds on foundation
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </Panel>
    )
}
// END MODIFICATION
