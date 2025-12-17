// app/components/partials/ParallaxBackground.tsx
// Simple decorative background component for secondary pages
"use client";

import Image from "next/image";

interface ParallaxBackgroundProps {
  src: string;
  alt: string;
  speed?: number;
  opacity?: number;
  objectPosition?: string;
}

export default function ParallaxBackground({
  src,
  alt,
  opacity = 0.2,
  objectPosition = "center",
}: ParallaxBackgroundProps) {
  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{
          opacity,
          objectPosition,
        }}
        priority={false}
      />
      {/* Gradient overlay for better text readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        }}
      />
    </div>
  );
}
