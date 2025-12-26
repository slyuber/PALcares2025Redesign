// app/components/Values.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Sprout,
  Database,
} from "lucide-react";

// MODIFICATION: 2024-12-16 - Reduced to 4 values for cleaner 2x2 grid layout
// REASON: User feedback indicated layout was broken with 5 values (only 3 visible)
const values = [
  {
    title: "Relationships Before Technology",
    description:
      "We're not here to transform the sector—we're here to support the organizations already doing transformative work. Building with communities is slower than building for them. We think that's worth it.",
    icon: HeartHandshake,
  },
  {
    title: "Community Ownership",
    description:
      "The people doing the work should shape the tools. Your data stays yours. What we build together gets generalized and released under open license so it stays with the community—available for others to use, adjust, build on.",
    icon: ShieldCheck,
  },
  {
    title: "Data Sovereignty",
    description:
      "Indigenous-led movements—including OCAP work here in Alberta—have been clear: data about communities should be governed by those communities. We're learning from that. When organizations lose control of their data through vendor lock-in or proprietary systems, they lose the ability to tell their own stories. Your data stays yours. Full stop.",
    icon: Database,
  },
  {
    title: "Building Capacity, Not Dependency",
    description:
      "We don't aim to stay forever—but we'll stay as long as we're needed. Technology partnerships should build capability within your organization. Every capacity we build with you can strengthen the whole sector.",
    icon: Sprout,
  },
];
// END MODIFICATION

export default function Values() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="values"
      className="py-20 md:py-32 relative overflow-hidden"
      aria-label="Our foundational values"
    >
      {/* Subtle sage wash - no hard edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8FAE8B]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07B4C]">
            What Guides Us
          </span>
          <h2 className="text-3xl md:text-4xl font-normal text-[#4A2756] tracking-tight">
            What We Believe
          </h2>
        </div>

        {/* MODIFICATION: 2024-12-16 - Changed to 2x2 grid for 4 values */}
        {/* REASON: Cleaner layout that shows all values equally */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                  duration: prefersReducedMotion ? 0 : 0.6,
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E07B4C]/15 to-[#E07B4C]/5 border border-[#E07B4C]/15 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-[#E07B4C]" />
                </div>
                <h3 className="text-base font-semibold text-[#4A2756] mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-[#4A2756]/75 leading-[1.7]">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        {/* END MODIFICATION */}
      </div>
    </section>
  );
}
