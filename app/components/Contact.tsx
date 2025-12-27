// app/components/Contact.tsx
// MODIFICATION: 2024-12-16 - Issue 5: Award-winning inspired two-column contact section
// Design inspiration: Kinsta, Formidable Forms minimal approach, warm nonprofit aesthetics
// ENHANCEMENT: 2025-01 - Award-winning design: Background patterns, enhanced icon interactions
"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="py-24 md:py-32 relative overflow-hidden"
      aria-label="Contact us"
    >
      {/* Enhanced background: Subtle organic + award-winning patterns */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-transparent to-[#F5F0EB]/50" />
        {/* Decorative orb - top right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FF9966]/[0.04] blur-3xl" />
        {/* Decorative orb - bottom left */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#8FAE8B]/[0.05] blur-3xl" />
        {/* Award-winning subtle patterns */}
        <BackgroundPatterns variant="connection" opacity={0.5} />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Two-column grid - asymmetric for visual interest */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: Content (narrower - 2 cols) */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            {/* Header */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FF9966]">
                Start a Conversation
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#5C306C] leading-[1.2] tracking-tight">
                Let&apos;s talk about what you need
              </h2>
            </div>
            
            {/* Description */}
            <p className="text-base text-[#5C306C]/70 leading-relaxed">
              We&apos;re building partnerships with organizations in Calgary and Edmonton—crisis services, community housing, mental health support, and social service providers.
            </p>

            {/* Divider line */}
            <div className="w-16 h-px bg-gradient-to-r from-[#FF9966]/50 to-transparent" />

            {/* Contact details - stacked simply */}
            <div className="space-y-4">
              <a 
                href="mailto:partnerships@palcares.org" 
                className="group flex items-center gap-3 text-[#5C306C] hover:text-[#FF9966] transition-colors"
              >
                <span className="text-base font-medium group-hover:underline underline-offset-4 decoration-[#FF9966]/50">
                  partnerships@palcares.org
                </span>
              </a>
              
              <div className="text-sm text-[#5C306C]/60">
                <p className="font-medium text-[#5C306C]/80">Treaty 6 & Treaty 7 Territories</p>
                <p>Calgary & Edmonton, Alberta</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Form (wider - 3 cols) */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.15 }}
          >
            {/* Form container - subtle card styling */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#5C306C]/[0.06] p-8 md:p-10 shadow-[0_8px_32px_rgba(92,48,108,0.04)] transform-gpu">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    {/* Name row */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label 
                          htmlFor="firstName" 
                          className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/50 block"
                        >
                          First Name
                        </label>
                        <input 
                          type="text" 
                          id="firstName" 
                          name="firstName"
                          required 
                          className="w-full bg-[#FAF8F5]/50 border-0 border-b-2 border-[#5C306C]/10 rounded-none px-0 py-3 text-base text-[#5C306C] focus:border-[#FF9966] focus:ring-0 outline-none transition-colors placeholder:text-[#5C306C]/25" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label 
                          htmlFor="lastName" 
                          className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/50 block"
                        >
                          Last Name
                        </label>
                        <input 
                          type="text" 
                          id="lastName" 
                          name="lastName"
                          required 
                          className="w-full bg-[#FAF8F5]/50 border-0 border-b-2 border-[#5C306C]/10 rounded-none px-0 py-3 text-base text-[#5C306C] focus:border-[#FF9966] focus:ring-0 outline-none transition-colors placeholder:text-[#5C306C]/25" 
                        />
                      </div>
                    </div>

                    {/* Email & Org row */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label 
                          htmlFor="email" 
                          className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/50 block"
                        >
                          Email
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email"
                          required 
                          className="w-full bg-[#FAF8F5]/50 border-0 border-b-2 border-[#5C306C]/10 rounded-none px-0 py-3 text-base text-[#5C306C] focus:border-[#FF9966] focus:ring-0 outline-none transition-colors placeholder:text-[#5C306C]/25" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label 
                          htmlFor="org" 
                          className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/50 block"
                        >
                          Organization <span className="font-normal normal-case tracking-normal text-[#5C306C]/35">(optional)</span>
                        </label>
                        <input 
                          type="text" 
                          id="org" 
                          name="org"
                          className="w-full bg-[#FAF8F5]/50 border-0 border-b-2 border-[#5C306C]/10 rounded-none px-0 py-3 text-base text-[#5C306C] focus:border-[#FF9966] focus:ring-0 outline-none transition-colors placeholder:text-[#5C306C]/25" 
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label 
                        htmlFor="message" 
                        className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/50 block"
                      >
                        How can we help?
                      </label>
                      <textarea 
                        id="message" 
                        name="message"
                        required 
                        rows={4} 
                        placeholder="Tell us about your organization and what you're looking for..."
                        className="w-full bg-[#FAF8F5]/50 border-0 border-b-2 border-[#5C306C]/10 rounded-none px-0 py-3 text-base text-[#5C306C] focus:border-[#FF9966] focus:ring-0 outline-none transition-colors resize-none placeholder:text-[#5C306C]/30"
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#5C306C] text-white font-medium hover:bg-[#472055] transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2"
                      >
                        <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                        {!isSubmitting && (
                          <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Send className="w-4 h-4" />
                          </motion.div>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center space-y-6"
                  >
                    <motion.div
                      className="relative w-16 h-16 rounded-full flex items-center justify-center icon-container-enhanced"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {/* Multi-layer background */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8FAE8B]/20 to-[#8FAE8B]/10" />
                      <div className="absolute inset-0 rounded-full border border-[#8FAE8B]/30" />
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "radial-gradient(circle at center, rgba(107, 155, 103, 0.2) 0%, transparent 70%)",
                          filter: "blur(8px)",
                        }}
                        animate={{
                          opacity: [0.5, 0.7, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <CheckCircle className="relative z-10 w-8 h-8 text-[#6B9B67]" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-light text-[#5C306C] mb-2">Message Sent</h3>
                      <p className="text-[#5C306C]/60">We&apos;ll be in touch soon.</p>
                    </div>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-sm text-[#FF9966] hover:underline underline-offset-4"
                    >
                      Send another message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
// END MODIFICATION
