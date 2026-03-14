// app/components/ScrollBackground.tsx
// PROVEN PATTERN: Subtle parallax with GPU-accelerated transforms
// Uses Framer Motion's useTransform (no useState, no re-renders)
"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function ScrollBackground() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll();
  
  // PROVEN PATTERN: useTransform for scroll-linked values (no springs needed for subtle parallax)
  // This avoids continuous spring calculations - transforms are computed only when scrollYProgress changes
  // 2 parallax layers (reduced from 3 — fewer compositor layers = less GPU work per frame)
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Loading state - matches body background
  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10 bg-[#F5F2EE]" />
    );
  }

  // Simplified version for reduced motion preference
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF8] via-[#FAF7F3] to-[#F5F2EE]" />
        
        {/* Static color accents */}
        <div 
          className="absolute -top-[10%] -right-[15%] w-[70vw] h-[70vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,200,170,0.18) 0%, rgba(255,180,150,0.08) 40%, transparent 70%)",
          }}
        />
        <div 
          className="absolute top-[40%] -left-[20%] w-[60vw] h-[60vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(143,174,139,0.12) 0%, rgba(143,174,139,0.04) 40%, transparent 70%)",
          }}
        />
        <div 
          className="absolute -bottom-[5%] right-[10%] w-[50vw] h-[50vw] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(92,48,108,0.06) 0%, transparent 60%)",
          }}
        />
        
        {/* Crosshatch texture (lightweight, no SVG filters) */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(139,119,101,0.12) 2px,
                rgba(139,119,101,0.12) 3px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(139,119,101,0.12) 2px,
                rgba(139,119,101,0.12) 3px
              )
            `,
            backgroundSize: "8px 8px",
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* ====== STATIC LAYERS — isolated stacking context, never recomposited by parallax ====== */}
      <div className="absolute inset-0" style={{ isolation: "isolate" }}>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF8] via-[#FAF7F3] to-[#F5F2EE]" />

        {/* Cream glow (top) */}
        <div
          className="absolute -top-[10%] left-[20%] w-[50vw] h-[40vh] pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 30%,
                rgba(255,253,250,0.5) 0%,
                rgba(255,250,245,0.2) 40%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Warm glow (bottom) */}
        <div
          className="absolute bottom-0 left-[30%] w-[60vw] h-[35vh] pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 50% 80%,
                rgba(255,240,230,0.3) 0%,
                rgba(250,245,240,0.1) 50%,
                transparent 70%
              )
            `,
          }}
        />

        {/* Purple accent (static — merged from former parallax layer 3) */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-10%",
            right: "5%",
            width: "50vw",
            height: "50vw",
            background: `
              radial-gradient(circle at 50% 50%,
                rgba(92,48,108,0.05) 0%,
                rgba(92,48,108,0.025) 30%,
                rgba(92,48,108,0.01) 50%,
                transparent 70%
              )
            `,
            borderRadius: "50%",
          }}
        />

        {/* Crosshatch texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(139,119,101,0.12) 2px,
                rgba(139,119,101,0.12) 3px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(139,119,101,0.12) 2px,
                rgba(139,119,101,0.12) 3px
              )
            `,
            backgroundSize: "8px 8px",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(245,242,238,0.25) 100%)
            `,
          }}
        />
      </div>

      {/* ====== PARALLAX LAYERS — own stacking context, only these recomposite on scroll ====== */}
      <div className="absolute inset-0 pointer-events-none" style={{ isolation: "isolate" }}>
        {/* Warm peach/coral (top-right) */}
        <motion.div
          className="absolute pointer-events-none will-change-transform"
          style={{
            y: layer1Y,
            top: "-15%",
            right: "-20%",
            width: "70vw",
            height: "70vw",
            background: `
              radial-gradient(circle at 40% 40%,
                rgba(255,210,180,0.16) 0%,
                rgba(255,195,165,0.10) 20%,
                rgba(255,180,150,0.05) 40%,
                rgba(255,170,140,0.02) 60%,
                transparent 80%
              )
            `,
            borderRadius: "50%",
          }}
        />

        {/* Sage green (left-center) */}
        <motion.div
          className="absolute pointer-events-none will-change-transform"
          style={{
            y: layer2Y,
            top: "30%",
            left: "-25%",
            width: "60vw",
            height: "60vw",
            background: `
              radial-gradient(circle at 60% 50%,
                rgba(143,174,139,0.10) 0%,
                rgba(143,174,139,0.05) 25%,
                rgba(143,174,139,0.02) 45%,
                transparent 70%
              )
            `,
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
}
