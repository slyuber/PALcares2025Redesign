"use client";

import { useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import {
  SCROLL_DURATION_NAV,
  SCROLL_HEADER_OFFSET,
} from "./animation-constants";

/**
 * Centralized scroll-to hook.
 *
 * Routes all programmatic scrolls through Lenis for consistent
 * velocity-damped easing. Falls back to native scroll when Lenis
 * isn't ready. Respects `prefers-reduced-motion` automatically.
 *
 * Defaults:
 * - Element targets: offset = SCROLL_HEADER_OFFSET (-100), clears fixed header
 * - Pixel targets: offset = 0 (pixel values are already absolute)
 * - Duration: SCROLL_DURATION_NAV (1.0s)
 *
 * @example
 * const scrollTo = useScrollTo();
 * scrollTo(sectionEl);                      // element → header offset applied
 * scrollTo(sectionEl, { duration: 0.8 });   // faster arrival
 * scrollTo(1200);                           // pixel → no offset
 * scrollTo(sectionEl, { offset: -200 });    // custom offset
 */
export function useScrollTo() {
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  return useCallback(
    (
      target: HTMLElement | number,
      options?: {
        offset?: number;
        duration?: number;
      }
    ) => {
      const isPixel = typeof target === "number";
      const offset = options?.offset ?? (isPixel ? 0 : SCROLL_HEADER_OFFSET);
      const duration = prefersReducedMotion
        ? 0
        : (options?.duration ?? SCROLL_DURATION_NAV);

      if (lenis) {
        lenis.scrollTo(target, { offset, duration });
      } else if (isPixel) {
        window.scrollTo({
          top: target,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      } else {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [lenis, prefersReducedMotion]
  );
}
