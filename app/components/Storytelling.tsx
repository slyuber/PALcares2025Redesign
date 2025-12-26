// app/components/Storytelling.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, MotionValue } from "framer-motion";
import { Users, Sprout, BookOpen, ArrowRight, FlaskConical, ArrowDown, ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";
import Image from "next/image";

export default function Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobileStickyRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [headerHeight, setHeaderHeight] = useState(0);

  // Desktop scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false,  // Fix for Next.js production builds
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);  // Track last index to avoid unnecessary setState calls
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/7441a0bd-e4da-4256-be0e-b7fd7579ac7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:30',message:'activeIndex state changed',data:{activeIndex,timestamp:Date.now()},sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, [activeIndex]);
  // #endregion
  
  // MotionValue fill progress
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const teamsFill = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const researchFill = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const labsFill = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const teamsFillClamped = useTransform(teamsFill, clamp01);
  const researchFillClamped = useTransform(researchFill, clamp01);
  const labsFillClamped = useTransform(labsFill, clamp01);

  // Measure header height for dynamic spacing
  useEffect(() => {
    const measureHeader = () => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/7441a0bd-e4da-4256-be0e-b7fd7579ac7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:43',message:'measureHeader called',data:{currentHeaderHeight:headerHeight,timestamp:Date.now()},sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      const header = document.querySelector('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        const newHeight = headerRect.height;
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/7441a0bd-e4da-4256-be0e-b7fd7579ac7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:47',message:'header height measured',data:{newHeight,oldHeight:headerHeight,willChange:newHeight!==headerHeight,timestamp:Date.now()},sessionId:'debug-session',runId:'post-fix',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Only update if height actually changed to prevent infinite loop
        if (newHeight !== headerHeight) {
          setHeaderHeight(newHeight);
          document.documentElement.style.setProperty('--header-height', `${newHeight}px`);
        }
      }
    };
    
    measureHeader();
    const timeoutId = setTimeout(measureHeader, 100);
    window.addEventListener('resize', measureHeader);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measureHeader);
    };
  }, [headerHeight]); // headerHeight included - the check inside measureHeader prevents infinite loops

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const newIndex = Math.min(4, Math.floor(latest * 5));
      // Only trigger state update if index actually changed (ref comparison avoids setState overhead)
      if (newIndex !== lastIndexRef.current) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/7441a0bd-e4da-4256-be0e-b7fd7579ac7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:65',message:'activeIndex update triggered',data:{newIndex,oldIndex:lastIndexRef.current,timestamp:Date.now()},sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        lastIndexRef.current = newIndex;
        setActiveIndex(newIndex);
      }
    });
  }, [scrollYProgress]);

  // Direct MotionValue transforms for scroll-linked visuals
  const smoothProgress = useTransform(scrollYProgress, (v) => {
    // #region agent log
    if (Math.random() < 0.01) { // Sample 1% of calls to avoid log spam
      fetch('http://127.0.0.1:7243/ingest/7441a0bd-e4da-4256-be0e-b7fd7579ac7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:70',message:'useTransform smoothProgress calculation',data:{v,timestamp:Date.now()},sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    // #endregion
    return v;
  });
  const lineOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.3, 0.3, 0]);

  // Two-state intro reveal
  const subtitleOpacity = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);
  const smoothSubtitleOpacity = subtitleOpacity;
  const ecosystemColor = useTransform(scrollYProgress, [0.02, 0.08], ["#5C306C", "#FF9966"]);

  return (
    <>
      {/* Mobile Layout */}
      <section
        id="storytelling-mobile"
        className="relative xl:hidden"
        aria-label="How we work - an ecosystem in three parts"
      >
        <div 
          ref={mobileStickyRef}
          className="w-full"
          style={{
            paddingTop: headerHeight > 0 ? `${Math.max(headerHeight + 40, 100)}px` : '6rem',
          }}
        >
          <div 
            ref={mobileContentRef} 
            className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 pb-16"
          >
            {/* Panel 0: Intro */}
            <header className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <h1
                className="font-light text-[#5C306C] tracking-tight leading-[1.15]"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                An <span className="text-[#FF9966]">ecosystem</span> in three parts
              </h1>
              <p className="text-[#5C306C]/70 leading-relaxed max-w-2xl mx-auto text-base sm:text-lg font-normal px-2">
                Not three separate services—<span className="font-semibold">one approach</span> where each part takes advantage of the others.
              </p>
            </header>

            {/* Panel 1: Teams - MOBILE */}
            <ContentPanelMobile
              icon={<Users className="w-6 h-6 text-[#FF9966]" />}
              label="Embedded Partnerships"
              title="PAL Teams"
              description="PAL Teams embeds technical staff directly within organizations for multi-year partnerships—building the relationships, processes, and infrastructure that let frontline expertise guide technology development."
              secondaryDescription="This is capacity building through daily work. Each tool we build addresses immediate needs while strengthening the connection between staff and their technical systems. We create the infrastructure—feedback loops, testing processes, communication channels—that makes this kind of iteration possible."
              details="The technical work ranges from urgent to strategic: the Excel formula that's mission-critical, the automated reporting saving weekends, the cloud infrastructure supporting growth, the cleaned data allowing you to tell your story more effectively. Multi-year commitment means we understand why that seemingly simple change is complex, why that workaround actually works."
              items={[
                "Multi-year partnerships give time to build relationships, processes and understanding",
                "Contracts structured to give room for real flexibility",
                "Creating feedback loops that connect staff to their technology"
              ]}
              quote="Once shared understanding and working processes are in place, iteration becomes affordable and quick. A report adjustment isn't a new project—it's a conversation. The database evolves with your programs rather than constraining them."
            />

            {/* Panel 2: Research - MOBILE */}
            <ContentPanelMobile
              icon={<BookOpen className="w-6 h-6 text-[#FF9966]" />}
              label="Turning Individual investments into sector resources."
              title="PAL Research"
              description="PAL Research generalizes solutions built through Teams partnerships and releases them under open license—so what works for one organization can benefit others in the sector."
              secondaryDescription="This is knowledge transfer through proven solutions. Every tool we generalize has survived daily use, been shaped by frontline feedback, solved real operational problems. We work through the existing relationships and channels built by Teams to carefully extract the patterns—removing organization-specific information and sensitive data while preserving what makes the solution work."
              details="What makes this possible is the trust and infrastructure built through embedded partnerships. Organizations know their investment strengthens the sector while their specific context stays protected. Solutions spread because they emerged from actual use, not theoretical design."
              items={[
                "Solutions proven through daily use before being generalized",
                "Individual investments become collective sector resources",
                "Open licensing ensures tools stay with the community, not companies"
              ]}
              quote="What emerges from embedded work carries weight—it's been tested, refined, shaped by the people doing the work. Open licensing means it stays with the community."
            />

            {/* Panel 3: Labs - MOBILE */}
            <ContentPanelMobile
              icon={<Sprout className="w-6 h-6 text-[#FF9966]" />}
              label="Building Local Capacity"
              title="PAL Labs"
              description="PAL Labs extends technical capacity to organizations through supervised placements—connecting emerging talent with real project needs while building on the relationships and infrastructure Teams has already established."
              secondaryDescription="Labs operates on the foundation Teams creates. The organizational understanding, the trusted relationships, the technical infrastructure—all become the base for meaningful placements. A student generalizes an existing solution for sector-wide use. A newcomer builds custom tools for unique program needs. Someone transitioning careers creates data infrastructure. Different people, different skills, same structure: learn in our environments under mentorship, apply those skills where they're needed, leave something maintainable behind."
              details="We gather funding from foundations, government, and larger organizations who understand the sector-wide benefit—pooling resources to run lean cohorts where technical talent learns specialized skills. The technical work is sophisticated—data engineering, cloud architecture, custom development—but connected to frontline reality through existing relationships. That messy data isn't abstract; it represents real people receiving real services."
              items={[
                "Emerging talent learns specialized skills, then applies them to community needs",
                "Projects build on Teams' existing infrastructure and relationships",
                "Funded collectively by stakeholders who benefit from a stronger ecosystem"
              ]}
              quote="A Waterloo engineering student completed his co-op term locally through PALcares. Working in our environment first under mentorship, then with real data—cleaning years of messy information to answer a specific operational question under a deadline. The organization gets critical capacity they couldn't otherwise afford. The student sees his technical expertise applied in the social service sector on his own community."
            />

            {/* Panel 4: Ecosystem Summary - MOBILE */}
            <footer className="w-full max-w-3xl mx-auto pt-8 border-t border-[#5C306C]/10">
              <div className="text-center space-y-4 sm:space-y-6 mb-8">
                <h2 className="text-2xl sm:text-3xl font-light text-[#6b4d7e] leading-tight tracking-tight">
                  How It Connects
                </h2>
                <p className="text-sm sm:text-base text-[#9b8a9e] leading-relaxed px-2">
                  Each part takes advantage of the others. Teams does the foundational work—building relationships, infrastructure and tools. Research generalizes solutions that have been tested through real use and releases them under open license. Labs builds on existing infrastructure to extend capacity.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-5">
                <div className="flex flex-col items-center text-center">
                  <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 text-[#7388e0] mb-2" strokeWidth={1.3} />
                  <h3 className="text-[#7388e0] mb-1 text-base sm:text-lg font-medium">Research</h3>
                  <p className="text-[#9b8a9e] text-xs sm:text-sm max-w-[180px] leading-relaxed">
                    Generalizes & shares under open license
                  </p>
                </div>

                <motion.div 
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
                </motion.div>

                <div className="flex flex-col items-center text-center">
                  <Users className="w-12 h-12 sm:w-14 sm:h-14 text-[#ea5dff] mb-2" strokeWidth={1.3} />
                  <h3 className="text-[#ea5dff] mb-1 text-base sm:text-lg font-medium">Teams</h3>
                  <p className="text-[#9b8a9e] text-xs sm:text-sm max-w-[180px] leading-relaxed">
                    Foundational work, relationships & infrastructure
                  </p>
                </div>

                <motion.div 
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
                </motion.div>

                <div className="flex flex-col items-center text-center">
                  <FlaskConical className="w-12 h-12 sm:w-14 sm:h-14 text-[#FF9966] mb-2" strokeWidth={1.3} />
                  <h3 className="text-[#FF9966] mb-1 text-base sm:text-lg font-medium">Labs</h3>
                  <p className="text-[#9b8a9e] text-xs sm:text-sm max-w-[180px] leading-relaxed">
                    Extends capacity, builds on foundation
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </section>

      {/* Desktop: Scroll-jacking layout - only on XL screens */}
      <section
        ref={containerRef}
        id="storytelling"
        className="relative h-[500vh] hidden xl:block"
        aria-label="How we work - an ecosystem in three parts"
      >
        <div 
          ref={stickyRef} 
          data-storytelling-sticky="true"
          className="sticky overflow-hidden flex flex-col items-center justify-center overscroll-contain"
          style={{
            top: headerHeight > 0 ? `${headerHeight}px` : '0px',
            height: headerHeight > 0 ? `calc(100svh - ${headerHeight}px)` : '100svh',
          }}
        >
          {/* Subtle warm wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFDFB]/30 to-transparent" />

          {/* Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[#FF9966]/5 blur-3xl opacity-40" />
            <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-[#5C306C]/5 blur-3xl opacity-35" />

            {/* Background Nature Lines */}
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

          {/* Main Grid Layout */}
          <div className="relative z-10 w-full h-full grid grid-cols-1 xl:grid-cols-[1fr_auto]">
            {/* Content Container */}
            <div 
              ref={contentRef} 
              className="w-full max-w-[1280px] mx-auto px-8 md:px-12 lg:px-16 py-8 md:py-12 flex flex-col justify-center min-h-full"
            >
              {/* Panel 0: Intro */}
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
                    Not three separate services—<span className="font-semibold">one approach</span> where each part takes advantage of the others.
                  </motion.p>
                </div>
              </Panel>

              {/* Panel 1: Teams */}
              <ContentPanel
                active={activeIndex === 1}
                icon={<Users className="w-6 h-6 text-[#FF9966]" />}
                label="Embedded Partnerships"
                title="PAL Teams"
                description={<>PAL Teams embeds technical staff directly within organizations for <strong className="font-semibold text-[#5C306C]">multi-year partnerships</strong>—building the relationships, processes, and infrastructure that let frontline expertise guide technology development.</>}
                secondaryDescription={<>This is <strong className="font-semibold text-[#5C306C]">capacity building through daily work</strong>. Each tool we build addresses immediate needs while strengthening the connection between staff and their technical systems. We create the infrastructure—<strong className="font-semibold text-[#5C306C]">feedback loops, testing processes, communication channels</strong>—that makes this kind of iteration possible.</>}
                details={<>The technical work ranges from urgent to strategic: the Excel formula that&apos;s mission-critical, the <strong className="font-semibold text-[#5C306C]">automated reporting saving weekends</strong>, the cloud infrastructure supporting growth, the cleaned data allowing you to tell your story more effectively. Multi-year commitment means we understand why that seemingly simple change is complex, <strong className="font-semibold text-[#5C306C]">why that workaround actually works</strong>.</>}
                items={[
                  "Multi-year partnerships give time to build relationships, processes and understanding",
                  "Contracts structured to give room for real flexibility",
                  "Creating feedback loops that connect staff to their technology"
                ]}
                quote="Once shared understanding and working processes are in place, iteration becomes affordable and quick. A report adjustment isn't a new project—it's a conversation. The database evolves with your programs rather than constraining them."
                prefersReducedMotion={prefersReducedMotion}
                fillProgress={teamsFillClamped}
              />

              {/* Panel 2: Research */}
              <ContentPanel
                active={activeIndex === 2}
                icon={<BookOpen className="w-6 h-6 text-[#FF9966]" />}
                label="Turning Individual investments into sector resources."
                title="PAL Research"
                description={<>PAL Research generalizes solutions built through Teams partnerships and releases them under <strong className="font-semibold text-[#5C306C]">open license</strong>—so what works for one organization can benefit others in the sector.</>}
                secondaryDescription={<>This is <strong className="font-semibold text-[#5C306C]">knowledge transfer through proven solutions</strong>. Every tool we generalize has survived daily use, been shaped by frontline feedback, solved real operational problems. We work through the existing relationships and channels built by Teams to carefully extract the patterns—<strong className="font-semibold text-[#5C306C]">removing organization-specific information</strong> and sensitive data while preserving what makes the solution work.</>}
                details={<>What makes this possible is the <strong className="font-semibold text-[#5C306C]">trust and infrastructure built through embedded partnerships</strong>. Organizations know their investment strengthens the sector while their specific context stays protected. Solutions spread because they <strong className="font-semibold text-[#5C306C]">emerged from actual use</strong>, not theoretical design.</>}
                items={[
                  "Solutions proven through daily use before being generalized",
                  "Individual investments become collective sector resources",
                  "Open licensing ensures tools stay with the community, not companies"
                ]}
                quote="What emerges from embedded work carries weight—it's been tested, refined, shaped by the people doing the work. Open licensing means it stays with the community."
                prefersReducedMotion={prefersReducedMotion}
                fillProgress={researchFillClamped}
              />

              {/* Panel 3: Labs */}
              <ContentPanel
                active={activeIndex === 3}
                icon={<Sprout className="w-6 h-6 text-[#FF9966]" />}
                label="Building Local Capacity"
                title="PAL Labs"
                description={<>PAL Labs extends technical capacity to organizations through <strong className="font-semibold text-[#5C306C]">supervised placements</strong>—connecting emerging talent with real project needs while building on the relationships and infrastructure Teams has already established.</>}
                secondaryDescription={<>Labs operates on the <strong className="font-semibold text-[#5C306C]">foundation Teams creates</strong>. The organizational understanding, the trusted relationships, the technical infrastructure—all become the base for meaningful placements. A student generalizes an existing solution for sector-wide use. A newcomer builds custom tools for unique program needs. Someone transitioning careers creates data infrastructure. <strong className="font-semibold text-[#5C306C]">Different people, different skills, same structure</strong>: learn in our environments under mentorship, apply those skills where they&apos;re needed, leave something maintainable behind.</>}
                details={<>We gather funding from foundations, government, and larger organizations who understand the sector-wide benefit—<strong className="font-semibold text-[#5C306C]">pooling resources to run lean cohorts</strong> where technical talent learns specialized skills. The technical work is sophisticated—data engineering, cloud architecture, custom development—but <strong className="font-semibold text-[#5C306C]">connected to frontline reality</strong> through existing relationships. That messy data isn&apos;t abstract; it represents real people receiving real services.</>}
                items={[
                  "Emerging talent learns specialized skills, then applies them to community needs",
                  "Projects build on Teams' existing infrastructure and relationships",
                  "Funded collectively by stakeholders who benefit from a stronger ecosystem"
                ]}
                quote="A Waterloo engineering student completed his co-op term locally through PALcares. Working in our environment first under mentorship, then with real data—cleaning years of messy information to answer a specific operational question under a deadline. The organization gets critical capacity they couldn't otherwise afford. The student sees his technical expertise applied in the social service sector on his own community."
                prefersReducedMotion={prefersReducedMotion}
                fillProgress={labsFillClamped}
              />

              {/* Panel 4: How It Connects */}
              <EcosystemPanel 
                active={activeIndex === 4}
                title="How It Connects"
                description="Each part takes advantage of the others. Teams does the foundational work—building relationships, infrastructure and tools. Research generalizes solutions that have been tested through real use and releases them under open license. Labs builds on existing infrastructure to extend capacity."
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            {/* Progress Indicator */}
            <div className="hidden xl:flex flex-col items-center justify-center gap-5 pr-6 w-40" data-storytelling-rail="true">
              {(() => {
                const labels = ["Intro", "Teams", "Research", "Labs", "Summary"] as const;
                const scrollToStep = (i: number) => {
                  const el = containerRef.current;
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const top = window.scrollY + rect.top;
                  const scrollRange = Math.max(1, el.offsetHeight - window.innerHeight);
                  const p = Math.min(0.999, Math.max(0.001, (i + 0.12) / 5));
                  const target = top + (p * scrollRange);
                  window.scrollTo({ top: target, behavior: prefersReducedMotion ? "auto" : "smooth" });
                };

                return [0, 1, 2, 3, 4].map((i) => (
                  <motion.button
                    key={i}
                    type="button"
                    className="relative flex items-center justify-end w-full group"
                    onClick={() => scrollToStep(i)}
                    aria-label={`Jump to ${labels[i]}`}
                    whileHover={{ scale: 1.05 }}
                    whileFocus={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-wider mr-4 whitespace-nowrap transition-all duration-200",
                        i === activeIndex
                          ? "text-[#5C306C] opacity-100 translate-x-0"
                          : "text-[#5C306C]/60 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                      )}
                    >
                      {labels[i]}
                    </span>

                    <motion.div
                      className={cn(
                        "rounded-full relative",
                        i === activeIndex
                          ? "bg-gradient-to-b from-[#FF9966] to-[#FF9966]/80 shadow-[0_0_12px_rgba(255,153,102,0.4)]"
                          : "bg-[#5C306C]/15 group-hover:bg-[#5C306C]/30 group-focus-visible:bg-[#5C306C]/30"
                      )}
                      animate={{
                        height: i === activeIndex ? 36 : 6,
                        width: 6,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      {i === activeIndex && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-[#FF9966] blur-md"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.3, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.div>
                  </motion.button>
                ));
              })()}
            </div>
          </div>

          {/* Screen reader announcement */}
          <div className="sr-only" role="status" aria-live="polite">
            {`Viewing section ${activeIndex + 1} of 5`}
          </div>
        </div>
      </section>
    </>
  );
}

const Panel = React.memo(({ active, children }: { active: boolean, children: React.ReactNode }) => {
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7243/ingest/7441a0bd-e4da-4256-be0e-b7fd7579ac7c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:429',message:'Panel render',data:{active,timestamp:Date.now()},sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
  });
  // #endregion
  return (
    <div
      data-storytelling-active-panel={active ? "true" : "false"}
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
        active ? "opacity-100 translate-y-0 blur-0 pointer-events-auto" : "opacity-0 translate-y-12 blur-sm pointer-events-none"
      )}
    >
      <div className="w-full max-w-6xl px-6 md:px-10 lg:px-12">
        {children}
      </div>
    </div>
  );
});
Panel.displayName = 'Panel';

interface ContentPanelProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: React.ReactNode;
  secondaryDescription?: React.ReactNode;
  details?: React.ReactNode;
  items: string[];
  quote?: string;
  prefersReducedMotion: boolean | null;
  fillProgress?: MotionValue<number> | number;
}

// Mobile version - shows all content inline
function ContentPanelMobile({ icon, label, title, description, secondaryDescription, details, items, quote }: {
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  details?: string;
  items: string[];
  quote?: string;
}) {
  return (
    <article className="space-y-6 sm:space-y-8 py-10 sm:py-14 border-b border-[#5C306C]/10 last:border-b-0">
      {/* Header Section - Enhanced icon container */}
      <header className="flex items-center gap-3 text-[#FF9966]">
        <motion.div
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 icon-container-enhanced"
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Multi-layer background */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF9966]/15 to-[#FF9966]/5" />
          <div className="absolute inset-0 rounded-xl border border-[#FF9966]/20" />
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "radial-gradient(circle at center, rgba(255, 153, 102, 0.2) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          <div className="relative z-10">{icon}</div>
        </motion.div>
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em]">
          {label}
        </span>
      </header>
      
      {/* Title */}
      <h2 className="text-[1.75rem] sm:text-3xl font-light text-[#5C306C] leading-[1.2] tracking-tight">
        {title}
      </h2>

      {/* Main Content */}
      <div className="space-y-4">
        <p className="text-base sm:text-lg text-[#5C306C]/90 leading-[1.7]">
          {description}
        </p>

        {secondaryDescription && (
          <p className="text-[15px] sm:text-base text-[#5C306C]/75 leading-[1.7]">
            {secondaryDescription}
          </p>
        )}

        {details && (
          <p className="text-[15px] sm:text-base text-[#5C306C]/75 leading-[1.7]">
            {details}
          </p>
        )}
      </div>
      
      {/* Key Points List */}
      <ul className="space-y-4 pt-2">
        {items.map((item: string, i: number) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[#5C306C]/90 text-[15px] sm:text-base min-h-[44px]"
          >
            <motion.div
              className="w-6 h-6 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF9966]/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <ArrowRight className="w-3 h-3 text-[#FF9966]" />
            </motion.div>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
      
      {/* Quote */}
      {quote && (
        <blockquote className="mt-6 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[#5C306C]/75 text-[15px] sm:text-base leading-relaxed italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
      )}
    </article>
  );
}

// Desktop version - with inline expansion
function ContentPanel({ 
  active, 
  icon, 
  label, 
  title, 
  description, 
  secondaryDescription, 
  details, 
  items, 
  quote, 
  prefersReducedMotion, 
  fillProgress = 0 
}: ContentPanelProps) {
  const [expanded, setExpanded] = useState(false);

  // Reset expansion when panel becomes inactive
  useEffect(() => {
    if (!active) setExpanded(false);
  }, [active]);

  return (
    <Panel active={active}>
      {/* F-PATTERN LAYOUT - Left anchor narrows when expanded to give prose more room */}
      <div className={cn(
        "grid gap-10 lg:gap-12 items-start w-full transition-all duration-500",
        expanded 
          ? "lg:grid-cols-[280px_1fr]"  // Fixed narrow left when expanded
          : "lg:grid-cols-12"            // Standard 12-col grid when collapsed
      )}>
        
        {/* LEFT COLUMN - Visual anchor: Icon, Label, Title */}
        <div className={cn(
          "space-y-5",
          !expanded && "lg:col-span-4"
        )} data-storytelling-leftcol="true">
          {/* Icon + Label row - Enhanced icon container */}
          <div className="flex items-center gap-3 text-[#FF9966]">
            <motion.div
              className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 icon-container-enhanced"
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Multi-layer background */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF9966]/15 to-[#FF9966]/5" />
              <div className="absolute inset-0 rounded-xl border border-[#FF9966]/20" />
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at center, rgba(255, 153, 102, 0.2) 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
              />
              <div className="relative z-10">{icon}</div>
            </motion.div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              {label}
            </span>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-light text-[#5C306C] leading-[1.15] tracking-tight">
            {title}
          </h2>

          {/* Back button - only shown when expanded */}
          <AnimatePresence>
            {expanded && (
              <motion.button
                type="button"
                onClick={() => setExpanded(false)}
                className={cn(
                  "inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide transition-colors",
                  "text-[#5C306C]/60 hover:text-[#5C306C]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded",
                  "mt-4"
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to overview</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Quote as visual anchor - only shown when NOT expanded (collapsed state) */}
          <AnimatePresence>
            {quote && !expanded && (
              <motion.blockquote
                data-storytelling-quote="true"
                className="mt-8 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[15px] text-[#5C306C]/75 leading-relaxed italic hidden lg:block"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: active ? 1 : 0, x: active ? 0 : -10 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.35, duration: 0.5 }}
              >
                {/* Show truncated quote in collapsed state */}
                <div
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  } as React.CSSProperties}
                >
                  &ldquo;{quote}&rdquo;
                </div>
              </motion.blockquote>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN - Main content (expands when in expanded state) */}
        <div className={cn(
          "lg:pl-12 relative",
          !expanded && "lg:col-span-8"
        )} data-storytelling-contentcol="true">
          {/* Vertical divider - base gray track */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[2px] bg-[#5C306C]/10 rounded-full" />
          {/* Animated coral fill */}
          <motion.div 
            className="hidden lg:block absolute left-0 top-0 w-[2px] bg-[#FF9966] rounded-full origin-top"
            style={{ height: '100%', scaleY: active ? fillProgress : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
          
          {/* COLLAPSED STATE: Description + Read more + Bullets */}
          <AnimatePresence mode="wait">
            {!expanded ? (
              <motion.div
                key="collapsed"
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Main description */}
                <p className="text-base md:text-lg lg:text-[17px] text-[#5C306C]/90 leading-[1.75]">
                  {description}
                </p>
                
                {/* Read more button */}
                {(secondaryDescription || details) && (
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className={cn(
                      "inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide transition-all",
                      "text-[#FF9966] hover:text-[#E07B4C]",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded",
                      "group"
                    )}
                    aria-expanded={expanded}
                  >
                    <span className="underline underline-offset-4 decoration-[#FF9966]/40 group-hover:decoration-[#FF9966]">
                      Read more
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                
                {/* Bullet points */}
                <ul className="pt-2 grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-3">
                  {items.map((item: string, i: number) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-3 text-[#5C306C]/90 text-[15px] group"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: active ? 1 : 0, x: active ? 0 : 15 }}
                      transition={{ delay: prefersReducedMotion ? 0 : 0.25 + (i * 0.08) }}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF9966]/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <ArrowRight className="w-3 h-3 text-[#FF9966]" />
                      </motion.div>
                      <span className="leading-relaxed group-hover:text-[#5C306C] transition-colors">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                
                {/* Mobile quote */}
                {quote && (
                  <blockquote className="lg:hidden mt-6 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[#5C306C]/75 text-base leading-relaxed italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                )}
              </motion.div>
            ) : (
              /* EXPANDED STATE: Award-winning single-column prose */
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* 
                  Editorial-style prose layout inspired by:
                  - Medium's reading experience
                  - Stripe's documentation
                  - Award-winning nonprofit annual reports
                  
                  Key principles:
                  - Full-width utilization with optimal line length
                  - Visual rhythm through varied paragraph styling
                  - Generous vertical breathing room
                  - Subtle visual hierarchy without being heavy
                */}
                <article className="prose-container">
                  {/* Lead paragraph - slightly larger, full color, sets the tone */}
                  <p className="text-[18px] lg:text-[20px] text-[#5C306C] leading-[1.75] tracking-[-0.01em]">
                    {description}
                  </p>
                  
                  {/* Visual breath - subtle coral accent */}
                  <div className="my-8 flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-gradient-to-r from-[#FF9966] to-[#FF9966]/0 rounded-full" />
                  </div>
                  
                  {/* Body content - comfortable reading size */}
                  {secondaryDescription && (
                    <p className="text-[16px] lg:text-[17px] text-[#5C306C]/80 leading-[1.85] mb-6">
                      {secondaryDescription}
                    </p>
                  )}
                  
                  {details && (
                    <p className="text-[16px] lg:text-[17px] text-[#5C306C]/80 leading-[1.85]">
                      {details}
                    </p>
                  )}
                </article>
              </motion.div>
            )}
          </AnimatePresence>
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

function EcosystemPanel({ active, title, description, prefersReducedMotion }: EcosystemPanelProps) {
  return (
    <Panel active={active}>
      <div className="w-full max-w-5xl h-full flex flex-col justify-center items-center px-6 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-8 md:mb-16 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[#FF9966] mb-4 text-2xl md:text-3xl font-medium tracking-tight">
            {title}
          </h2>
          <p className="text-[#5C306C]/75 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </motion.div>

        {/* MOBILE LAYOUT - Vertical Stack */}
        <div className="block md:hidden w-full">
          <div className="flex flex-col items-center space-y-6">
            {/* Research */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <BookOpen className="w-14 h-14 text-[#7388e0] mb-3" strokeWidth={1.3} />
              <h3 className="text-[#7388e0] mb-2 text-lg font-medium">Research</h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Generalizes & shares under open license
              </p>
            </motion.div>

            <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
            </motion.div>

            {/* Teams */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <Users className="w-14 h-14 text-[#ea5dff] mb-3" strokeWidth={1.3} />
              <h3 className="text-[#ea5dff] mb-2 text-lg font-medium">Teams</h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Foundational work, relationships & infrastructure
              </p>
            </motion.div>

            <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
              <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
            </motion.div>

            {/* Labs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <FlaskConical className="w-14 h-14 text-[#FF9966] mb-3" strokeWidth={1.3} />
              <h3 className="text-[#FF9966] mb-2 text-lg font-medium">Labs</h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Extends capacity, builds on foundation
              </p>
            </motion.div>
          </div>
        </div>

        {/* DESKTOP LAYOUT - Triangle with Particles */}
        <div className="hidden md:block relative max-w-3xl mx-auto w-full" style={{ height: '400px' }}>
          {/* SVG Background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 600 280"
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 0 }}
          >
            {/* SVG streaks */}
            {!prefersReducedMotion && active && (
              <g>
                <motion.circle
                  r="3" fill="#FF9966"
                  initial={{ opacity: 0, cx: 300, cy: 42 }}
                  animate={{ opacity: [0, 0.55, 0], cx: [300, 120], cy: [42, 210], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 4.6, delay: 0.0, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.5" fill="#FF9966"
                  initial={{ opacity: 0, cx: 120, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [120, 300], cy: [210, 42], scale: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 4.9, delay: 1.2, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="3" fill="#FF9966"
                  initial={{ opacity: 0, cx: 300, cy: 42 }}
                  animate={{ opacity: [0, 0.55, 0], cx: [300, 480], cy: [42, 210], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 4.7, delay: 0.6, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.5" fill="#FF9966"
                  initial={{ opacity: 0, cx: 480, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [480, 300], cy: [210, 42], scale: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 5.0, delay: 1.8, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.75" fill="#FF9966"
                  initial={{ opacity: 0, cx: 120, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [120, 480], cy: [210, 210], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 4.4, delay: 0.3, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.75" fill="#FF9966"
                  initial={{ opacity: 0, cx: 480, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [480, 120], cy: [210, 210], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 4.6, delay: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}
          </svg>

          {/* Nodes positioned absolutely */}
          <div className="relative h-full w-full">
            {/* Center mark */}
            <motion.div
              className="absolute pointer-events-none left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: active ? 0.25 : 0, scale: active ? 1 : 0.95 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              <div className="relative w-[120px] h-[114px]">
                <Image
                  src="/svg/PALcares_icon.svg"
                  alt="PAL Cares"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Research - Top */}
            <motion.div 
              className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
            >
              <div className="flex flex-col items-center group">
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400 }}>
                  <BookOpen className="w-12 h-12 text-[#7388e0] mb-3" strokeWidth={1.3} />
                </motion.div>
                <h3 className="text-[#7388e0] mb-1.5 text-lg font-medium">Research</h3>
                <p className="text-[#9b8a9e] text-center text-sm max-w-[160px] leading-snug">
                  Generalizes & shares under open license
                </p>
              </div>
            </motion.div>

            {/* Teams - Bottom Left */}
            <motion.div 
              className="absolute left-[10%] bottom-[8%] z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.4 }}
            >
              <div className="flex flex-col items-center group">
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Users className="w-12 h-12 text-[#ea5dff] mb-3" strokeWidth={1.3} />
                </motion.div>
                <h3 className="text-[#ea5dff] mb-1.5 text-lg font-medium">Teams</h3>
                <p className="text-[#9b8a9e] text-center text-sm max-w-[160px] leading-snug">
                  Foundational work, relationships & infrastructure
                </p>
              </div>
            </motion.div>

            {/* Labs - Bottom Right */}
            <motion.div 
              className="absolute right-[10%] bottom-[8%] z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.6 }}
            >
              <div className="flex flex-col items-center group">
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400 }}>
                  <FlaskConical className="w-12 h-12 text-[#FF9966] mb-3" strokeWidth={1.3} />
                </motion.div>
                <h3 className="text-[#FF9966] mb-1.5 text-lg font-medium">Labs</h3>
                <p className="text-[#9b8a9e] text-center text-sm max-w-[160px] leading-snug">
                  Extends capacity, builds on foundation
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Panel>
  );
}