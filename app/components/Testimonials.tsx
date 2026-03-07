// app/components/Testimonials.tsx
// Pull-quote + expand pattern for long testimonials
"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";
import {
  EASE_PREMIUM,
  EASE_SMOOTH,
  DURATION_NORMAL,
  useSafeInView,
} from "../lib/animation-constants";
import { testimonials, testimonialsList } from "../lib/site-content";

function TestimonialCard({
  testimonial,
  index,
  inView,
  prefersReducedMotion,
}: {
  testimonial: (typeof testimonialsList)[number];
  index: number;
  inView: boolean;
  prefersReducedMotion: boolean | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentId = `testimonial-content-${index}`;

  const handleCollapse = useCallback(() => {
    setExpanded(false);
    // Scroll pull quote back into view so user isn't staring at blank space
    requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, []);

  const isPlaceholder = !testimonial.pullQuote;

  if (isPlaceholder) {
    return (
      <motion.div
        ref={cardRef}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.6,
          delay: prefersReducedMotion ? 0 : index * 0.15,
          ease: EASE_PREMIUM,
        }}
      >
        <div className="border-l-2 border-[#5C306C]/15 pl-6 md:pl-10 py-4">
          <p className="text-lg text-[#5C306C]/50 italic">
            {testimonial.org}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : index * 0.15,
        ease: EASE_PREMIUM,
      }}
    >
      {/* Pull Quote */}
      <blockquote className="border-l-2 border-[#FF9966]/40 pl-6 md:pl-10">
        <p className="text-xl md:text-2xl font-light text-[#5C306C] leading-relaxed italic">
          &ldquo;{testimonial.pullQuote}&rdquo;
        </p>

        {/* Attribution — always visible */}
        <footer className="mt-6 flex items-center gap-3">
          <div className="w-8 h-px bg-[#FF9966]/40" />
          <cite className="not-italic">
            <span className="text-sm font-semibold text-[#5C306C]">
              {testimonial.author}
            </span>
            <span className="text-sm text-[#5C306C]/70">
              {" "}&mdash; {testimonial.role}, {testimonial.org}
            </span>
          </cite>
        </footer>
      </blockquote>

      {/* Expand / Collapse */}
      {testimonial.fullTestimonial.length > 0 && (
        <div className="mt-6 pl-6 md:pl-10">
          {!expanded ? (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-expanded={false}
              aria-controls={contentId}
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#FF9966] hover:text-[#E07B4C] transition-colors min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2 rounded"
            >
              <span>Read full testimonial</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          ) : null}

          <AnimatePresence>
            {expanded && (
              <motion.div
                id={contentId}
                role="region"
                aria-label={`Full testimonial from ${testimonial.author}`}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : DURATION_NORMAL, ease: EASE_SMOOTH }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-2 pb-2">
                  {testimonial.fullTestimonial.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-base text-[#5C306C]/75 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCollapse}
                  aria-expanded={true}
                  aria-controls={contentId}
                  className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-[#5C306C]/60 hover:text-[#5C306C] transition-colors mt-2 min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2 rounded"
                >
                  <span>Show less</span>
                  <ChevronUp className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useSafeInView(headerRef, { once: true, amount: 0.15, margin: "100px 0px" });
  const quotesRef = useRef<HTMLDivElement>(null);
  const quotesInView = useSafeInView(quotesRef, { once: true, amount: 0.1, margin: "100px 0px" });

  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
      aria-label="Partner testimonials"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/20 to-transparent" />
        <BackgroundPatterns variant="watercolor" opacity={0.6} />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16 md:mb-24 space-y-4"
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          <motion.span
            className="text-xs font-semibold uppercase tracking-[0.2em] block"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, color: "#5C306C" }}
            animate={headerInView ? { opacity: 1, y: 0, color: "#E07B4C" } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          >
            {testimonials.label}
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-light text-[#5C306C] tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.1 }}
          >
            {testimonials.title}
          </motion.h2>
        </motion.div>

        {/* Testimonials stack */}
        <div ref={quotesRef} className="space-y-16 md:space-y-20">
          {testimonialsList.map((testimonial, index) => (
            <div key={testimonial.org}>
              <TestimonialCard
                testimonial={testimonial}
                index={index}
                inView={quotesInView}
                prefersReducedMotion={prefersReducedMotion}
              />

              {/* Separator */}
              {index < testimonialsList.length - 1 && (
                <div className="mt-16 md:mt-20 flex justify-center">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#5C306C]/10 to-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
