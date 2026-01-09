// app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  hasSubmenu?: boolean;
  submenu?: Array<{ id: string; label: string; scrollOffset: number }>;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const router = useRouter();
  const pathname = usePathname();
  
  // Logo visibility based on scroll - instant threshold for clean transition
  const { scrollY } = useScroll();
  const [showHeaderLogo, setShowHeaderLogo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll for subtle background AND logo visibility
  // Using threshold check avoids the "double logo" cross-fade issue
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (shouldBeScrolled !== scrolled) {
      setScrolled(shouldBeScrolled);
    }
    // Logo appears at scroll threshold - instant, not gradual
    const shouldShowLogo = latest > 200;
    if (shouldShowLogo !== showHeaderLogo) {
      setShowHeaderLogo(shouldShowLogo);
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

  const handleNavClick = (id: string, scrollOffset?: number) => {
    setMenuOpen(false);
    setOpenSubmenu(null);
    const offset = 100;
    const element = document.getElementById(id);
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY - offset;
      
      // If scrollOffset is provided (for submenu items), calculate position within section
      if (scrollOffset !== undefined && id === "storytelling") {
        const sectionHeight = element.offsetHeight;
        const targetPosition = elementPosition + (scrollOffset * sectionHeight);
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      } else {
        window.scrollTo({ top: elementPosition, behavior: "smooth" });
      }
    } else if (pathname !== "/") {
      router.push(`/#${id}`);
    }
  };

  // Click outside detection for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownElement = dropdownRefs.current.get(openSubmenu || "");
      if (dropdownElement && !dropdownElement.contains(target)) {
        setOpenSubmenu(null);
      }
    };

    if (openSubmenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openSubmenu]);

  // Keyboard navigation for dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (openSubmenu === "storytelling") {
        if (event.key === "Escape") {
          setOpenSubmenu(null);
        }
      }
    };

    if (openSubmenu) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [openSubmenu]);

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  const toggleDrawerSubmenu = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const navItems: NavItem[] = [
    { id: "where-we-started", label: "Our Story" },
    { 
      id: "storytelling", 
      label: "How We Work",
      hasSubmenu: true,
      submenu: [
        { id: "storytelling", label: "Teams", scrollOffset: 0.2 },
        { id: "storytelling", label: "Research", scrollOffset: 0.4 },
        { id: "storytelling", label: "Labs", scrollOffset: 0.6 },
      ]
    },
    { id: "context", label: "Our Approach" },
    { id: "values", label: "Values" },
    { id: "testimonials", label: "Partners" },
  ];

  const drawerItems: Array<NavItem | { id: string; label: string }> = [
    { id: "top", label: "Top" },
    { id: "where-we-started", label: "Our Story" },
    { 
      id: "storytelling", 
      label: "How We Work",
      hasSubmenu: true,
      submenu: [
        { id: "storytelling", label: "Teams", scrollOffset: 0.2 },
        { id: "storytelling", label: "Research", scrollOffset: 0.4 },
        { id: "storytelling", label: "Labs", scrollOffset: 0.6 },
      ]
    },
    { id: "context", label: "Our Approach" },
    { id: "values", label: "Values" },
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
        {/* Logo - instant appear at scroll threshold for clean transition */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            initial={false}
            animate={{
              opacity: pathname === "/" ? (showHeaderLogo ? 1 : 0) : 1,
              scale: pathname === "/" ? (showHeaderLogo ? 1 : 0.95) : 1
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
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

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <div 
              key={item.id} 
              className="relative" 
              ref={(el) => {
                if (el && item.hasSubmenu) {
                  dropdownRefs.current.set(item.id, el);
                } else if (!item.hasSubmenu) {
                  dropdownRefs.current.delete(item.id);
                }
              }}
            >
              <button
                type="button"
                onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : handleNavClick(item.id)}
                onMouseEnter={() => item.hasSubmenu && setOpenSubmenu(item.id)}
                className="nav-link-underline text-sm font-medium text-[#4A2756]/70 hover:text-[#4A2756] transition-colors duration-200 flex items-center gap-1"
                aria-haspopup={item.hasSubmenu ? "true" : undefined}
                aria-expanded={item.hasSubmenu ? openSubmenu === item.id : undefined}
              >
                {item.label}
                {item.hasSubmenu && (
                  <ChevronDown 
                    className={`w-3 h-3 transition-transform duration-200 ${
                      openSubmenu === item.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              
              {/* Dropdown Submenu - Improved styling */}
              {item.hasSubmenu && (
                <AnimatePresence>
                  {openSubmenu === item.id && (
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white shadow-xl shadow-[#5C306C]/15 border border-[#5C306C]/10 rounded-xl py-2 z-50"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      onMouseLeave={() => setOpenSubmenu(null)}
                      role="menu"
                    >
                      {item.submenu?.map((subItem) => (
                        <button
                          key={subItem.label}
                          type="button"
                          onClick={() => handleNavClick(subItem.id, subItem.scrollOffset)}
                          className="w-full text-left px-5 py-3 text-sm font-medium text-[#5C306C] hover:bg-[#5C306C]/5 hover:text-[#5C306C] transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                          role="menuitem"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
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

      {/* Mobile Menu - Full Screen Overlay (Award-Winning Pattern) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop overlay - darker for better focus */}
            <motion.div
              className="fixed inset-0 bg-[#5C306C]/40 backdrop-blur-sm z-[99997] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Full-screen menu overlay - smooth tween instead of bouncy spring */}
            <motion.div
              className="fixed inset-0 bg-[#FAF8F5] z-[99998] lg:hidden flex flex-col"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#5C306C]/10">
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Image
                    src="/svg/PALcares_logo_light.svg"
                    alt="PALcares logo"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] rounded"
                  aria-label="Close menu"
                >
                  <svg
                    className="menu-icon active"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 42 30"
                    style={{ width: "24px", height: "auto" }}
                  >
                    <path className="bar top" d="M3,6A3,3,0,0,1,3,0H18a3,3,0,0,1,0,6Z" />
                    <path className="bar middle" d="M3,18a3,3,0,0,1,0-6H39a3,3,0,0,1,0,6Z" />
                    <path className="bar bottom" d="M24,30a3,3,0,0,1,0-6H39a3,3,0,0,1,0,6Z" />
                  </svg>
                </button>
              </div>

              {/* Menu Content - Scrollable */}
              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-1">
                  {drawerItems.map((item, index) => {
                    const hasSubmenu = "hasSubmenu" in item && item.hasSubmenu;
                    const isExpanded = expandedItems.has(item.id);
                    
                    return (
                      <div key={item.id}>
                        <motion.button
                          type="button"
                          onClick={() => hasSubmenu ? toggleDrawerSubmenu(item.id) : handleNavClick(item.id)}
                          className="w-full text-left px-4 py-4 text-lg font-medium text-[#5C306C] hover:bg-[#5C306C]/5 rounded-lg transition-colors duration-200 flex items-center justify-between min-h-[56px]"
                          aria-expanded={hasSubmenu ? isExpanded : undefined}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <span>{item.label}</span>
                          {hasSubmenu && (
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-5 h-5 text-[#5C306C]/60" />
                            </motion.div>
                          )}
                        </motion.button>
                        
                        {/* Expandable Submenu */}
                        {hasSubmenu && "submenu" in item && item.submenu && (
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pr-4 pt-2 pb-2 space-y-1">
                                  {item.submenu.map((subItem) => (
                                    <motion.button
                                      key={subItem.label}
                                      type="button"
                                      onClick={() => handleNavClick(subItem.id, subItem.scrollOffset)}
                                      className="w-full text-left px-4 py-3 text-base text-[#5C306C]/80 hover:bg-[#5C306C]/5 rounded-lg transition-colors duration-200 min-h-[48px]"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {subItem.label}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button at bottom */}
                <motion.div
                  className="mt-8 pt-6 border-t border-[#5C306C]/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: drawerItems.length * 0.05 + 0.1, duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => handleNavClick("contact")}
                    className="w-full px-6 py-4 text-base font-medium text-white bg-[#5C306C] hover:bg-[#4A2756] rounded-lg transition-colors duration-200"
                  >
                    Get in Touch
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
