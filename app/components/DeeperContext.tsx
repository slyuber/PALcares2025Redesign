// app/components/DeeperContext.tsx
// MODIFICATION: 2024-12-16 - Issue 4: Left alignment, proper title/subtitle/body hierarchy, reduced color emphasis
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export default function DeeperContext() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20,
  });

  const lineHeight = useTransform(smoothProgress, [0, 0.7], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="context"
      className="relative py-24 md:py-32"
      aria-label="The deeper context - the work behind it"
    >
      {/* Very subtle warm wash - blends with page background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header - Updated hierarchy: label → title → subtitle */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#5C306C]/60 mb-4"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            Our Approach
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[#5C306C] tracking-tight mb-4"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.1 }}
          >
            The Deeper Context
          </motion.h2>
          <motion.p
            className="text-base md:text-lg text-[#5C306C]/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            What makes genuine partnership possible—and why it matters for the work.
          </motion.p>
        </div>

        {/* Overlapping Staggered Layout */}
        <div className="relative">
          {/* Vertical connecting line - centered on desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-[#5C306C]/5" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#8FAE8B] via-[#FF9966] to-[#5C306C] origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Beat 1: Where We Start - LEFT (removed md:text-right) */}
          <motion.div
            className="relative grid md:grid-cols-2 gap-8 md:gap-16"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <div className="md:pr-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[#5C306C]/50 mb-4">
                Meeting You Where You Are
              </span>
              <p className="text-base md:text-lg text-[#5C306C] leading-[1.8] mb-4">
                We inherit whatever you have.{" "}
                <span className="font-semibold">
                  The Excel sheets holding everything together
                </span>
                . The expensive system no one uses. The database someone&apos;s nephew built in 2012.
              </p>
              <p className="text-sm md:text-base text-[#5C306C]/70 leading-[1.8]">
                We don&apos;t judge. These &ldquo;solutions&rdquo; tell us important truths about what your team needs.{" "}
                <span className="font-medium">That Excel sheet that works? There&apos;s a reason five organizations independently created something similar.</span>
              </p>
            </div>
            <div className="hidden md:block" />
            
            {/* Node */}
            <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8FAE8B] ring-4 ring-[#8FAE8B]/20" />
          </motion.div>

          {/* Beat 2: Why This Matters - RIGHT */}
          <motion.div
            className="relative grid md:grid-cols-2 gap-8 md:gap-16 md:-mt-16"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <div className="hidden md:block" />
            <div className="md:pl-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[#5C306C]/50 mb-4">
                Frontline Expertise
              </span>
              <p className="text-base md:text-lg text-[#5C306C] leading-[1.8] mb-4">
                The person answering crisis calls at 2 AM knows things about the work that{" "}
                <span className="font-semibold">take doing the job to understand</span>.
                They know which fields in the intake form don&apos;t make sense. They know what data never gets captured. They know the workarounds everyone uses.
              </p>
              <p className="text-sm md:text-base text-[#5C306C]/70 leading-[1.8] border-l-2 border-[#5C306C]/20 pl-4">
                That expertise is where the data comes from. We think it should guide how technology gets built.
              </p>
            </div>
            
            {/* Node */}
            <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9966] ring-4 ring-[#FF9966]/20" />
          </motion.div>

          {/* Beat 3: What It Takes - LEFT (removed md:text-right) */}
          <motion.div
            className="relative grid md:grid-cols-2 gap-8 md:gap-16 md:-mt-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <div className="md:pr-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[#5C306C]/50 mb-4">
                Building the Conditions
              </span>
              <p className="text-base md:text-lg text-[#5C306C] leading-[1.8] mb-4">
                Getting there isn&apos;t automatic. It takes time to{" "}
                <span className="font-semibold">build relationships where people feel comfortable raising problems</span>.
                It takes processes for gathering feedback. It takes infrastructure that makes iteration affordable rather than a new project every time.
              </p>
              <p className="text-sm md:text-base text-[#5C306C]/70 leading-[1.8]">
                Current system frameworks can make this difficult.{" "}
                <span className="font-medium">Short timelines, rigid contracts, misaligned incentives.</span>
              </p>
            </div>
            <div className="hidden md:block" />
            
            {/* Node */}
            <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8FAE8B] ring-4 ring-[#8FAE8B]/20" />
          </motion.div>

          {/* Beat 4: What We've Tried - RIGHT */}
          <motion.div
            className="relative grid md:grid-cols-2 gap-8 md:gap-16 md:-mt-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <div className="hidden md:block" />
            <div className="md:pl-16">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] text-[#5C306C]/50 mb-4">
                Small, Purposeful Decisions
              </span>
              <p className="text-base md:text-lg text-[#5C306C] leading-[1.8] mb-4">
                We&apos;re not claiming to have solved any of that. But we&apos;ve tried to make choices—
                <span className="font-semibold">how we structure partnerships, how we write contracts, our nonprofit status</span>—
                that give us room to try.
              </p>
              <p className="text-sm md:text-base text-[#5C306C]/70 leading-[1.8]">
                Our job is{" "}
                <span className="font-medium">incremental improvement</span>—making tomorrow slightly better than today without disrupting the critical work you&apos;re already doing.
              </p>
            </div>
            
            {/* Node */}
            <div className="hidden md:block absolute left-1/2 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#5C306C] ring-4 ring-[#5C306C]/20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
// END MODIFICATION
