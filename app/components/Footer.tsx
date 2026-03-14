// app/components/Footer.tsx
"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EASE_OUT_CUBIC, DURATION_SLOW, useSafeInView } from "../lib/animation-constants";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useSafeInView(gridRef, { once: true, amount: 0.1, margin: "100px 0px" });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '80c1f5f5-77f7-4e7d-b033-b61ec7633706',
          subject: 'New Newsletter Subscription — PALcares',
          email,
          replyto: email,
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        setTimeout(() => {
          setIsSubscribed(false);
          setEmail("");
        }, 3000);
      }
    } catch {
      // Silent fail — newsletter is low-stakes
    }
  };

  const links = [
    { name: "What We Do", href: "#storytelling" },
    { name: "Our Values", href: "#values" },
    { name: "Partner Stories", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];


  return (
    <footer className="bg-[#FAF8F5] pt-16 pb-8 relative">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5C306C]/15 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          ref={gridRef}
          className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-12 md:gap-10 mb-14"
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : DURATION_SLOW, ease: EASE_OUT_CUBIC }}
        >

          {/* Column 1: Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] rounded">
              <Image
                src="/svg/PALcares_logo_light.svg"
                alt="PALcares"
                width={130}
                height={36}
                className="w-[120px] h-auto"
              />
            </Link>
            <p className="text-[#5C306C]/85 text-sm leading-relaxed max-w-[280px]">
              Embedded technology partnerships for Alberta&apos;s social services.
            </p>
            <div className="space-y-1.5 text-xs text-[#5C306C]/60">
              <p>Serving Calgary, Edmonton &amp; Rural Alberta</p>
              <p>Open tools · Shared resources · Local expertise</p>
            </div>
            <p className="text-sm text-[#5C306C] font-medium pt-1">
              Genuine partnerships, not transactions.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5C306C]/80">
              Quick Links
            </span>
            <nav aria-label="Footer navigation" className="flex flex-col gap-2.5">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-[#5C306C]/60 hover:text-[#5C306C] transition-colors duration-200 w-fit focus:outline-none focus-visible:underline focus-visible:text-[#5C306C]"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Newsletter & Social */}
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5C306C]/80">
              Stay Updated
            </span>

            {isSubscribed ? (
              <p className="text-sm font-medium text-[#8FAE8B]">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input type="text" name="_gotcha" className="hidden" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 min-w-0 bg-white border border-[#5C306C]/10 rounded-full px-4 py-2.5 text-sm text-[#5C306C] focus-visible:border-[#5C306C]/30 focus-visible:ring-1 focus-visible:ring-[#5C306C]/20 outline-none transition-colors placeholder:text-[#5C306C]/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-full bg-[#5C306C] text-white text-sm font-medium hover:bg-[#4A2756] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C306C]"
                >
                  Subscribe
                </button>
              </form>
            )}

          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#5C306C]/6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#5C306C]/75">
          <p>© {new Date().getFullYear()} PALcares (Perseverance Analytics Ltd.)</p>
          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="hover:text-[#5C306C]/70 transition-colors focus:outline-none focus-visible:underline"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-use"
              className="hover:text-[#5C306C]/70 transition-colors focus:outline-none focus-visible:underline"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}