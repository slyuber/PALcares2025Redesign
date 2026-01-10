"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useMobileOptimizedAnimation } from "../../lib/hooks/useScrollAnimation";

// ============================================
// PALcares Section Header Component
// Consistent animated headers across all sections
// Single useInView to prevent competing observers
// ============================================

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowColor?: string;
  title: string;
  titleHighlights?: string[];
  subtitle?: string;
  alignment?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

/**
 * SectionHeader - Consistent section header pattern
 *
 * Uses a single useInView observer for all elements to prevent
 * competing animations and visibility flickering.
 */
export function SectionHeader({
  eyebrow,
  eyebrowColor = "#FF9966",
  title,
  titleHighlights = [],
  subtitle,
  alignment = "center",
  className = "",
  titleClassName = "",
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const animConfig = useMobileOptimizedAnimation();

  const alignmentClasses =
    alignment === "center" ? "text-center mx-auto" : "text-left";

  // Helper to render title with optional highlights
  const renderTitle = () => {
    if (titleHighlights.length === 0) {
      return title;
    }
    const words = title.split(" ");
    return words.map((word, i) => (
      <span
        key={i}
        className={titleHighlights.includes(word) ? "text-[#FF9966]" : ""}
      >
        {word}
        {i < words.length - 1 ? " " : ""}
      </span>
    ));
  };

  // Static render for reduced motion
  if (prefersReducedMotion) {
    return (
      <div className={`space-y-4 ${alignmentClasses} ${className}`}>
        {eyebrow && (
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] block"
            style={{ color: eyebrowColor }}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={`text-3xl md:text-4xl font-normal text-[#4A2756] tracking-tight ${titleClassName}`}
        >
          {renderTitle()}
        </h2>
        {subtitle && (
          <p
            className="text-base md:text-lg text-[#5C306C]/70 leading-relaxed max-w-2xl"
            style={{
              marginLeft: alignment === "center" ? "auto" : 0,
              marginRight: alignment === "center" ? "auto" : 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`space-y-4 ${alignmentClasses} ${className}`}>
      {/* Eyebrow */}
      {eyebrow && (
        <motion.span
          className="text-xs font-semibold uppercase tracking-[0.2em] block"
          style={{ color: eyebrowColor }}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            duration: animConfig.durationFast,
            ease: animConfig.ease,
          }}
        >
          {eyebrow}
        </motion.span>
      )}

      {/* Title - Single element animation, no nested useInView */}
      <motion.h2
        className={`text-3xl md:text-4xl font-normal text-[#4A2756] tracking-tight ${titleClassName}`}
        initial={{ opacity: 0, y: animConfig.yOffset }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: animConfig.yOffset }
        }
        transition={{
          delay: eyebrow ? 0.1 : 0,
          duration: animConfig.durationNormal,
          ease: animConfig.ease,
        }}
      >
        {renderTitle()}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="text-base md:text-lg text-[#5C306C]/70 leading-relaxed max-w-2xl"
          style={{
            marginLeft: alignment === "center" ? "auto" : 0,
            marginRight: alignment === "center" ? "auto" : 0,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{
            delay: eyebrow ? 0.2 : 0.1,
            duration: animConfig.durationNormal,
            ease: animConfig.ease,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
