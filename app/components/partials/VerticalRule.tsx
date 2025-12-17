"use client";

import { motion } from "framer-motion";

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
  const sharedStyles = {
    position: "relative" as const,
    left: "50%",
    top: 0,
    transform: "translateX(-50%)",
    width: thickness,
    height,
    backgroundColor: color,
    opacity,
    borderRadius: "200px",
  };

  if (animated) {
    return (
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          ...sharedStyles,
          transformOrigin: "top",
        }}
      />
    );
  }

  return <div style={sharedStyles} />;
}
