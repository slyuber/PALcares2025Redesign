// app/components/DeeperContext.tsx
// Scroll-linked vertical progress line with traveling ball and deposit dots
"use client";

import { useRef, useState } from "react";
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
import { cn } from "../lib/utils";

// Scroll-linked reveal for each beat — useTransform can't be called inside .map()
function ScrollRevealBeat({
  children,
  className,
  scrollYProgress,
  revealStart,
  revealEnd,
  prefersReducedMotion,
}: {
  children: React.ReactNode;
  className?: string;
  scrollYProgress: MotionValue<number>;
  revealStart: number;
  revealEnd: number;
  prefersReducedMotion: boolean | null;
}) {
  const opacity = useTransform(scrollYProgress, [revealStart, revealEnd], [0, 1]);
  const y = useTransform(scrollYProgress, [revealStart, revealEnd], [12, 0]);

  return (
    <motion.div
      className={className}
      style={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity, y }}
    >
      {children}
    </motion.div>
  );
}

export default function DeeperContext() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Offset: start measuring when section top hits viewport center
    // Complete when section end approaches viewport top
    offset: ["start center", "end 0.2"],
  });

  // Line fills top-to-bottom as user scrolls — scaleY is GPU-composited (no layout thrash)
  const lineScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  // Traveling ball position — maps scroll progress to percentage along the line
  const ballTop = useTransform(scrollYProgress, [0, 0.85], ["0%", "100%"]);

  // Deposit dots: appear when the traveling ball passes each beat's position
  const beatThresholds = [0.12, 0.37, 0.62, 0.87];
  const [deposited, setDeposited] = useState([false, false, false, false]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const norm = latest / 0.85;
    setDeposited((prev) => {
      let changed = false;
      const next = prev.map((d, i) => {
        if (!d && norm >= beatThresholds[i]) {
          changed = true;
          return true;
        }
        return d;
      });
      return changed ? next : prev;
    });
  });

  // Layout alternation: even beats LEFT, odd beats RIGHT
  const beatLayouts = [
    { side: "left", mtClass: "", mbClass: "mb-12 md:mb-0" },
    { side: "right", mtClass: "md:-mt-24", mbClass: "mb-12 md:mb-0" },
    { side: "left", mtClass: "md:-mt-20", mbClass: "mb-12 md:mb-0" },
    { side: "right", mtClass: "md:-mt-24", mbClass: "" },
  ];

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
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#E07B4C] tracking-tight mb-4">
            {deeperContext.heading}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#5C306C]/80 font-normal max-w-2xl mx-auto lg:whitespace-nowrap">
            {deeperContext.subheading}
          </p>
        </div>

        {/* Overlapping Staggered Layout */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
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

            return (
              <ScrollRevealBeat
                key={beatIdx}
                className={`relative grid md:grid-cols-2 gap-8 md:gap-10 ${layout.mbClass} ${layout.mtClass}`}
                scrollYProgress={scrollYProgress}
                revealStart={beatThresholds[beatIdx] * 0.85 - 0.1}
                revealEnd={beatThresholds[beatIdx] * 0.85}
                prefersReducedMotion={prefersReducedMotion}
              >
                {/* Spacer for right-side beats */}
                {!isLeft && <div className="hidden md:block" />}

                <div className={isLeft ? "md:pr-10" : "md:pl-10"}>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-3">
                    {beat.label}
                  </span>
                  {beat.paragraphs.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className={`text-base text-[#5C306C]/85 leading-relaxed${pIdx < beat.paragraphs.length - 1 ? " mb-2" : ""}`}
                    >
                      {renderRichText(paragraph)}
                    </p>
                  ))}
                </div>

                {/* Spacer for left-side beats */}
                {isLeft && <div className="hidden md:block" />}

                {/* Deposit dot — appears when traveling ball passes this beat */}
                <div
                  className={cn(
                    "hidden md:block absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E07B4C]",
                    deposited[beatIdx] ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    top: "1rem",
                    boxShadow: deposited[beatIdx]
                      ? "0 0 0 4px rgba(224, 123, 76, 0.12)"
                      : "none",
                    animation: deposited[beatIdx]
                      ? "dot-pulse 0.4s ease-out"
                      : "none",
                  }}
                />
              </ScrollRevealBeat>
            );
          })}
        </div>
      </div>
    </section>
  );
}
