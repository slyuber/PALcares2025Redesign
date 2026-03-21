// app/components/DeeperContext.tsx
// Scroll-linked vertical progress line with traveling ball and deposit dots
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { deeperContext } from "content-collections";
import { renderRichText } from "../lib/rich-text";
import {
  EASE_PREMIUM,
  DURATION_FAST,
  DURATION_MEDIUM,
  DURATION_NORMAL,
  getDeviceOptimizedY,
  useSafeInView,
} from "../lib/animation-constants";


// Label "pops in" first — earlier scroll range, quick entrance
function BeatLabel({
  children,
  scrollYProgress,
  revealStart,
  revealEnd,
  prefersReducedMotion,
  isDesktop,
}: {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  revealStart: number;
  revealEnd: number;
  prefersReducedMotion: boolean | null;
  isDesktop: boolean;
}) {
  const labelEnd = revealStart + (revealEnd - revealStart) * 0.4;
  const opacity = useTransform(scrollYProgress, [revealStart, labelEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [revealStart, labelEnd], [8, 0]);

  const isMobile = !prefersReducedMotion && !isDesktop;
  const isDesktopMotion = !prefersReducedMotion && isDesktop;

  return (
    <motion.span
      className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-3"
      style={
        prefersReducedMotion ? { opacity: 1, y: 0 }
        : isDesktopMotion ? { opacity, y }
        : undefined
      }
      {...(isMobile ? {
        initial: { opacity: 0, y: 8 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: DURATION_FAST, ease: EASE_PREMIUM },
      } : {})}
    >
      {children}
    </motion.span>
  );
}

// Paragraphs cascade in after the label with stagger
function BeatParagraph({
  children,
  className,
  scrollYProgress,
  revealStart,
  revealEnd,
  prefersReducedMotion,
  isDesktop,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  scrollYProgress: MotionValue<number>;
  revealStart: number;
  revealEnd: number;
  prefersReducedMotion: boolean | null;
  isDesktop: boolean;
  index: number;
}) {
  const range = revealEnd - revealStart;
  const paraStart = revealStart + range * (0.3 + index * 0.1);
  const opacity = useTransform(scrollYProgress, [paraStart, revealEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [paraStart, revealEnd], [12, 0]);

  const isMobile = !prefersReducedMotion && !isDesktop;
  const isDesktopMotion = !prefersReducedMotion && isDesktop;
  const mobileDelay = 0.1 + index * 0.08;

  return (
    <motion.p
      className={className}
      style={
        prefersReducedMotion ? { opacity: 1, y: 0 }
        : isDesktopMotion ? { opacity, y }
        : undefined
      }
      {...(isMobile ? {
        initial: { opacity: 0, y: getDeviceOptimizedY(true) },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: DURATION_NORMAL, delay: mobileDelay, ease: EASE_PREMIUM },
      } : {})}
    >
      {children}
    </motion.p>
  );
}

export default function DeeperContext() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // On mobile (<md), the progress line/ball/dots are hidden — scroll-linked
  // reveal makes no sense without them. Show beats statically instead.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 0.2"],
  });

  // Line fills top-to-bottom as user scrolls
  const lineScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  // Measure actual dot positions relative to the line container
  // Returns fractions (0-1) of where each dot sits within the line
  const [dotFractions, setDotFractions] = useState([0.12, 0.37, 0.62, 0.87]);

  const measureDots = useCallback(() => {
    const line = lineRef.current;
    if (!line) return;
    const lineRect = line.getBoundingClientRect();
    const lineHeight = lineRect.height;
    if (lineHeight === 0) return;

    const fractions = dotRefs.current.map((dot) => {
      if (!dot) return 0;
      const dotRect = dot.getBoundingClientRect();
      // Center of dot relative to top of line
      return (dotRect.top + dotRect.height / 2 - lineRect.top) / lineHeight;
    });

    setDotFractions(fractions);
  }, []);

  useEffect(() => {
    measureDots();
    window.addEventListener("resize", measureDots);
    // Re-measure after fonts/layout settle
    const timer = setTimeout(measureDots, 500);
    return () => {
      window.removeEventListener("resize", measureDots);
      clearTimeout(timer);
    };
  }, [measureDots]);

  // Traveling ball position — maps scroll progress to percentage along the line
  const ballTop = useTransform(scrollYProgress, [0, 0.85], ["0%", "100%"]);

  // Deposit dots: appear INSTANTLY when ball's visual position passes the dot
  const [deposited, setDeposited] = useState([false, false, false, false]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // The ball is at (latest / 0.85) fraction of the line height
    const ballFraction = latest / 0.85;
    setDeposited((prev) => {
      let changed = false;
      const next = prev.map((d, i) => {
        if (!d && ballFraction >= dotFractions[i]) {
          changed = true;
          return true;
        }
        return d;
      });
      return changed ? next : prev;
    });
  });

  // Header entrance animation
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useSafeInView(headerRef, { once: true, amount: 0.15, margin: "100px 0px" });

  // Layout alternation: even beats LEFT, odd beats RIGHT
  const beatLayouts = [
    { side: "left", mtClass: "", mbClass: "mb-12 md:mb-0" },
    { side: "right", mtClass: "md:-mt-16", mbClass: "mb-12 md:mb-0" },
    { side: "left", mtClass: "md:-mt-8", mbClass: "mb-12 md:mb-0" },   // beat 2 — minimal overlap (push down from beat 0)
    { side: "right", mtClass: "md:-mt-48", mbClass: "" },              // beat 3 — heavy overlap (pull up toward beat 1)
  ];

  // Content reveal: generous range so beats are fully opaque by the time they're readable
  const getRevealRange = (beatIdx: number) => {
    const dotPos = dotFractions[beatIdx] * 0.85;
    return {
      revealStart: Math.max(0, dotPos - 0.08),
      revealEnd: dotPos,
    };
  };

  return (
    <section
      ref={containerRef}
      id="context"
      className="relative py-16 md:py-24 lg:py-32"
      aria-label="The deeper context - the work behind it"
    >
      {/* Background: clean wash, progress line is the visual element */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, ease: EASE_PREMIUM }}
        >
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-light text-[#E07B4C] tracking-tight mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, ease: EASE_PREMIUM }}
          >
            {deeperContext.heading}
          </motion.h2>
          <motion.p
            className="text-base md:text-lg lg:text-xl text-[#5C306C]/80 font-normal max-w-2xl mx-auto lg:whitespace-nowrap"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : 0.1, ease: EASE_PREMIUM }}
          >
            {deeperContext.subheading}
          </motion.p>
        </motion.div>

        {/* Overlapping Staggered Layout */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div ref={lineRef} className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-[#5C306C]/5" />
            <motion.div
              className="absolute inset-0 bg-[#E07B4C] origin-top"
              style={{ scaleY: lineScale }}
            />
          </div>

          {/* Traveling ball */}
          {!prefersReducedMotion && (
            <motion.div
              className="hidden md:block absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E07B4C] z-10"
              style={{
                top: ballTop,
                boxShadow: "0 0 12px rgba(224, 123, 76, 0.4)",
              }}
            />
          )}

          {deeperContext.beats.map((beat, beatIdx) => {
            const layout = beatLayouts[beatIdx];
            const isLeft = layout.side === "left";
            const { revealStart, revealEnd } = getRevealRange(beatIdx);

            return (
              <div
                key={beatIdx}
                className={`relative grid md:grid-cols-2 gap-8 md:gap-10 ${layout.mbClass} ${layout.mtClass}`}
              >
                {/* Spacer for right-side beats */}
                {!isLeft && <div className="hidden md:block" />}

                <div className={isLeft ? "md:pr-10" : "md:pl-10"}>
                  <BeatLabel
                    scrollYProgress={scrollYProgress}
                    revealStart={revealStart}
                    revealEnd={revealEnd}
                    prefersReducedMotion={prefersReducedMotion}
                    isDesktop={isDesktop}
                  >
                    {beat.label}
                  </BeatLabel>
                  {beat.paragraphs.map((paragraph, pIdx) => (
                    <BeatParagraph
                      key={pIdx}
                      className={`text-base text-[#5C306C]/85 leading-relaxed${pIdx < beat.paragraphs.length - 1 ? " mb-3" : ""}`}
                      scrollYProgress={scrollYProgress}
                      revealStart={revealStart}
                      revealEnd={revealEnd}
                      prefersReducedMotion={prefersReducedMotion}
                      isDesktop={isDesktop}
                      index={pIdx}
                    >
                      {renderRichText(paragraph)}
                    </BeatParagraph>
                  ))}
                </div>

                {/* Spacer for left-side beats */}
                {isLeft && <div className="hidden md:block" />}

                {/* Deposit dot — appears instantly when traveling ball passes this position */}
                <div
                  ref={(el) => { dotRefs.current[beatIdx] = el; }}
                  className="hidden md:block absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E07B4C]"
                  style={{
                    top: "1rem",
                    opacity: deposited[beatIdx] ? 1 : 0,
                    transition: "opacity 300ms ease-out",
                    boxShadow: "0 0 0 4px rgba(224, 123, 76, 0.12)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
