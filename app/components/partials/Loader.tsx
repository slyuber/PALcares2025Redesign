// app/components/partials/Loader.tsx
//
// Accelerating heartbeat loader with auto-proceed.
// No "ENTER" gate — plays through and exits via clip-path circle reveal.
//
// Stutter fixes:
//   1. Fixed minWidth on word slot (measured after fonts load) — no layout snapping
//   2. Icon always in DOM (opacity-gated) — no AnimatePresence width animation
//   3. Flat AnimatePresence structure — no nested mode="wait" blank frames
//   4. Asymmetric word transitions — fast exit, smooth enter
//
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  EASE_IN_OUT,
  EASE_SNAPPY,
  EASE_DRAMATIC,
  EASE_TEXT_REVEAL,
  DURATION_FAST,
  DURATION_NORMAL,
  DURATION_NORMAL_MOBILE,
  DURATION_MEDIUM,
} from "../../lib/animation-constants";

const words = ["teams", "labs", "research", "cares"];

const COLORS = {
  pal: "#4a5890",
  cares: "#FF9966",
  animating: "#5C306C",
};

// Accelerating heartbeat timing (ms from fontsReady)
// Each word gets time to settle — accelerating rhythm but never rushed
//   "teams" (800ms hold) → "labs" (700ms) → "research" (600ms) → "cares" (800ms pause) → merge → exit
const WORD_SCHEDULE = [0, 800, 1500, 2100]; // when each word appears
const MERGE_AT = 2900; // 800ms after "cares" appears
const EXIT_AT = 3600; // 700ms after merge
const SAFETY_TIMEOUT = 8000;

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
  const skipLoaderEnv = process.env.NEXT_PUBLIC_SKIP_LOADER === 'true';

  const [initialized, setInitialized] = useState(skipLoaderEnv);
  const [fontsReady, setFontsReady] = useState(false);
  const [showLoader, setShowLoader] = useState(!skipLoaderEnv);
  const [loaderSeen, setLoaderSeen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMerged, setIsMerged] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wordSlotMinWidth, setWordSlotMinWidth] = useState(0);

  const wordSlotRef = useRef<HTMLSpanElement>(null);

  const baseFontSize = "clamp(1.75rem, 5vw, 3.25rem)";
  const palFontSize = "clamp(2rem, 5.75vw, 3.75rem)";
  const iconSize = "clamp(2.25rem, 6.5vw, 4.5rem)";

  const exitLoader = useCallback(() => {
    if (!showLoader) return;
    setShowLoader(false);
    setLoaderSeen(true);
    sessionStorage.setItem("loaderSeen", "true");
    window.dispatchEvent(new Event("loaderComplete"));
  }, [showLoader]);

  // Measure widest word using a hidden offscreen span (always in DOM)
  const measureWidestWord = useCallback(() => {
    const el = wordSlotRef.current;
    if (!el) return;

    let maxW = 0;
    for (const word of words) {
      el.textContent = word;
      maxW = Math.max(maxW, el.getBoundingClientRect().width);
    }
    el.textContent = "";
    setWordSlotMinWidth(Math.ceil(maxW));
  }, []);

  // Init: skip checks, font loading
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const urlParams = new URLSearchParams(window.location.search);
    const userAgent = navigator.userAgent.toLowerCase();
    const isAutomatedTest =
      urlParams.get('skiploader') === 'true' ||
      process.env.NODE_ENV === 'test' ||
      userAgent.includes('lighthouse') ||
      userAgent.includes('headless') ||
      userAgent.includes('puppeteer') ||
      userAgent.includes('playwright') ||
      userAgent.includes('headlesschrome');

    const seen = sessionStorage.getItem("loaderSeen");
    if (seen === "true" || isAutomatedTest) {
      setShowLoader(false);
      setLoaderSeen(true);
      if (isAutomatedTest) sessionStorage.setItem("loaderSeen", "true");
    }
    setInitialized(true);

    // Wait for fonts, then measure widest word
    const fontFamily = 'Raleway';
    document.fonts.ready.then(() => {
      // Verify the actual font loaded (not fallback)
      const loaded = document.fonts.check(`1em ${fontFamily}`);
      if (loaded) {
        setFontsReady(true);
      } else {
        // Fallback: short delay then proceed anyway
        setTimeout(() => setFontsReady(true), 50);
      }
    });

    const handleResize = () => {
      const s = sessionStorage.getItem("loaderSeen");
      if (s === "true") {
        setShowLoader(false);
        setLoaderSeen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loaderSeen]);

  // Measure after fonts ready + DOM painted
  useEffect(() => {
    if (!fontsReady) return;
    requestAnimationFrame(() => {
      measureWidestWord();
    });
  }, [fontsReady, measureWidestWord]);

  // Accelerating heartbeat word sequence + merge + auto-exit
  useEffect(() => {
    if (!showLoader || !initialized || !fontsReady) return;

    if (prefersReducedMotion) {
      setTimeout(exitLoader, 500);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    // Word transitions (skip index 0, already showing)
    WORD_SCHEDULE.forEach((time, index) => {
      if (index > 0) {
        timeouts.push(setTimeout(() => setCurrentIndex(index), time));
      }
    });

    // Merge: icon appears, dash collapses, colors change
    timeouts.push(setTimeout(() => setIsMerged(true), MERGE_AT));

    // Auto-exit: clip-path circle reveal
    timeouts.push(setTimeout(() => setIsFinished(true), EXIT_AT));

    // Loader fully gone after exit animation completes (~1.2s)
    timeouts.push(setTimeout(exitLoader, EXIT_AT + 1200));

    // Safety timeout
    timeouts.push(setTimeout(exitLoader, SAFETY_TIMEOUT));

    return () => timeouts.forEach(clearTimeout);
  }, [showLoader, initialized, fontsReady, prefersReducedMotion, exitLoader]);

  if (!initialized) {
    if (skipLoaderEnv) return <>{children}</>;
    return <div className="fixed inset-0 z-[100] bg-[#F9F7F5]" />;
  }

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            data-loader-phase={isFinished ? "exiting" : isMerged ? "merged" : "cycling"}
            initial={{ opacity: 1 }}
            animate={{ opacity: isFinished ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 1, ease: EASE_IN_OUT }}
            style={{ pointerEvents: isFinished ? "none" : "auto" }}
          >
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-[#F9F7F5]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F1] via-[#F9F7F5] to-[#F0F4EF] opacity-80" />

              <motion.div
                className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
                transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
                style={{ opacity: 0.1, background: "radial-gradient(circle, rgba(255,153,102,0.4) 0%, rgba(255,153,102,0.1) 40%, transparent 70%)" }}
              />
              <motion.div
                className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
                transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT, delay: 1 }}
                style={{ opacity: 0.1, background: "radial-gradient(circle, rgba(143,174,139,0.4) 0%, rgba(143,174,139,0.1) 40%, transparent 70%)" }}
              />
              <motion.div
                className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.04, 0.06, 0.04] }}
                transition={{ duration: 12, repeat: Infinity, ease: EASE_IN_OUT, delay: 2 }}
                style={{ opacity: 0.05, background: "radial-gradient(circle, rgba(92,48,108,0.3) 0%, rgba(92,48,108,0.08) 40%, transparent 70%)" }}
              />
            </div>

            {/* Hidden measurement span — always in DOM for measuring widest word */}
            <span
              ref={wordSlotRef}
              aria-hidden="true"
              className="font-semibold leading-none"
              style={{
                fontSize: baseFontSize,
                position: "absolute",
                visibility: "hidden",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            />

            {/* LOGO TEXT */}
            <div className="relative z-10" data-loader-text>
              {/* Static icon while fonts load */}
              <AnimatePresence mode="wait">
                {!fontsReady ? (
                  <motion.div
                    key="loading-icon"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: DURATION_NORMAL_MOBILE }}
                    className="flex items-center justify-center"
                  >
                    <PALcaresIcon size="clamp(4rem, 12vw, 8rem)" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo-text"
                    className="inline-flex items-baseline justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: DURATION_NORMAL }}
                  >
                    {/* ICON — always in DOM, opacity + scale gated (no width animation) */}
                    <motion.div
                      className="flex items-center self-center overflow-hidden"
                      style={{ marginRight: "0.3em", width: iconSize }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: isMerged ? 1 : 0,
                        scale: isMerged ? 1 : 0,
                      }}
                      transition={{ duration: DURATION_NORMAL, ease: EASE_SNAPPY }}
                    >
                      <PALcaresIcon size={iconSize} />
                    </motion.div>

                    {/* PAL */}
                    <motion.span
                      className="font-semibold tracking-tight leading-none"
                      style={{ fontSize: palFontSize }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        color: isMerged ? COLORS.pal : COLORS.animating,
                      }}
                      transition={{
                        duration: DURATION_MEDIUM,
                        color: { duration: DURATION_NORMAL },
                      }}
                    >
                      PAL
                    </motion.span>

                    {/* DASH — collapses on merge */}
                    <motion.span
                      className="font-light leading-none"
                      style={{ fontSize: baseFontSize, color: COLORS.animating }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isMerged ? 0 : 1,
                        marginLeft: isMerged ? 0 : "0.2em",
                        marginRight: isMerged ? 0 : "0.2em",
                        width: isMerged ? 0 : "auto",
                      }}
                      transition={{ duration: DURATION_NORMAL_MOBILE }}
                    >
                      {!isMerged && "\u2013"}
                    </motion.span>

                    {/* ROTATING WORD / FINAL "cares" */}
                    <AnimatePresence mode="wait">
                      {!isMerged ? (
                        <motion.span
                          key={words[currentIndex]}
                          data-loader-word
                          className="font-semibold leading-none inline-block"
                          style={{
                            fontSize: baseFontSize,
                            color: COLORS.animating,
                            minWidth: wordSlotMinWidth > 0 ? wordSlotMinWidth : undefined,
                          }}
                          initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -12, filter: "blur(2px)" }}
                          transition={{
                            duration: DURATION_FAST,
                            ease: EASE_TEXT_REVEAL,
                          }}
                        >
                          {words[currentIndex]}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="final-cares"
                          data-loader-word
                          className="font-semibold leading-none inline-block"
                          style={{
                            fontSize: baseFontSize,
                            minWidth: wordSlotMinWidth > 0 ? wordSlotMinWidth : undefined,
                          }}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0, color: COLORS.cares }}
                          transition={{
                            duration: DURATION_NORMAL,
                            color: { duration: DURATION_MEDIUM },
                          }}
                        >
                          cares
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* TRANSITION OUT — clip-path circle reveal */}
            <AnimatePresence>
              {isFinished && (
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(150% at 50% 50%)" }}
                  transition={{ duration: 1.2, ease: EASE_DRAMATIC }}
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
      <div style={{ pointerEvents: showLoader ? "none" : "auto" }}>
        {children}
      </div>
    </>
  );
}
