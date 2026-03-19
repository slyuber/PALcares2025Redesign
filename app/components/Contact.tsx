// app/components/Contact.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import BackgroundPatterns from "./partials/BackgroundPatterns";
import { EASE_PREMIUM, EASE_SMOOTH, SPRING_SNAPPY, DURATION_MEDIUM, DURATION_SLOW, useSafeInView } from "../lib/animation-constants";
import { contact, global as siteGlobal } from "content-collections";
import { renderRichText } from "../lib/rich-text";

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
        return value.trim() ? '' : contact.form.validation.firstNameRequired;
      case 'lastName':
        return value.trim() ? '' : contact.form.validation.lastNameRequired;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : contact.form.validation.emailRequired;
      case 'message':
        return value.trim().length >= 10 ? '' : contact.form.validation.messageMinLength;
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
    const base = "w-full bg-[#FAF8F5]/50 border-0 border-b-2 rounded-none px-0 py-3 text-base text-[#5C306C] hover:border-[#5C306C]/20 focus-visible:ring-2 focus-visible:ring-offset-2 outline-none transition-colors placeholder:text-[#5C306C]/60";
    if (touched[field] && errors[field]) {
      return `${base} border-[#E07B4C] focus-visible:border-[#E07B4C] focus-visible:ring-[#E07B4C]`;
    }
    if (touched[field] && !errors[field] && formData[field as keyof typeof formData]) {
      return `${base} border-[#8FAE8B] focus-visible:border-[#8FAE8B] focus-visible:ring-[#8FAE8B]`;
    }
    return `${base} border-[#5C306C]/10 focus-visible:border-[#FF9966] focus-visible:ring-[#FF9966]`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '5ef71b93-d323-49ac-a070-060f2d8c56b7',
          subject: 'New Contact Form Submission — PALcares',
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          organization: formData.org,
          message: formData.message,
          replyto: formData.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setFormData({ firstName: '', lastName: '', email: '', org: '', message: '' });
        setErrors({});
        setTouched({});
      } else {
        setErrors(prev => ({ ...prev, submit: data.message || contact.form.validation.submitError }));
      }
    } catch {
      setErrors(prev => ({ ...prev, submit: contact.form.validation.networkError }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-12 md:py-16 lg:py-24 relative overflow-hidden"
      aria-label="Contact us"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F5] via-transparent to-[#F5F0EB]/50" />
        <BackgroundPatterns variant="connection" opacity={0.5} />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* LEFT COLUMN */}
          <motion.div
            ref={leftRef}
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
            animate={leftInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_SLOW, ease: EASE_SMOOTH }}
          >
            <div className="space-y-4">
              <motion.span
                className="text-xs font-semibold uppercase tracking-[0.2em] block"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10, color: "#5C306C" }}
                animate={leftInView ? { opacity: 1, y: 0, color: "#FF9966" } : undefined}
                transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, ease: EASE_PREMIUM }}
              >
                {contact.sectionLabel}
              </motion.span>
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-light text-[#5C306C] leading-tight tracking-tight"
                initial={{ opacity: 0, y: 16 }}
                animate={leftInView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : 0.1, ease: EASE_PREMIUM }}
              >
                {contact.heading}
              </motion.h2>
            </div>

            <motion.p
              className="text-base text-[#5C306C]/80 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={leftInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: prefersReducedMotion ? 0 : DURATION_MEDIUM, delay: prefersReducedMotion ? 0 : 0.2, ease: EASE_PREMIUM }}
            >
              {renderRichText(contact.description)}
            </motion.p>

            <div className="w-16 h-px bg-gradient-to-r from-[#FF9966]/50 to-transparent" />

            <div className="space-y-4">
              <a
                href={`mailto:${siteGlobal.supportEmail}`}
                className="group flex items-center gap-3 text-[#5C306C] hover:text-[#FF9966] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
              >
                <span className="text-base font-medium group-hover:underline underline-offset-4 decoration-[#FF9966]/50">
                  {siteGlobal.supportEmail}
                </span>
              </a>

              <div className="text-sm text-[#5C306C]/75">
                <p>{contact.location}</p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Form */}
          <motion.div
            ref={rightRef}
            className="lg:col-span-3"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 30 }}
            animate={rightInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: prefersReducedMotion ? 0 : DURATION_SLOW, delay: prefersReducedMotion ? 0 : 0.15, ease: EASE_SMOOTH }}
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#5C306C]/6 p-8 md:p-10 shadow-[0_8px_32px_rgba(92,48,108,0.04)] transform-gpu">
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
                    {/* Honeypot spam protection */}
                    <input type="text" name="_gotcha" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                    {/* Name row */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/80 block">
                          {contact.form.fields.firstName.label}
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
                          <p className="text-xs text-[#E07B4C] mt-1">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/80 block">
                          {contact.form.fields.lastName.label}
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
                          <p className="text-xs text-[#E07B4C] mt-1">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email & Org row */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/80 block">
                          {contact.form.fields.email.label}
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
                          <p className="text-xs text-[#E07B4C] mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="org" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/80 block">
                          {contact.form.fields.org.label} <span className="font-normal normal-case tracking-normal text-[#5C306C]/80">{contact.form.fields.org.optionalNote}</span>
                        </label>
                        <input
                          type="text"
                          id="org"
                          name="org"
                          value={formData.org}
                          onChange={handleChange}
                          className="w-full bg-[#FAF8F5]/50 border-0 border-b-2 border-[#5C306C]/10 rounded-none px-0 py-3 text-base text-[#5C306C] hover:border-[#5C306C]/20 focus-visible:border-[#FF9966] focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 outline-none transition-colors placeholder:text-[#5C306C]/60"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-[#5C306C]/80 block">
                        {contact.form.fields.message.label}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        rows={4}
                        placeholder={contact.form.fields.message.placeholder}
                        className={`${getInputClasses('message')} resize-none`}
                      />
                      {touched.message && errors.message && (
                        <p className="text-xs text-[#E07B4C] mt-1">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={prefersReducedMotion || isSubmitting ? {} : { scale: 1.03, boxShadow: "0 8px 24px rgba(92, 48, 108, 0.2)" }}
                        whileTap={prefersReducedMotion || isSubmitting ? {} : { scale: 0.97 }}
                        transition={SPRING_SNAPPY}
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#5C306C] text-white font-medium hover:bg-[#4A2756] transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{contact.form.submittingLabel}</span>
                          </>
                        ) : (
                          <>
                            <span>{contact.form.submitLabel}</span>
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </motion.button>
                      {errors.submit && (
                        <p className="text-sm text-[#E07B4C] mt-3">{errors.submit}</p>
                      )}
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
                      <CheckCircle className="relative z-10 w-8 h-8 text-[#8FAE8B]" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-light text-[#5C306C] mb-2">{contact.success.heading}</h3>
                      <p className="text-[#5C306C]/75">{contact.success.body}</p>
                    </div>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-sm text-[#FF9966] hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2 rounded"
                    >
                      {contact.success.resetLabel}
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
