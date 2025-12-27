// app/components/Testimonials.tsx
// ENHANCEMENT: 2025-01 - Award-winning design: Background patterns, enhanced icon interactions
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  org: string;
  initials: string;
}

// Placeholder for real testimonials - remove fake testimonials
const testimonials: Testimonial[] = [
  {
    quote: "[Awaiting real quote from partner]",
    author: "Name",
    role: "Role",
    org: "Reach",
    initials: "PL"
  },
  {
    quote: "[Awaiting real quote from partner]",
    author: "Name",
    role: "Role",
    org: "24-7 Crisis Diversion Team",
    initials: "PL"
  }
];

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section 
      id="testimonials"
      className="py-20 md:py-32 relative overflow-hidden"
      aria-label="Partner testimonials"
    >
      {/* Enhanced background: Award-winning patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundPatterns variant="watercolor" opacity={0.6} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-24 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF9966]">
            Partner Voices
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[#5C306C]">
            Organizations We Work With
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="group relative bg-gradient-to-br from-white to-[#FAFAFA] rounded-3xl p-8 md:p-10 border border-[#5C306C]/5 shadow-[0_4px_20px_rgba(92,48,108,0.06)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.2, duration: 0.6 }}
              whileHover={prefersReducedMotion ? {} : { y: -5, transition: { duration: 0.3 } }}
            >
              {/* Quote Icon Badge - Enhanced */}
              <motion.div
                className="absolute -top-5 left-8 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF9966] to-[#FF8552] shadow-lg shadow-[#FF9966]/30 flex items-center justify-center icon-container-enhanced"
                whileHover={prefersReducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                role="img"
                aria-label="Quote icon"
              >
                <Quote className="w-5 h-5 text-white stroke-[2.5]" />
              </motion.div>

              <blockquote className="mt-6 mb-8 text-[#5C306C]/85 text-[15px] leading-relaxed font-light">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4 border-t border-[#5C306C]/10 pt-6">
                {/* Avatar with initials */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#5C306C] to-[#472055] flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{testimonial.initials}</span>
                </div>
                <div>
                  <cite className="not-italic block text-sm font-semibold text-[#5C306C]">
                    {testimonial.author}
                  </cite>
                  <span className="block text-xs text-[#5C306C]/60">
                    {testimonial.role}, {testimonial.org}
                  </span>
                </div>
              </div>

              {/* Hover Accent Line */}
              <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-[#FF9966] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
