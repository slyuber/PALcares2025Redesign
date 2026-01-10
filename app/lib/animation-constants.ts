// ============================================
// PALcares Animation Constants
// app/lib/animation-constants.ts
//
// These values are researched and tested based on:
// - Linear.app UI transitions
// - Medium article layouts
// - Framer Motion best practices
// - Chrome DevTools performance guidelines
// - 2025 Mobile UX best practices (Awwwards, Motion.dev)
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
 * Premium Easing Curves (2025 Mobile-First)
 * Apple-inspired and award-winning motion design
 */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const; // Apple-inspired, premium feel
export const EASE_MOBILE = [0.25, 0.46, 0.45, 0.94] as const; // Faster settle for mobile
export const EASE_TEXT_REVEAL = [0.33, 1, 0.68, 1] as const; // Elegant text deceleration

/**
 * Micro-Animation Easing Curves (2025 Best Practices)
 * Based on Awwwards/Motion.dev recommendations
 *
 * EASE_ENERGETIC: Slight overshoot, playful - CTAs, brand moments
 * EASE_SNAPPY: Quick response - button taps, instant feedback
 * EASE_ORGANIC: Natural, gentle - parallax, floating elements
 */
export const EASE_ENERGETIC = [0.34, 1.56, 0.64, 1] as const;
export const EASE_SNAPPY = [0.4, 0, 0.2, 1] as const;
export const EASE_ORGANIC = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Duration Values (in seconds)
 *
 * Based on research:
 * - Under 100ms feels instant (use for micro-interactions)
 * - 200-300ms is perceived as "fast"
 * - 400-500ms is "comfortable"
 * - Over 500ms starts feeling slow
 */
export const DURATION_INSTANT = 0.1; // Hover states, micro-interactions
export const DURATION_FAST = 0.2; // Button presses, small reveals
export const DURATION_NORMAL = 0.4; // Content transitions, expand/collapse
export const DURATION_SLOW = 0.6; // Large layout changes, hero animations

/**
 * Mobile-Optimized Durations (2025)
 * Shorter durations for snappier mobile experience
 */
export const DURATION_MICRO = 0.08; // Instant feedback
export const DURATION_FAST_MOBILE = 0.15; // Mobile-optimized fast
export const DURATION_NORMAL_MOBILE = 0.3; // Mobile-optimized normal
export const DURATION_SLOW_MOBILE = 0.45; // Mobile-optimized slow

/**
 * Stagger Timing
 * Delay between sequential child animations
 */
export const STAGGER_FAST = 0.05; // Rapid sequence
export const STAGGER_NORMAL = 0.08; // Standard list items
export const STAGGER_SLOW = 0.12; // Emphasized sequence

/**
 * Text Animation Stagger (2025)
 * Per-character and per-word reveal timing
 */
export const STAGGER_CHARACTER = 0.02; // Per-character reveals
export const STAGGER_WORD = 0.06; // Per-word reveals
export const STAGGER_LINE = 0.1; // Per-line reveals

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
 * Mobile Spring Physics (2025)
 * Optimized for touch interactions
 */
export const SPRING_MOBILE = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 1,
};

export const SPRING_TEXT = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.8,
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

// ============================================
// Mobile-First Animation Variants (2025)
// Simple fade + slide - clean, fast, professional
// ============================================

/**
 * Mobile-Optimized Fade + Slide Variants
 * User preference: Simple, clean animations
 */
export const MOBILE_FADE_SLIDE = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_NORMAL_MOBILE,
      ease: EASE_MOBILE,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: DURATION_FAST_MOBILE,
      ease: EASE_MOBILE,
    },
  },
};

/**
 * Text Reveal Variants - Simple fade + slide
 */
export const TEXT_REVEAL_SIMPLE = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_NORMAL_MOBILE,
      ease: EASE_TEXT_REVEAL,
    },
  },
};

/**
 * Staggered Container - for parent elements
 */
export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_WORD,
      delayChildren: 0.1,
    },
  },
};

/**
 * Staggered Child - for child elements in a stagger
 */
export const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_NORMAL_MOBILE,
      ease: EASE_MOBILE,
    },
  },
};

/**
 * Device-Aware Helper Functions
 */
export const getDeviceOptimizedDuration = (
  baseDuration: number,
  isMobile: boolean
): number => {
  return isMobile ? baseDuration * 0.75 : baseDuration;
};

export const getDeviceOptimizedEase = (
  isMobile: boolean
): readonly number[] => {
  return isMobile ? EASE_MOBILE : EASE_PREMIUM;
};

export const getDeviceOptimizedY = (isMobile: boolean): number => {
  return isMobile ? 10 : 16;
};
