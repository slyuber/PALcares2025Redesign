"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Scroll to top on route change - fixes Next.js App Router + Lenis issue
// where page doesn't start at top if navigating while scroll is in motion
function ScrollReset() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top immediately on route change
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        // lerp: higher = tighter/snappier, lower = smoother/driftier
        // 0.1 is default, 0.105 gives slightly more grounded feel with subtle inertia
        lerp: 0.105,
        smoothWheel: true,
        syncTouch: false, // Native touch on mobile/tablet - much better UX
      }}
    >
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
