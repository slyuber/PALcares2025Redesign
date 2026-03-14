// app/components/Hero.tsx
// PROVEN PATTERN: useTransform for scroll-linked animations (no springs needed for simple fade/move)
// ENHANCEMENT: 2025-01 - Award-winning design: Subtle background patterns
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import BackgroundPatterns from "./partials/BackgroundPatterns";
import { hero } from "../lib/site-content";
import { EASE_PREMIUM, EASE_OUT_CUBIC, SPRING_SNAPPY, SCROLL_DURATION_HERO } from "../lib/animation-constants";
import { useScrollTo } from "../lib/use-scroll-to";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const scrollTo = useScrollTo();

  const { scrollY } = useScroll();

  const logoOpacity = useTransform(scrollY, [100, 250], [1, 0]);
  const logoY = useTransform(scrollY, [0, 250], [0, -60]);
  const logoScale = useTransform(scrollY, [0, 250], [1, 0.7]);
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 80], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const findVisibleTarget = useCallback(() => {
    const desktop = document.getElementById("storytelling");
    const mobile = document.getElementById("storytelling-mobile");
    if (mobile && mobile.offsetHeight > 0) return mobile;
    if (desktop && desktop.offsetHeight > 0) return desktop;
    return null;
  }, []);

  const handleScrollToStorytelling = useCallback(() => {
    const target = findVisibleTarget();
    if (target) scrollTo(target, { duration: SCROLL_DURATION_HERO });
  }, [findVisibleTarget, scrollTo]);

  const handleScrollDown = useCallback(() => {
    const target = findVisibleTarget();
    if (target) {
      scrollTo(target, { duration: SCROLL_DURATION_HERO });
    } else {
      scrollTo(window.innerHeight, { duration: SCROLL_DURATION_HERO });
    }
  }, [findVisibleTarget, scrollTo]);

  return (
    <section
      id="top"
      className="hero relative min-h-[100svh] flex flex-col overflow-hidden px-6 pt-20 pb-12 md:pb-16 lg:pb-20"
      aria-label="Hero section - PALcares introduction"
    >
      {/* Soft organic wash - blends seamlessly */}
      {/* MODIFICATION: 2024-12-16 - Softer, more feathered edges */}
      {/* PERF: Removed blur-3xl on large area - use larger gradient stops instead for soft edge */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.4)_0%,_transparent_70%)]" />
        <div className="absolute top-[30%] left-[20%] w-[70vw] h-[50vh] bg-[radial-gradient(ellipse,_rgba(255,252,250,0.25)_0%,_rgba(255,252,250,0.1)_30%,_transparent_70%)]" />
      </div>
      {/* END MODIFICATION */}

      {/* Primary Orb - pre-softened gradient, no runtime blur */}
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[110vmax] h-[110vmax] bg-[radial-gradient(circle,_rgba(255,153,102,0.06)_0%,_rgba(255,153,102,0.03)_30%,_rgba(255,153,102,0.01)_50%,_transparent_70%)] pointer-events-none z-0" />

      {/* Secondary Orb - pre-softened gradient, no runtime blur */}
      <div className="absolute top-[70%] left-[75%] w-[70vmax] h-[70vmax] bg-[radial-gradient(circle,_rgba(92,48,108,0.03)_0%,_rgba(92,48,108,0.01)_30%,_rgba(92,48,108,0.005)_50%,_transparent_70%)] pointer-events-none z-0" />

      {/* Award-winning subtle patterns - very subtle in hero */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <BackgroundPatterns variant="watercolor" opacity={0.3} />
      </div>

      {/* Organic Lines - Horizontal Flow (CSS animation for better perf) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <svg
          className="w-[110%] h-full -ml-[5%]"
          viewBox="0 0 1584 900"
          preserveAspectRatio="none"
        >
          <path
            d="M-50,400 Q360,350 720,400 T1584,400"
            fill="none"
            stroke="rgba(92, 48, 108, 0.06)"
            strokeWidth="2"
            className={prefersReducedMotion ? "" : "animate-sway-slow"}
          />
          <path
            d="M-50,500 Q360,550 720,500 T1584,500"
            fill="none"
            stroke="rgba(92, 48, 108, 0.06)"
            strokeWidth="1.5"
            className={prefersReducedMotion ? "" : "animate-sway-slow-reverse"}
          />
          <path
            d="M-50,600 Q360,550 720,600 T1584,600"
            fill="none"
            stroke="rgba(92, 48, 108, 0.06)"
            strokeWidth="1"
            className={prefersReducedMotion ? "" : "animate-sway-medium"}
          />
        </svg>
      </div>

      {/* Content Block - Row 1: Centered content with flex-1 to push scroll indicator down */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full text-center space-y-8 md:space-y-10">
        {/* Mobile Logo - Only shows on mobile since desktop uses Header */}
        <motion.div
          className="lg:hidden flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: EASE_PREMIUM }}
        >
          <Image
            src="/svg/PALcares_logo_light.svg"
            alt="PALcares"
            width={180}
            height={50}
            className="w-full max-w-[180px] h-auto"
            priority
          />
        </motion.div>

        {/* Desktop Logo - Large centered, morphs on scroll */}
        {/* MODIFICATION: 2024-12-16 - Logo animates toward header on scroll */}
        {/* MODIFICATION: 2025-01 - Slight left offset to balance visual weight (logo icon vs text) */}
        <motion.div
          className="hidden lg:flex justify-center mb-12"
          initial={{ x: -6 }}
          animate={{ x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: EASE_PREMIUM }}
          style={prefersReducedMotion ? {} : {
            opacity: logoOpacity,
            y: logoY,
            scale: logoScale,
          }}
        >
          <Image
            src="/svg/PALcares_logo_light.svg"
            alt="PALcares"
            width={280}
            height={76}
            className="w-full max-w-[280px] h-auto object-contain"
            priority
            style={{
              filter: "drop-shadow(0 2px 8px rgba(92, 48, 108, 0.08))",
            }}
          />
        </motion.div>
        {/* END MODIFICATION */}

        {/* Hero text content - staggered line reveal */}
        <div className="space-y-8 md:space-y-10">
          <h1
            className="font-light leading-tight tracking-tight text-[#5C306C]"
            style={{ fontSize: "clamp(1.5rem, 4.5vw, 3.5rem)" }}
          >
            {/* Line 1 - enters first */}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.2,
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: EASE_PREMIUM,
              }}
            >
              {hero.tagline.line1}
            </motion.span>{" "}
            {/* Line 2 - emphasis, enters second */}
            <motion.span
              className="font-medium inline-block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.35,
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: EASE_PREMIUM,
              }}
            >
              strengthens the{" "}
              <motion.span
                  className="text-[#5C306C] inline-block"
                  initial={{ fontWeight: 300 }}
                  animate={{ fontWeight: 600 }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 1.1,
                    duration: prefersReducedMotion ? 0 : 0.6,
                    ease: EASE_PREMIUM,
                  }}
                >
                  relationships
                </motion.span>
            </motion.span>{" "}
            <br className="hidden md:block" />
            {/* Line 3 - enters last */}
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.5,
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: EASE_PREMIUM,
              }}
            >
              {hero.tagline.line2}
            </motion.span>
          </h1>

          <motion.p
            className="font-normal leading-relaxed text-[#5C306C]/90 max-w-2xl mx-auto"
            style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: prefersReducedMotion ? 0 : 0.6,
              duration: prefersReducedMotion ? 0 : 0.5,
              ease: EASE_OUT_CUBIC,
            }}
          >
            We&apos;re not here to transform the sector&mdash;we&apos;re here to{" "}
            <strong className="font-medium text-[#5C306C]">support the organizations already doing transformative work</strong>.
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-[#5C306C]/80 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: prefersReducedMotion ? 0 : 0.75,
              duration: prefersReducedMotion ? 0 : 0.4,
              ease: EASE_PREMIUM,
            }}
          >
            Supporting social service providers in{" "}
            <span className="font-medium text-[#5C306C]">Calgary</span>,{" "}
            <span className="font-medium text-[#5C306C]">Edmonton</span>,{" "}
            and <span className="font-medium text-[#5C306C]">Rural Alberta</span>.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) scrollTo(el, { duration: SCROLL_DURATION_HERO });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-br from-[#5C306C] to-[#472055] text-white font-medium tracking-wide shadow-lg shadow-[#5C306C]/25 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C306C]"
              whileHover={prefersReducedMotion ? {} : {
                scale: 1.02,
                boxShadow: "0 8px 24px rgba(92, 48, 108, 0.35)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_SNAPPY}
            >
              {hero.buttonPrimary}
            </motion.button>
            <motion.button
              type="button"
              onClick={handleScrollToStorytelling}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-[#5C306C]/80 bg-[#5C306C]/[0.06] text-[#5C306C] font-medium text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C306C] transition-colors"
              whileHover={prefersReducedMotion ? {} : {
                scale: 1.02,
                backgroundColor: "#5C306C",
                color: "#ffffff",
              }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_SNAPPY}
            >
              {hero.buttonSecondary}
            </motion.button>
          </div>
        </div>
        </div>
      </div>

      {/* Scroll Indicator - Bottom center, line-draw animation, fades on scroll */}
      {isMounted && (
        <motion.button
          type="button"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2 rounded-lg p-2 group"
          onClick={handleScrollDown}
          aria-label="Scroll to learn more"
          style={{ opacity: scrollIndicatorOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5, ease: EASE_OUT_CUBIC }}
        >
          <span className="text-xs uppercase tracking-[0.2em] text-[#5C306C]/40 group-hover:text-[#5C306C]/60 transition-colors font-medium">
            Scroll
          </span>
          <div className="w-px h-8 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 w-full bg-[#5C306C]/30 animate-scroll-line" />
          </div>
        </motion.button>
      )}
    </section>
  );
}
