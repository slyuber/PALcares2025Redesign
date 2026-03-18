// app/components/NeedWeNoticed.tsx
// ENHANCEMENT: 2025-01 - Award-winning design: Background patterns
"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { needWeNoticed } from "content-collections";
import { renderRichText } from "../lib/rich-text";
import { EASE_PREMIUM, EASE_SMOOTH, EASE_ENERGETIC, DURATION_NORMAL, DURATION_SLOW, STAGGER_NORMAL, useSafeInView } from "../lib/animation-constants";

export default function NeedWeNoticed() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useSafeInView(ref, { once: true, amount: 0.15, margin: "100px 0px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : STAGGER_NORMAL,
      },
    },
  };

  // Label: quick, subtle fade
  const labelVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_NORMAL,
        ease: EASE_PREMIUM,
      },
    },
  };

  // Headline: slightly overshoots then settles — the "snap" moment
  const headlineVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SLOW,
        ease: EASE_ENERGETIC,
      },
    },
  };

  // Left column: slides from left — parting curtain
  const leftColumnVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SLOW,
        ease: EASE_SMOOTH,
      },
    },
  };

  // Right column: slides from right — parting curtain
  const rightColumnVariants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SLOW,
        ease: EASE_SMOOTH,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="where-we-started"
      className="py-12 md:py-16 lg:py-24 relative overflow-hidden"
      aria-label="Where we started - the need we noticed"
    >
      {/* Background: clean wash, let content breathe */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent" />
      </div>

      <motion.div
        ref={ref}
        className="max-w-6xl mx-auto px-6 md:px-12 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : undefined}
      >
        {/* Section Label */}
        <motion.span
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF9966] block mb-6"
          variants={labelVariants}
        >
          {needWeNoticed.label}
        </motion.span>

        {/* Headline — the anchor moment, subtle overshoot */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-light text-[#5C306C] mb-12 tracking-tight leading-tight"
          variants={headlineVariants}
        >
          {needWeNoticed.headline}
        </motion.h2>

        {/* Content Grid - asymmetric for visual interest */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Main Content Column */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            variants={leftColumnVariants}
          >
            <p className="text-base md:text-lg text-[#5C306C] leading-relaxed">
              {renderRichText(needWeNoticed.leftColumn[0])}
            </p>

            <p className="text-base md:text-lg text-[#5C306C] leading-relaxed">
              {renderRichText(needWeNoticed.leftColumn[1])}
            </p>

            <p className="text-base md:text-lg text-[#5C306C] leading-relaxed">
              {renderRichText(needWeNoticed.leftColumn[2])}
            </p>
          </motion.div>

          {/* Supporting Column - Vision */}
          <motion.div
            className="lg:col-span-5 lg:pt-2"
            variants={rightColumnVariants}
          >
            <div className="lg:pl-8 lg:border-l border-[#5C306C]/10">
              <p className="text-base md:text-lg text-[#5C306C]/90 leading-relaxed mb-6">
                {renderRichText(needWeNoticed.rightColumn[0])}
              </p>

              <p className="text-[#5C306C] font-semibold text-base md:text-lg leading-relaxed">
                {needWeNoticed.rightColumn[1]}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

    </section>
  );
}
