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
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

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
        
        {/* Paper texture */}
        <div 
          className="absolute inset-0 opacity-[0.05] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
            backgroundSize: "512px 512px",
          }}
        />
        
        {/* Fine grain */}
        <div 
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      
      {/* ====== BASE LAYER - Static warm gradient ====== */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDFBF8] via-[#FAF7F3] to-[#F5F2EE]" />
      
      
      {/* ====== PARALLAX LAYER 1 - Warm peach/coral (top-right) ====== */}
      {/* MODIFICATION: 2024-12-16 - Softer edges, more feathering */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ 
          y: layer1Y,
          top: "-15%",
          right: "-20%",
          width: "90vw",
          height: "90vw",
        }}
      >
        <div 
          className="w-full h-full rounded-full blur-xl"
          style={{
            background: `
              radial-gradient(circle at 40% 40%, 
                rgba(255,210,180,0.18) 0%, 
                rgba(255,195,165,0.10) 25%,
                rgba(255,180,150,0.06) 45%,
                rgba(255,170,140,0.02) 65%,
                transparent 85%
              )
            `,
          }}
        />
      </motion.div>
      {/* END MODIFICATION */}


      {/* ====== PARALLAX LAYER 2 - Sage green (left-center) ====== */}
      {/* MODIFICATION: 2024-12-16 - Softer edges, more feathering */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ 
          y: layer2Y,
          top: "30%",
          left: "-25%",
          width: "80vw",
          height: "80vw",
        }}
      >
        <div 
          className="w-full h-full rounded-full blur-xl"
          style={{
            background: `
              radial-gradient(circle at 60% 50%, 
                rgba(143,174,139,0.12) 0%, 
                rgba(143,174,139,0.06) 30%,
                rgba(143,174,139,0.02) 50%,
                transparent 75%
              )
            `,
          }}
        />
      </motion.div>
      {/* END MODIFICATION */}


      {/* ====== PARALLAX LAYER 3 - Purple accent (bottom-right) ====== */}
      {/* MODIFICATION: 2024-12-16 - Softer edges, more feathering */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ 
          y: layer3Y,
          bottom: "-10%",
          right: "5%",
          width: "65vw",
          height: "65vw",
        }}
      >
        <div 
          className="w-full h-full rounded-full blur-xl"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, 
                rgba(92,48,108,0.06) 0%, 
                rgba(92,48,108,0.03) 35%,
                rgba(92,48,108,0.01) 55%,
                transparent 75%
              )
            `,
          }}
        />
      </motion.div>
      {/* END MODIFICATION */}


      {/* ====== STATIC HIGHLIGHT - Cream glow (top) ====== */}
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


      {/* ====== STATIC HIGHLIGHT - Warm glow (bottom) ====== */}
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


      {/* ====== TEXTURE OVERLAYS - Keep these, they're performant ====== */}
      
      {/* Paper/Canvas texture - gives painterly feel */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundSize: "512px 512px",
        }}
      />
      
      {/* Fine grain noise - adds organic imperfection */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Subtle linen crosshatch - canvas texture */}
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

      {/* Soft vignette - very subtle, draws focus inward */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(245,242,238,0.25) 100%)
          `,
        }}
      />
    </div>
  );
}
