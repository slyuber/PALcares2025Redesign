// app/components/DeeperContext.tsx
// KISS: useInView for stable once-only animations, no re-triggers
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import BackgroundPatterns from "./partials/BackgroundPatterns";
import { EASE_PREMIUM, useSafeInView } from "../lib/animation-constants";

// Reusable animated section - useInView triggers with refined premium animation
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
  // Trigger when element is 15% visible for smoother entry
  const isInView = useSafeInView(ref, { once: true, amount: 0.15, margin: "100px 0px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={isInView
        ? { opacity: 1, y: 0 }
        : undefined
      }
      transition={{
        duration: prefersReducedMotion ? 0 : 0.55,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE_PREMIUM,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function DeeperContext() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Offset: start measuring when section top hits viewport center
    // Complete when section end approaches viewport top
    offset: ["start center", "end 0.2"],
  });

  // Line starts empty (0%) and fills to 100% as user scrolls through section
  const lineHeight = useTransform(scrollYProgress, [0, 0.85], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="context"
      className="relative py-16 md:py-24 lg:py-32"
      aria-label="The deeper context - the work behind it"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent" />
        <BackgroundPatterns variant="organic-grid" opacity={0.6} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[#E07B4C] tracking-tight mb-4"
          >
            Our Approach
          </h2>
          <p
            className="text-base md:text-lg lg:text-xl text-[#5C306C]/80 font-light max-w-2xl mx-auto lg:whitespace-nowrap"
          >
            What makes partnership like this possible, and why it matters.
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
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-3">
                Meeting You Where You Are
              </span>
              <p className="text-base text-[#5C306C]/85 leading-relaxed">
                We <strong className="font-semibold text-[#5C306C]">inherit whatever you have</strong>. That Excel sheet from 2008 holds years of <strong className="font-semibold text-[#5C306C]">institutional knowledge</strong>. Those workarounds everyone relies on reveal where systems fall short. We learn from what&apos;s already working and what isn&apos;t—not from assumptions about what you should need. When five organizations independently build similar solutions, <span className="font-medium">that pattern tells us something the sector has been trying to say</span>.
              </p>
            </div>
            <div className="hidden md:block" />
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8FAE8B] ring-4 ring-[#8FAE8B]/20" />
          </AnimatedBeat>

          {/* Beat 2: Building Infrastructure Before Changing Systems - RIGHT */}
          <AnimatedBeat className="relative grid md:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-0 md:-mt-24" delay={0.1}>
            <div className="hidden md:block" />
            <div className="md:pl-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-3">
                Building Infrastructure Before Changing Systems
              </span>
              <p className="text-base text-[#5C306C]/85 leading-relaxed mb-2">
                Frontline staff know what doesn&apos;t appear in any requirements document. That knowledge should shape technology development&mdash;but it only does if two things are true.
              </p>
              <p className="text-base text-[#5C306C]/85 leading-relaxed mb-2">
                First: a relationship where feedback travels. Staff tell you what isn&apos;t working when they trust it won&apos;t create problems and believe something will happen as a result.
              </p>
              <p className="text-base text-[#5C306C]/85 leading-relaxed mb-2">
                Second, and harder: the infrastructure to act on that feedback safely. We work through smaller, lower-stakes things first&mdash;not to delay, but because that&apos;s where surprises surface while there&apos;s still room to handle them. By the time we&apos;re touching the systems that matter most, we&apos;ve already learned how this organization&apos;s environment behaves.
              </p>
              <p className="text-base text-[#5C306C]/85 leading-relaxed">
                That&apos;s the sequence. Relationship first, infrastructure second. Both have to exist before feedback does anything useful.
              </p>
            </div>
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF9966] ring-4 ring-[#FF9966]/20" />
          </AnimatedBeat>

          {/* Beat 3: What Time Makes Possible - LEFT */}
          <AnimatedBeat className="relative grid md:grid-cols-2 gap-8 md:gap-10 mb-12 md:mb-0 md:-mt-20" delay={0.1}>
            <div className="md:pr-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-3">
                What Time Makes Possible
              </span>
              <p className="text-base text-[#5C306C]/85 leading-relaxed mb-2">
                Short project timelines reward deliverables over understanding, handoffs over relationships. Our structure buys us something most consultancies can&apos;t offer: time. Time to understand before prescribing. Time for relationships that outlast individual projects.
              </p>
              <p className="text-base text-[#5C306C]/85 leading-relaxed mb-2">
                That means iteration becomes affordable once the foundation exists. <strong className="font-semibold text-[#5C306C]">A report adjustment isn&apos;t a new project, it&apos;s a conversation</strong>. A database change doesn&apos;t require a new contract&mdash;it requires a Tuesday morning call.
              </p>
              <p className="text-base text-[#5C306C]/85 leading-relaxed">
                Technology projects fail at a predictable point: when the relationship ends and the system has to survive without the people who understood it. <strong className="font-semibold text-[#5C306C]">We stay. We adapt.</strong> When our team changes&mdash;and it will&mdash;knowledge lives in the systems, processes, and documentation we&apos;ve built together, not only in whoever&apos;s currently on your file. Knowledge transfers through the work itself, not just documentation handed over at the end.
              </p>
            </div>
            <div className="hidden md:block" />
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8FAE8B] ring-4 ring-[#8FAE8B]/20" />
          </AnimatedBeat>

          {/* Beat 4: When Plans Change - RIGHT */}
          <AnimatedBeat className="relative grid md:grid-cols-2 gap-8 md:gap-10 md:-mt-24" delay={0.1}>
            <div className="hidden md:block" />
            <div className="md:pl-10">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-3">
                When Plans Change
              </span>
              <p className="text-base text-[#5C306C]/85 leading-relaxed mb-2">
                In typical consulting, unexpected roadblocks threaten the whole engagement. Different personnel needed, data to gather first, requirements that shifted&mdash;suddenly you&apos;re over budget or restarting the RFP process.
              </p>
              <p className="text-base text-[#5C306C]/85 leading-relaxed mb-2">
                Our structure makes room for that differently. When something doesn&apos;t go as planned, we reorient. We rescope. We meet the new context rather than defending the old one. That&apos;s sometimes uncomfortable&mdash;it doesn&apos;t always look like what either party expected. But having the room and resources to do that together, rather than fighting about whose fault the change is, is what makes the difference.
              </p>
              <p className="text-base text-[#5C306C]/85 leading-relaxed">
                This isn&apos;t looseness&mdash;it&apos;s <strong className="font-semibold text-[#5C306C]">contracts structured for how work unfolds</strong>.
              </p>
            </div>
            <div className="hidden md:block absolute left-1/2 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#5C306C] ring-4 ring-[#5C306C]/20" />
          </AnimatedBeat>
        </div>
      </div>
    </section>
  );
}
