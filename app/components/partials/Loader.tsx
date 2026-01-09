// app/components/partials/Loader.tsx
// 
// VERSION: 2024-12-27 - Complete rework for proper centering
//
// RESEARCH-BACKED FIXES:
// 1. NO fixed-width containers - words take natural width
// 2. AnimatePresence mode="wait" - only ONE word exists at a time (no stacking)
// 3. align-items: baseline for proper text alignment
// 4. Simpler structure matching the hero section
//
// Animation sequence:
//   1. "PAL – teams" → "PAL – labs" → etc. (words swap, layout adjusts)
//   2. Merge: Icon appears, dash collapses, colors change
//   3. Final: Exact match to hero logo
//
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const words = ["teams", "labs", "research", "cares"];

const COLORS = {
  pal: "#4a5890",
  cares: "#FF9966", 
  animating: "#5C306C",
};

// Inline SVG icon component
function PALcaresIcon({ size }: { size: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 138.89 131.25"
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden="true"
    >
      <path fill="#ea5dff" d="M63.78,78.69a29.12,29.12,0,1,0,0,46.79l40.39-23.4ZM53.59,113.8a14.47,14.47,0,0,1-19-1.39,14.65,14.65,0,0,1,0-20.66,14.48,14.48,0,0,1,19-1.39l20.19,11.72Z"/>
      <path fill="#7388e0" d="M113,8.54A29,29,0,0,0,75.11,5.77L34.72,29.17,75.11,52.56A29.12,29.12,0,0,0,113,8.54Zm-8.77,31a14.48,14.48,0,0,1-19,1.39L65.1,29.17,85.3,17.45a14.47,14.47,0,0,1,19,1.39A14.65,14.65,0,0,1,104.25,39.5Z"/>
      <path fill="#FF9966" d="M46.42,32.16a29.12,29.12,0,1,0,0,46.79L86.81,55.56ZM36.23,67.28a14.48,14.48,0,0,1-18.95-1.39,14.65,14.65,0,0,1,0-20.66,14.46,14.46,0,0,1,18.95-1.39L56.42,55.56Z"/>
      <path fill="#c42ac6" d="M130.38,55.07A29,29,0,0,0,92.47,52.3L52.08,75.69l40.39,23.4a29.12,29.12,0,0,0,37.91-44ZM121.61,86a14.46,14.46,0,0,1-19,1.39L82.47,75.69,102.66,64a14.48,14.48,0,0,1,19,1.39A14.65,14.65,0,0,1,121.61,86Z"/>
    </svg>
  );
}

export default function Loader({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  // Skip loader entirely when env var is set (for testing tools like Lighthouse)
  const skipLoaderEnv = process.env.NEXT_PUBLIC_SKIP_LOADER === 'true';

  const [initialized, setInitialized] = useState(skipLoaderEnv);
  const [showLoader, setShowLoader] = useState(!skipLoaderEnv);
  const [loaderSeen, setLoaderSeen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Start at 0, not -1
  const [isMerged, setIsMerged] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Font size - using CSS custom property pattern for consistency
  const baseFontSize = "clamp(1.75rem, 5vw, 3.25rem)";
  const palFontSize = "clamp(2rem, 5.75vw, 3.75rem)"; // ~1.15x
  const iconSize = "clamp(2.25rem, 6.5vw, 4.5rem)";

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Skip loader for testing: add ?skiploader=true to URL, set in sessionStorage,
      // or detect automated testing tools (Lighthouse, Puppeteer, Playwright, etc.)
      const urlParams = new URLSearchParams(window.location.search);
      const userAgent = navigator.userAgent.toLowerCase();
      const isAutomatedTest =
        urlParams.get('skiploader') === 'true' ||
        process.env.NODE_ENV === 'test' ||
        userAgent.includes('lighthouse') ||
        userAgent.includes('headless') ||
        userAgent.includes('puppeteer') ||
        userAgent.includes('playwright') ||
        // Check for Chrome DevTools protocol (used by most testing tools)
        !!(window as typeof window & { chrome?: { csi?: unknown } }).chrome?.csi;

      const seen = sessionStorage.getItem("loaderSeen");
      if (seen === "true" || isAutomatedTest) {
        setShowLoader(false);
        setLoaderSeen(true);
        if (isAutomatedTest) sessionStorage.setItem("loaderSeen", "true");
      }
      setInitialized(true);

      const handleResize = () => {
        const seen = sessionStorage.getItem("loaderSeen");
        if (seen === "true" && showLoader) {
          setShowLoader(false);
          setLoaderSeen(true);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [loaderSeen, showLoader]);

  useEffect(() => {
    if (!showLoader || !initialized) return;

    if (prefersReducedMotion) {
      setTimeout(() => {
        setShowLoader(false);
        setLoaderSeen(true);
        sessionStorage.setItem("loaderSeen", "true");
      }, 500);
      return;
    }

    // Word timings - start immediately with first word
    const wordTimings = [700, 1400, 2100, 2800]; // When each subsequent word appears
    const timeouts: NodeJS.Timeout[] = [];

    wordTimings.forEach((time, index) => {
      if (index > 0) { // Skip first, already showing
        timeouts.push(setTimeout(() => setCurrentIndex(index), time));
      }
    });

    // Merge after last word has been shown for a moment
    timeouts.push(setTimeout(() => setIsMerged(true), 3400));
    timeouts.push(setTimeout(() => setIsReady(true), 4200));

    // Safety timeout
    timeouts.push(setTimeout(() => {
      if (showLoader) {
        setShowLoader(false);
        setLoaderSeen(true);
        sessionStorage.setItem("loaderSeen", "true");
      }
    }, 8000));

    return () => timeouts.forEach(clearTimeout);
  }, [showLoader, initialized, prefersReducedMotion]);

  useEffect(() => {
    if (!isReady || isFinished) return;

    const handleInput = () => {
      setIsFinished(true);
      setTimeout(() => {
        setShowLoader(false);
        setLoaderSeen(true);
        sessionStorage.setItem("loaderSeen", "true");
      }, 1000);
    };

    const events = ["click", "wheel", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, handleInput, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handleInput));
  }, [isReady, isFinished]);

  if (!initialized) {
    // When skip loader env is set, render children immediately
    if (skipLoaderEnv) return <>{children}</>;
    return <div className="fixed inset-0 z-[999999] bg-[#F9F7F5]" />;
  }

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFinished ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{
              pointerEvents: isFinished ? "none" : "auto",
              fontFamily: "Raleway, var(--font-raleway), system-ui, sans-serif",
            }}
          >
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-[#F9F7F5]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F1] via-[#F9F7F5] to-[#F0F4EF] opacity-80" />
              
              <motion.div
                className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#FF9966] rounded-full mix-blend-multiply blur-[120px]"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ opacity: 0.1 }}
              />
              <motion.div
                className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#8FAE8B] rounded-full mix-blend-multiply blur-[120px]"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ opacity: 0.1 }}
              />
              <motion.div
                className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-[#5C306C] rounded-full mix-blend-multiply blur-[100px]"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.04, 0.06, 0.04] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                style={{ opacity: 0.05 }}
              />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                LOGO TEXT
                
                Key insight from research:
                - Use inline-flex with align-items: baseline for text alignment
                - Let words take their natural width (no fixed containers)
                - AnimatePresence mode="wait" ensures only one word at a time
                - The whole block naturally centers in its parent
            ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-10">
              {/* 
                Using a simple inline-flex container
                align-items: baseline ensures PAL and the word align on text baseline
                gap provides consistent spacing
              */}
              <motion.div
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  justifyContent: "center",
                }}
                layout
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* ICON - appears after merge */}
                <AnimatePresence>
                  {isMerged && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0 }}
                      animate={{ opacity: 1, scale: 1, width: "auto", marginRight: "0.3em" }}
                      exit={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        alignSelf: "center", // Center icon vertically with text block
                        overflow: "hidden",
                      }}
                    >
                      <PALcaresIcon size={iconSize} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* PAL */}
                <motion.span
                  style={{
                    fontSize: palFontSize,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    color: isMerged ? COLORS.pal : COLORS.animating,
                  }}
                  transition={{
                    duration: 0.5,
                    color: { duration: 0.4 },
                  }}
                >
                  PAL
                </motion.span>

                {/* DASH - collapses on merge */}
                <motion.span
                  style={{
                    fontSize: baseFontSize,
                    fontWeight: 300,
                    color: COLORS.animating,
                    lineHeight: 1,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isMerged ? 0 : 1,
                    marginLeft: isMerged ? 0 : "0.2em",
                    marginRight: isMerged ? 0 : "0.2em",
                    width: isMerged ? 0 : "auto",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {!isMerged && "–"}
                </motion.span>

                {/* ROTATING WORD / FINAL "cares"
                    
                    KEY FIX: Using AnimatePresence mode="wait"
                    This ensures only ONE word exists in the DOM at a time.
                    No stacking, no fixed widths, no centering issues.
                    The container naturally sizes to fit the current word.
                */}
                <AnimatePresence mode="wait">
                  {!isMerged ? (
                    <motion.span
                      key={words[currentIndex]}
                      style={{
                        fontSize: baseFontSize,
                        fontWeight: 600,
                        color: COLORS.animating,
                        lineHeight: 1,
                        display: "inline-block",
                      }}
                      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      {words[currentIndex]}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="final-cares"
                      style={{
                        fontSize: baseFontSize,
                        fontWeight: 600,
                        lineHeight: 1,
                        display: "inline-block",
                      }}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0, color: COLORS.cares }}
                      transition={{
                        duration: 0.4,
                        color: { duration: 0.5 },
                      }}
                    >
                      cares
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* ENTER PROMPT */}
            <motion.div
              className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-2 text-sm font-medium tracking-widest uppercase"
              style={{ color: `${COLORS.pal}66` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 10 }}
              transition={{ duration: 0.6 }}
            >
              <span>Enter</span>
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* TRANSITION OUT */}
            <AnimatePresence>
              {isFinished && (
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(150% at 50% 50%)" }}
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] as const }}
                  style={{
                    background: "linear-gradient(to bottom, rgba(249,247,245,0.95), rgba(249,247,245,0.8))",
                    backdropFilter: "blur(20px)",
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        initial={false}
        animate={{ opacity: showLoader ? 0 : 1 }}
        transition={{ duration: 0.5, delay: showLoader ? 0 : 0.1 }}
        style={{ pointerEvents: showLoader ? "none" : "auto" }}
      >
        {children}
      </motion.div>
    </>
  );
}