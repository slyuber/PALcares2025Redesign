// app/components/NeedWeNoticed.tsx
// ENHANCEMENT: 2025-01 - Award-winning design: Background patterns
"use client";

import { motion, useReducedMotion } from "framer-motion";
import BackgroundPatterns from "./partials/BackgroundPatterns";

export default function NeedWeNoticed() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.7,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    },
  };

  return (
    <section
      id="where-we-started"
      className="pt-16 pb-24 md:pt-20 md:pb-32 lg:pt-24 lg:pb-40 relative overflow-hidden"
      aria-label="Where we started - the need we noticed"
    >
      {/* Enhanced background: Subtle wash + award-winning patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent" />
        {/* Award-winning subtle patterns */}
        <BackgroundPatterns variant="organic-grid" opacity={0.4} />
      </div>

      <motion.div
        className="max-w-5xl mx-auto px-6 md:px-12 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Section Label */}
        <motion.span
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF9966] block mb-6"
          variants={itemVariants}
        >
          Where We Started
        </motion.span>

        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-[2.75rem] font-light text-[#5C306C] mb-12 tracking-tight leading-[1.2]"
          variants={itemVariants}
        >
          We noticed a need in our communities.
        </motion.h2>

        {/* Content Grid - asymmetric for visual interest */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Main Content Column */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            variants={itemVariants}
          >
            <p className="text-base md:text-lg text-[#5C306C]/80 leading-[1.8]">
              Across North America, organizations are questioning why technology
              that should serve communities often ends up extracting from them.
              We&apos;re part of this broader conversation—but our focus is specific.
            </p>

            <p className="text-base md:text-lg text-[#5C306C]/80 leading-[1.8]">
              We believe{" "}
              <strong className="text-[#5C306C] font-semibold">
                the people closest to the work should shape the tools they use
              </strong>
              .{" "}
              <strong className="text-[#5C306C] font-semibold">
                What gets built should stay with the organizations and communities that helped create it
              </strong>
              .{" "}
              <strong className="text-[#5C306C] font-semibold">
                Technical expertise and frontline wisdom need equal weight
              </strong>{" "}
              in development decisions.
            </p>

            <p className="text-base md:text-lg text-[#5C306C]/80 leading-[1.8]">
              Creating the conditions for this kind of partnership takes
              deliberate choices. Small, purposeful decisions—
              <span className="text-[#5C306C] font-medium">
                nonprofit structure, multi-year commitments, open licensing,
                relationship-centered contracts
              </span>
              —that together give us the flexibility to work differently.
            </p>
          </motion.div>

          {/* Supporting Column - Vision */}
          <motion.div
            className="lg:col-span-5 lg:pt-2"
            variants={itemVariants}
          >
            <div className="lg:pl-8 lg:border-l border-[#5C306C]/10">
              <p className="text-base md:text-lg text-[#5C306C]/70 leading-[1.8] mb-6">
                We&apos;re building an ecosystem where embedded technical teams
                learn organizational reality before writing code, where emerging
                talent and newcomers strengthen local capacity, where proven
                solutions become resources for the sector.
              </p>

              <p className="text-[#5C306C] font-semibold text-base md:text-lg leading-[1.7]">
                Sustainable technology emerges from genuine partnership.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle background decoration - more restrained */}
      <div className="absolute top-1/2 left-0 w-48 h-48 bg-[#8FAE8B]/4 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-[#5C306C]/4 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
    </section>
  );
}
