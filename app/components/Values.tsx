// app/components/Values.tsx
// Clean 2x2 grid layout with strategic bolding for important ideas
"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import BackgroundPatterns from "./partials/BackgroundPatterns";
import { value } from "content-collections";
import { renderRichText } from "../lib/rich-text";
import { getIcon } from "../lib/icon-map";
import { EASE_PREMIUM, EASE_OUT_CUBIC, EASE_ENERGETIC, DURATION_MEDIUM, DURATION_FAST, STAGGER_SLOW, useSafeInView } from "../lib/animation-constants";

const CardIcon0 = getIcon(value.cards[0].icon);
const CardIcon1 = getIcon(value.cards[1].icon);
const CardIcon2 = getIcon(value.cards[2].icon);
const CardIcon3 = getIcon(value.cards[3].icon);

export default function Values() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useSafeInView(headerRef, { once: true, amount: 0.15, margin: "100px 0px" });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useSafeInView(gridRef, { once: true, amount: 0.1, margin: "100px 0px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={sectionRef}
      id="values"
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
      aria-label="Our foundational values"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8FAE8B]/[0.02] to-transparent"
          style={prefersReducedMotion ? {} : { y: backgroundY }}
        />
        <BackgroundPatterns variant="watercolor" opacity={0.4} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header - staggered reveal */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16 md:mb-24 space-y-4"
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, ease: EASE_PREMIUM }}
        >
          <motion.span
            className="text-xs font-semibold uppercase tracking-[0.2em] block"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, color: "#5C306C" }}
            animate={headerInView ? { opacity: 1, y: 0, color: "#E07B4C" } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, ease: EASE_PREMIUM }}
          >
            {value.label}
          </motion.span>
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#5C306C] tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : 0.1, ease: EASE_PREMIUM }}
          >
            {value.heading}
          </motion.h2>
        </motion.div>

        {/* 2x2 Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Trust as Infrastructure */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={gridInView ? { opacity: 1, scale: 1 } : undefined}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : 0, ease: EASE_OUT_CUBIC }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${value.cards[0].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: DURATION_FAST, ease: EASE_ENERGETIC }}
            >
              <CardIcon0
                className="w-6 h-6"
                style={{ color: value.cards[0].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#5C306C] mb-3">
              {value.cards[0].title}
            </h3>
            <p className="text-base text-[#5C306C]/85 leading-relaxed">
              {renderRichText(value.cards[0].description)}
            </p>
          </motion.div>

          {/* Community Ownership */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={gridInView ? { opacity: 1, scale: 1 } : undefined}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : STAGGER_SLOW, ease: EASE_OUT_CUBIC }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${value.cards[1].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: DURATION_FAST, ease: EASE_ENERGETIC }}
            >
              <CardIcon1
                className="w-6 h-6"
                style={{ color: value.cards[1].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#5C306C] mb-3">
              {value.cards[1].title}
            </h3>
            <p className="text-base text-[#5C306C]/85 leading-relaxed">
              {renderRichText(value.cards[1].description)}
            </p>
          </motion.div>

          {/* Data Sovereignty */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={gridInView ? { opacity: 1, scale: 1 } : undefined}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : STAGGER_SLOW * 2, ease: EASE_OUT_CUBIC }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${value.cards[2].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: DURATION_FAST, ease: EASE_ENERGETIC }}
            >
              <CardIcon2
                className="w-6 h-6"
                style={{ color: value.cards[2].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#5C306C] mb-3">
              {value.cards[2].title}
            </h3>
            <p className="text-base text-[#5C306C]/85 leading-relaxed">
              {renderRichText(value.cards[2].description)}
            </p>
          </motion.div>

          {/* Building Capacity, Not Dependency */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={gridInView ? { opacity: 1, scale: 1 } : undefined}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : STAGGER_SLOW * 3, ease: EASE_OUT_CUBIC }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${value.cards[3].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: DURATION_FAST, ease: EASE_ENERGETIC }}
            >
              <CardIcon3
                className="w-6 h-6"
                style={{ color: value.cards[3].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#5C306C] mb-3">
              {value.cards[3].title}
            </h3>
            <p className="text-base text-[#5C306C]/85 leading-relaxed">
              {renderRichText(value.cards[3].description)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
