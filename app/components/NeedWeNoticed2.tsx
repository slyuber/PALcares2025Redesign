// app/components/NeedWeNoticed.tsx
// PROVEN UX PATTERN: Left-aligned body text for readability
// Centered titles are fine, but body paragraphs should be left-aligned
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function NeedWeNoticed() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="where-we-started"
      className="py-24 md:py-32 relative overflow-hidden"
      aria-label="Where we started - the need we noticed"
    >
      {/* Subtle background wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/30 to-transparent pointer-events-none" />

      {/* PROVEN PATTERN: Asymmetric two-column layout for visual interest */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
          className="grid md:grid-cols-12 gap-8 md:gap-12"
        >
          {/* Left column: Title area (sticky on desktop) */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="md:sticky md:top-32">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-4">
                Where We Started
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-[#4A2756] tracking-tight leading-tight">
                We noticed a need in our communities.
              </h2>
            </div>
          </div>

          {/* Right column: Body text (left-aligned for readability) */}
          <div className="md:col-span-8 lg:col-span-7">
            <div className="space-y-6 text-base md:text-lg text-[#4A2756]/85 leading-relaxed">
              <p>
                Across North America, organizations are questioning why technology
                that should serve communities often ends up extracting from them.
                We&apos;re part of this broader conversation—but our focus is specific.
              </p>

              <p>
                We believe the people doing the work should shape the tools. What
                gets built should stay with the organizations and communities that
                helped create it. Technical expertise and frontline wisdom need
                equal weight in development decisions.
              </p>

              <p>
                Creating the conditions for this kind of partnership takes
                deliberate choices. Small, purposeful decisions—nonprofit
                structure, multi-year commitments, open licensing,
                relationship-centered contracts—that together give us the
                flexibility to work differently.
              </p>

              <p>
                We&apos;re building an ecosystem where embedded technical teams learn
                organizational reality before writing code, where emerging talent
                and newcomers strengthen local capacity, where a proven solution
                can become a resource for the sector.
              </p>

              <p className="text-[#4A2756] font-medium border-l-2 border-[#E07B4C] pl-6 mt-8">
                It&apos;s deliberate work, rooted in the understanding that sustainable
                technology emerges from genuine partnership.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#8FAE8B]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#5C306C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </section>
  );
}
