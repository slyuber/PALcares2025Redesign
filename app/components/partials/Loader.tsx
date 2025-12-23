// app/components/partials/Loader.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const words = ["teams", "labs", "research", "cares"];

export default function Loader({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [initialized, setInitialized] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderSeen, setLoaderSeen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isMerged, setIsMerged] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // #region agent log
  const _dbgLoaderRenderCountRef = useState(0)[0]; // stable placeholder, avoids lint about unused ref in render
  // (useRef in render-only is fine; kept minimal)
  // #endregion agent log

  // Check sessionStorage on mount and handle resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("loaderSeen");
      if (seen === "true") {
        setShowLoader(false);
        setLoaderSeen(true);
      }
      setInitialized(true);
      
      // Ensure loader doesn't block on resize - hide if it's been seen before or after a delay
      const handleResize = () => {
        const seen = sessionStorage.getItem("loaderSeen");
        if (seen === "true" && showLoader) {
          setShowLoader(false);
          setLoaderSeen(true);
        }
        // Also hide after 5 seconds on resize to prevent blocking
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
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [loaderSeen, showLoader]);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/c686fb35-8db3-46c2-9758-79707c3550fe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Loader.tsx:state',message:'loader state change',data:{initialized,showLoader,loaderSeen,isReady,isFinished,prefersReducedMotion},timestamp:Date.now(),sessionId:'debug-session',runId:'baseline',hypothesisId:'C'})}).catch(()=>{});
  }, [initialized, showLoader, loaderSeen, isReady, isFinished, prefersReducedMotion]);
  // #endregion agent log

  // Animation timeline
  useEffect(() => {
    if (!showLoader || !initialized) return;

    if (prefersReducedMotion) {
      // Skip animation for reduced motion
      setTimeout(() => {
        setShowLoader(false);
        setLoaderSeen(true);
        sessionStorage.setItem("loaderSeen", "true");
      }, 500);
      return;
    }

    const wordTimings = [500, 1200, 1900, 2600]; // When each word drops in
    const timeouts: NodeJS.Timeout[] = [];

    // Schedule word changes
    wordTimings.forEach((time, index) => {
      timeouts.push(
        setTimeout(() => {
          setCurrentIndex(index);
        }, time)
      );
    });

    // Merge at 3.2s
    timeouts.push(
      setTimeout(() => {
        setIsMerged(true);
      }, 3200)
    );

    // Ready for input at 4s
    timeouts.push(
      setTimeout(() => {
        setIsReady(true);
      }, 4000)
    );

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

    window.addEventListener("click", handleInput);
    window.addEventListener("wheel", handleInput);
    window.addEventListener("keydown", handleInput);
    window.addEventListener("touchstart", handleInput);

    return () => {
      window.removeEventListener("click", handleInput);
      window.removeEventListener("wheel", handleInput);
      window.removeEventListener("keydown", handleInput);
      window.removeEventListener("touchstart", handleInput);
    };
  }, [isReady, isFinished]);

  // Don't render anything until we know sessionStorage state
  if (!initialized) {
    return <div className="fixed inset-0 z-[999999] bg-[#F9F7F5]" />;
  }

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            className="fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFinished ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ 
              pointerEvents: isFinished ? "none" : "auto",
              display: isFinished && !showLoader ? "none" : "flex"
            }}
          >
            {/* Organic Warm Background */}
            <div className="absolute inset-0 bg-[#F9F7F5]">
              {/* Subtle warm gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F1] via-[#F9F7F5] to-[#F0F4EF] opacity-80" />

              {/* Organic amorphous shapes for warmth */}
              <motion.div
                className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#FF9966] rounded-full mix-blend-multiply blur-[120px]"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.1, 1],
                        opacity: [0.08, 0.12, 0.08],
                      }
                }
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={{ opacity: 0.1 }}
              />
              <motion.div
                className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#8FAE8B] rounded-full mix-blend-multiply blur-[120px]"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.15, 1],
                        opacity: [0.08, 0.12, 0.08],
                      }
                }
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                style={{ opacity: 0.1 }}
              />
              <motion.div
                className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-[#5C306C] rounded-full mix-blend-multiply blur-[100px]"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                        opacity: [0.04, 0.06, 0.04],
                      }
                }
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                style={{ opacity: 0.05 }}
              />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <div className="flex items-center text-4xl md:text-6xl lg:text-7xl font-light text-[#5C306C] tracking-tight">
                {/* PAL */}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="font-bold"
                >
                  PAL
                </motion.span>

                {/* Dash - fades out during merge */}
                <motion.span
                  className="mx-1 md:mx-2 overflow-hidden inline-block"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isMerged ? 0 : 1,
                    width: isMerged ? 0 : "auto",
                    marginLeft: isMerged ? 0 : undefined,
                    marginRight: isMerged ? 0 : undefined,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  –
                </motion.span>

                {/* Rotating Words */}
                <div className="relative h-[1.2em] w-[180px] md:w-[280px] lg:w-[320px]">
                  <AnimatePresence mode="popLayout">
                    {!isMerged && currentIndex >= 0 && (
                      <motion.span
                        key={words[currentIndex]}
                        className="absolute left-0 top-0"
                        initial={{
                          y: -50,
                          opacity: 0,
                          filter: "blur(10px)",
                        }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          y: 50,
                          opacity: 0,
                          filter: "blur(10px)",
                        }}
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

                    {/* Final State: "cares" merges and turns orange */}
                    {isMerged && (
                      <motion.span
                        key="merged-cares"
                        className="absolute left-0 top-0 font-light"
                        initial={{ x: 20, color: "#5C306C" }}
                        animate={{ x: 0, color: "#FF9966" }}
                        transition={{
                          type: "spring",
                          stiffness: 60,
                          damping: 20,
                          color: { duration: 0.6 },
                        }}
                      >
                        cares
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Input Prompt - "Enter" with bouncing chevron */}
            <motion.div
              className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-2 text-[#5C306C]/40 text-sm font-medium tracking-widest uppercase"
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

            {/* Transition Out Effect - Ripple/Expand from center */}
            <AnimatePresence>
              {isFinished && (
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(150% at 50% 50%)" }}
                  transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(249,247,245,0.95), rgba(249,247,245,0.8))",
                    backdropFilter: "blur(20px)",
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content - always render so the app loads/hydrates underneath the loader */}
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
