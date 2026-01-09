// app/components/Footer.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Linkedin, Twitter, Facebook } from "lucide-react";

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
    <footer className="bg-[#F8F8F8] pt-16 pb-8 relative">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5C306C]/10 to-transparent" />
      
      <div className="max-w-[1152px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-[5fr_3fr_4fr] gap-12 md:gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] rounded">
              <Image
                src="/svg/PALcares_logo_light.svg"
                alt="PALcares"
                width={140}
                height={38}
                className="w-[130px] h-auto"
              />
            </Link>
            <p className="text-[#5C306C]/80 font-light leading-relaxed max-w-sm">
              Building sustainable data infrastructure for Alberta&apos;s social services.
            </p>
            <p className="text-xs text-[#5C306C]/55 leading-relaxed max-w-xs">
              <strong>Serving:</strong> Calgary, Edmonton, and surrounding communities.
            </p>
            <p className="text-xs text-[#5C306C]/55 leading-relaxed max-w-xs">
              <strong>Creating:</strong> Open tools, shared resources, sector-wide capacity.
            </p>
            <p className="text-sm text-[#5C306C]/70 font-medium leading-relaxed max-w-xs mt-2">
              Genuine partnerships, not transactions.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5C306C]">
              Quick Links
            </span>
            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm text-[#5C306C]/60 hover:text-[#5C306C] transition-colors flex items-center gap-2 group w-fit"
                >
                  {link.name}
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Newsletter & Social */}
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5C306C]">
              Stay Updated
            </span>
            
            {isSubscribed ? (
              <p className="text-sm font-medium text-[#FF9966]">
                Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="flex-1 bg-white border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm text-[#5C306C] focus:border-[#FF9966] focus:ring-1 focus:ring-[#FF9966] outline-none transition-all placeholder:text-[#5C306C]/30"
                />
                <button 
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-br from-[#5C306C] to-[#472055] text-white text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#5C306C]"
                >
                  Subscribe
                </button>
              </form>
            )}
            
            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#5C306C]/5 flex items-center justify-center text-[#5C306C]/55 hover:bg-[#5C306C]/10 hover:scale-110 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C]"
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
        <div className="pt-6 border-t border-[#5C306C]/8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5C306C]/45">
          <p>© {new Date().getFullYear()} PALcares (Perseverance Analytics Ltd.)</p>
          <div className="flex gap-6">
            <Link 
              href="/privacy-policy" 
              className="hover:text-[#5C306C] transition-colors focus:outline-none focus-visible:underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-use" 
              className="hover:text-[#5C306C] transition-colors focus:outline-none focus-visible:underline"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}