// ============================================
// PALcares Animation Constants
// app/lib/animation-constants.ts
//
// These values are researched and tested based on:
// - Linear.app UI transitions
// - Medium article layouts
// - Framer Motion best practices
// - Chrome DevTools performance guidelines
//
// DO NOT modify without testing performance impact
// ============================================

/**
 * Easing Curves
 * All curves use cubic-bezier format: [x1, y1, x2, y2]
 * 
 * EASE_SMOOTH: Natural deceleration, feels premium
 * EASE_OUT_CUBIC: Quick start, gentle end - good for entrances
 * EASE_IN_OUT: Symmetric - good for toggles
 */
export const EASE_SMOOTH = [0.04, 0.62, 0.23, 0.98] as const;
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;
export const EASE_OUT_EXPO = [0.32, 0.72, 0, 1] as const;
export const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;

/**
 * Duration Values (in seconds)
 * 
 * Based on research:
 * - Under 100ms feels instant (use for micro-interactions)
 * - 200-300ms is perceived as "fast"
 * - 400-500ms is "comfortable"
 * - Over 500ms starts feeling slow
 */
export const DURATION_INSTANT = 0.1;   // Hover states, micro-interactions
export const DURATION_FAST = 0.2;      // Button presses, small reveals
export const DURATION_NORMAL = 0.4;    // Content transitions, expand/collapse
export const DURATION_SLOW = 0.6;      // Large layout changes, hero animations

/**
 * Stagger Timing
 * Delay between sequential child animations
 */
export const STAGGER_FAST = 0.05;      // Rapid sequence
export const STAGGER_NORMAL = 0.08;    // Standard list items
export const STAGGER_SLOW = 0.12;      // Emphasized sequence

/**
 * Spring Physics
 * For Framer Motion's spring animations
 * 
 * Higher stiffness = snappier
 * Higher damping = less bounce
 */
export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
};

export const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export const SPRING_BOUNCY = {
  type: "spring" as const,
  stiffness: 500,
  damping: 15,
};

/**
 * Pre-built Transition Objects
 * Import these directly into motion components
 */
export const TRANSITION_HEIGHT = {
  duration: DURATION_NORMAL,
  ease: EASE_SMOOTH,
};

export const TRANSITION_FADE = {
  duration: DURATION_FAST,
  ease: EASE_OUT_CUBIC,
};

export const TRANSITION_SLIDE = {
  duration: DURATION_NORMAL,
  ease: EASE_OUT_CUBIC,
};

/**
 * Variant Presets for Common Patterns
 */

// Fade in/out
export const FADE_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: TRANSITION_FADE,
  },
  exit: { 
    opacity: 0,
    transition: { duration: DURATION_FAST, ease: "easeIn" as const },
  },
};

// Slide up and fade
export const SLIDE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: TRANSITION_SLIDE,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: DURATION_FAST, ease: "easeIn" as const },
  },
};

// Height collapse (for expand/collapse patterns)
export const HEIGHT_VARIANTS = {
  expanded: {
    opacity: 1,
    height: "auto",
    transition: TRANSITION_HEIGHT,
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: TRANSITION_HEIGHT,
  },
};

/**
 * Reduced Motion Helper
 * Use with useReducedMotion() hook
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * transition={{ duration: getReducedMotionDuration(DURATION_NORMAL, prefersReducedMotion) }}
 */
export const getReducedMotionDuration = (
  duration: number, 
  prefersReducedMotion: boolean | null
): number => {
  return prefersReducedMotion ? 0 : duration;
};

/**
 * Transition with reduced motion support built-in
 * 
 * @example
 * transition={createTransition(DURATION_NORMAL, EASE_SMOOTH, prefersReducedMotion)}
 */
export const createTransition = (
  duration: number,
  ease: readonly number[],
  prefersReducedMotion: boolean | null
) => ({
  duration: prefersReducedMotion ? 0 : duration,
  ease: ease,
});
