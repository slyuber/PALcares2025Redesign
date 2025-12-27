// app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // MODIFICATION: 2024-12-16 - Logo visibility based on scroll
  // Hide header logo while hero logo is visible, fade in as you scroll past hero
  const { scrollY } = useScroll();
  // Hero section is ~100vh, start showing header logo at ~200px scroll
  const logoOpacity = useTransform(scrollY, [100, 300], [0, 1]);
  const logoScale = useTransform(scrollY, [100, 300], [0.8, 1]);
  // END MODIFICATION

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll for subtle background - using MotionValue event to avoid per-scroll setState
  // Only updates state when crossing the 50px threshold, not on every scroll tick
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (shouldBeScrolled !== scrolled) {
      setScrolled(shouldBeScrolled);
    }
  });

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    const offset = 100;
    const element = document.getElementById(id);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    } else if (pathname !== "/") {
      router.push(`/#${id}`);
    }
  };

  const navItems = [
    { id: "where-we-started", label: "Our Story" },
    { id: "storytelling", label: "How We Work" },
    { id: "context", label: "Our Approach" },
    { id: "values", label: "Values" },
    { id: "testimonials", label: "Partners" },
  ];

  const drawerItems = [
    { id: "top", label: "Top" },
    { id: "where-we-started", label: "Our Story" },
    { id: "storytelling", label: "How We Work" },
    { id: "context", label: "Our Approach" },
    { id: "values", label: "Our Values" },
    { id: "testimonials", label: "Partners" },
    { id: "contact", label: "Contact Us" },
  ];

  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="px-6 py-4 flex items-center justify-between bg-transparent">
          <div className="w-[100px]" />
          <div className="w-[30px]" />
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* MODIFICATION: 2024-12-16 - Issue 6: Header merges with background without bar effect, but blocks content */}
      <nav className={`px-6 lg:px-8 py-4 flex items-center justify-between transition-all duration-500 ${
        scrolled ? "bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5]/95 to-[#FAF8F5]/80 backdrop-blur-sm" : "bg-transparent"
      }`}>
        {/* Logo - using PALcares_logo_light.svg */}
        {/* MODIFICATION: 2024-12-16 - Logo fades in as you scroll past hero */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            style={{ 
              opacity: pathname === "/" ? logoOpacity : 1,
              scale: pathname === "/" ? logoScale : 1
            }}
          >
            <Image
              src="/svg/PALcares_logo_light.svg"
              alt="PALcares logo"
              width={140}
              height={38}
              className="h-8 w-auto lg:h-10"
              priority
            />
          </motion.div>
        </Link>
        {/* END MODIFICATION */}

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-medium text-[#4A2756]/70 hover:text-[#4A2756] transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNavClick("contact")}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#4A2756] hover:bg-[#3A1F46] rounded-full transition-colors duration-200"
          >
            Get in Touch
          </button>
        </div>

        {/* Mobile Hamburger - hidden on desktop */}
        <button
          className="lg:hidden p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A2756] rounded"
          onClick={handleMenuToggle}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className={`menu-icon header__trigger js-header__trigger ${
              menuOpen ? "active" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 42 30"
            style={{ width: "30px", height: "auto" }}
          >
            <path className="bar top" d="M3,6A3,3,0,0,1,3,0H18a3,3,0,0,1,0,6Z" />
            <path
              className="bar middle"
              d="M3,18a3,3,0,0,1,0-6H39a3,3,0,0,1,0,6Z"
            />
            <path
              className="bar bottom"
              d="M24,30a3,3,0,0,1,0-6H39a3,3,0,0,1,0,6Z"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-[99997] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="drawer lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <nav className="drawer__menu px-10">
                {drawerItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className="drawer__link text-left w-full"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
