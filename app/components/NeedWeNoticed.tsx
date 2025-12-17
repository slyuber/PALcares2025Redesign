// app/components/NeedWeNoticed.tsx
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

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C] block mb-6">
            Where We Started
          </span>

          <h2 className="text-3xl md:text-4xl font-normal text-[#4A2756] mb-10 tracking-tight leading-tight">
            We noticed a need in our communities.
          </h2>

          <div className="space-y-8 text-base md:text-lg text-[#4A2756]/85 leading-[1.8] max-w-3xl mx-auto text-left md:text-center">
            <p>
              Across North America, organizations are questioning why technology
              that should serve communities often ends up extracting from them.
              We&apos;re part of this broader conversation—but our focus is specific.
            </p>

            <p>
              We think frontline expertise guiding development matters. We think
              what gets built should stay with organizations and communities.
              Creating the conditions for that can be difficult in current system
              frameworks—we&apos;re not claiming to have solved it.
            </p>

            <p className="text-[#4A2756] font-medium">
              But we&apos;ve made small, purposeful decisions—multi-year partnerships,
              how we structure contracts, shared nonprofit status, open
              licensing—that together give us enough flexibility to try to do this kind of work. Here&apos;s what we&apos;re building.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#8FAE8B]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#5C306C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </section>
  );
}
