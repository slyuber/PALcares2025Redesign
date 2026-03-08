// app/components/NeedWeNoticed.tsx
// ENHANCEMENT: 2025-01 - Award-winning design: Background patterns
"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import BackgroundPatterns from "./partials/BackgroundPatterns";
import { EASE_PREMIUM, EASE_ENERGETIC, DURATION_NORMAL, DURATION_SLOW, STAGGER_NORMAL, useSafeInView } from "../lib/animation-constants";

export default function NeedWeNoticed() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const hasSnapped = useRef(false);
  const isInView = useSafeInView(ref, { once: true, amount: 0.15, margin: "100px 0px" });

  // Gentle delayed snap: wait 600ms after section becomes visible, then ease in
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !lenis || prefersReducedMotion) return;

    let timeout: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timeout);
        if (entry.isIntersecting && !hasSnapped.current) {
          // Wait 600ms — let the user settle before nudging
          timeout = setTimeout(() => {
            hasSnapped.current = true;
            lenis.scrollTo(el, { offset: -80, duration: 2 });
          }, 600);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, [lenis, prefersReducedMotion]);

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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_SLOW,
        ease: EASE_ENERGETIC,
      },
    },
  };

  // Body content: smooth slide-up
  const bodyVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : DURATION_NORMAL,
        ease: EASE_PREMIUM,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="where-we-started"
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
      aria-label="Where we started - the need we noticed"
    >
      {/* Enhanced background: Subtle wash + award-winning patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent" />
        {/* Award-winning subtle patterns */}
        <BackgroundPatterns variant="organic-grid" opacity={0.4} />
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
          Where We Started
        </motion.span>

        {/* Headline — the anchor moment, subtle overshoot */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-light text-[#5C306C] mb-12 tracking-tight leading-tight"
          variants={headlineVariants}
        >
          We noticed a need in our communities.
        </motion.h2>

        {/* Content Grid - asymmetric for visual interest */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Main Content Column */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            variants={bodyVariants}
          >
            <p className="text-base md:text-lg text-[#5C306C]/80 leading-relaxed">
              Across North America, organizations are questioning why technology
              that should serve communities often ends up extracting from them.
              We&apos;re part of this broader conversation—but our focus is specific.
            </p>

            <p className="text-base md:text-lg text-[#5C306C]/80 leading-relaxed">
              We believe{" "}
              <strong className="text-[#5C306C] font-semibold">
                the people closest to the work should shape the tools they use
              </strong>
              .{" "}
              <strong className="text-[#5C306C] font-semibold">
                What gets built should stay with the communities that helped create it
              </strong>
              .{" "}
              <strong className="text-[#5C306C] font-semibold">
                The people who know the code and the people who know the work should build side by side
              </strong>
              .
            </p>

            <p className="text-base md:text-lg text-[#5C306C]/80 leading-relaxed">
              This takes deliberate choices. Small, purposeful decisions:
              <span className="text-[#5C306C] font-medium">
                nonprofit structure, multi-year commitments, open licensing,
                relationship-centered contracts
              </span>
              . Together they give us the flexibility to work differently.
            </p>
          </motion.div>

          {/* Supporting Column - Vision */}
          <motion.div
            className="lg:col-span-5 lg:pt-2"
            variants={bodyVariants}
          >
            <div className="lg:pl-8 lg:border-l border-[#5C306C]/10">
              <p className="text-base md:text-lg text-[#5C306C]/70 leading-relaxed mb-6">
                Our technical teams sit inside your organization before writing a line of code. Emerging talent and newcomers build local capacity through supervised placements. Solutions that prove themselves get released openly so the whole sector benefits.
              </p>

              <p className="text-[#5C306C] font-semibold text-base md:text-lg leading-relaxed">
                Sustainable technology starts with trust.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle background decoration - more restrained */}
      <div className="absolute top-1/2 left-0 w-[30vw] h-[30vw] bg-[radial-gradient(circle,_rgba(143,174,139,0.04)_0%,_rgba(143,174,139,0.015)_40%,_transparent_70%)] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[25vw] h-[25vw] bg-[radial-gradient(circle,_rgba(92,48,108,0.04)_0%,_rgba(92,48,108,0.015)_40%,_transparent_70%)] translate-x-1/2 pointer-events-none" />
    </section>
  );
}
