// app/components/partials/BackgroundPatterns.tsx
// Award-winning design: Subtle brand patterns for section backgrounds
// PERF: Background patterns are now static - no motion imports needed
// Original patterns had continuous animations that caused scroll jank

interface BackgroundPatternsProps {
  variant?: "connection" | "organic-grid" | "watercolor" | "all";
  opacity?: number;
  className?: string;
}

export default function BackgroundPatterns({
  variant = "all",
  opacity = 1,
  className = "",
}: BackgroundPatternsProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Connection Lines Pattern - Flowing lines that connect elements */}
      {/* PERF: Static pattern, no continuous animation - mixBlendMode is costly on large areas */}
      {(variant === "connection" || variant === "all") && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.02 * opacity,
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(92, 48, 108, 0.3) 20px,
                rgba(92, 48, 108, 0.3) 21px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                rgba(92, 48, 108, 0.3) 20px,
                rgba(92, 48, 108, 0.3) 21px
              )
            `,
          }}
        />
      )}

      {/* Organic Grid Pattern - Soft, wavy grid overlay */}
      {/* PERF: Static pattern - backgroundPosition animation on large areas is costly */}
      {(variant === "organic-grid" || variant === "all") && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.015 * opacity,
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(92, 48, 108, 0.2) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {/* Watercolor-like Texture Wash */}
      {/* PERF: Static wash - blur(40px) + mixBlendMode + opacity animation is very expensive */}
      {(variant === "watercolor" || variant === "all") && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.03 * opacity,
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(255, 153, 102, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(143, 174, 139, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(92, 48, 108, 0.2) 0%, transparent 60%)
            `,
          }}
        />
      )}

      {/* Flowing Organic Lines - Inspired by community/connection theme */}
      {/* PERF: Static paths - pathLength animation is GPU-friendly but not needed for static decoration */}
      {(variant === "all") && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.015]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 Q200,150 400,200 T800,200"
            fill="none"
            stroke="rgba(92, 48, 108, 0.3)"
            strokeWidth="1"
          />
          <path
            d="M0,400 Q300,350 600,400 T1200,400"
            fill="none"
            stroke="rgba(255, 153, 102, 0.2)"
            strokeWidth="1"
          />
        </svg>
      )}
    </div>
  );
}

