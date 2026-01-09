// app/components/DeeperContext.tsx
// KISS: useInView for stable once-only animations, no re-triggers
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, useInView } from "framer-motion";
import BackgroundPatterns from "./partials/BackgroundPatterns";

// Reusable animated section - useInView is stable and won't re-trigger
function AnimatedBeat({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function DeeperContext() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.7], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="context"
      className="relative py-20 md:py-24 lg:py-32"
      aria-label="The deeper context - the work behind it"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent" />
        <BackgroundPatterns variant="organic-grid" opacity={0.6} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[#E07B4C] tracking-tight mb-4"
          >
            Our Approach
          </h2>
          <p
            className="text-base md:text-lg text-[#5C306C]/80 font-light max-w-xl mx-auto"
          >
            What makes genuine partnership possible—and why it matters for the work.
          </p>
        </div>

        {/* Overlapping Staggered Layout */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="absolute inset-0 bg-[#5C306C]/5" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#8FAE8B] via-[#FF9966] to-[#5C306C] origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Beat 1: Meeting You Where You Are - LEFT */}
          <AnimatedBeat className="relative grid md:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-0">
            <div className="md:pr-10">
              <h3 className="text-lg md:text-xl font-semibold text-[#5C306C] mb-2">
                Meeting You Where You Are
              </h3>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7]">
                We <strong className="font-semibold text-[#5C306C]">inherit whatever you have</strong>. That Excel sheet from 2008 holds years of <strong className="font-semibold text-[#5C306C]">institutional knowledge</strong>. Those workarounds everyone relies on reveal where systems fall short. We learn from what&apos;s already working and what isn&apos;t—not from assumptions about what you should need. When five organizations independently build similar solutions, <span className="font-medium">that pattern tells us something the sector has been trying to say</span>.
              </p>
            </div>
            <div className="hidden md:block" />
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8FAE8B] ring-4 ring-[#8FAE8B]/20" />
          </AnimatedBeat>

          {/* Beat 2: Expertise That Shapes Development - RIGHT */}
          <AnimatedBeat className="relative grid md:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-0 md:-mt-24" delay={0.1}>
            <div className="hidden md:block" />
            <div className="md:pl-10">
              <h3 className="text-lg md:text-xl font-semibold text-[#5C306C] mb-2">
                Expertise That Shapes Development
              </h3>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7] mb-2">
                The people using these tools every day—connected to communities, to the work, to the systems this technology needs to fit—hold knowledge that doesn&apos;t show up in a requirements document. Without it shaping development, technology doesn&apos;t fit. It doesn&apos;t improve things in ways that last.
              </p>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7]">
                So we build infrastructure where <strong className="font-semibold text-[#5C306C]">frontline insight holds real weight</strong>. Where <strong className="font-semibold text-[#5C306C]">feedback connects directly to what gets built next</strong>. Where there&apos;s enough safety to try something, learn from it, and adjust.
              </p>
            </div>
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9966] ring-4 ring-[#FF9966]/20" />
          </AnimatedBeat>

          {/* Beat 3: What Time Makes Possible - LEFT */}
          <AnimatedBeat className="relative grid md:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-0 md:-mt-20" delay={0.1}>
            <div className="md:pr-10">
              <h3 className="text-lg md:text-xl font-semibold text-[#5C306C] mb-2">
                What Time Makes Possible
              </h3>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7] mb-2">
                Short project timelines reward deliverables over understanding, handoffs over relationships. We&apos;ve structured ourselves differently—nonprofit, embedded teams, multi-year commitment—which creates room for a different kind of work.
              </p>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7] mb-2">
                Room for understanding before prescribing solutions. Room for relationships that outlast individual projects. Room for the kind of iteration that becomes affordable once trust is established—where <strong className="font-semibold text-[#5C306C]">a report adjustment isn&apos;t a new project, it&apos;s a conversation</strong>.
              </p>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7]">
                Most nonprofits have graveyards of abandoned systems. <strong className="font-semibold text-[#5C306C]">We stay. We adapt.</strong> Knowledge transfers through the work itself, not just documentation handed over at the end.
              </p>
            </div>
            <div className="hidden md:block" />
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8FAE8B] ring-4 ring-[#8FAE8B]/20" />
          </AnimatedBeat>

          {/* Beat 4: When Plans Change - RIGHT */}
          <AnimatedBeat className="relative grid md:grid-cols-2 gap-8 md:gap-10 md:-mt-24" delay={0.1}>
            <div className="hidden md:block" />
            <div className="md:pl-10">
              <h3 className="text-lg md:text-xl font-semibold text-[#5C306C] mb-2">
                When Plans Change
              </h3>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7] mb-2">
                In typical consulting, unexpected roadblocks threaten the whole engagement. You discover you need different personnel, or data that has to be gathered first, or requirements that shifted—and suddenly you&apos;re over budget or starting the RFP process again.
              </p>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7] mb-2">
                Our structure absorbs that differently. <strong className="font-semibold text-[#5C306C]">Roadblocks become problems to solve together</strong>, not threats to the project. Team composition adjusts to actual needs, not what was promised six months ago. The relationship continues even when the specifics shift.
              </p>
              <p className="text-[15px] md:text-base text-[#5C306C]/85 leading-[1.7]">
                This isn&apos;t looseness—it&apos;s <strong className="font-semibold text-[#5C306C]">contracts structured for how work actually unfolds</strong>.
              </p>
            </div>
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#5C306C] ring-4 ring-[#5C306C]/20" />
          </AnimatedBeat>
        </div>
      </div>
    </section>
  );
}
