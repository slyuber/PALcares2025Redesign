// app/components/Values.tsx
// ENHANCEMENT: 2025-01 - Award-winning design improvements
// - Larger icon containers (64px) with multi-layer backgrounds
// - Enhanced hover states with glow and rotation
// - Scroll-linked animations
// - Improved spacing and visual hierarchy
"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Sprout,
  Database,
} from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";

// MODIFICATION: 2024-12-16 - Reduced to 4 values for cleaner 2x2 grid layout
// REASON: User feedback indicated layout was broken with 5 values (only 3 visible)
const values = [
  {
    title: "Relationships Before Technology",
    description:
      "We're not here to transform the sector—we're here to support the organizations already doing transformative work. Building with communities is slower than building for them. We think that's worth it.",
    icon: HeartHandshake,
    color: "#E07B4C", // Coral
  },
  {
    title: "Community Ownership",
    description:
      "The people doing the work should shape the tools. Your data stays yours. What we build together gets generalized and released under open license so it stays with the community—available for others to use, adjust, build on.",
    icon: ShieldCheck,
    color: "#8FAE8B", // Sage green
  },
  {
    title: "Data Sovereignty",
    description:
      "Indigenous-led movements—including OCAP work here in Alberta—have been clear: data about communities should be governed by those communities. We're learning from that. When organizations lose control of their data through vendor lock-in or proprietary systems, they lose the ability to tell their own stories. Your data stays yours. Full stop.",
    icon: Database,
    color: "#5C306C", // Purple
  },
  {
    title: "Building Capacity, Not Dependency",
    description:
      "We don't aim to stay forever—but we'll stay as long as we're needed. Technology partnerships should build capability within your organization. Every capacity we build with you can strengthen the whole sector.",
    icon: Sprout,
    color: "#FF9966", // Orange
  },
];
// END MODIFICATION

// Separate component to allow hooks to be called at top level
function ValueItem({
  value,
  index,
  scrollYProgress,
  prefersReducedMotion,
}: {
  value: typeof values[number];
  index: number;
  scrollYProgress: MotionValue<number>;
  prefersReducedMotion: boolean | null;
}) {
  const Icon = value.icon;
  // Scroll-linked opacity for each icon - hooks must be at top level
  const iconOpacity = useTransform(
    scrollYProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [0, 1]
  );
  const iconY = useTransform(
    scrollYProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [20, 0]
  );
  const iconScale = useTransform(
    scrollYProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [0.95, 1]
  );

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        delay: prefersReducedMotion ? 0 : index * 0.1,
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeOut",
      }}
      style={prefersReducedMotion ? {} : {
        opacity: iconOpacity,
        y: iconY,
      }}
    >
      {/* ENHANCED: Larger icon container (64px) with multi-layer background */}
      <motion.div
        className="relative w-16 h-16 rounded-xl mb-6 flex items-center justify-center icon-container-enhanced"
        style={prefersReducedMotion ? {} : { scale: iconScale }}
        whileHover={prefersReducedMotion ? {} : {
          scale: 1.05,
          rotate: -2,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        role="img"
        aria-label={`${value.title} icon`}
        tabIndex={0}
      >
        {/* Multi-layer background: base gradient + pattern overlay */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${value.color}15 0%, ${value.color}05 100%)`,
          }}
        />
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 rounded-xl opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 30%, ${value.color}08 0%, transparent 50%)`,
          }}
        />
        {/* Border with gradient */}
        <div
          className="absolute inset-0 rounded-xl border"
          style={{
            borderColor: `${value.color}20`,
          }}
        />
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${value.color}20 0%, transparent 70%)`,
            filter: "blur(8px)",
          }}
        />
        {/* Icon */}
        <Icon
          className="relative z-10 w-6 h-6 transition-colors duration-300"
          style={{ color: value.color }}
          strokeWidth={1.5}
          aria-hidden="true"
          aria-label={`${value.title} icon`}
        />
      </motion.div>

      <h3 className="text-lg font-semibold text-[#4A2756] mb-3 leading-tight">
        {value.title}
      </h3>
      <p className="text-sm text-[#4A2756]/75 leading-[1.7]">
        {value.description}
      </p>
    </motion.div>
  );
}

export default function Values() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-linked animations for icons
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      id="values"
      className="py-20 md:py-32 relative overflow-hidden"
      aria-label="Our foundational values"
    >
      {/* Enhanced background: Subtle sage wash + award-winning patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8FAE8B]/[0.02] to-transparent" />
        {/* Watercolor-like wash using brand colors */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,_rgba(143,174,139,0.03)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,153,102,0.02)_0%,_transparent_60%)]" />
        {/* Award-winning subtle patterns */}
        <BackgroundPatterns variant="watercolor" opacity={0.8} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C]">
            What Guides Us
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#4A2756] tracking-tight">
            What We Believe
          </h2>
        </div>

        {/* ENHANCED: 2x2 grid with improved icon containers and animations */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <ValueItem
              key={index}
              value={value}
              index={index}
              scrollYProgress={scrollYProgress}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
