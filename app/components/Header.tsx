// app/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useLenis } from "lenis/react";
import { EASE_SNAPPY, EASE_OUT_EXPO, SPRING_SNAPPY, SCROLL_DURATION_NAV, SCROLL_HEADER_OFFSET, DURATION_FAST_MOBILE, DURATION_FAST, DURATION_INSTANT, DURATION_NORMAL_MOBILE, STAGGER_NORMAL } from "../lib/animation-constants";
import { useScrollTo } from "../lib/use-scroll-to";
import { navigation } from "content-collections";

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
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis(); // kept for lenis.stop() / lenis.start() in menu logic
  const scrollToTarget = useScrollTo();

  // Logo visibility: scroll-linked crossfade with hero logo
  const { scrollY, scrollYProgress } = useScroll();
  // Smooth fade-in that overlaps with hero logo fade-out ([100, 250])
  const headerLogoOpacity = useTransform(scrollY, [100, 250], [0, 1]);
  const headerLogoScale = useTransform(scrollY, [100, 250], [0.9, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track scroll for header background
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 50;
    if (shouldBeScrolled !== scrolled) {
      setScrolled(shouldBeScrolled);
    }
  });

  // Prevent scroll when menu is open - Lenis + overscroll-behavior + inert background
  // Desktop: lenis.stop() toggles `lenis-stopped` class on <html> (overflow: hidden)
  // Mobile: overscroll-y-contain on menu overlay prevents touch scroll chaining (CSS-only)
  // No body.style.overflow manipulation — that corrupts iOS Safari native scroll state
  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();

      // Make background content inert so screen readers can't reach it
      const mainContent = document.getElementById('main-content');
      const pageFooter = document.querySelector<HTMLElement>('footer[class*="pt-16"]');
      if (mainContent) mainContent.setAttribute('inert', '');
      if (pageFooter) pageFooter.setAttribute('inert', '');
    } else {
      lenis?.start();

      const mainContent = document.getElementById('main-content');
      const pageFooter = document.querySelector<HTMLElement>('footer[class*="pt-16"]');
      if (mainContent) mainContent.removeAttribute('inert');
      if (pageFooter) pageFooter.removeAttribute('inert');
    }

    // Cleanup on unmount to prevent stale inert state
    return () => {
      const mainContent = document.getElementById('main-content');
      const pageFooter = document.querySelector<HTMLElement>('footer[class*="pt-16"]');
      if (mainContent) mainContent.removeAttribute('inert');
      if (pageFooter) pageFooter.removeAttribute('inert');
    };
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
      // Map scrollOffset values to specific mobile panel IDs
      const mobileIdMap: Record<number, string> = {
        0.2: "mobile-panel-teams",
        0.4: "mobile-panel-research",
        0.6: "mobile-panel-labs",
      };

      if (scrollOffset !== undefined && mobileIdMap[scrollOffset]) {
        const panelTarget = document.getElementById(mobileIdMap[scrollOffset]);
        if (panelTarget && panelTarget.offsetHeight > 0) {
          element = panelTarget;
          scrollOffset = undefined;
        }
      }

      // Fallback to storytelling-mobile container if no specific panel matched
      if (element.offsetHeight === 0) {
        const mobileTarget = document.getElementById("storytelling-mobile");
        if (mobileTarget && mobileTarget.offsetHeight > 0) {
          element = mobileTarget;
          scrollOffset = undefined;
        }
      }
    }

    if (element) {
      // Calculate offset for submenu items (scroll within storytelling section)
      const additionalOffset = scrollOffset !== undefined && id === "storytelling"
        ? scrollOffset * element.offsetHeight
        : 0;

      const performScroll = () => {
        scrollToTarget(element, {
          offset: additionalOffset + SCROLL_HEADER_OFFSET,
          duration: SCROLL_DURATION_NAV,
        });
      };

      if (wasMenuOpen) {
        // Double rAF ensures React commit + Lenis restart have completed (~32ms at 60fps)
        requestAnimationFrame(() => {
          requestAnimationFrame(performScroll);
        });
      } else {
        performScroll();
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
    return undefined;
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
    return undefined;
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

  const navItems: NavItem[] = navigation.navItems;

  const drawerItems: Array<NavItem | { id: string; label: string }> = navigation.drawerItems;

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
      <nav className={`px-6 lg:px-8 py-4 flex items-center justify-between transition-colors duration-500 ${
        scrolled ? "bg-[#FAF8F5]" : "bg-transparent"
      }`}>
        {/* Logo - scroll-linked crossfade with hero logo */}
        <Link href="/" className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] rounded">
          <motion.div
            style={pathname === "/" && !prefersReducedMotion ? {
              opacity: headerLogoOpacity,
              scale: headerLogoScale,
            } : { opacity: 1, scale: 1 }}
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
                className="relative px-4 py-2.5 text-sm font-medium text-[#5C306C]/75 hover:text-[#5C306C] transition-colors duration-300 flex items-center gap-1.5 rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C]"
                whileHover={{ backgroundColor: "rgba(92, 48, 108, 0.04)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: DURATION_FAST_MOBILE, ease: EASE_SNAPPY }}
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
                    transition={{ duration: DURATION_FAST, ease: EASE_SNAPPY }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-80 transition-opacity" />
                  </motion.span>
                )}
              </motion.button>

              {/* Dropdown - soft, tactile feel */}
              {item.hasSubmenu && (
                <AnimatePresence>
                  {openSubmenu === item.id && (
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white/95 backdrop-blur-md shadow-lg shadow-[#5C306C]/8 border border-[#5C306C]/5 rounded-xl py-1.5 z-50 overflow-hidden"
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -4, scale: prefersReducedMotion ? 1 : 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4, scale: prefersReducedMotion ? 1 : 0.98 }}
                      transition={{ duration: prefersReducedMotion ? DURATION_INSTANT : DURATION_FAST, ease: EASE_SNAPPY }}
                      onMouseLeave={() => setOpenSubmenu(null)}
                      role="menu"
                    >
                      {item.submenu?.map((subItem, i) => (
                        <motion.button
                          key={subItem.label}
                          type="button"
                          onClick={() => handleNavClick(subItem.id, subItem.scrollOffset)}
                          className="w-full text-left px-4 py-2 text-sm font-medium text-[#5C306C]/75 hover:text-[#5C306C] hover:bg-[#5C306C]/[0.05] transition-colors duration-200 flex items-center gap-2.5 group/item focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-inset"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * STAGGER_NORMAL, duration: DURATION_FAST, ease: EASE_SNAPPY }}
                          whileHover={{ x: 2 }}
                          role="menuitem"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9966]/50 group-hover/item:bg-[#FF9966] group-hover/item:scale-125 transition-[background-color,transform] duration-200" />
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
            className="ml-3 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-[#5C306C] to-[#4A2756] rounded-full shadow-sm shadow-[#5C306C]/20 hover:shadow-md hover:shadow-[#5C306C]/25 transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2"
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97, y: 0 }}
            transition={SPRING_SNAPPY}
          >
            {navigation.cta}
          </motion.button>
        </div>

        {/* Mobile Hamburger - hidden on desktop */}
        <button
          ref={hamburgerRef}
          className="lg:hidden p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A2756] rounded"
          onClick={handleMenuToggle}
          aria-expanded={menuOpen}
          aria-label={navigation.hamburgerAriaLabel}
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
        {/* Scroll progress bar - always mounted, opacity toggle avoids mount/unmount flicker */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF9966] to-[#5C306C] origin-left"
          style={{ scaleX: scrollYProgress, opacity: scrolled ? 1 : 0 }}
        />
      </nav>

      {/* Mobile Menu - Full Screen Takeover (no backdrop close - intentional UX choice) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#FAF8F5] z-[80] lg:hidden flex flex-col overscroll-contain"
            data-mobile-menu
            role="dialog"
            aria-modal="true"
            aria-label={navigation.menuAriaLabel}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.25, ease: EASE_OUT_EXPO }}
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const container = e.currentTarget;
              const focusable = Array.from(
                container.querySelectorAll<HTMLElement>(
                  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
                )
              ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
              if (focusable.length === 0) return;
              const first = focusable[0];
              const last = focusable[focusable.length - 1];
              const active = document.activeElement as HTMLElement | null;
              if (e.shiftKey) {
                if (active === first || !container.contains(active)) {
                  e.preventDefault();
                  last.focus();
                }
              } else {
                if (active === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#5C306C]/10">
                <Link href="/" onClick={() => handleCloseMenu('nav-item')} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] rounded">
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
                  aria-label={navigation.closeAriaLabel}
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
              <nav className="flex-1 overflow-y-auto overscroll-y-contain px-6 py-6">
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
                          className="w-full text-left px-4 py-4 text-lg font-medium text-[#5C306C] hover:bg-[#5C306C]/5 active:bg-[#5C306C]/10 rounded-lg transition-colors duration-150 flex items-center justify-between min-h-[56px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-inset"
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
                                className="w-full text-left px-4 py-3 text-base text-[#5C306C]/80 hover:bg-[#5C306C]/5 active:bg-[#5C306C]/10 rounded-lg transition-colors duration-150 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-inset"
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
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: prefersReducedMotion ? 0 : drawerItems.length * STAGGER_NORMAL + 0.1, duration: prefersReducedMotion ? 0 : DURATION_NORMAL_MOBILE, ease: EASE_SNAPPY }}
                >
                  <motion.button
                    type="button"
                    onClick={() => handleNavClick("contact")}
                    className="w-full px-6 py-4 text-base font-medium text-white bg-[#5C306C] hover:bg-[#4A2756] active:bg-[#4A2756] rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C306C] focus-visible:ring-offset-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    {navigation.cta}
                  </motion.button>
                </motion.div>
              </nav>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
