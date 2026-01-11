// app/components/Values.tsx
// Clean 2x2 grid layout with strategic bolding for important ideas
"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Sprout,
  Database,
} from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";

const values = [
  {
    title: "Trust as Infrastructure",
    icon: HeartHandshake,
    color: "#E07B4C",
  },
  {
    title: "Community Ownership",
    icon: ShieldCheck,
    color: "#8FAE8B",
  },
  {
    title: "Data Sovereignty",
    icon: Database,
    color: "#5C306C",
  },
  {
    title: "Building Capacity, Not Dependency",
    icon: Sprout,
    color: "#FF9966",
  },
];

export default function Values() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={sectionRef}
      id="values"
      className="py-20 md:py-32 relative overflow-hidden"
      aria-label="Our foundational values"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8FAE8B]/[0.02] to-transparent"
          style={prefersReducedMotion ? {} : { y: backgroundY }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,_rgba(143,174,139,0.03)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,153,102,0.02)_0%,_transparent_60%)]" />
        <BackgroundPatterns variant="watercolor" opacity={0.8} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header - staggered reveal */}
        <motion.div
          className="text-center mb-16 md:mb-24 space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          <motion.span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
          >
            What Guides Us
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-normal text-[#4A2756] tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.1 }}
          >
            What We Believe
          </motion.h2>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          {/* Trust as Infrastructure */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: "blur(3px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${values[0].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <HeartHandshake
                className="w-6 h-6"
                style={{ color: values[0].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#4A2756] mb-3">
              {values[0].title}
            </h3>
            <p className="text-sm text-[#4A2756]/75 leading-relaxed">
              Good technology can't be separated from the relationships that create it. We don't finish understanding your organization and then start building—<strong className="font-semibold text-[#4A2756]">the building is part of the understanding</strong>. The small fixes, the documentation, the patient learning alongside your team—that IS the technical work. When <span className="font-medium">trust and technology develop together</span>, what emerges actually fits how your organization operates.
            </p>
          </motion.div>

          {/* Community Ownership */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: "blur(3px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${values[1].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <ShieldCheck
                className="w-6 h-6"
                style={{ color: values[1].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#4A2756] mb-3">
              {values[1].title}
            </h3>
            <p className="text-sm text-[#4A2756]/75 leading-relaxed">
              What we build together comes from your organization's knowledge and the communities you serve. It shouldn't be locked in proprietary systems or sold back to you. <strong className="font-semibold text-[#4A2756]">Tools shaped by community expertise belong to that community</strong>—to use, change, and share freely.
            </p>
          </motion.div>

          {/* Data Sovereignty */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: "blur(3px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${values[2].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Database
                className="w-6 h-6"
                style={{ color: values[2].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#4A2756] mb-3">
              {values[2].title}
            </h3>
            <p className="text-sm text-[#4A2756]/75 leading-relaxed">
              Indigenous-led movements—including <span className="font-medium">OCAP principles</span> here in Alberta—have shown that data about communities should be governed by those communities. We're learning from that leadership. When organizations lose control of their data through vendor lock-in or proprietary systems, they lose the ability to tell their own stories and advocate on their own terms. <strong className="font-semibold text-[#4A2756]">Your data stays yours. Full stop.</strong>
            </p>
          </motion.div>

          {/* Building Capacity, Not Dependency */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: "blur(3px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            whileHover={prefersReducedMotion ? {} : { y: -4 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="cursor-default"
          >
            <motion.div
              className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: `${values[3].color}12` }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.08, rotate: 5 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Sprout
                className="w-6 h-6"
                style={{ color: values[3].color }}
                strokeWidth={1.5}
              />
            </motion.div>
            <h3 className="text-lg font-semibold text-[#4A2756] mb-3">
              {values[3].title}
            </h3>
            <p className="text-sm text-[#4A2756]/75 leading-relaxed">
              We don't aim to stay forever—but we'll stay as long as we're needed. Some organizations choose deep, ongoing collaboration; others gradually take the lead. Either way, technology partnerships should <strong className="font-semibold text-[#4A2756]">leave your organization stronger</strong>—with <span className="font-medium">real skills transferred</span>, not just documentation handed over.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
