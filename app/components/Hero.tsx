// app/components/Hero.tsx
// PROVEN PATTERN: useTransform for scroll-linked animations (no springs needed for simple fade/move)
// ENHANCEMENT: 2025-01 - Award-winning design: Subtle background patterns
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  const { scrollY } = useScroll();
  
  // PROVEN PATTERN: Direct useTransform (no springs) for simple scroll-linked fades
  // Springs add complexity and constant calculations - not needed for basic parallax
  const logoOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const logoY = useTransform(scrollY, [0, 300], [0, -80]);
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.6]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleScrollDown = useCallback(() => {
    const target = document.getElementById("storytelling");
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [prefersReducedMotion]);

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

      {/* Primary Orb - MODIFICATION: 2024-12-16 - Softer edges */}
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[110vmax] h-[110vmax] bg-[radial-gradient(circle,_rgba(255,153,102,0.08)_0%,_rgba(255,153,102,0.03)_40%,_transparent_70%)] blur-xl pointer-events-none z-0" />

      {/* Secondary Orb - MODIFICATION: 2024-12-16 - Softer edges */}
      <div className="absolute top-[70%] left-[75%] w-[70vmax] h-[70vmax] bg-[radial-gradient(circle,_rgba(92,48,108,0.04)_0%,_rgba(92,48,108,0.01)_40%,_transparent_70%)] blur-xl pointer-events-none z-0" />

      {/* Award-winning subtle patterns - very subtle in hero */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <BackgroundPatterns variant="watercolor" opacity={0.3} />
      </div>

      {/* Organic Lines - Horizontal Flow */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <svg
          className="w-[110%] h-full -ml-[5%]"
          viewBox="0 0 1584 900"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M-50,400 Q360,350 720,400 T1584,400"
            fill="none"
            stroke="rgba(92, 48, 108, 0.06)"
            strokeWidth="2"
            style={{ willChange: 'transform' }}
            initial={{ x: 0 }}
            animate={prefersReducedMotion ? {} : { x: 20 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M-50,500 Q360,550 720,500 T1584,500"
            fill="none"
            stroke="rgba(92, 48, 108, 0.06)"
            strokeWidth="1.5"
            style={{ willChange: 'transform' }}
            initial={{ x: 0 }}
            animate={prefersReducedMotion ? {} : { x: -20 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M-50,600 Q360,550 720,600 T1584,600"
            fill="none"
            stroke="rgba(92, 48, 108, 0.06)"
            strokeWidth="1"
            style={{ willChange: 'transform' }}
            initial={{ x: 0 }}
            animate={prefersReducedMotion ? {} : { x: 15 }}
            transition={{
              duration: 22,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
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
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
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
        <motion.div
          className="hidden lg:flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeOut" }}
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

        <motion.h1
          className="font-light leading-[1.15] tracking-tight text-[#5C306C]"
          style={{ fontSize: "clamp(1.5rem, 4.5vw, 3.5rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: "easeOut",
          }}
        >
          Technology that <span className="font-medium">strengthens the relationships</span> <br className="hidden md:block" />
          your work depends on
        </motion.h1>

        <motion.p
          className="font-light leading-relaxed text-[#5C306C]/85 max-w-2xl mx-auto"
          style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: "easeOut",
            delay: 0.2,
          }}
        >
          We&apos;re not here to transform the sector—we&apos;re here to support
          the organizations already doing transformative work.{" "}
          <span className="font-semibold">Genuine partnerships, not transactions.</span>
        </motion.p>

        <motion.p
          className="text-sm md:text-base font-light text-[#5C306C]/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: "easeOut",
            delay: 0.4,
          }}
        >
          Serving Calgary, Edmonton, and Surrounding Areas
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: "easeOut",
            delay: 0.6,
          }}
        >
          <motion.a
            href="#storytelling"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-br from-[#5C306C] to-[#472055] text-white font-medium tracking-wide shadow-lg shadow-[#5C306C]/25 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C306C]"
            whileHover={prefersReducedMotion ? {} : {
              scale: 1.02,
              boxShadow: "0 8px 24px rgba(92, 48, 108, 0.35)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            See How We Work
          </motion.a>
          <motion.a
            href="#contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-[#5C306C] text-[#5C306C] font-medium text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C306C] transition-colors"
            whileHover={prefersReducedMotion ? {} : {
              scale: 1.02,
              backgroundColor: "#5C306C",
              color: "#ffffff",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Start a Conversation
          </motion.a>
        </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Positioned at bottom right, subtle and elegant */}
      {isMounted && (
        <motion.button
          type="button"
          className="absolute bottom-8 right-6 md:bottom-12 md:right-12 flex flex-col items-center gap-1.5 z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2 rounded-lg p-2 group"
          onClick={handleScrollDown}
          aria-label="Scroll to learn more"
          animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#5C306C]/40 group-hover:text-[#5C306C]/60 transition-colors">
            Scroll
          </span>
          <ArrowDown className="w-4 h-4 text-[#5C306C]/40 group-hover:text-[#5C306C]/60 transition-colors" />
        </motion.button>
      )}
    </section>
  );
}
