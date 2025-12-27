// app/components/partials/Loader.tsx
// 
// COMPLETE REWRITE: 2024-12-27
// Goal: Exact logo match + proper centering
//
// Logo specs (from PALcares_logo.svg):
//   PAL:   Raleway, 46px, SemiBold (600), #4a5890 (navy)
//   cares: Raleway, 40px, SemiBold (600), #FF9966 (orange)
//   Ratio: PAL is 1.15x larger than cares
//   Both on same baseline, NO space between them
//
// Centering approach:
//   - Full viewport centered with flexbox
//   - Text container uses text-align: center
//   - All text elements are inline/inline-block
//   - Rotating words container is inline-block with fixed width
//
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Animation words (final one is "cares")
const words = ["teams", "labs", "research", "cares"];

// EXACT colors from PALcares_logo.svg
const COLORS = {
  pal: "#4a5890",        // Navy blue (final state)
  cares: "#FF9966",      // Orange
  animating: "#5C306C",  // Purple (during animation)
};

export default function Loader({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [initialized, setInitialized] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderSeen, setLoaderSeen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isMerged, setIsMerged] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Calculate responsive font sizes using useMemo
  // Logo ratio: PAL (46px) / cares (40px) = 1.15
  const fontSizes = useMemo(() => ({
    cares: "clamp(2rem, 6vw, 4rem)",      // Base size
    pal: "clamp(2.3rem, 6.9vw, 4.6rem)",  // 1.15x base
  }), []);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("loaderSeen");
      if (seen === "true") {
        setShowLoader(false);
        setLoaderSeen(true);
      }
      setInitialized(true);

      // Safety timeout to prevent loader blocking
      const handleResize = () => {
        const seen = sessionStorage.getItem("loaderSeen");
        if (seen === "true" && showLoader) {
          setShowLoader(false);
          setLoaderSeen(true);
        }
        if (showLoader && !seen) {
          setTimeout(() => {
            if (showLoader) {
              setShowLoader(false);
              setLoaderSeen(true);
              sessionStorage.setItem("loaderSeen", "true");
            }
          }, 5000);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [loaderSeen, showLoader]);

  // Animation timeline
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

    const wordTimings = [500, 1200, 1900, 2600];
    const timeouts: NodeJS.Timeout[] = [];

    wordTimings.forEach((time, index) => {
      timeouts.push(setTimeout(() => setCurrentIndex(index), time));
    });

    timeouts.push(setTimeout(() => setIsMerged(true), 3200));
    timeouts.push(setTimeout(() => setIsReady(true), 4000));

    return () => timeouts.forEach(clearTimeout);
  }, [showLoader, initialized, prefersReducedMotion]);

  // Handle user input to exit
  useEffect(() => {
    if (!isReady || isFinished) return;

    const handleInput = () => {
      setIsFinished(true);
      setTimeout(() => {
        setShowLoader(false);
        setLoaderSeen(true);
        sessionStorage.setItem("loaderSeen", "true");
      }, 1200);
    };

    const events = ["click", "wheel", "keydown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, handleInput, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handleInput));
  }, [isReady, isFinished]);

  // Pre-initialization state
  if (!initialized) {
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
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{
              pointerEvents: isFinished ? "none" : "auto",
              fontFamily: "Raleway, var(--font-raleway), system-ui, sans-serif",
            }}
          >
            {/* ═══════════════════════════════════════════
                BACKGROUND
            ═══════════════════════════════════════════ */}
            <div className="absolute inset-0 bg-[#F9F7F5]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F1] via-[#F9F7F5] to-[#F0F4EF] opacity-80" />
              
              {/* Animated orbs */}
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

            {/* ═══════════════════════════════════════════
                LOGO TEXT - CENTERED
                
                Structure for centering:
                [full-width, text-align: center]
                  └── [inline-block wrapper, items-baseline]
                        ├── PAL (inline)
                        ├── – (inline, animates out)
                        └── [words container] (inline-block, relative, fixed width)
                              └── word (absolute positioned)
            ═══════════════════════════════════════════ */}
            <div className="relative z-10 w-full px-4">
              <div className="text-center">
                <span 
                  className="inline-flex items-baseline"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {/* PAL */}
                  <motion.span
                    style={{
                      fontSize: fontSizes.pal,
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                    initial={{ opacity: 0, x: -20, color: COLORS.animating }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      color: isMerged ? COLORS.pal : COLORS.animating,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      color: { duration: 0.8, delay: isMerged ? 0.2 : 0 },
                    }}
                  >
                    PAL
                  </motion.span>

                  {/* Dash – animates width to 0 on merge */}
                  <motion.span
                    style={{
                      fontSize: fontSizes.cares,
                      fontWeight: 300,
                      color: COLORS.animating,
                      display: "inline-block",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isMerged ? 0 : 1,
                      width: isMerged ? 0 : "auto",
                      paddingLeft: isMerged ? 0 : "0.15em",
                      paddingRight: isMerged ? 0 : "0.15em",
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    –
                  </motion.span>

                  {/* Words container - inline-block with relative positioning */}
                  <span
                    style={{
                      fontSize: fontSizes.cares,
                      fontWeight: 600,
                      display: "inline-block",
                      position: "relative",
                      // Fixed width = longest word to prevent layout shift during rotation
                      // "research" is longest, but we use em units for responsiveness
                      width: isMerged ? "2.7em" : "4em", // "cares" vs "research"
                      height: "1.2em",
                      verticalAlign: "baseline",
                      textAlign: "left",
                      transition: "width 0.4s ease-out",
                    }}
                  >
                    <AnimatePresence mode="popLayout">
                      {/* Rotating words */}
                      {!isMerged && currentIndex >= 0 && (
                        <motion.span
                          key={words[currentIndex]}
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            color: COLORS.animating,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                          initial={{ y: -40, opacity: 0, filter: "blur(8px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          exit={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                          transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 20,
                            opacity: { duration: 0.2 },
                            filter: { duration: 0.3 },
                          }}
                        >
                          {words[currentIndex]}
                        </motion.span>
                      )}

                      {/* Final "cares" - EXACT LOGO MATCH */}
                      {isMerged && (
                        <motion.span
                          key="merged-cares"
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                          initial={{ x: 15, opacity: 0, color: COLORS.animating }}
                          animate={{ x: 0, opacity: 1, color: COLORS.cares }}
                          transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                            color: { duration: 0.6 },
                          }}
                        >
                          cares
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </span>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                ENTER PROMPT
            ═══════════════════════════════════════════ */}
            <motion.div
              className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-2 text-sm font-medium tracking-widest uppercase"
              style={{ color: `${COLORS.pal}66` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 10 }}
              transition={{ duration: 0.8 }}
            >
              <span>Enter</span>
              <motion.div
                animate={prefersReducedMotion ? {} : { y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* Transition Out */}
            <AnimatePresence>
              {isFinished && (
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(150% at 50% 50%)" }}
                  transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] as const }}
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
        transition={{ duration: 0.6, delay: showLoader ? 0 : 0.1 }}
        style={{ pointerEvents: showLoader ? "none" : "auto" }}
      >
        {children}
      </motion.div>
    </>
  );
}