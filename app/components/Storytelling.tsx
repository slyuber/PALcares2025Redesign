// app/components/Storytelling.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Users, Sprout, BookOpen, ArrowRight, FlaskConical, ArrowDown } from "lucide-react";
import { cn } from "../lib/utils";
import Image from "next/image";
import { OverlaySheet } from "./ui/OverlaySheet";

export default function Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Separate refs for mobile layout
  const mobileStickyRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  // #region agent log
  const _dbgStoryMountRef = useRef(false);
  if (!_dbgStoryMountRef.current) {
    _dbgStoryMountRef.current = true;
    fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:Storytelling',message:'mount',data:{mounted:false},timestamp:Date.now(),sessionId:'debug-session',runId:'baseline',hypothesisId:'A'})}).catch(()=>{});
  }
  // #endregion agent log

  useEffect(() => {
    setMounted(true);
  }, []);

  // #region agent log
  // Hypothesis E: double scrollbar is caused by nested scroll container (stickyRef overflow-y-auto).
  // Verify by measuring scrollHeight/clientHeight and the computed overflow style.
  useEffect(() => {
    const reportScrollbars = (tag: string) => {
      const stickyEl = stickyRef.current;
      const containerEl = containerRef.current;
      const stickyComputed = stickyEl ? window.getComputedStyle(stickyEl) : null;
      const stickyOverflowY = stickyComputed?.overflowY;
      const stickyHasScrollbar = !!stickyEl && stickyEl.scrollHeight > stickyEl.clientHeight + 1;
      const containerHasScrollbar = !!containerEl && containerEl.scrollHeight > containerEl.clientHeight + 1;

      fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:scrollbars',message:'scrollbar check',data:{tag,stickyOverflowY,stickyClientH:stickyEl?.clientHeight,stickyScrollH:stickyEl?.scrollHeight,stickyHasScrollbar,containerClientH:containerEl?.clientHeight,containerScrollH:containerEl?.scrollHeight,containerHasScrollbar,viewportW:window.innerWidth,viewportH:window.innerHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'combo-v1',hypothesisId:'E'})}).catch(()=>{});
    };

    reportScrollbars('mount');
    const onResize = () => reportScrollbars('resize');
    window.addEventListener('resize', onResize);
    const t = window.setTimeout(() => reportScrollbars('after-500ms'), 500);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(t);
    };
  }, []);
  // #endregion agent log

  // Desktop scroll tracking - element is always rendered with dimensions (opacity hidden on mobile)
  // This allows Framer Motion to measure it even when visually hidden
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  // MotionValue fill progress (no React state updates during scroll)
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
  const teamsFill = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const researchFill = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const labsFill = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const teamsFillClamped = useTransform(teamsFill, clamp01);
  const researchFillClamped = useTransform(researchFill, clamp01);
  const labsFillClamped = useTransform(labsFill, clamp01);

  const _dbgScrollUpdatesRef = useRef(0);
  const _dbgIndexChangesRef = useRef(0);
  const _dbgFillUpdatesRef = useRef(0);
  const _dbgLastLogRef = useRef(0);
  const _dbgLastIndexRef = useRef<number | null>(null);

  // Measure header height for dynamic spacing
  useEffect(() => {
    const measureHeader = () => {
      const header = document.querySelector('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        setHeaderHeight(headerRect.height);
        document.documentElement.style.setProperty('--header-height', `${headerRect.height}px`);
      }
    };
    
    measureHeader();
    const timeoutId = setTimeout(measureHeader, 100);
    window.addEventListener('resize', measureHeader);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measureHeader);
    };
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      _dbgScrollUpdatesRef.current += 1;
      const newIndex = Math.min(4, Math.floor(latest * 5));
      if (_dbgLastIndexRef.current === null) _dbgLastIndexRef.current = newIndex;
      if (newIndex !== _dbgLastIndexRef.current) {
        _dbgIndexChangesRef.current += 1;
        _dbgLastIndexRef.current = newIndex;
        // Only update React state when the step changes
        setActiveIndex(newIndex);
      }
      // Fill progress is MotionValue-driven now (no setState here)

      const now = Date.now();
      if (now - _dbgLastLogRef.current > 1000) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:scrollYProgress.onChange',message:'scroll updates/sec',data:{updatesPerSec:_dbgScrollUpdatesRef.current,indexChangesPerSec:_dbgIndexChangesRef.current,fillUpdatesPerSec:_dbgFillUpdatesRef.current,activeIndex:newIndex,latest},timestamp:now,sessionId:'debug-session',runId:'baseline',hypothesisId:'A'})}).catch(()=>{});
        // #endregion agent log
        _dbgScrollUpdatesRef.current = 0;
        _dbgIndexChangesRef.current = 0;
        _dbgFillUpdatesRef.current = 0;
        _dbgLastLogRef.current = now;
      }
    });
  }, [scrollYProgress]);
  // END MODIFICATION

  // Replace springs with direct MotionValue transforms for scroll-linked visuals.
  // This avoids high-frequency spring updates during scrolling.
  const smoothProgress = useTransform(scrollYProgress, (v) => v);
  const lineOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 0.3, 0.3, 0]);

  // MODIFICATION: 2024-12-16 - Issue 2: Two-state intro reveal
  // Subtitle fades in after scroll begins, only "ecosystem" word changes color
  const subtitleOpacity = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);
  const smoothSubtitleOpacity = subtitleOpacity;
  const ecosystemColor = useTransform(scrollYProgress, [0.02, 0.08], ["#5C306C", "#FF9966"]);
  // END MODIFICATION

  // #region agent log
  // Hypothesis D: springs are still updating at high frequency and causing stutter
  const _dbgSpringUpdatesRef = useRef(0);
  const _dbgSubtitleSpringUpdatesRef = useRef(0);
  const _dbgSpringLastLogRef = useRef(0);
  useEffect(() => {
    const unsub1 = smoothProgress.on("change", () => {
      _dbgSpringUpdatesRef.current += 1;
    });
    const unsub2 = smoothSubtitleOpacity.on("change", () => {
      _dbgSubtitleSpringUpdatesRef.current += 1;
    });
    const interval = window.setInterval(() => {
      const now = Date.now();
      fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:springs',message:'spring updates/sec',data:{smoothProgressPerSec:_dbgSpringUpdatesRef.current,smoothSubtitlePerSec:_dbgSubtitleSpringUpdatesRef.current,activeIndex},timestamp:now,sessionId:'debug-session',runId:'post-fix',hypothesisId:'D'})}).catch(()=>{});
      _dbgSpringUpdatesRef.current = 0;
      _dbgSubtitleSpringUpdatesRef.current = 0;
      _dbgSpringLastLogRef.current = now;
    }, 1000);
    return () => {
      unsub1();
      unsub2();
      window.clearInterval(interval);
    };
  }, [smoothProgress, smoothSubtitleOpacity, activeIndex]);
  // #endregion agent log

  // #region agent log
  // Hypothesis G: content overlaps/clips (header/progress rail/pinned viewport) causing perceived stutter/awkwardness.
  // We check for clipping and overlap on step change + resize.
  useEffect(() => {
    const checkLayout = (tag: string) => {
      const stickyEl = stickyRef.current;
      const contentEl = contentRef.current;
      if (!stickyEl || !contentEl) return;

      const stickyRect = stickyEl.getBoundingClientRect();
      const contentRect = contentEl.getBoundingClientRect();
      const headerEl = document.querySelector('header');
      const headerRect = headerEl ? (headerEl as HTMLElement).getBoundingClientRect() : null;

      const rail = document.querySelector('[data-storytelling-rail=\"true\"]') as HTMLElement | null;
      const railRect = rail ? rail.getBoundingClientRect() : null;

      const topSafe = (headerRect ? headerRect.bottom : stickyRect.top) + 12;
      const bottomSafe = stickyRect.bottom - 12;

      const clippedTop = contentRect.top < topSafe;
      const clippedBottom = contentRect.bottom > bottomSafe;

      const overlapsRail = !!(railRect && (
        !(contentRect.right < railRect.left || contentRect.left > railRect.right || contentRect.bottom < railRect.top || contentRect.top > railRect.bottom)
      ));

      fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:layoutCheck',message:'layout check',data:{tag,activeIndex,viewportW:window.innerWidth,viewportH:window.innerHeight,stickyTop:stickyRect.top,stickyBottom:stickyRect.bottom,contentTop:contentRect.top,contentBottom:contentRect.bottom,topSafe,bottomSafe,clippedTop,clippedBottom,overlapsRail,railVisible:!!railRect},timestamp:Date.now(),sessionId:'debug-session',runId:'combo-v2',hypothesisId:'G'})}).catch(()=>{});
    };

    checkLayout('step-change');
    const onResize = () => checkLayout('resize');
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeIndex]);
  // #endregion agent log

  return (
    <>
      {/* 
        Mobile: Column Drop Pattern (Award-Winning UX Best Practices)
        - No scroll-jacking on mobile (natural scrolling preferred)
        - Fluid grid with responsive spacing (8px base unit)
        - Touch-friendly targets (min 44px)
        - Proper semantic HTML (header, article, footer)
        - Dynamic header spacing using CSS custom properties
        - Progressive enhancement (works without JS)
      */}
      <section
        id="storytelling-mobile"
        className="relative xl:hidden"
        aria-label="How we work - an ecosystem in three parts"
      >
        {/* #region agent log */}
        {/* Hypothesis H: some requested paragraphs are not rendering on mobile due to prop wiring/render logic. */}
        {/* We check for unique phrases in the DOM (safe: no user data). */}
        {(() => {
          if (typeof window !== "undefined") {
            // Run once shortly after mount to allow render.
            window.setTimeout(() => {
              const root = document.getElementById("storytelling-mobile");
              const text = root?.textContent ?? "";
              const hasTeamsDetails = text.includes("automated reporting saving weekends");
              const hasResearchDetails = text.includes("trust and infrastructure built through embedded partnerships");
              const hasLabsDetails = text.includes("pooling resources to run lean cohorts");
              fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:mobileContentCheck',message:'mobile details phrases present?',data:{viewportW:window.innerWidth,hasTeamsDetails,hasResearchDetails,hasLabsDetails},timestamp:Date.now(),sessionId:'debug-session',runId:'content-check',hypothesisId:'H'})}).catch(()=>{});
            }, 250);
          }
          return null;
        })()}
        {/* #endregion agent log */}
        {/* Spacer for fixed header - uses CSS custom property for dynamic header height */}
        <div 
          ref={mobileStickyRef}
          className="w-full"
          style={{
            paddingTop: headerHeight > 0 ? `${Math.max(headerHeight + 40, 100)}px` : '6rem',
          }}
        >
          {/* Content Container - Fluid Grid Pattern with consistent spacing system */}
          <div 
            ref={mobileContentRef} 
            className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20 pb-16"
          >
            {/* Panel 0: Intro - Hero Section Pattern */}
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

            {/* Panel 4: Ecosystem - Summary Section Pattern */}
            {/* REDESIGNED: Match desktop EcosystemPanel with icons, colors, and animated arrows */}
            <footer className="w-full max-w-3xl mx-auto pt-8 border-t border-[#5C306C]/10">
              {/* Header */}
              <div className="text-center space-y-4 sm:space-y-6 mb-8">
                <h2 className="text-2xl sm:text-3xl font-light text-[#6b4d7e] leading-tight tracking-tight">
                  How It Connects
                </h2>
                <p className="text-sm sm:text-base text-[#9b8a9e] leading-relaxed px-2">
                  Each part takes advantage of the others. Teams does the foundational work—building relationships, infrastructure and tools. Research generalizes solutions that have been tested through real use and releases them under open license. Labs builds on existing infrastructure to extend capacity.
                </p>
              </div>

              {/* Visual representation - Vertical Stack with animated arrows */}
              <div className="flex flex-col items-center space-y-5">
                {/* Research */}
                <div className="flex flex-col items-center text-center">
                  <BookOpen 
                    className="w-12 h-12 sm:w-14 sm:h-14 text-[#7388e0] mb-2" 
                    strokeWidth={1.3}
                  />
                  <h3 className="text-[#7388e0] mb-1 text-base sm:text-lg font-medium">
                    Research
                  </h3>
                  <p className="text-[#9b8a9e] text-xs sm:text-sm max-w-[180px] leading-relaxed">
                    Generalizes & shares under open license
                  </p>
                </div>

                {/* Arrow */}
                <motion.div 
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
                </motion.div>

                {/* Teams */}
                <div className="flex flex-col items-center text-center">
                  <Users 
                    className="w-12 h-12 sm:w-14 sm:h-14 text-[#ea5dff] mb-2" 
                    strokeWidth={1.3}
                  />
                  <h3 className="text-[#ea5dff] mb-1 text-base sm:text-lg font-medium">
                    Teams
                  </h3>
                  <p className="text-[#9b8a9e] text-xs sm:text-sm max-w-[180px] leading-relaxed">
                    Foundational work, relationships & infrastructure
                  </p>
                </div>

                {/* Arrow */}
                <motion.div 
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
                </motion.div>

                {/* Labs */}
                <div className="flex flex-col items-center text-center">
                  <FlaskConical 
                    className="w-12 h-12 sm:w-14 sm:h-14 text-[#FF9966] mb-2" 
                    strokeWidth={1.3}
                  />
                  <h3 className="text-[#FF9966] mb-1 text-base sm:text-lg font-medium">
                    Labs
                  </h3>
                  <p className="text-[#9b8a9e] text-xs sm:text-sm max-w-[180px] leading-relaxed">
                    Extends capacity, builds on foundation
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </section>

      {/* Desktop: Scroll-jacking layout - only on XL screens (1280px+) where there's enough space */}
      {/* Below XL, the mobile column layout is used which is more reliable */}
      <section
        ref={containerRef}
        id="storytelling"
        className="relative h-[500vh] hidden xl:block"
        aria-label="How we work - an ecosystem in three parts"
      >
      {/* #region agent log */}
      {/* Hypothesis I: desktop panels are hiding requested paragraphs behind disclosure and/or duplicating content. */}
      {/* Check whether key phrases exist in the DOM without user interaction. */}
      {(() => {
        if (typeof window !== "undefined") {
          window.setTimeout(() => {
            const root = document.getElementById("storytelling");
            const text = root?.textContent ?? "";
            const hasTeamsDetails = text.includes("automated reporting saving weekends");
            const hasResearchDetails = text.includes("trust and infrastructure built through embedded partnerships");
            const hasLabsDetails = text.includes("pooling resources to run lean cohorts");
            fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:desktopContentCheck',message:'desktop details phrases present?',data:{viewportW:window.innerWidth,hasTeamsDetails,hasResearchDetails,hasLabsDetails,activeIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'content-check',hypothesisId:'I'})}).catch(()=>{});
          }, 250);
        }
        return null;
      })()}
      {/* #endregion agent log */}
      <div 
        ref={stickyRef} 
        data-storytelling-sticky="true"
        className="sticky overflow-hidden flex flex-col items-center justify-center overscroll-contain"
        style={{
          // Position sticky container BELOW the header
          top: headerHeight > 0 ? `${headerHeight}px` : '0px',
          height: headerHeight > 0 ? `calc(100svh - ${headerHeight}px)` : '100svh',
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

        {/* Main Grid Layout - Content on left, Progress indicator on right (only at xl+) */}
        <div className="relative z-10 w-full h-full grid grid-cols-1 xl:grid-cols-[1fr_auto]">
          {/* Content Container */}
          <div 
            ref={contentRef} 
            className="w-full max-w-[1280px] mx-auto px-8 md:px-12 lg:px-16 py-8 md:py-12 flex flex-col justify-center min-h-full"
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
                Not three separate services—<span className="font-semibold">one approach</span> where each part takes advantage of the others.
              </motion.p>
            </div>
          </Panel>
          {/* END MODIFICATION */}

          {/* Panel 1: Teams - UPDATED CONTENT */}
          <ContentPanel
            active={activeIndex === 1}
            icon={<Users className="w-6 h-6 text-[#FF9966]" />}
            label="Embedded Partnerships"
            title="PAL Teams"
            description={<>PAL Teams embeds technical staff directly within organizations for <strong className="font-semibold text-[#5C306C]">multi-year partnerships</strong>—building the relationships, processes, and infrastructure that let frontline expertise guide technology development.</>}
            secondaryDescription="This is capacity building through daily work. Each tool we build addresses immediate needs while strengthening the connection between staff and their technical systems. We create the infrastructure—feedback loops, testing processes, communication channels—that makes this kind of iteration possible."
            details="The technical work ranges from urgent to strategic: the Excel formula that's mission-critical, the automated reporting saving weekends, the cloud infrastructure supporting growth, the cleaned data allowing you to tell your story more effectively. Multi-year commitment means we understand why that seemingly simple change is complex, why that workaround actually works."
            items={[
              "Multi-year partnerships give time to build relationships, processes and understanding",
              "Contracts structured to give room for real flexibility",
              "Creating feedback loops that connect staff to their technology"
            ]}
            quote="Once shared understanding and working processes are in place, iteration becomes affordable and quick. A report adjustment isn't a new project—it's a conversation. The database evolves with your programs rather than constraining them."
            prefersReducedMotion={prefersReducedMotion}
              fillProgress={teamsFillClamped}
          />

          {/* Panel 2: Research - UPDATED CONTENT */}
          <ContentPanel
            active={activeIndex === 2}
            icon={<BookOpen className="w-6 h-6 text-[#FF9966]" />}
            label="Turning Individual investments into sector resources."
            title="PAL Research"
            description={<>PAL Research generalizes solutions built through Teams partnerships and releases them under <strong className="font-semibold text-[#5C306C]">open license</strong>—so what works for one organization can benefit others in the sector.</>}
            secondaryDescription="This is knowledge transfer through proven solutions. Every tool we generalize has survived daily use, been shaped by frontline feedback, solved real operational problems. We work through the existing relationships and channels built by Teams to carefully extract the patterns—removing organization-specific information and sensitive data while preserving what makes the solution work."
            details="What makes this possible is the trust and infrastructure built through embedded partnerships. Organizations know their investment strengthens the sector while their specific context stays protected. Solutions spread because they emerged from actual use, not theoretical design."
            items={[
              "Solutions proven through daily use before being generalized",
              "Individual investments become collective sector resources",
              "Open licensing ensures tools stay with the community, not companies"
            ]}
            quote="What emerges from embedded work carries weight—it's been tested, refined, shaped by the people doing the work. Open licensing means it stays with the community."
            prefersReducedMotion={prefersReducedMotion}
              fillProgress={researchFillClamped}
          />

          {/* Panel 3: Labs - UPDATED CONTENT */}
          <ContentPanel
            active={activeIndex === 3}
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

          {/* Progress Indicator - In grid column 2, only at xl+ screens */}
          {/* ENHANCED: 20% larger with modern animations and glow effects */}
          <div className="hidden xl:flex flex-col items-center justify-center gap-5 pr-6 w-40" data-storytelling-rail="true">
            {(() => {
              const labels = ["Intro", "Teams", "Research", "Labs", "Summary"] as const;
              const scrollToStep = (i: number) => {
                const el = containerRef.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const top = window.scrollY + rect.top;
                const scrollRange = Math.max(1, el.offsetHeight - window.innerHeight);
                // Ensure we land inside the step bucket (activeIndex uses floor(latest*5)).
                const p = Math.min(0.999, Math.max(0.001, (i + 0.12) / 5));
                const target = top + (p * scrollRange);
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:rail',message:'rail click scrollToStep',data:{i,label:labels[i],p,containerTop:Math.round(top),scrollRange:Math.round(scrollRange),target:Math.round(target)},timestamp:Date.now(),sessionId:'debug-session',runId:'rail-v1',hypothesisId:'R'})}).catch(()=>{});
                // #endregion agent log
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
                    {/* Active indicator glow */}
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

function Panel({ active, children }: { active: boolean, children: React.ReactNode }) {
  return (
    <div
      data-storytelling-active-panel={active ? "true" : "false"}
      className={cn(
      // Absolute positioning within the content area (now a proper grid cell)
      "absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
      active ? "opacity-100 translate-y-0 blur-0 pointer-events-auto" : "opacity-0 translate-y-12 blur-sm pointer-events-none"
    )}
    >
      {/* WIDER: max-w-6xl (1152px) for better horizontal space usage */}
      <div className="w-full max-w-6xl px-6 md:px-10 lg:px-12">
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
  description: React.ReactNode;  // Supports semantic bolding
  secondaryDescription?: React.ReactNode;  // Supports semantic bolding
  details?: React.ReactNode;
  items: string[];
  quote?: string;
  prefersReducedMotion: boolean | null;
  fillProgress?: any;
}

// Mobile version - Column Drop Pattern with best practices:
// - Touch-friendly spacing (min 44px touch targets)
// - Clear visual hierarchy
// - Semantic HTML structure
// - Consistent spacing system (8px base unit)
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
  const _dbgMobileLoggedRef = useRef(false);

  // #region agent log
  if (!_dbgMobileLoggedRef.current) {
    _dbgMobileLoggedRef.current = true;
    fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ContentPanelMobile',message:'mobile panel mount',data:{title,hasSecondary:!!secondaryDescription,hasDetails:!!details},timestamp:Date.now(),sessionId:'debug-session',runId:'content-v2',hypothesisId:'H'})}).catch(()=>{});
  }
  // #endregion agent log

  return (
    <article className="space-y-6 sm:space-y-8 py-10 sm:py-14 border-b border-[#5C306C]/10 last:border-b-0">
      {/* Header Section - Icon + Label */}
      <header className="flex items-center gap-3 text-[#FF9966]">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FF9966]/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em]">
          {label}
        </span>
      </header>
      
      {/* Title - Larger on mobile */}
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
      
      {/* Key Points List - Touch-friendly with proper spacing */}
      <ul className="space-y-4 pt-2">
        {items.map((item: string, i: number) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[#5C306C]/90 text-[15px] sm:text-base min-h-[44px]"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-0.5">
              <ArrowRight className="w-3 h-3 text-[#FF9966]" />
            </div>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
      
      {/* Quote - Coral accent border */}
      {quote && (
        <blockquote className="mt-6 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[#5C306C]/75 text-[15px] sm:text-base leading-relaxed italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
      )}
    </article>
  );
}

function ContentPanel({ active, icon, label, title, description, secondaryDescription, details, items, quote, prefersReducedMotion, fillProgress = 0 }: ContentPanelProps) {
  // Progressive disclosure: keep pinned panels fitting vertically without adding inner scroll
  const [expanded, setExpanded] = useState(false);
  const _dbgExpandedCheckRef = useRef(0);
  const _dbgBalanceCheckRef = useRef(0);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // Reset expansion when step changes to keep the scrollytelling rhythm consistent
    if (!active) setExpanded(false);
  }, [active]);

  useEffect(() => {
    if (!active) setQuoteOpen(false);
  }, [active]);

  useEffect(() => {
    if (!active) setDetailsOpen(false);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    // #region agent log
    // Hypothesis K: PAL Labs "feels worst" due to desktop left/right column imbalance (quote height dominates).
    window.setTimeout(() => {
      const panelEl = document.querySelector('#storytelling [data-storytelling-active-panel=\"true\"]') as HTMLElement | null;
      if (!panelEl) return;
      const leftColEl = panelEl.querySelector('[data-storytelling-leftcol=\"true\"]') as HTMLElement | null;
      const rightColEl = panelEl.querySelector('[data-storytelling-contentcol=\"true\"]') as HTMLElement | null;
      const quoteEl = panelEl.querySelector('[data-storytelling-quote=\"true\"]') as HTMLElement | null;
      if (!leftColEl || !rightColEl) return;
      const leftRect = leftColEl.getBoundingClientRect();
      const rightRect = rightColEl.getBoundingClientRect();
      const quoteRect = quoteEl ? quoteEl.getBoundingClientRect() : null;
      const leftH = Math.round(leftRect.height);
      const rightH = Math.round(rightRect.height);
      const quoteH = quoteRect ? Math.round(quoteRect.height) : null;
      const quoteScrollH = quoteEl ? Math.round(quoteEl.scrollHeight) : null;
      const quoteClientH = quoteEl ? Math.round(quoteEl.clientHeight) : null;
      const quoteTextLen = quoteEl ? (quoteEl.textContent || '').trim().length : null;
      const imbalance = rightH > 0 ? Math.round((leftH / rightH) * 100) / 100 : null;
      _dbgBalanceCheckRef.current += 1;
      fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ContentPanel',message:'desktop balance check',data:{title,expanded,check:_dbgBalanceCheckRef.current,viewportW:window.innerWidth,viewportH:window.innerHeight,leftH,rightH,quoteH,quoteScrollH,quoteClientH,quoteTextLen,imbalance},timestamp:Date.now(),sessionId:'debug-session',runId:'labs-balance-v2',hypothesisId:'K'})}).catch(()=>{});
    }, 120);
    // #endregion agent log
  }, [active, title, expanded]);

  const shouldClampQuote = !!quote && (quote.length >= 260);

  return (
    <Panel active={active}>
      {/* F-PATTERN LAYOUT: Narrow left anchor (title/quote), wide right content area */}
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start w-full">
        
        {/* LEFT COLUMN (4 cols) - Visual anchor: Icon, Label, Title, Quote */}
        <div className="lg:col-span-4 space-y-5" data-storytelling-leftcol="true">
          {/* Icon + Label row */}
          <div className="flex items-center gap-3 text-[#FF9966]">
            <div className="w-10 h-10 rounded-xl bg-[#FF9966]/10 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              {label}
            </span>
          </div>
          
          {/* Title - Large and prominent */}
          <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-light text-[#5C306C] leading-[1.15] tracking-tight">
            {title}
          </h2>

          {/* Quote as visual anchor - italic, coral left border */}
          {quote && (
            <motion.blockquote
              data-storytelling-quote="true"
              className="mt-8 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[15px] text-[#5C306C]/75 leading-relaxed italic hidden lg:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : -10 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.35, duration: 0.5 }}
            >
              <div className="relative">
                <div
                  style={
                    shouldClampQuote && !quoteOpen
                      ? ({
                          display: "-webkit-box",
                          WebkitLineClamp: 6,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        } as any)
                      : undefined
                  }
                >
                  &ldquo;{quote}&rdquo;
                </div>
              </div>
            </motion.blockquote>
          )}

          {/* Long-quote disclosure (desktop): keep pinned layout clean, open full quote in a modal */}
          {quote && shouldClampQuote && (
            <button
              type="button"
              onClick={() => {
                setQuoteOpen(true);
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ContentPanel',message:'open quote modal',data:{title,quoteLen:quote.length},timestamp:Date.now(),sessionId:'debug-session',runId:'labs-quote-fix-v1',hypothesisId:'L'})}).catch(()=>{});
                // #endregion agent log
              }}
              className={cn(
                "hidden lg:inline-flex items-center gap-2 text-sm font-semibold transition-colors mt-3",
                "text-[#FF9966] hover:text-[#E07B4C]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
              )}
            >
              <span className="underline underline-offset-4 decoration-[#FF9966]/40">
                Read full quote
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>

          {/* RIGHT COLUMN (8 cols) - Main content with coral fill line */}
        <div className="lg:col-span-8 space-y-6 lg:pl-12 relative" data-storytelling-contentcol="true">
          {/* Vertical divider - base gray track */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[2px] bg-[#5C306C]/10 rounded-full" />
          {/* Animated coral fill - clean single color */}
          <motion.div 
            className="hidden lg:block absolute left-0 top-0 w-[2px] bg-[#FF9966] rounded-full origin-top"
            style={{ height: '100%', scaleY: active ? fillProgress : 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
          
          {/* Main description - larger, readable */}
          <p className="text-base md:text-lg lg:text-[17px] text-[#5C306C]/90 leading-[1.75]">
            {description}
          </p>
          
          {/* Read more: after paragraph 1 only (open overlay for full narrative) */}
          {(secondaryDescription || details) && (
            <button
              type="button"
              onClick={() => {
                const next = true;
                setDetailsOpen(true);
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ContentPanel',message:'open narrative sheet',data:{title,active},timestamp:Date.now(),sessionId:'debug-session',runId:'details-sheet-v2',hypothesisId:'F'})}).catch(()=>{});
                // #endregion agent log

                // #region agent log
                // Hypothesis J: opening the overlay should not change pinned layout sizing/scrollbars.
                window.setTimeout(() => {
                  const stickyEl = document.querySelector('#storytelling [data-storytelling-sticky=\"true\"]') as HTMLElement | null;
                  const headerEl = document.querySelector('header') as HTMLElement | null;
                  const panelEl = document.querySelector('#storytelling [data-storytelling-active-panel=\"true\"]') as HTMLElement | null;
                  const contentColEl = document.querySelector('#storytelling [data-storytelling-contentcol=\"true\"]') as HTMLElement | null;
                  if (!stickyEl || !panelEl) return;
                  const stickyRect = stickyEl.getBoundingClientRect();
                  const panelRect = panelEl.getBoundingClientRect();
                  const headerRect = headerEl ? headerEl.getBoundingClientRect() : null;
                  const topSafe = (headerRect ? headerRect.bottom : stickyRect.top) + 12;
                  const bottomSafe = stickyRect.bottom - 12;
                  const clippedTop = panelRect.top < topSafe;
                  const clippedBottom = panelRect.bottom > bottomSafe;
                  const overBy = Math.round(panelRect.bottom - bottomSafe);
                  const contentColRect = contentColEl ? contentColEl.getBoundingClientRect() : null;
                  const contentColOverBy = contentColRect ? Math.round(contentColRect.bottom - bottomSafe) : null;
                  _dbgExpandedCheckRef.current += 1;
                  fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ContentPanel',message:'pinned layout check (open overlay)',data:{title,check:_dbgExpandedCheckRef.current,viewportW:window.innerWidth,viewportH:window.innerHeight,stickyTop:Math.round(stickyRect.top),stickyBottom:Math.round(stickyRect.bottom),panelTop:Math.round(panelRect.top),panelBottom:Math.round(panelRect.bottom),topSafe:Math.round(topSafe),bottomSafe:Math.round(bottomSafe),clippedTop,clippedBottom,overBy,contentColOverBy},timestamp:Date.now(),sessionId:'debug-session',runId:'details-sheet-v2',hypothesisId:'J'})}).catch(()=>{});
                }, 80);
                // #endregion agent log
              }}
              className={cn(
                "inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide transition-colors",
                "text-[#FF9966] hover:text-[#E07B4C]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
              )}
              aria-expanded={detailsOpen}
            >
              <span className="underline underline-offset-4 decoration-[#FF9966]/40">
                Read more
              </span>
              <span aria-hidden="true">↗</span>
            </button>
          )}
          
          {/* Bullet points - clean, well-spaced */}
          <ul className="pt-2 grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-3">
            {items.map((item: string, i: number) => (
              <motion.li
                key={i}
                className="flex items-start gap-3 text-[#5C306C]/90 text-[15px] group"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: active ? 1 : 0, x: active ? 0 : 15 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.25 + (i * 0.08) }}
              >
                <div className="w-5 h-5 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#FF9966]/20 transition-colors">
                  <ArrowRight className="w-3 h-3 text-[#FF9966]" />
                </div>
                <span className="leading-relaxed group-hover:text-[#5C306C] transition-colors">{item}</span>
              </motion.li>
            ))}
          </ul>
          
          {/* Mobile quote - shown below content */}
          {quote && (
            <blockquote className="lg:hidden mt-6 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[#5C306C]/75 text-base leading-relaxed italic">
              &ldquo;{quote}&rdquo;
            </blockquote>
          )}
        </div>
      </div>

      {/* Quote modal (desktop only) */}
      <OverlaySheet
        open={quoteOpen && !!quote}
        onOpenChange={(next) => setQuoteOpen(next)}
        onCloseReason={(reason) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ContentPanel',message:`close quote modal (${reason})`,data:{title},timestamp:Date.now(),sessionId:'debug-session',runId:'labs-quote-fix-v2',hypothesisId:'L'})}).catch(()=>{});
          // #endregion agent log
        }}
        ariaLabel={`${title} quote`}
        title={title}
        subtitle={label}
      >
        {quote && (
          <blockquote className="pt-2 pl-5 border-l-2 border-[#FF9966]/50 text-[15px] text-[#5C306C]/75 leading-relaxed italic">
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}
      </OverlaySheet>

      <OverlaySheet
        open={detailsOpen && (!!secondaryDescription || !!details)}
        onOpenChange={(next) => setDetailsOpen(next)}
        onCloseReason={(reason) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ContentPanel',message:`close narrative sheet (${reason})`,data:{title},timestamp:Date.now(),sessionId:'debug-session',runId:'details-sheet-v2',hypothesisId:'F'})}).catch(()=>{});
          // #endregion agent log
        }}
        ariaLabel={`${title} more`}
        title={title}
        subtitle={label}
      >
        <div className="space-y-4">
          <p className="text-base md:text-[15px] text-[#5C306C]/80 leading-[1.75]">
            {description}
          </p>
          {secondaryDescription && (
            <p className="text-base md:text-[15px] text-[#5C306C]/80 leading-[1.75]">
              {secondaryDescription}
            </p>
          )}
          {details && (
            <p className="text-base md:text-[15px] text-[#5C306C]/80 leading-[1.75]">
              {details}
            </p>
          )}
        </div>
      </OverlaySheet>
    </Panel>
  );
}

// Component to render particle with masking near nodes (Desktop only)
interface ParticleData {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}

function ParticleWithMask({ particle }: { particle: ParticleData }) {
  const [progress, setProgress] = useState(0);
  const _dbgFramesRef = useRef(0);
  const _dbgLastRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / (particle.duration * 1000), 1);
      _dbgFramesRef.current += 1;
      setProgress(currentProgress);
      
      if (currentProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ParticleWithMask',message:'particle finished',data:{duration:particle.duration,frames:_dbgFramesRef.current},timestamp:Date.now(),sessionId:'debug-session',runId:'baseline',hypothesisId:'B'})}).catch(()=>{});
        // #endregion agent log
      }
    };
    animate();
  }, [particle.duration]);

  // #region agent log
  // lightweight fps sample (logs at most once per second per particle)
  const now = Date.now();
  if (now - _dbgLastRef.current > 1000) {
    _dbgLastRef.current = now;
    fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Storytelling.tsx:ParticleWithMask',message:'particle frame sample',data:{framesSoFar:_dbgFramesRef.current},timestamp:now,sessionId:'debug-session',runId:'baseline',hypothesisId:'B'})}).catch(()=>{});
  }
  // #endregion agent log

  // Calculate current position
  const currentX = particle.startX + (particle.endX - particle.startX) * progress;
  const currentY = particle.startY + (particle.endY - particle.startY) * progress;

  // Node positions with exclusion zones (larger to ensure no overlap)
  const nodes = [
    { x: 50, y: 15, radius: 15 }, // Research - larger exclusion zone
    { x: 20, y: 75, radius: 15 }, // Teams
    { x: 80, y: 75, radius: 15 }, // Labs
  ];

  // Check if particle is near any node - if so, hide it completely
  let isNearNode = false;
  for (const node of nodes) {
    const distance = Math.sqrt(
      Math.pow(currentX - node.x, 2) + Math.pow(currentY - node.y, 2)
    );
    if (distance < node.radius) {
      isNearNode = true;
      break;
    }
  }

  // Base opacity animation
  const getOpacity = () => {
    if (isNearNode) return 0; // Hide completely when near nodes
    if (progress < 0.15) return progress / 0.15 * 0.4;
    if (progress > 0.85) return (1 - progress) / 0.15 * 0.4;
    return 0.5;
  };

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-[#f18f6f] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{
        boxShadow: '0 0 10px rgba(241, 143, 111, 0.4), 0 0 20px rgba(241, 143, 111, 0.2)',
        zIndex: 5,
        opacity: getOpacity(),
        left: `${currentX}%`,
        top: `${currentY}%`,
      }}
      animate={{ 
        scale: isNearNode ? 0.5 : 1,
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
      }}
    />
  );
}

interface EcosystemPanelProps {
  active: boolean;
  title: string;
  description: string;
  prefersReducedMotion: boolean | null;
}

// REDESIGNED: Triangle layout with animated particles, PAL Cares icon centered, and new node colors
function EcosystemPanel({ active, title, description, prefersReducedMotion }: EcosystemPanelProps) {
  // NOTE: Particle timers (RAF/setInterval) have been replaced with SVG streaks for performance.
  // We keep ParticleWithMask component in the file (unused) for debug comparison, but do not run it.

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
              <BookOpen 
                className="w-14 h-14 text-[#7388e0] mb-3" 
                strokeWidth={1.3}
              />
              <h3 className="text-[#7388e0] mb-2 text-lg font-medium">
                Research
              </h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Generalizes & shares under open license
              </p>
            </motion.div>

            {/* Arrow */}
            <motion.div 
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
            </motion.div>

            {/* Teams */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <Users 
                className="w-14 h-14 text-[#ea5dff] mb-3" 
                strokeWidth={1.3}
              />
              <h3 className="text-[#ea5dff] mb-2 text-lg font-medium">
                Teams
              </h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Foundational work, relationships & infrastructure
              </p>
            </motion.div>

            {/* Arrow */}
            <motion.div 
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
            </motion.div>

            {/* Labs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <FlaskConical 
                className="w-14 h-14 text-[#FF9966] mb-3" 
                strokeWidth={1.3}
              />
              <h3 className="text-[#FF9966] mb-2 text-lg font-medium">
                Labs
              </h3>
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
            {/* SVG streaks (lightweight, no React state) */}
            {!prefersReducedMotion && active && (
              <g>
                {/* Research -> Teams */}
                <motion.circle
                  r="3"
                  fill="#FF9966"
                  initial={{ opacity: 0, cx: 300, cy: 42 }}
                  animate={{ opacity: [0, 0.55, 0], cx: [300, 120], cy: [42, 210], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 4.6, delay: 0.0, repeat: Infinity, ease: "linear" }}
                />
                {/* Teams -> Research */}
                <motion.circle
                  r="2.5"
                  fill="#FF9966"
                  initial={{ opacity: 0, cx: 120, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [120, 300], cy: [210, 42], scale: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 4.9, delay: 1.2, repeat: Infinity, ease: "linear" }}
                />
                {/* Research -> Labs */}
                <motion.circle
                  r="3"
                  fill="#FF9966"
                  initial={{ opacity: 0, cx: 300, cy: 42 }}
                  animate={{ opacity: [0, 0.55, 0], cx: [300, 480], cy: [42, 210], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 4.7, delay: 0.6, repeat: Infinity, ease: "linear" }}
                />
                {/* Labs -> Research */}
                <motion.circle
                  r="2.5"
                  fill="#FF9966"
                  initial={{ opacity: 0, cx: 480, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [480, 300], cy: [210, 42], scale: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 5.0, delay: 1.8, repeat: Infinity, ease: "linear" }}
                />
                {/* Teams -> Labs */}
                <motion.circle
                  r="2.75"
                  fill="#FF9966"
                  initial={{ opacity: 0, cx: 120, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [120, 480], cy: [210, 210], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 4.4, delay: 0.3, repeat: Infinity, ease: "linear" }}
                />
                {/* Labs -> Teams */}
                <motion.circle
                  r="2.75"
                  fill="#FF9966"
                  initial={{ opacity: 0, cx: 480, cy: 210 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [480, 120], cy: [210, 210], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 4.6, delay: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}
          </svg>

          {/* Nodes positioned absolutely */}
          <div className="relative h-full w-full">
            {/* Center mark: align to SVG centroid (stable across responsive scaling) */}
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

            {/* Particles removed (replaced by SVG streaks for smoothness) */}

            {/* Research - Top */}
            <motion.div 
              className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.8 }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
            >
              <div className="flex flex-col items-center group">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <BookOpen 
                    className="w-12 h-12 text-[#7388e0] mb-3" 
                    strokeWidth={1.3}
                  />
                </motion.div>
                <h3 className="text-[#7388e0] mb-1.5 text-lg font-medium">
                  Research
                </h3>
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
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Users 
                    className="w-12 h-12 text-[#ea5dff] mb-3" 
                    strokeWidth={1.3}
                  />
                </motion.div>
                <h3 className="text-[#ea5dff] mb-1.5 text-lg font-medium">
                  Teams
                </h3>
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
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <FlaskConical 
                    className="w-12 h-12 text-[#FF9966] mb-3" 
                    strokeWidth={1.3}
                  />
                </motion.div>
                <h3 className="text-[#FF9966] mb-1.5 text-lg font-medium">
                  Labs
                </h3>
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
// END MODIFICATION
