// app/components/Storytelling.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence, MotionValue, useInView, useMotionValueEvent } from "framer-motion";
import { useSafeInView } from "../lib/animation-constants";
import { Users, Sprout, BookOpen, ArrowRight, FlaskConical, ArrowDown, ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { EASE_OUT_EXPO, EASE_PREMIUM, EASE_SNAPPY, EASE_IN_OUT, SPRING_SNAPPY, SPRING_GENTLE, DURATION_FAST, SCROLL_DURATION_SNAP, SCROLL_DURATION_NAV } from "../lib/animation-constants";
import { useScrollTo } from "../lib/use-scroll-to";
import Image from "next/image";

export default function Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobileStickyRef = useRef<HTMLDivElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const scrollTo = useScrollTo();
  const [headerHeight, setHeaderHeight] = useState(0);

  // Desktop scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Skip button visibility — gated on scroll progress, not IntersectionObserver
  const showSkipRef = useRef(false);
  const [showSkipButton, setShowSkipButton] = useState(false);

  // Track if mobile section is in view — gates infinite particle animations
  const isMobileInView = useInView(mobileStickyRef, {
    margin: "100px 0px",
    once: false,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);  // Track last index to avoid unnecessary setState calls
  
  
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
      const header = document.querySelector('header');
      if (header) {
        const headerRect = header.getBoundingClientRect();
        const newHeight = headerRect.height;
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

  // PERF: useMotionValueEvent is optimized internally vs manual .on() subscription
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.min(4, Math.floor(latest * 5));
    // Only trigger state update if index actually changed (ref comparison avoids setState overhead)
    if (newIndex !== lastIndexRef.current) {
      lastIndexRef.current = newIndex;
      setActiveIndex(newIndex);
    }
    // Skip button: visible after ecosystem color change, hidden near end
    const shouldShowSkip = latest > 0.07 && latest < 0.8;
    if (shouldShowSkip !== showSkipRef.current) {
      showSkipRef.current = shouldShowSkip;
      setShowSkipButton(shouldShowSkip);
    }
  });

  // Direct MotionValue transforms for scroll-linked visuals
  // PERF: Removed no-op smoothProgress transform - use scrollYProgress directly
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.3, 0.3, 0]);

  // Scroll cue: brief appearance on section entry, gone before ecosystem color change completes
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.01, 0.04, 0.06], [0, 0.6, 0.6, 0]);

  // Two-state intro reveal - completes by 0.06 for early clarity
  const subtitleOpacity = useTransform(scrollYProgress, [0.02, 0.06], [0, 1]);

  // Scroll-linked color transition for "ecosystem" text
  // Starts purple (same as heading), transitions to coral as user scrolls
  // Completes by 0.07 to sync with settle
  const ecosystemColor = useTransform(
    scrollYProgress,
    [0.02, 0.07],
    ["#5C306C", "#FF9966"]
  );

  // Letter-spacing animation for "ecosystem" - letters converge together
  // Metaphor: the ecosystem "comes together" as user engages
  // Completes by 0.07 to sync with settle
  const ecosystemLetterSpacing = useTransform(
    scrollYProgress,
    [0.02, 0.07],
    ["0.08em", "0em"]
  );

  // Scale animation for "ecosystem" - subtle overshoot then settle
  // Creates a satisfying "landing" moment when the transition completes
  // Extended range for more pronounced settle effect
  const ecosystemScale = useTransform(
    scrollYProgress,
    [0.02, 0.05, 0.07, 0.10],
    [1, 1.02, 1.005, 1]
  );

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
            className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 space-y-16 sm:space-y-20 pb-16"
          >
            {/* Panel 0: Intro */}
            <MobileIntroHeader />

            {/* Panel 1: Teams - MOBILE */}
            <ContentPanelMobile
              id="mobile-panel-teams"
              icon={<Users className="w-6 h-6 text-[#FF9966]" />}
              label="Embedded Partnerships"
              title="PAL Teams"
              description={<>PAL Teams embeds technical staff directly within organizations for <strong className="font-semibold text-[#5C306C]">multi-year partnerships</strong>&mdash;building the relationships, processes, and infrastructure that let frontline expertise guide technology development.</>}
              secondaryDescription={<>The organizations we work with vary. Some have dedicated technical staff. Some have consultants. Some have systems built years ago that have outlived the context they were designed for. What they share is a gap between what their technology does and what they need it to do, and the recognition that closing that gap requires more than a project. It requires <strong className="font-semibold text-[#5C306C]">someone inside the organization long enough to understand it</strong>.</>}
              details={<>The technical work ranges from urgent to strategic: the Excel formula that&apos;s mission-critical, the <strong className="font-semibold text-[#5C306C]">automated reporting saving weekends</strong>, the cloud infrastructure supporting growth, the cleaned data allowing you to tell your story more effectively. Some of the systems we maintain run around the clock. Multi-year commitment means we understand why that seemingly simple change is complex, <strong className="font-semibold text-[#5C306C]">why that workaround works</strong>, and we&apos;re reachable when something doesn&apos;t.</>}
              items={[
                <><strong className="font-semibold text-[#5C306C]">Multi-year partnerships</strong> that give time to build relationships, processes, and real understanding</>,
                <><strong className="font-semibold text-[#5C306C]">Contracts structured for flexibility,</strong> so roadblocks become problems to solve, not threats to the project</>,
                <><strong className="font-semibold text-[#5C306C]">Infrastructure built to make changes cheaper, faster,</strong> and lower-risk over time</>
              ]}
              quote="Once shared understanding and working processes are in place, iteration becomes affordable and quick. That tweak to a report? A five-minute conversation, not a new statement of work. The database evolves with your programs rather than constraining them."
            />

            {/* Panel 2: Research - MOBILE */}
            <ContentPanelMobile
              id="mobile-panel-research"
              icon={<BookOpen className="w-6 h-6 text-[#FF9966]" />}
              label="Shared Solutions"
              title="PAL Research"
              description={<>PAL Research takes solutions built through PAL Teams partnerships and works to release them under <strong className="font-semibold text-[#5C306C]">open license</strong>. What one organization&apos;s work produced, others don&apos;t have to rebuild from scratch.</>}
              secondaryDescription={<>This is <strong className="font-semibold text-[#5C306C]">knowledge transfer through proven solutions</strong>. Every tool we generalize has survived daily use, been shaped by frontline feedback, and solved real operational problems. We work through the relationships and channels PAL Teams have already built&mdash;carefully extracting the patterns, stripping out anything specific to one organization while keeping what makes the solution work.</>}
              details={<>What makes this possible is the trust and working relationships built through embedded partnerships. Organizations know their investment strengthens the sector while their specific context stays protected. Solutions spread because they emerged from <strong className="font-semibold text-[#5C306C]">actual use, not theoretical design</strong>. The first tools built through this process are in testing now, with public releases coming.</>}
              items={[
                <><strong className="font-semibold text-[#5C306C]">Generalization starts with the user base,</strong> not the solution: we find who needs it before deciding if it&apos;s worth building</>,
                <><strong className="font-semibold text-[#5C306C]">Individual investments become collective resources</strong>&mdash;without exposing the organizational specifics behind them</>,
                <><strong className="font-semibold text-[#5C306C]">Open licensing</strong> ensures tools stay with the community, not locked behind vendor agreements</>
              ]}
              quote="What emerges from embedded work carries weight—it's been tested, refined, shaped by the people doing the work. Open licensing means it stays with the community."
            />

            {/* Panel 3: Labs - MOBILE */}
            <ContentPanelMobile
              id="mobile-panel-labs"
              icon={<Sprout className="w-6 h-6 text-[#FF9966]" />}
              label="Building Local Capacity"
              title="PAL Labs"
              description={<>PAL Labs extends technical capacity to organizations through <strong className="font-semibold text-[#5C306C]">supervised placements</strong>&mdash;connecting students and newcomers to organizations that have genuine needs and the infrastructure to support them. Every placement is scoped, mentored, and built to leave something the organization can use.</>}
              secondaryDescription={<>Labs builds on what Teams creates. The organizational understanding, the established relationships, the documented systems&mdash;these are what make supervised placements safe and productive. Placement work is scoped within that foundation: bounded tasks, active mentorship, outputs that fit into systems people already understand. Students and newcomers work in an environment where the stakes are known, the context is documented, and <strong className="font-semibold text-[#5C306C]">the support is real</strong>.</>}
              details={<>Funding comes from foundations, government, and larger organizations who see the value of growing technical capacity locally&mdash;which means <strong className="font-semibold text-[#5C306C]">organizations don&apos;t pay for it out of already-thin budgets</strong>. Placements run through the infrastructure Teams has already built: established relationships, documented systems, a clear sense of what&apos;s sensitive and what isn&apos;t. The work is real&mdash;data engineering, cloud architecture, custom tooling&mdash;and the context is what makes it meaningful. That messy data isn&apos;t abstract; it represents real people receiving real services.</>}
              items={[
                <><strong className="font-semibold text-[#5C306C]">Local placements</strong> that keep students and newcomers connected to Alberta communities and the sector&apos;s actual work</>,
                <><strong className="font-semibold text-[#5C306C]">Fully funded</strong>&mdash;no financial cost to the receiving organization</>,
                <><strong className="font-semibold text-[#5C306C]">Sustainable handoffs</strong>&mdash;every project leaves something maintainable behind</>
              ]}
              quote="A Waterloo engineering student completed his co-op term locally through PALcares. An organization needed years of inconsistent records cleaned to answer one operational question—under a real deadline. He worked in our environment first, under mentorship, then with their data. The organization got focused capacity exactly when they needed it. The student got a placement with actual stakes."
            />

            {/* Panel 4: Ecosystem Summary - MOBILE with triangle + particles */}
            <footer className="w-full max-w-3xl mx-auto pt-8 border-t border-[#5C306C]/10">
              <div className="text-center space-y-4 sm:space-y-6 mb-6">
                <h2 className="text-2xl sm:text-3xl font-light text-[#6b4d7e] leading-tight tracking-tight">
                  How It Connects
                </h2>
                <p className="text-sm sm:text-base text-[#9b8a9e] leading-relaxed px-2">
                  <strong className="font-semibold text-[#5C306C]">Each part sustains the others.</strong> Teams does the foundational work&mdash;learning your organization, building <strong className="font-medium text-[#5C306C]">processes and tools</strong>. Research generalizes what survives <strong className="font-medium text-[#5C306C]">daily use</strong> and releases it under open license. Labs builds on that foundation to <strong className="font-medium text-[#5C306C]">grow local expertise</strong>.
                </p>
              </div>

              {/* Mobile Ecosystem Visual - Triangle layout with animated particles */}
              <div className="relative w-full" style={{ height: '280px' }}>
                {/* SVG for animated particles */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 300 220"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Animated particles traveling between nodes — gated on visibility */}
                  {isMobileInView && !prefersReducedMotion && (<>
                  {/* Research to Teams */}
                  <motion.circle
                    r="3" fill="#FF9966"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      cx: [150, 60],
                      cy: [35, 175],
                    }}
                    transition={{ duration: 3.5, delay: 0, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Teams to Research */}
                  <motion.circle
                    r="2.5" fill="#FF9966"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      cx: [60, 150],
                      cy: [175, 35],
                    }}
                    transition={{ duration: 3.8, delay: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Research to Labs */}
                  <motion.circle
                    r="3" fill="#FF9966"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      cx: [150, 240],
                      cy: [35, 175],
                    }}
                    transition={{ duration: 3.2, delay: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Labs to Research */}
                  <motion.circle
                    r="2.5" fill="#FF9966"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      cx: [240, 150],
                      cy: [175, 35],
                    }}
                    transition={{ duration: 4, delay: 2, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Teams to Labs */}
                  <motion.circle
                    r="2.5" fill="#FF9966"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      cx: [60, 240],
                      cy: [175, 175],
                    }}
                    transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Labs to Teams */}
                  <motion.circle
                    r="2.5" fill="#FF9966"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      cx: [240, 60],
                      cy: [175, 175],
                    }}
                    transition={{ duration: 3.8, delay: 2.5, repeat: Infinity, ease: "linear" }}
                  />
                  </>)}
                </svg>

                {/* Triangle nodes positioned absolutely */}
                <div className="relative h-full w-full">
                  {/* Research - Top Center */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center text-center z-10">
                    <BookOpen className="w-9 h-9 sm:w-10 sm:h-10 text-[#7388e0] mb-1.5" strokeWidth={1.3} />
                    <h3 className="text-[#7388e0] text-sm sm:text-base font-medium">Research</h3>
                    <p className="text-[#9b8a9e] text-xs max-w-[100px] leading-snug">
                      Generalizes & shares
                    </p>
                  </div>

                  {/* Teams - Bottom Left */}
                  <div className="absolute left-[8%] bottom-0 flex flex-col items-center text-center z-10">
                    <Users className="w-9 h-9 sm:w-10 sm:h-10 text-[#ea5dff] mb-1.5" strokeWidth={1.3} />
                    <h3 className="text-[#ea5dff] text-sm sm:text-base font-medium">Teams</h3>
                    <p className="text-[#9b8a9e] text-xs max-w-[100px] leading-snug">
                      Foundational work
                    </p>
                  </div>

                  {/* Labs - Bottom Right */}
                  <div className="absolute right-[8%] bottom-0 flex flex-col items-center text-center z-10">
                    <FlaskConical className="w-9 h-9 sm:w-10 sm:h-10 text-[#FF9966] mb-1.5" strokeWidth={1.3} />
                    <h3 className="text-[#FF9966] text-sm sm:text-base font-medium">Labs</h3>
                    <p className="text-[#9b8a9e] text-xs max-w-[100px] leading-snug">
                      Extends capacity
                    </p>
                  </div>
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
            height: headerHeight > 0 ? `calc(100dvh - ${headerHeight}px)` : '100dvh',
          }}
        >
          {/* Subtle warm wash */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFDFB]/30 to-transparent" />

          {/* Background Orbs */}
          {/* PERF: Use radial gradients instead of blur-3xl on large areas for better scroll performance */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,_rgba(255,153,102,0.05)_0%,_rgba(255,153,102,0.02)_40%,_transparent_70%)] opacity-40" />
            <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,_rgba(92,48,108,0.05)_0%,_rgba(92,48,108,0.02)_40%,_transparent_70%)] opacity-35" />

            {/* Background Nature Lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <motion.path
                  d="M100,1000 C150,800 50,600 100,400 C150,200 100,0 100,-200"
                  stroke="currentColor"
                  className="text-[#5C306C]/5"
                  strokeWidth="1"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  style={{ pathLength: prefersReducedMotion ? 1 : scrollYProgress, opacity: lineOpacity }}
                />
              </svg>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="relative z-10 w-full h-full grid grid-cols-1 xl:grid-cols-[1fr_auto]">
            {/* Content Container */}
            <div 
              ref={contentRef} 
              className="w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-8 md:py-12 flex flex-col justify-center min-h-full"
            >
              {/* Panel 0: Intro */}
              <Panel active={activeIndex === 0}>
                <div className="text-center max-w-4xl mx-auto space-y-6 relative">
                  <h2
                    className="font-light text-[#5C306C] tracking-tight leading-tight"
                    style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                  >
                    An{" "}
                    <motion.span
                      className="inline-block"
                      style={{
                        color: ecosystemColor,
                        letterSpacing: ecosystemLetterSpacing,
                        scale: ecosystemScale,
                      }}
                    >
                      ecosystem
                    </motion.span>{" "}
                    in three parts
                  </h2>
                  <motion.p
                    className="text-[#5C306C]/70 leading-relaxed max-w-3xl mx-auto text-base md:text-lg font-normal"
                    style={{ opacity: subtitleOpacity }}
                  >
                    Not three separate services—<span className="font-semibold">one approach</span> where each part strengthens&nbsp;the&nbsp;others.
                  </motion.p>

                  {/* Scroll cue - brief appearance, scroll-linked fade */}
                  <motion.div
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    style={{ opacity: prefersReducedMotion ? (activeIndex === 0 ? 0.6 : 0) : scrollCueOpacity }}
                  >
                    <span className="text-xs text-[#5C306C]/60 tracking-[0.2em] uppercase mb-2">
                      Scroll
                    </span>
                    {!prefersReducedMotion && (
                      <motion.div
                        className="w-px h-5 bg-[#5C306C]/25"
                        animate={{ scaleY: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: EASE_IN_OUT }}
                      />
                    )}
                    {prefersReducedMotion && (
                      <div className="w-px h-5 bg-[#5C306C]/25" />
                    )}
                  </motion.div>
                </div>
              </Panel>

              {/* Panel 1: Teams */}
              <ContentPanel
                active={activeIndex === 1}
                icon={<Users className="w-6 h-6 text-[#FF9966]" />}
                label="Embedded Partnerships"
                title="PAL Teams"
                description={<>PAL <span className="font-semibold text-[#FF9966]">Teams</span> embeds technical staff directly within organizations for <strong className="font-semibold text-[#5C306C]">multi-year partnerships</strong>&mdash;building the relationships, processes, and infrastructure that let frontline expertise guide technology development.</>}
                secondaryDescription={<>The organizations we work with vary. Some have dedicated technical staff. Some have consultants. Some have systems built years ago that have outlived the context they were designed for. What they share is a gap between what their technology does and what they need it to do, and the recognition that closing that gap requires more than a project. It requires <strong className="font-semibold text-[#5C306C]">someone inside the organization long enough to understand it</strong>.</>}
                details={<>The technical work ranges from urgent to strategic: the Excel formula that&apos;s mission-critical, the <strong className="font-semibold text-[#5C306C]">automated reporting saving weekends</strong>, the cloud infrastructure supporting growth, the cleaned data allowing you to tell your story more effectively. Some of the systems we maintain run around the clock. Multi-year commitment means we understand why that seemingly simple change is complex, <strong className="font-semibold text-[#5C306C]">why that workaround works</strong>, and we&apos;re reachable when something doesn&apos;t.</>}
                items={[
                  <><strong className="font-semibold text-[#5C306C]">Multi-year partnerships</strong> that give time to build relationships, processes, and real understanding</>,
                  <><strong className="font-semibold text-[#5C306C]">Contracts structured for flexibility,</strong> so roadblocks become problems to solve, not threats to the project</>,
                  <><strong className="font-semibold text-[#5C306C]">Infrastructure built to make changes cheaper, faster,</strong> and lower-risk over time</>
                ]}
                quote="Once shared understanding and working processes are in place, iteration becomes affordable and quick. That tweak to a report? A five-minute conversation, not a new statement of work. The database evolves with your programs rather than constraining them."
                prefersReducedMotion={prefersReducedMotion}
                fillProgress={teamsFillClamped}
              />

              {/* Panel 2: Research */}
              <ContentPanel
                active={activeIndex === 2}
                icon={<BookOpen className="w-6 h-6 text-[#FF9966]" />}
                label="Shared Solutions"
                title="PAL Research"
                description={<>PAL <span className="font-semibold text-[#FF9966]">Research</span> takes solutions built through PAL <span className="font-semibold text-[#FF9966]">Teams</span> partnerships and works to release them under <strong className="font-semibold text-[#5C306C]">open license</strong>. What one organization&apos;s work produced, others don&apos;t have to rebuild from scratch.</>}
                secondaryDescription={<>This is <strong className="font-semibold text-[#5C306C]">knowledge transfer through proven solutions</strong>. Every tool we generalize has survived daily use, been shaped by frontline feedback, and solved real operational problems. We work through the relationships and channels PAL <span className="font-semibold text-[#FF9966]">Teams</span> have already built&mdash;carefully extracting the patterns, stripping out anything specific to one organization while keeping what makes the solution work.</>}
                details={<>What makes this possible is the trust and working relationships built through embedded partnerships. Organizations know their investment strengthens the sector while their specific context stays protected. Solutions spread because they emerged from <strong className="font-semibold text-[#5C306C]">actual use, not theoretical design</strong>. The first tools built through this process are in testing now, with public releases coming.</>}
                items={[
                  <><strong className="font-semibold text-[#5C306C]">Generalization starts with the user base,</strong> not the solution: we find who needs it before deciding if it&apos;s worth building</>,
                  <><strong className="font-semibold text-[#5C306C]">Individual investments become collective resources</strong>&mdash;without exposing the organizational specifics behind them</>,
                  <><strong className="font-semibold text-[#5C306C]">Open licensing</strong> ensures tools stay with the community, not locked behind vendor agreements</>
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
                description={<>PAL <span className="font-semibold text-[#FF9966]">Labs</span> extends technical capacity to organizations through <strong className="font-semibold text-[#5C306C]">supervised placements</strong>&mdash;connecting students and newcomers to organizations that have genuine needs and the infrastructure to support them. Every placement is scoped, mentored, and built to leave something the organization can use.</>}
                secondaryDescription={<>Labs builds on what Teams creates. The organizational understanding, the established relationships, the documented systems&mdash;these are what make supervised placements safe and productive. Placement work is scoped within that foundation: bounded tasks, active mentorship, outputs that fit into systems people already understand. Students and newcomers work in an environment where the stakes are known, the context is documented, and <strong className="font-semibold text-[#5C306C]">the support is real</strong>.</>}
                details={<>Funding comes from foundations, government, and larger organizations who see the value of growing technical capacity locally&mdash;which means <strong className="font-semibold text-[#5C306C]">organizations don&apos;t pay for it out of already-thin budgets</strong>. Placements run through the infrastructure Teams has already built: established relationships, documented systems, a clear sense of what&apos;s sensitive and what isn&apos;t. The work is real&mdash;data engineering, cloud architecture, custom tooling&mdash;and the context is what makes it meaningful. That messy data isn&apos;t abstract; it represents real people receiving real services.</>}
                items={[
                  <><strong className="font-semibold text-[#5C306C]">Local placements</strong> that keep students and newcomers connected to Alberta communities and the sector&apos;s actual work</>,
                  <><strong className="font-semibold text-[#5C306C]">Fully funded</strong>&mdash;no financial cost to the receiving organization</>,
                  <><strong className="font-semibold text-[#5C306C]">Sustainable handoffs</strong>&mdash;every project leaves something maintainable behind</>
                ]}
                quote="A Waterloo engineering student completed his co-op term locally through PALcares. An organization needed years of inconsistent records cleaned to answer one operational question—under a real deadline. He worked in our environment first, under mentorship, then with their data. The organization got focused capacity exactly when they needed it. The student got a placement with actual stakes."
                prefersReducedMotion={prefersReducedMotion}
                fillProgress={labsFillClamped}
              />

              {/* Panel 4: How It Connects */}
              <EcosystemPanel
                active={activeIndex === 4}
                title="How It Connects"
                description={<><strong className="text-[#5C306C] font-semibold">Each part sustains the others.</strong> Teams does the foundational work—learning your organization, building <strong className="text-[#5C306C] font-medium">processes and tools</strong>. Research generalizes what survives <strong className="text-[#5C306C] font-medium">daily use</strong> and releases it under open license. Labs builds on that foundation to <strong className="text-[#5C306C] font-medium">grow local expertise</strong>.</>}
                prefersReducedMotion={prefersReducedMotion}
              />
            </div>

            {/* Progress Indicator */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-5 pr-6 w-40" data-storytelling-rail="true">
              {(() => {
                const labels = ["Intro", "Teams", "Research", "Labs", "How It Connects"] as const;
                const scrollToStep = (i: number) => {
                  const el = containerRef.current;
                  if (!el) return;
                  const rect = el.getBoundingClientRect();
                  const top = window.scrollY + rect.top;
                  const scrollRange = Math.max(1, el.offsetHeight - window.innerHeight);
                  const p = Math.min(0.999, Math.max(0.001, (i + 0.12) / 5));
                  const target = top + (p * scrollRange);
                  scrollTo(target, { duration: SCROLL_DURATION_SNAP });
                };

                return [0, 1, 2, 3, 4].map((i) => (
                  <motion.button
                    key={i}
                    type="button"
                    className="relative flex items-center justify-end w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] rounded"
                    onClick={() => scrollToStep(i)}
                    aria-label={`Jump to ${labels[i]}`}
                    whileHover={{ scale: 1.05 }}
                    whileFocus={{ scale: 1.05 }}
                    transition={SPRING_SNAPPY}
                  >
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider mr-4 whitespace-nowrap transition-[opacity,color,transform] duration-200",
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
                      transition={SPRING_GENTLE}
                    >
                      {i === activeIndex && !prefersReducedMotion && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-[#FF9966] blur-md"
                          style={{ willChange: 'transform, opacity' }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.3, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: EASE_IN_OUT,
                          }}
                        />
                      )}
                      {i === activeIndex && prefersReducedMotion && (
                        <div className="absolute inset-0 rounded-full bg-[#FF9966]/40 blur-md" />
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

          {/* Skip affordance - appears after ecosystem color change, fades out near end */}
          <AnimatePresence>
            {showSkipButton && (
              <motion.button
                key="skip-btn"
                type="button"
                className="fixed bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium text-[#5C306C]/60 hover:text-[#5C306C]/80 transition-colors flex items-center gap-1.5 py-2 px-4 rounded-full hover:bg-[#5C306C]/5 bg-white/90 backdrop-blur-sm shadow-sm z-[60] pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: DURATION_FAST, ease: EASE_PREMIUM }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const el = containerRef.current;
                  if (!el) return;
                  const sectionEnd = el.offsetTop + el.offsetHeight;
                  scrollTo(sectionEnd, { duration: SCROLL_DURATION_NAV });
                }}
                aria-label="Skip to next section"
              >
                <span>Skip section</span>
                <ArrowDown className="w-3 h-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

// Mobile intro header with ecosystem animation effect
function MobileIntroHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const isInView = useSafeInView(headerRef, {
    once: true,
    margin: "-10% 0px -10% 0px"
  });
  const prefersReducedMotion = useReducedMotion();

  return (
    <header
      ref={headerRef}
      className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6"
    >
      <h2
        className="font-light text-[#5C306C] tracking-tight leading-tight"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
      >
        An{" "}
        <motion.span
          className="inline-block"
          initial={{
            color: "#5C306C",
            letterSpacing: "0.08em",
            scale: 1
          }}
          animate={isInView ? {
            color: "#FF9966",
            letterSpacing: "0em",
            scale: [1, 1.02, 1.005, 1]
          } : undefined}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: EASE_PREMIUM,
            scale: {
              duration: prefersReducedMotion ? 0 : 0.8,
              times: [0, 0.4, 0.7, 1]
            }
          }}
        >
          ecosystem
        </motion.span>{" "}
        in three parts
      </h2>
      <motion.p
        className="text-[#5C306C]/70 leading-relaxed max-w-2xl mx-auto text-base sm:text-lg font-normal px-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : undefined}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.5,
          delay: 0.2,
          ease: EASE_PREMIUM
        }}
      >
        Not three separate services—<span className="font-semibold">one approach</span> where each part strengthens the others.
      </motion.p>
    </header>
  );
}

// PERF: Use CSS transitions for inactive panels instead of Framer Motion animate
// This eliminates RAF subscriptions for panels that aren't visible
const Panel = React.memo(({ active, children, expanded = false }: { active: boolean, children: React.ReactNode, expanded?: boolean }) => {
  return (
    <div
      data-storytelling-active-panel={active ? "true" : "false"}
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-400 ease-out",
        active
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div
        className="w-full px-6 md:px-10 lg:px-12 lg:pr-20 xl:pr-24 transition-[max-width] duration-150"
        style={{
          maxWidth: expanded ? "1400px" : "1152px",
          transitionTimingFunction: `cubic-bezier(${EASE_OUT_EXPO.join(",")})`
        }}
      >
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
  items: React.ReactNode[];
  quote?: string;
  prefersReducedMotion: boolean | null;
  fillProgress?: MotionValue<number> | number;
}

// Style sub-brand names: "PAL Teams" → PAL + coral "Teams"
function stylePalNames(text: React.ReactNode): React.ReactNode {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(PAL Teams|PAL Research|PAL Labs)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part === 'PAL Teams') return <span key={i}>PAL <span className="font-semibold text-[#FF9966]">Teams</span></span>;
    if (part === 'PAL Research') return <span key={i}>PAL <span className="font-semibold text-[#FF9966]">Research</span></span>;
    if (part === 'PAL Labs') return <span key={i}>PAL <span className="font-semibold text-[#FF9966]">Labs</span></span>;
    return part;
  });
}

// Mobile version - shows all content inline
function ContentPanelMobile({ id, icon, label, title, description, secondaryDescription, details, items, quote }: {
  id?: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: React.ReactNode;
  secondaryDescription?: React.ReactNode;
  details?: React.ReactNode;
  items: React.ReactNode[];
  quote?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article id={id} className="space-y-6 sm:space-y-8 py-10 sm:py-14 border-b border-[#5C306C]/10 last:border-b-0">
      {/* Header Section - Enhanced icon container */}
      <header className="flex items-center gap-3 text-[#FF9966]">
        <motion.div
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0 icon-container-enhanced"
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={SPRING_SNAPPY}
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
      <h2 className="text-3xl sm:text-3xl font-light text-[#5C306C] leading-tight tracking-tight">
        {title.startsWith('PAL ') ? <>PAL <span className="font-bold text-[#FF9966]">{title.slice(4)}</span></> : title}
      </h2>

      {/* Main Content */}
      <div className="space-y-4">
        <p className="text-base sm:text-lg text-[#5C306C]/90 leading-relaxed">
          {stylePalNames(description)}
        </p>

        {/* Expandable secondary content - Read More / Read Less */}
        {(secondaryDescription || details || quote) && (
          <AnimatePresence mode="wait">
            {!expanded ? (
              <motion.button
                key="read-more"
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#FF9966] hover:text-[#e88855] transition-colors mt-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="underline underline-offset-4 decoration-[#FF9966]/40">Read more</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            ) : (
              <motion.div
                key="expanded-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: EASE_SNAPPY }}
                className="space-y-4 overflow-hidden"
              >
                {secondaryDescription && (
                  <p className="text-base text-[#5C306C]/75 leading-relaxed">
                    {stylePalNames(secondaryDescription)}
                  </p>
                )}

                {details && (
                  <p className="text-base text-[#5C306C]/75 leading-relaxed">
                    {stylePalNames(details)}
                  </p>
                )}

                {/* Quote - visible only when expanded */}
                {quote && (
                  <blockquote className="mt-2 pt-4 pl-5 border-l-2 border-[#FF9966]/50 text-[#5C306C]/75 text-base leading-relaxed italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                )}

                {/* Read Less Button */}
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#5C306C]/60 hover:text-[#5C306C] transition-colors mt-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2 rounded"
                >
                  <ArrowRight className="w-4 h-4 rotate-[-90deg]" />
                  <span className="underline underline-offset-4 decoration-[#5C306C]/30">Read less</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Key Points List - Always visible */}
      <ul className="space-y-3 pt-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-[#5C306C]/80 text-base min-h-[44px]"
          >
            <div
              className="w-5 h-5 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-1"
            >
              <ArrowRight className="w-3 h-3 text-[#FF9966]" />
            </div>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

    </article>
  );
}

// Desktop version - with inline expansion to full-width reader mode
// PERF: Memoized to prevent re-renders when other panels update
const ContentPanel = React.memo(function ContentPanel({
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
    <Panel active={active} expanded={expanded}>
      <AnimatePresence mode="popLayout" initial={false}>
        {!expanded ? (
          /* ============================================
             COLLAPSED STATE: Two-column F-pattern layout
             ============================================ */
          <motion.div 
            key="collapsed-layout"
            className="grid gap-10 lg:gap-12 items-start w-full lg:grid-cols-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: EASE_PREMIUM }}
          >
            {/* LEFT COLUMN - Visual anchor: Icon, Label, Title, Quote */}
            <div className="space-y-5 lg:col-span-4">
              {/* Icon + Label */}
              <div className="flex items-center gap-3 text-[#FF9966]">
                <motion.div
                  className="relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={SPRING_SNAPPY}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF9966]/15 to-[#FF9966]/5" />
                  <div className="absolute inset-0 rounded-xl border border-[#FF9966]/20" />
                  <div className="relative z-10">{icon}</div>
                </motion.div>
                <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                  {label}
                </span>
              </div>
              
              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-4xl font-light text-[#5C306C] leading-tight tracking-tight">
                {title.startsWith('PAL ') ? <>PAL <span className="font-bold text-[#FF9966]">{title.slice(4)}</span></> : title}
              </h2>

            </div>

            {/* RIGHT COLUMN - Main content */}
            <div className="lg:pl-12 relative lg:col-span-8">
              {/* Vertical divider */}
              <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[2px] bg-[#5C306C]/10 rounded-full" />
              <motion.div 
                className="hidden lg:block absolute left-0 top-0 w-[2px] bg-[#FF9966] rounded-full origin-top"
                style={{ height: '100%', scaleY: active ? fillProgress : 0 }}
                transition={{ duration: 0.15, ease: EASE_OUT_EXPO }}
              />
              
              <div className="space-y-6">
                {/* Main description */}
                <p className="text-base md:text-lg lg:text-lg text-[#5C306C]/90 leading-relaxed">
                  {description}
                </p>
                
                {/* Read more button */}
                {(secondaryDescription || details) && (
                  <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#FF9966] hover:text-[#E07B4C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded group mt-2"
                    aria-expanded={expanded}
                    aria-controls="expanded-content"
                  >
                    <span className="underline underline-offset-4 decoration-[#FF9966]/40 group-hover:decoration-[#FF9966] transition-colors">
                      Read more
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                
                {/* Bullet points - PERF: Use CSS transition instead of Framer Motion */}
                <ul className="pt-2 grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-3">
                  {items.map((item, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex items-start gap-3 text-[#5C306C]/80 text-base group transition-[opacity,transform] duration-300",
                        active ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                      )}
                    >
                      <div className="w-5 h-5 rounded-full bg-[#FF9966]/10 flex items-center justify-center shrink-0 mt-1">
                        <ArrowRight className="w-3 h-3 text-[#FF9966]" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Mobile quote */}
                {quote && (
                  <blockquote className="lg:hidden mt-6 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[#5C306C]/75 text-base leading-relaxed italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ============================================
             EXPANDED STATE: Clean two-column layout
             Title stays LEFT, content takes RIGHT
             ============================================ */
          <motion.div
            key="expanded-layout"
            id="expanded-content"
            className="grid gap-8 lg:gap-10 items-start w-full lg:grid-cols-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: EASE_PREMIUM }}
          >
            {/* LEFT COLUMN - Title and navigation */}
            <div className="lg:col-span-4 space-y-4 lg:space-y-5 lg:pr-4">
              {/* Back button row - desktop */}
              <div className="hidden lg:flex items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="group inline-flex items-center gap-1.5 font-medium text-[#5C306C]/50 hover:text-[#5C306C] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  <span>Back</span>
                </button>
                <span className="text-[#5C306C]/20 mx-1">|</span>
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FF9966]/80 truncate">
                  {label}
                </span>
              </div>
              
              {/* Icon */}
              <div className="flex items-center text-[#FF9966]">
                <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#FF9966]/15 to-[#FF9966]/5" />
                  <div className="absolute inset-0 rounded-xl border border-[#FF9966]/20" />
                  <div className="relative z-10">{icon}</div>
                </div>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#5C306C] leading-tight tracking-tight pr-2">
                {title.startsWith('PAL ') ? <>PAL <span className="font-bold text-[#FF9966]">{title.slice(4)}</span></> : title}
              </h2>
              
              {/* Full quote - desktop only, below title */}
              {quote && (
                <blockquote className="hidden lg:block mt-6 pt-6 pl-5 border-l-2 border-[#FF9966]/50 text-[#5C306C]/75 text-base leading-relaxed italic">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              )}
            </div>

            {/* RIGHT COLUMN - Main content */}
            <div className="lg:col-span-8 lg:pl-8 xl:pl-10 relative">
              {/* Vertical divider - desktop */}
              <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-[#5C306C]/10" />
              
              {/* Lead paragraph */}
              <p className="text-base lg:text-lg text-[#5C306C] leading-relaxed mb-5">
                {description}
              </p>
              
              {/* Accent line */}
              <div className="w-10 h-[2px] bg-gradient-to-r from-[#FF9966] to-transparent rounded-full mb-5" />
              
              {/* Body content */}
              <div className="space-y-4 lg:space-y-5 lg:pr-8 xl:pr-12">
                {secondaryDescription && (
                  <p className="text-base text-[#5C306C]/75 leading-relaxed">
                    {secondaryDescription}
                  </p>
                )}
                
                {details && (
                  <p className="text-base text-[#5C306C]/75 leading-relaxed">
                    {details}
                  </p>
                )}
              </div>
              
              {/* End flourish - desktop */}
              <div className="hidden lg:flex items-center gap-2 mt-8 pt-5 border-t border-[#5C306C]/6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF9966]/30" />
                <div className="w-1 h-1 rounded-full bg-[#5C306C]/10" />
              </div>
            </div>
            
            {/* MOBILE: Back button footer */}
            <div className="lg:hidden col-span-full mt-4 pt-5 border-t border-[#5C306C]/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#5C306C]/60 hover:text-[#5C306C] transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] rounded"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to overview</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Panel>
  );
});
ContentPanel.displayName = 'ContentPanel';

interface EcosystemPanelProps {
  active: boolean;
  title: string;
  description: React.ReactNode;
  prefersReducedMotion: boolean | null;
}

// PERF: Memoized to prevent re-renders + CSS transitions instead of Framer Motion
const EcosystemPanel = React.memo(function EcosystemPanel({ active, title, description, prefersReducedMotion }: EcosystemPanelProps) {
  return (
    <Panel active={active}>
      <div className="w-full max-w-6xl h-full flex flex-col justify-center items-center px-6 py-8">
        {/* Header Section - PERF: CSS transition */}
        <div
          className={cn(
            "mb-6 md:mb-10 text-center transition-[opacity,transform] duration-400",
            active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2.5"
          )}
        >
          <h2 className="text-[#FF9966] mb-4 text-2xl md:text-3xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="text-[#5C306C]/85 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            {description}
          </p>
        </div>

        {/* MOBILE LAYOUT - Vertical Stack */}
        <div className="block md:hidden w-full">
          <div className="flex flex-col items-center space-y-6">
            {/* Research - PERF: CSS transition */}
            <div
              className={cn(
                "flex flex-col items-center text-center transition-[opacity,transform] duration-400",
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
            >
              <BookOpen className="w-14 h-14 text-[#7388e0] mb-3" strokeWidth={1.3} />
              <h3 className="text-[#7388e0] mb-2 text-lg font-medium">Research</h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Generalizes & shares under open license
              </p>
            </div>

            {/* PERF: CSS animation instead of Framer Motion infinite */}
            <div className={prefersReducedMotion ? "" : "animate-bounce-slow"}>
              <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
            </div>

            {/* Teams - PERF: CSS transition */}
            <div
              className={cn(
                "flex flex-col items-center text-center transition-[opacity,transform] duration-400",
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
            >
              <Users className="w-14 h-14 text-[#ea5dff] mb-3" strokeWidth={1.3} />
              <h3 className="text-[#ea5dff] mb-2 text-lg font-medium">Teams</h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Foundational work, relationships & infrastructure
              </p>
            </div>

            {/* PERF: CSS animation instead of Framer Motion infinite */}
            <div className={prefersReducedMotion ? "" : "animate-bounce-slow"} style={{ animationDelay: "0.5s" }}>
              <ArrowDown className="w-5 h-5 text-[#f18f6f] opacity-30" strokeWidth={2} />
            </div>

            {/* Labs - PERF: CSS transition */}
            <div
              className={cn(
                "flex flex-col items-center text-center transition-[opacity,transform] duration-400",
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
            >
              <FlaskConical className="w-14 h-14 text-[#FF9966] mb-3" strokeWidth={1.3} />
              <h3 className="text-[#FF9966] mb-2 text-lg font-medium">Labs</h3>
              <p className="text-[#9b8a9e] text-sm max-w-[200px] leading-relaxed">
                Extends capacity, builds on foundation
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP LAYOUT - Triangle with Particles */}
        {/* Wider horizontal space, less vertical space */}
        <div className="hidden md:block relative max-w-5xl mx-auto w-full" style={{ height: '320px' }}>
          {/* SVG Background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 240"
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 0 }}
          >
            {/* SVG streaks */}
            {!prefersReducedMotion && active && (
              <g>
                <motion.circle
                  r="3" fill="#FF9966"
                  initial={{ opacity: 0, cx: 400, cy: 40 }}
                  animate={{ opacity: [0, 0.55, 0], cx: [400, 160], cy: [40, 180], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 4.6, delay: 0.0, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.5" fill="#FF9966"
                  initial={{ opacity: 0, cx: 160, cy: 180 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [160, 400], cy: [180, 40], scale: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 4.9, delay: 1.2, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="3" fill="#FF9966"
                  initial={{ opacity: 0, cx: 400, cy: 40 }}
                  animate={{ opacity: [0, 0.55, 0], cx: [400, 640], cy: [40, 180], scale: [0.9, 1.2, 0.9] }}
                  transition={{ duration: 4.7, delay: 0.6, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.5" fill="#FF9966"
                  initial={{ opacity: 0, cx: 640, cy: 180 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [640, 400], cy: [180, 40], scale: [0.8, 1.15, 0.8] }}
                  transition={{ duration: 5.0, delay: 1.8, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.75" fill="#FF9966"
                  initial={{ opacity: 0, cx: 160, cy: 180 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [160, 640], cy: [180, 180], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 4.4, delay: 0.3, repeat: Infinity, ease: "linear" }}
                />
                <motion.circle
                  r="2.75" fill="#FF9966"
                  initial={{ opacity: 0, cx: 640, cy: 180 }}
                  animate={{ opacity: [0, 0.5, 0], cx: [640, 160], cy: [180, 180], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 4.6, delay: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </g>
            )}
          </svg>

          {/* Nodes positioned absolutely - PERF: CSS transitions */}
          <div className="relative h-full w-full">
            {/* Center mark - more faded, behind nodes */}
            <div
              className={cn(
                "absolute pointer-events-none left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-700 delay-100",
                active ? "opacity-[0.12] scale-100" : "opacity-0 scale-95"
              )}
              style={{ zIndex: 0 }}
            >
              {/* ~15% smaller than prior 120x114 */}
              <div className="relative w-[102px] h-[97px]">
                <Image
                  src="/svg/PALcares_icon.svg"
                  alt="PAL Cares"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Research - Top - timed pulse when particles arrive */}
            <div
              className={cn(
                "absolute left-1/2 top-0 -translate-x-1/2 z-10 transition-[opacity,transform] duration-500 ease-out",
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: active ? "100ms" : "0ms" }}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "relative p-3",
                  active && !prefersReducedMotion && "animate-node-pulse-research"
                )}>
                  <BookOpen className="w-10 h-10 text-[#7388e0]" strokeWidth={1.4} />
                </div>
                <h3 className="text-[#7388e0] mt-3 mb-1 text-base font-bold tracking-tight">Research</h3>
                <p className="text-[#5C306C]/80 text-center text-sm max-w-[160px] leading-relaxed">
                  Generalizes & shares under <span className="text-[#7388e0] font-medium">open license</span>
                </p>
              </div>
            </div>

            {/* Teams - Bottom Left - timed pulse when particles arrive */}
            <div
              className={cn(
                "absolute left-[8%] bottom-[22%] z-10 transition-[opacity,transform] duration-500 ease-out",
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: active ? "200ms" : "0ms" }}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "relative p-3",
                  active && !prefersReducedMotion && "animate-node-pulse-teams"
                )}>
                  <Users className="w-10 h-10 text-[#ea5dff]" strokeWidth={1.4} />
                </div>
                <h3 className="text-[#ea5dff] mt-3 mb-1 text-base font-bold tracking-tight">Teams</h3>
                <p className="text-[#5C306C]/80 text-center text-sm max-w-[160px] leading-relaxed">
                  <span className="text-[#ea5dff] font-medium">Foundational</span> work & infrastructure
                </p>
              </div>
            </div>

            {/* Labs - Bottom Right - timed pulse when particles arrive */}
            <div
              className={cn(
                "absolute right-[8%] bottom-[22%] z-10 transition-[opacity,transform] duration-500 ease-out",
                active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: active ? "300ms" : "0ms" }}
            >
              <div className="flex flex-col items-center">
                <div className={cn(
                  "relative p-3",
                  active && !prefersReducedMotion && "animate-node-pulse-labs"
                )}>
                  <FlaskConical className="w-10 h-10 text-[#FF9966]" strokeWidth={1.4} />
                </div>
                <h3 className="text-[#FF9966] mt-3 mb-1 text-base font-bold tracking-tight">Labs</h3>
                <p className="text-[#5C306C]/80 text-center text-sm max-w-[160px] leading-relaxed">
                  <span className="text-[#FF9966] font-medium">Extends capacity</span> locally
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
});
EcosystemPanel.displayName = 'EcosystemPanel';