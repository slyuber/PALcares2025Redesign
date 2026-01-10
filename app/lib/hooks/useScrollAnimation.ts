"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
  MotionValue,
} from "framer-motion";
import {
  EASE_PREMIUM,
  EASE_MOBILE,
  DURATION_NORMAL,
  DURATION_NORMAL_MOBILE,
  DURATION_FAST,
  DURATION_FAST_MOBILE,
  DURATION_SLOW,
  DURATION_SLOW_MOBILE,
  STAGGER_WORD,
} from "../animation-constants";

// ============================================
// PALcares Scroll Animation Hooks
// Mobile-optimized, performance-focused
// ============================================

interface ScrollAnimationOptions {
  range?: [number, number];
  margin?: string;
  once?: boolean;
  amount?: number | "some" | "all";
}

interface ScrollAnimationResult {
  ref: React.RefObject<HTMLElement | null>;
  isInView: boolean;
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  scale: MotionValue<number>;
}

/**
 * useScrollAnimation - Performance-optimized scroll-linked animations
 *
 * Uses MotionValues to avoid React re-renders during scroll.
 * Automatically handles reduced motion preferences.
 */
export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
): ScrollAnimationResult {
  const { range = [0, 1], margin = "-10% 0px", once = true, amount = 0.3 } = options;

  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const isInView = useInView(ref, {
    once,
    amount,
    margin: margin as `${number}px ${number}px` | `${number}px`,
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion ? [1, 1] : [0, 1]
  );

  const y = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion ? [0, 0] : [20, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    range,
    prefersReducedMotion ? [1, 1] : [0.98, 1]
  );

  return {
    ref,
    isInView,
    progress: scrollYProgress,
    opacity,
    y,
    scale,
  };
}

/**
 * useMobileOptimizedAnimation - Device-aware animation configuration
 *
 * Returns optimized durations, easing, and offsets based on device.
 * Handles reduced motion preferences automatically.
 */
export function useMobileOptimizedAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
      };
      checkMobile();

      const mediaQuery = window.matchMedia("(max-width: 768px)");
      mediaQuery.addEventListener("change", checkMobile);

      return () => mediaQuery.removeEventListener("change", checkMobile);
    }
  }, []);

  const config = useMemo(
    () => ({
      // Durations - shorter on mobile
      durationFast: isMobile ? DURATION_FAST_MOBILE : DURATION_FAST,
      durationNormal: isMobile ? DURATION_NORMAL_MOBILE : DURATION_NORMAL,
      durationSlow: isMobile ? DURATION_SLOW_MOBILE : DURATION_SLOW,

      // Easing - optimized for device
      ease: isMobile ? EASE_MOBILE : EASE_PREMIUM,

      // Transform amounts - smaller on mobile
      yOffset: isMobile ? 10 : 16,
      scaleOffset: isMobile ? 0.98 : 0.95,

      // Stagger timing
      stagger: isMobile ? 0.04 : STAGGER_WORD,

      // Flags
      isMobile,
      shouldAnimate: !prefersReducedMotion,
    }),
    [isMobile, prefersReducedMotion]
  );

  return config;
}

/**
 * useOptimizedInView - Performance-optimized IntersectionObserver hook
 *
 * Disconnects after trigger if once is true.
 */
export function useOptimizedInView(options: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
} = {}) {
  const { threshold = 0.3, rootMargin = "-50px 0px", once = true } = options;

  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const frozen = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (frozen.current && once) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);

            if (once) {
              frozen.current = true;
              observer.unobserve(element);
            }
          } else if (!once) {
            setIsInView(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
}

/**
 * useAnimationCleanup - Removes will-change after animation
 *
 * Prevents GPU memory leaks from lingering will-change declarations.
 */
export function useAnimationCleanup(
  isAnimating: boolean,
  cleanupDelay: number = 500
) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (isAnimating) {
      element.style.willChange = "transform, opacity";
    } else {
      const timeout = setTimeout(() => {
        element.style.willChange = "auto";
      }, cleanupDelay);

      return () => clearTimeout(timeout);
    }
  }, [isAnimating, cleanupDelay]);

  return elementRef;
}
