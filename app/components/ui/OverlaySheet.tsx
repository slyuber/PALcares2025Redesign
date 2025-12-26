"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "../../lib/utils";

type OverlaySheetProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onCloseReason?: (reason: "escape" | "backdrop" | "button") => void;
  ariaLabel: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

function getFocusable(container: HTMLElement) {
  const nodes = container.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
  );
  return Array.from(nodes).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

export function OverlaySheet({
  open,
  onOpenChange,
  onCloseReason,
  ariaLabel,
  title,
  subtitle,
  children,
  className,
  contentClassName,
}: OverlaySheetProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const initialFocusRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  const lockStyles = useMemo(() => {
    const w = getScrollbarWidth();
    return { paddingRight: w > 0 ? `${w}px` : "" };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement as HTMLElement | null;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (lockStyles.paddingRight) document.body.style.paddingRight = lockStyles.paddingRight;

    // Focus: move into dialog (close button) on open
    window.setTimeout(() => {
      initialFocusRef.current?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      previousActiveRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] hidden lg:block"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onCloseReason?.("escape");
          onOpenChange(false);
          return;
        }

        if (e.key === "Tab") {
          const container = contentRef.current;
          if (!container) return;
          const focusable = getFocusable(container);
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          const active = document.activeElement as HTMLElement | null;
          if (!active) return;

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
        }
      }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#5C306C]/25 backdrop-blur-[2px] transform-gpu"
        aria-label="Close dialog"
        onClick={() => {
          onCloseReason?.("backdrop");
          onOpenChange(false);
        }}
      />

      <div
        ref={contentRef}
        className={cn(
          "relative mx-auto mt-[9svh] w-[min(880px,calc(100vw-48px))] rounded-2xl border border-[#5C306C]/10 bg-[#FFFDFB] shadow-xl ring-1 ring-[#FF9966]/10",
          className
        )}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FF9966]/10 via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#5C306C]/5 blur-2xl" />
          <div className="relative flex items-start justify-between gap-6 p-6 border-b border-[#5C306C]/10">
          <div className="min-w-0">
            {subtitle && (
              <div className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5C306C]/60">
                {subtitle}
              </div>
            )}
            {title && <div className="text-xl font-medium text-[#5C306C] leading-tight">{title}</div>}
          </div>

          <button
            ref={initialFocusRef}
            type="button"
            className={cn(
              "shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full",
              "bg-[#5C306C]/5 hover:bg-[#5C306C]/10 text-[#5C306C]/80",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9966] focus-visible:ring-offset-2"
            )}
            aria-label="Close"
            onClick={() => {
              onCloseReason?.("button");
              onOpenChange(false);
            }}
          >
            ✕
          </button>
        </div>
        </div>

        <div className={cn("p-6 max-h-[70svh] overflow-auto overscroll-contain", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}


