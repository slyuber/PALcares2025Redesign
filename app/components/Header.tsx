// app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useLenis } from "lenis/react";

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
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastToggleRef = useRef<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  
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
    // Logo appears earlier for polished crossfade overlap with hero logo
    const shouldShowLogo = latest > 150;
    if (shouldShowLogo !== showHeaderLogo) {
      setShowHeaderLogo(shouldShowLogo);
    }
  });

  // Prevent scroll when menu is open - use Lenis stop/start for proper integration
  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [menuOpen, lenis]);

  // Escape key closes mobile menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseMenu('escape');
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Track close source for focus management
  const closeSourceRef = useRef<'x-button' | 'escape' | 'nav-item' | null>(null);

  // Focus management: focus close button on open, return to hamburger only on X/Escape
  useEffect(() => {
    if (menuOpen) {
      // Delay to allow animation to start
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      // Only return focus to hamburger if closed via X button or Escape
      if (closeSourceRef.current === 'x-button' || closeSourceRef.current === 'escape') {
        hamburgerRef.current?.focus();
      }
      closeSourceRef.current = null;
    }
  }, [menuOpen]);

  // Debounced menu toggle to prevent double-tap issues (150ms cooldown - snappier)
  const handleMenuToggle = () => {
    const now = Date.now();
    if (now - lastToggleRef.current < 150) return; // Reduced debounce
    lastToggleRef.current = now;
    setMenuOpen((prev) => !prev);
  };

  // Close menu with proper state cleanup
  const handleCloseMenu = (source: 'x-button' | 'escape' | 'nav-item') => {
    closeSourceRef.current = source;
    setMenuOpen(false);
    setOpenSubmenu(null);
    setExpandedItems(new Set()); // Reset submenu expansion state
  };

  const handleNavClick = (id: string, scrollOffset?: number) => {
    const wasMenuOpen = menuOpen;

    // Close immediately - no artificial delay
    if (wasMenuOpen) {
      handleCloseMenu('nav-item');
    }

    // Find target element - handle mobile storytelling section
    let element = document.getElementById(id);

    // If targeting storytelling and desktop version is hidden, use mobile version
    if (id === "storytelling" && element && element.offsetHeight === 0) {
      const mobileTarget = document.getElementById("storytelling-mobile");
      if (mobileTarget && mobileTarget.offsetHeight > 0) {
        element = mobileTarget;
        scrollOffset = undefined; // Mobile layout is linear, no panel offsets
      }
    }

    if (element) {
      // Calculate offset for submenu items (scroll within storytelling section)
      const additionalOffset = scrollOffset !== undefined && id === "storytelling"
        ? scrollOffset * element.offsetHeight
        : 0;

      // Brief delay to allow Lenis to restart after menu close
      const scrollDelay = wasMenuOpen ? 50 : 0;
      setTimeout(() => {
        // Use Lenis for smooth scrolling, with native fallback for slow devices
        if (lenis) {
          lenis.scrollTo(element, {
            offset: additionalOffset - 100, // -100 for header clearance
            duration: 1.2,
          });
        } else {
          // Fallback: native smooth scroll if Lenis not ready
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, scrollDelay);
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
        {/* Logo - polished crossfade with hero logo */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            initial={false}
            animate={{
              opacity: pathname === "/" ? (showHeaderLogo ? 1 : 0) : 1,
              scale: pathname === "/" ? (showHeaderLogo ? 1 : 0.9) : 1
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Desktop Navigation - Award-winning minimal design */}
        <div className="hidden lg:flex items-center gap-1">
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
              <motion.button
                type="button"
                onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : handleNavClick(item.id)}
                onMouseEnter={() => item.hasSubmenu && setOpenSubmenu(item.id)}
                className="relative px-4 py-2.5 text-[13px] font-medium text-[#5C306C]/60 hover:text-[#5C306C] transition-colors duration-300 flex items-center gap-1.5 rounded-full group"
                whileHover={{ backgroundColor: "rgba(92, 48, 108, 0.04)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                aria-haspopup={item.hasSubmenu ? "true" : undefined}
                aria-expanded={item.hasSubmenu ? openSubmenu === item.id : undefined}
              >
                <span className="relative">
                  {item.label}
                  {/* Organic underline that grows from center */}
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-[#FF9966] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full" />
                </span>
                {item.hasSubmenu && (
                  <motion.span
                    animate={{ rotate: openSubmenu === item.id ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 opacity-40 group-hover:opacity-70 transition-opacity" />
                  </motion.span>
                )}
              </motion.button>

              {/* Dropdown - soft, tactile feel */}
              {item.hasSubmenu && (
                <AnimatePresence>
                  {openSubmenu === item.id && (
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/95 backdrop-blur-md shadow-lg shadow-[#5C306C]/8 border border-[#5C306C]/5 rounded-2xl py-2 z-50 overflow-hidden"
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      onMouseLeave={() => setOpenSubmenu(null)}
                      role="menu"
                    >
                      {item.submenu?.map((subItem, i) => (
                        <motion.button
                          key={subItem.label}
                          type="button"
                          onClick={() => handleNavClick(subItem.id, subItem.scrollOffset)}
                          className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#5C306C]/70 hover:text-[#5C306C] hover:bg-[#5C306C]/[0.03] transition-all duration-200 flex items-center gap-3 group/item"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                          whileHover={{ x: 2 }}
                          role="menuitem"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#FF9966]/40 group-hover/item:bg-[#FF9966] group-hover/item:scale-125 transition-all duration-200" />
                          {subItem.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}

          {/* CTA - tactile, warm feel */}
          <motion.button
            type="button"
            onClick={() => handleNavClick("contact")}
            className="ml-3 px-5 py-2.5 text-[13px] font-medium text-white bg-gradient-to-b from-[#5C306C] to-[#4A2756] rounded-full shadow-sm shadow-[#5C306C]/20 hover:shadow-md hover:shadow-[#5C306C]/25 transition-shadow duration-300"
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Get in Touch
          </motion.button>
        </div>

        {/* Mobile Hamburger - hidden on desktop */}
        <button
          ref={hamburgerRef}
          className="lg:hidden p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A2756] rounded"
          onClick={handleMenuToggle}
          aria-expanded={menuOpen}
          aria-label="Open menu"
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

      {/* Mobile Menu - Full Screen Takeover (no backdrop close - intentional UX choice) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#FAF8F5] z-[99998] lg:hidden flex flex-col"
            data-mobile-menu
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#5C306C]/10">
                <Link href="/" onClick={() => handleCloseMenu('nav-item')}>
                  <Image
                    src="/svg/PALcares_logo_light.svg"
                    alt="PALcares logo"
                    width={120}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => handleCloseMenu('x-button')}
                  className="p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] rounded"
                  aria-label="Close menu"
                >
                  {/* Clear X icon for unambiguous close affordance */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-[#5C306C]"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Menu Content - Scrollable */}
              <nav className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-1">
                  {drawerItems.map((item, index) => {
                    const hasSubmenu = "hasSubmenu" in item && item.hasSubmenu;
                    const isExpanded = expandedItems.has(item.id);
                    const itemKey = `drawer-${item.id}-${index}`;

                    return (
                      <div key={itemKey}>
                        {/* Nav item button - clean implementation without conflicting animations */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hasSubmenu) {
                              toggleDrawerSubmenu(item.id);
                            } else {
                              handleNavClick(item.id);
                            }
                          }}
                          className="w-full text-left px-4 py-4 text-lg font-medium text-[#5C306C] hover:bg-[#5C306C]/5 active:bg-[#5C306C]/10 rounded-lg transition-colors duration-150 flex items-center justify-between min-h-[56px]"
                          aria-expanded={hasSubmenu ? isExpanded : undefined}
                          aria-controls={hasSubmenu ? `submenu-${item.id}` : undefined}
                        >
                          <span>{item.label}</span>
                          {hasSubmenu && (
                            <span
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            >
                              <ChevronDown className="w-5 h-5 text-[#5C306C]/60" />
                            </span>
                          )}
                        </button>

                        {/* Expandable Submenu - only render when expanded */}
                        {hasSubmenu && "submenu" in item && item.submenu && isExpanded && (
                          <div
                            id={`submenu-${item.id}`}
                            className="overflow-hidden pl-4 pr-4 pt-2 pb-2 space-y-1"
                          >
                            {item.submenu.map((subItem, subIndex) => (
                              <button
                                key={`${itemKey}-sub-${subIndex}`}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNavClick(subItem.id, subItem.scrollOffset);
                                }}
                                className="w-full text-left px-4 py-3 text-base text-[#5C306C]/80 hover:bg-[#5C306C]/5 active:bg-[#5C306C]/10 rounded-lg transition-colors duration-150 min-h-[48px]"
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
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
                  <motion.button
                    type="button"
                    onClick={() => handleNavClick("contact")}
                    className="w-full px-6 py-4 text-base font-medium text-white bg-[#5C306C] hover:bg-[#4A2756] active:bg-[#3D1F45] rounded-lg transition-colors duration-200"
                    whileTap={{ scale: 0.98 }}
                  >
                    Get in Touch
                  </motion.button>
                </motion.div>
              </nav>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
