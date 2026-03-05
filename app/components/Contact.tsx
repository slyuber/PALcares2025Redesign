// app/components/Contact.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";
import { SPRING_SNAPPY, useSafeInView } from "../lib/animation-constants";

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const leftRef = useRef<HTMLDivElement>(null);
  const leftInView = useSafeInView(leftRef, { once: true, amount: 0.15, margin: "100px 0px" });
  const rightRef = useRef<HTMLDivElement>(null);
  const rightInView = useSafeInView(rightRef, { once: true, amount: 0.15, margin: "100px 0px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', org: '', message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() ? '' : `${name === 'firstName' ? 'First' : 'Last'} name is required`;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Valid email required';
      case 'message':
        return value.trim().length >= 10 ? '' : 'Message must be at least 10 characters';
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name] && errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const getInputClasses = (field: string) => {
    const base = "w-full bg-[#FAF8F5]/50 border-0 border-b-2 rounded-none px-0 py-3 text-base text-[#5C306C] hover:border-[#5C306C]/20 focus-visible:ring-2 focus-visible:ring-offset-2 outline-none transition-colors placeholder:text-[#5C306C]/50";
    if (touched[field] && errors[field]) {
      return `${base} border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500`;
    }
    if (touched[field] && !errors[field] && formData[field as keyof typeof formData]) {
      return `${base} border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500`;
    }
    return `${base} border-[#5C306C]/10 focus-visible:border-[#FF9966] focus-visible:ring-[#FF9966]`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'org') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', org: '', message: '' });
      setErrors({});
      setTouched({});
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
      aria-label="Contact us"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-transparent to-[#F5F0EB]/50" />
        <div className="absolute -top-32 -right-32 w-[40vw] h-[40vw] bg-[radial-gradient(circle,_rgba(255,153,102,0.04)_0%,_rgba(255,153,102,0.015)_40%,_transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[35vw] h-[35vw] bg-[radial-gradient(circle,_rgba(143,174,139,0.05)_0%,_rgba(143,174,139,0.02)_40%,_transparent_70%)] pointer-events-none" />
        <BackgroundPatterns variant="connection" opacity={0.5} />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* LEFT COLUMN */}
          <motion.div
            ref={leftRef}
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={leftInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          >
            <div className="space-y-4">
              <motion.span
                className="text-xs font-semibold uppercase tracking-[0.2em] block"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, color: "#5C306C" }}
                animate={leftInView ? { opacity: 1, y: 0, color: "#FF9966" } : undefined}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              >
                Let&apos;s Connect
              </motion.span>
              <motion.h2
                className="text-3xl md:text-4xl font-light text-[#5C306C] leading-tight tracking-tight"
                initial={{ opacity: 0, y: 15 }}
                animate={leftInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.1 }}
              >
                We engage with organizations in different ways
              </motion.h2>
            </div>

            <motion.p
              className="text-base text-[#5C306C]/70 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={leftInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.2 }}
            >
              Educational workshops on data, infrastructure, or ethical technology. Placements and PAL-Labs information. Connections between organizations facing similar challenges. Embedded teams, shared resources or tools that might help. Technical support for a specific problem. Or just a conversation about what you&apos;re building.
            </motion.p>

            <div className="w-16 h-px bg-gradient-to-r from-[#FF9966]/50 to-transparent" />

            <div className="space-y-4">
              <a
                href="mailto:support@palcares.ca"
                className="group flex items-center gap-3 text-[#5C306C] hover:text-[#FF9966] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
              >
                <span className="text-base font-medium group-hover:underline underline-offset-4 decoration-[#FF9966]/50">
                  support@palcares.ca
                </span>
              </a>

              <div className="text-sm text-[#5C306C]/60">
                <p className="font-medium text-[#5C306C]/80">Treaty 6 &amp; Treaty 7 Territories</p>
                <p>Calgary &amp; Edmonton, Alberta</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Form */}
          <motion.div
            ref={rightRef}
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={rightInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.15 }}
          >
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
                        <label htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/60 block">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputClasses('firstName')}
                        />
                        {touched.firstName && errors.firstName && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/60 block">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputClasses('lastName')}
                        />
                        {touched.lastName && errors.lastName && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email & Org row */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/60 block">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                          className={getInputClasses('email')}
                        />
                        {touched.email && errors.email && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="org" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/60 block">
                          Organization <span className="font-normal normal-case tracking-normal text-[#5C306C]/50">(optional)</span>
                        </label>
                        <input
                          type="text"
                          id="org"
                          name="org"
                          value={formData.org}
                          onChange={handleChange}
                          className="w-full bg-[#FAF8F5]/50 border-0 border-b-2 border-[#5C306C]/10 rounded-none px-0 py-3 text-base text-[#5C306C] hover:border-[#5C306C]/20 focus-visible:border-[#FF9966] focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 outline-none transition-colors placeholder:text-[#5C306C]/50"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/60 block">
                        How can we help?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        rows={4}
                        placeholder="Tell us about your organization and what you're looking for..."
                        className={`${getInputClasses('message')} resize-none`}
                      />
                      {touched.message && errors.message && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#5C306C] text-white font-medium hover:bg-[#472055] transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <motion.div
                              whileHover={{ x: 2 }}
                              transition={SPRING_SNAPPY}
                            >
                              <Send className="w-4 h-4" />
                            </motion.div>
                          </>
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
                      className="relative w-16 h-16 rounded-full flex items-center justify-center"
                      initial={{ scale: prefersReducedMotion ? 1 : 0.8 }}
                      animate={{ scale: 1 }}
                      transition={prefersReducedMotion ? { duration: 0 } : SPRING_SNAPPY}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8FAE8B]/20 to-[#8FAE8B]/10" />
                      <div className="absolute inset-0 rounded-full border border-[#8FAE8B]/30" />
                      <CheckCircle className="relative z-10 w-8 h-8 text-[#6B9B67]" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-light text-[#5C306C] mb-2">Message Sent</h3>
                      <p className="text-[#5C306C]/60">We&apos;ll be in touch soon.</p>
                    </div>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-sm text-[#FF9966] hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
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
