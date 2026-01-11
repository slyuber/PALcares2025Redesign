// app/components/Footer.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement actual newsletter subscription API call
      // await subscribeToNewsletter(email);
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const links = [
    { name: "What We Do", href: "#storytelling" },
    { name: "Our Values", href: "#values" },
    { name: "Partner Stories", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-[#FAF8F5] pt-16 pb-8 relative">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5C306C]/15 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[1.2fr_1fr_1fr] gap-12 md:gap-10 mb-14">

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
              Building sustainable data infrastructure for Alberta&apos;s social services.
            </p>
            <div className="space-y-1.5 text-xs text-[#5C306C]/60">
              <p>Serving Calgary, Edmonton & surrounding areas</p>
              <p>Open tools · Shared resources · Sector capacity</p>
            </div>
            <p className="text-sm text-[#5C306C] font-medium pt-1">
              Genuine partnerships, not transactions.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5C306C]/80">
              Quick Links
            </span>
            <nav className="flex flex-col gap-2.5">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-[#5C306C]/55 hover:text-[#5C306C] transition-colors duration-200 w-fit"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Newsletter & Social */}
          <div className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5C306C]/80">
              Stay Updated
            </span>

            {isSubscribed ? (
              <p className="text-sm font-medium text-[#8FAE8B]">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 min-w-0 bg-white border border-[#5C306C]/10 rounded-md px-3 py-2 text-sm text-[#5C306C] focus:border-[#5C306C]/30 focus:ring-1 focus:ring-[#5C306C]/20 outline-none transition-all placeholder:text-[#5C306C]/30"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#5C306C] text-white text-sm font-medium hover:bg-[#472055] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C306C]"
                >
                  Subscribe
                </button>
              </form>
            )}

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#5C306C]/5 flex items-center justify-center text-[#5C306C]/50 hover:bg-[#5C306C]/10 hover:text-[#5C306C]/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C]"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#5C306C]/6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#5C306C]/40">
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