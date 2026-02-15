"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_CUBIC } from "../../lib/animation-constants";

interface VerticalRuleProps {
  color?: string;
  thickness?: string; // e.g. "2px"
  height?: string; // e.g. "100vh"
  animated?: boolean;
  opacity?: string;
}

export default function VerticalRule({
  color = "#000",
  thickness = "1px",
  height = "50vh",
  animated = false,
  opacity = "1",
}: VerticalRuleProps) {
  const prefersReducedMotion = useReducedMotion();
  const dynamicStyles = {
    width: thickness,
    height,
    backgroundColor: color,
    opacity,
  };

  if (animated) {
    return (
      <motion.div
        className="relative left-1/2 top-0 -translate-x-1/2 rounded-full origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: EASE_OUT_CUBIC }}
        style={dynamicStyles}
      />
    );
  }

  return <div className="relative left-1/2 top-0 -translate-x-1/2 rounded-full" style={dynamicStyles} />;
}
