// app/components/partials/BackgroundPatterns.tsx
// Award-winning design: Subtle brand patterns for section backgrounds
"use client";

import { motion, useReducedMotion } from "framer-motion";

interface BackgroundPatternsProps {
  variant?: "connection" | "organic-grid" | "watercolor" | "all";
  opacity?: number;
  className?: string;
}

export default function BackgroundPatterns({
  variant = "all",
  opacity = 1,
  className = "",
}: BackgroundPatternsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Connection Lines Pattern - Flowing lines that connect elements */}
      {(variant === "connection" || variant === "all") && (
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: prefersReducedMotion ? 0.02 * opacity : 0.02 * opacity,
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(92, 48, 108, 0.3) 20px,
                rgba(92, 48, 108, 0.3) 21px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                rgba(92, 48, 108, 0.3) 20px,
                rgba(92, 48, 108, 0.3) 21px
              )
            `,
            mixBlendMode: "multiply",
          }}
          animate={prefersReducedMotion ? {} : {
            opacity: [0.02 * opacity, 0.03 * opacity, 0.02 * opacity],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Organic Grid Pattern - Soft, wavy grid overlay */}
      {(variant === "organic-grid" || variant === "all") && (
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: prefersReducedMotion ? 0.015 * opacity : 0.015 * opacity,
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(92, 48, 108, 0.2) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            mixBlendMode: "multiply",
          }}
          animate={prefersReducedMotion ? {} : {
            backgroundPosition: ["0 0", "20px 20px", "0 0"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Watercolor-like Texture Wash */}
      {(variant === "watercolor" || variant === "all") && (
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: prefersReducedMotion ? 0.03 * opacity : 0.03 * opacity,
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(255, 153, 102, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(143, 174, 139, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(92, 48, 108, 0.2) 0%, transparent 60%)
            `,
            mixBlendMode: "multiply",
            filter: "blur(40px)",
          }}
          animate={prefersReducedMotion ? {} : {
            opacity: [0.03 * opacity, 0.04 * opacity, 0.03 * opacity],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Flowing Organic Lines - Inspired by community/connection theme */}
      {(variant === "all") && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.015]"
          preserveAspectRatio="none"
          style={{ mixBlendMode: "multiply" }}
        >
          <motion.path
            d="M0,200 Q200,150 400,200 T800,200"
            fill="none"
            stroke="rgba(92, 48, 108, 0.3)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={prefersReducedMotion ? { pathLength: 1 } : {
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.path
            d="M0,400 Q300,350 600,400 T1200,400"
            fill="none"
            stroke="rgba(255, 153, 102, 0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={prefersReducedMotion ? { pathLength: 1 } : {
              pathLength: [0, 1, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </svg>
      )}
    </div>
  );
}

