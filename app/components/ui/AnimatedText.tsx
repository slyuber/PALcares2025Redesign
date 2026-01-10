"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import React, { useRef, ReactNode } from "react";
import { useMobileOptimizedAnimation } from "../../lib/hooks/useScrollAnimation";

// ============================================
// PALcares Animated Text Components
// Simple fade + slide - clean, fast, professional
// ============================================

interface AnimatedTextProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
  delay?: number;
  once?: boolean;
  stagger?: boolean;
}

/**
 * AnimatedText - Simple fade + slide text animation
 *
 * User preference: Clean, fast animations without blur effects.
 * Automatically optimizes for mobile devices.
 */
export function AnimatedText({
  children,
  as: Component = "p",
  className = "",
  delay = 0,
  once = true,
  stagger = false,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const animConfig = useMobileOptimizedAnimation();

  // Skip animations for reduced motion
  if (prefersReducedMotion) {
    const Tag = Component as keyof React.JSX.IntrinsicElements;
    return <Tag className={className}>{children}</Tag>;
  }

  // Staggered word animation
  if (stagger) {
    const words = children.split(" ");

    return (
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      <Component ref={ref as any} className={className}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: animConfig.yOffset }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: animConfig.yOffset }
              }
              transition={{
                duration: animConfig.durationNormal,
                delay: delay + i * animConfig.stagger,
                ease: animConfig.ease,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && "\u00A0"}
          </span>
        ))}
      </Component>
    );
  }

  // Simple fade + slide
  const MotionComponent = motion[Component] || motion.p;
  return (
    <MotionComponent
      ref={ref as React.RefObject<HTMLParagraphElement>}
      className={className}
      initial={{ opacity: 0, y: animConfig.yOffset }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: animConfig.yOffset }
      }
      transition={{
        duration: animConfig.durationNormal,
        delay,
        ease: animConfig.ease,
      }}
    >
      {children}
    </MotionComponent>
  );
}

interface AnimatedHeadingProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  delay?: number;
  highlightWords?: string[];
  highlightClassName?: string;
  stagger?: boolean;
}

/**
 * AnimatedHeading - Heading with optional highlighted words
 *
 * Simple fade + slide with staggered word reveal.
 * Highlighted words can have different styling.
 */
export function AnimatedHeading({
  children,
  as: Component = "h2",
  className = "",
  delay = 0,
  highlightWords = [],
  highlightClassName = "text-[#FF9966]",
  stagger = true,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();
  const animConfig = useMobileOptimizedAnimation();

  if (prefersReducedMotion) {
    const words = children.split(" ");
    return (
      <Component className={className}>
        {words.map((word, i) => (
          <span
            key={i}
            className={highlightWords.includes(word) ? highlightClassName : ""}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Component>
    );
  }

  const words = children.split(" ");

  if (!stagger) {
    // Simple animation without stagger
    const MotionComponent = motion[Component] || motion.h2;
    return (
      <MotionComponent
        ref={ref as React.RefObject<HTMLHeadingElement>}
        className={className}
        initial={{ opacity: 0, y: animConfig.yOffset }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: animConfig.yOffset }
        }
        transition={{
          duration: animConfig.durationNormal,
          delay,
          ease: animConfig.ease,
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={highlightWords.includes(word) ? highlightClassName : ""}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </MotionComponent>
    );
  }

  // Staggered word reveal
  return (
    <Component ref={ref} className={className}>
      {words.map((word, i) => {
        const isHighlight = highlightWords.includes(word);

        return (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className={`inline-block ${isHighlight ? highlightClassName : ""}`}
              initial={{ opacity: 0, y: animConfig.yOffset }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: animConfig.yOffset }
              }
              transition={{
                duration: animConfig.durationNormal,
                delay: delay + i * animConfig.stagger,
                ease: animConfig.ease,
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && "\u00A0"}
          </span>
        );
      })}
    </Component>
  );
}

interface AnimatedParagraphProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

/**
 * AnimatedParagraph - Paragraph with simple fade + slide
 *
 * Optional stagger for longer text content.
 */
export function AnimatedParagraph({
  children,
  className = "",
  delay = 0,
  stagger = false,
}: AnimatedParagraphProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const animConfig = useMobileOptimizedAnimation();

  if (prefersReducedMotion) {
    return <p className={className}>{children}</p>;
  }

  // Simple fade for paragraphs (stagger optional)
  if (!stagger) {
    return (
      <motion.p
        ref={ref}
        className={className}
        initial={{ opacity: 0, y: animConfig.yOffset }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: animConfig.yOffset }
        }
        transition={{
          duration: animConfig.durationNormal,
          delay,
          ease: animConfig.ease,
        }}
      >
        {children}
      </motion.p>
    );
  }

  // Split by sentences for staggered reveal
  const sentences = children.split(/(?<=[.!?])\s+/).filter(Boolean);

  return (
    <p ref={ref} className={className}>
      {sentences.map((sentence, i) => (
        <motion.span
          key={i}
          className="inline"
          initial={{ opacity: 0, y: 6 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 6 }
          }
          transition={{
            duration: animConfig.durationNormal,
            delay: delay + i * 0.08,
            ease: animConfig.ease,
          }}
        >
          {sentence}
          {i < sentences.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

interface AnimatedListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  delay?: number;
  staggerDelay?: number;
}

/**
 * AnimatedList - Staggered list item animations
 *
 * For card grids, feature lists, etc.
 */
export function AnimatedList({
  children,
  className = "",
  itemClassName = "",
  delay = 0,
  staggerDelay,
}: AnimatedListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const animConfig = useMobileOptimizedAnimation();

  const stagger = staggerDelay ?? animConfig.stagger;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          className={itemClassName}
          initial={{ opacity: 0, y: animConfig.yOffset }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: animConfig.yOffset }
          }
          transition={{
            duration: animConfig.durationNormal,
            delay: delay + i * stagger,
            ease: animConfig.ease,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
