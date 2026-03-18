// app/components/DeeperContext.tsx
// KISS: useInView for stable once-only animations, no re-triggers
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { EASE_SMOOTH, DURATION_MEDIUM, useSafeInView } from "../lib/animation-constants";
import { deeperContext } from "content-collections";
import { renderRichText } from "../lib/rich-text";

// Reusable animated section - useInView triggers with refined premium animation
function AnimatedBeat({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger when element is 15% visible for smoother entry
  const isInView = useSafeInView(ref, { once: true, amount: 0.15, margin: "100px 0px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
      animate={isInView
        ? { opacity: 1, scale: 1 }
        : undefined
      }
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_MEDIUM,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE_SMOOTH,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function DeeperContext() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Offset: start measuring when section top hits viewport center
    // Complete when section end approaches viewport top
    offset: ["start center", "end 0.2"],
  });

  // Line fills top-to-bottom as user scrolls — scaleY is GPU-composited (no layout thrash)
  const lineScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  // Dot colors per beat
  const dotColors = ["#8FAE8B", "#FF9966", "#8FAE8B", "#5C306C"];
  const dotRingColors = ["#8FAE8B", "#FF9966", "#8FAE8B", "#5C306C"];

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
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-light text-[#E07B4C] tracking-tight mb-4"
          >
            {deeperContext.heading}
          </h2>
          <p
            className="text-base md:text-lg lg:text-xl text-[#5C306C]/80 font-light max-w-2xl mx-auto lg:whitespace-nowrap"
          >
            {deeperContext.subheading}
          </p>
        </div>

        {/* Overlapping Staggered Layout */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-[#5C306C]/5" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-[#8FAE8B] via-[#FF9966] to-[#5C306C] origin-top"
              style={{ scaleY: lineScale }}
            />
          </div>

          {deeperContext.beats.map((beat, beatIdx) => {
            const layout = beatLayouts[beatIdx];
            const isLeft = layout.side === "left";
            const delay = beatIdx === 0 ? 0 : 0.1;

            return (
              <AnimatedBeat
                key={beatIdx}
                className={`relative grid md:grid-cols-2 gap-8 md:gap-10 ${layout.mbClass} ${layout.mtClass}`}
                delay={delay}
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

                {/* Progress dot */}
                <div
                  className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: dotColors[beatIdx],
                    boxShadow: `0 0 0 4px ${dotRingColors[beatIdx]}33`,
                  }}
                />
              </AnimatedBeat>
            );
          })}
        </div>
      </div>
    </section>
  );
}
