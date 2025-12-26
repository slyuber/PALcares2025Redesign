# PALcares Website Development Instructions for Claude

> **Version**: 2.1 (January 2025)  
> **Purpose**: Comprehensive guide for building and maintaining the PALcares website with correct code patterns, best practices for nonprofit websites, and consistent branding.

---

## Table of Contents

1. [Organization Context](#organization-context)
2. [Brand Identity](#brand-identity)
3. [Tech Stack & Dependencies](#tech-stack--dependencies)
4. [Project Architecture](#project-architecture)
5. [Critical Code Patterns (MUST FOLLOW)](#critical-code-patterns-must-follow)
6. [Nonprofit Website Best Practices](#nonprofit-website-best-practices)
7. [Animation Patterns with Framer Motion](#animation-patterns-with-framer-motion)
8. [Accessibility Requirements](#accessibility-requirements)
9. [UI/UX Design Principles](#uiux-design-principles)
10. [Component Structure Pattern](#component-structure-pattern)
11. [Styling Pattern (Hybrid Tailwind + SCSS)](#styling-pattern-hybrid-tailwind--scss)
12. [Common Tasks Reference](#common-tasks-reference)
13. [Build & Deploy](#build--deploy)
14. [Troubleshooting Guide](#troubleshooting-guide)

---

## Organization Context

### About PALcares

PALcares is a nonprofit providing **embedded technical teams** to social service organizations in Alberta. The organization operates under **Treaty 6 (Edmonton)** and **Treaty 7 (Calgary)** territories.

**Core Services:**
- **PAL Teams**: Multi-year embedded partnerships with organizations
- **PAL Research**: Generalizing and sharing solutions under open license
- **PAL Labs**: Extending capacity through students, newcomers, transition workers, and career-changers

**Organizational Voice Principles:**
- State values as values, not effectiveness claims
- Acknowledge difficulty without claiming to solve it
- Describe choices rather than making outcome promises
- Avoid phrases like "actually connect" or claims that imply others fail
- Use factual, minimal approaches (no performative language)
- Prioritize relationships before technology
- Build capacity, not dependency

**Treaty Language (Correct Format):**
```
✅ "Serving Calgary (Treaty 7) and Edmonton (Treaty 6)"
❌ "Serving Treaty 6 & 7 communities"
```

---

## Brand Identity

### Color Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| **Primary Purple** | `#5C306C` | `--foreground` | Headlines, primary buttons, links |
| **Dark Purple** | `#472055` | `--foreground-dark` | Hover states, emphasis |
| **Accent Orange/Coral** | `#FF9966` | `--color-orange` | CTAs, highlights, accents |
| **Sage Green** | `#8FAE8B` | `--color-sage` | Secondary accents, nature elements |
| **Navy** | `#3B4D81` | `--color-navy` | Alternate text, backgrounds |
| **Light Gray** | `#F8F8F8` | `--color-light-gray` | Backgrounds |
| **Dark Gray** | `#5F6368` | `--color-dark-gray` | Body text |

### Typography

| Element | Font | Weight | Tracking |
|---------|------|--------|----------|
| **Display/Headlines** | Raleway | 300 (Light) | `-0.02em` |
| **Body** | Raleway | 400 (Regular) | Normal |
| **Emphasis** | Raleway | 600 (Semi-bold) | Normal |
| **Labels/Caps** | Raleway | 600 | `0.2em` |

### Visual Style

- **Border Radius**: `rounded-full` (buttons), `rounded-xl` (cards), `rounded-2xl` (large containers)
- **Shadows**: Subtle, using `rgba(92, 48, 108, 0.08)` or `rgba(92, 48, 108, 0.15)`
- **Nature Inspiration**: Alberta landscapes, organic flowing shapes, grain textures
- **Aesthetic**: Warm, grounded, professional yet approachable—NOT corporate or slick

### Design Tokens (CSS Custom Properties)

```scss
:root {
  /* Brand Colors */
  --foreground: #5C306C;
  --foreground-dark: #472055;
  --color-orange: #FF9966;
  --color-sage: #8FAE8B;
  --color-navy: #3B4D81;
  --color-light-gray: #F8F8F8;
  --color-dark-gray: #5F6368;

  /* Typography Scale */
  --text-base: 1.125rem;
  --text-xs: calc(var(--text-base) * 0.75);
  --text-sm: calc(var(--text-base) * 0.875);
  --text-lg: calc(var(--text-base) * 1.125);
  --text-xl: calc(var(--text-base) * 1.25);
  --text-2xl: calc(var(--text-base) * 1.5);
  --text-3xl: calc(var(--text-base) * 1.875);
  --text-4xl: calc(var(--text-base) * 2.25);
  --text-5xl: calc(var(--text-base) * 3);

  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
}
```

---

## Tech Stack & Dependencies

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.x | React framework with App Router |
| **React** | 19.x | UI library |
| **TypeScript** | 5.9.x | Type safety |

### Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **SCSS/Sass** | 1.92.x | Component-specific styles |
| **PostCSS** | via `@tailwindcss/postcss` | CSS processing |

### Animation & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| **Framer Motion** | 12.x | Scroll-based and micro animations |
| **Lucide React** | 0.468.x | Icon library |

### Build Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: "export",           // Static HTML generation
  images: { unoptimized: true } // Required for static builds
};
```

### Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start"
}
```

---

## Project Architecture

```
app/
├── layout.tsx              # Root layout with font loading
├── page.tsx                # Homepage composition
├── globals.scss            # Global styles + SCSS imports
├── _styles/                # Component-specific SCSS modules
│   ├── typography.scss
│   ├── buttons.scss
│   ├── header.scss
│   ├── footer.scss
│   └── component_*.scss
├── components/             # React components
│   ├── Hero.tsx
│   ├── Storytelling.tsx
│   ├── NeedWeNoticed.tsx
│   ├── DeeperContext.tsx
│   ├── Values.tsx
│   ├── Testimonials.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── partials/
│       ├── TileCard.tsx
│       ├── Loader.tsx
│       └── BackgroundPatterns.tsx
├── privacy-policy/page.tsx
└── terms-of-use/page.tsx

public/
├── svg/
│   ├── social/             # Social media icons
│   └── *.svg               # Logo and icons
└── image/                  # Raster images
```

---

## Critical Code Patterns (MUST FOLLOW)

### ⚠️ These patterns prevent TypeScript build failures

### 1. Cubic Bezier Easing Arrays

**ALWAYS use `as const` with cubic bezier arrays:**

```tsx
// ❌ WRONG - Will cause TypeScript error
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1]  // TypeScript infers as number[]
    }
  }
};

// ✅ CORRECT - Use `as const`
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const  // Typed as tuple
    }
  }
};

// ✅ ALSO CORRECT - Use named easing
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"  // Named easing string
    }
  }
};
```

### 2. Standard Easing Constants (Recommended)

Define reusable easing constants at the top of files or in a shared utils file:

```tsx
// utils/animation.ts or at top of component file
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;
const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1] as const;
const EASE_SMOOTH = [0.25, 0.4, 0.25, 1] as const;

// Usage
transition: { duration: 0.8, ease: EASE_OUT_CUBIC }
```

### 3. Keyframe Arrays in Animations

**ALWAYS use `as const` with keyframe arrays:**

```tsx
// ❌ WRONG
animate={{ y: [0, -10, 0] }}

// ✅ CORRECT
animate={{ y: [0, -10, 0] as const }}

// ✅ ALSO CORRECT - Define separately
const floatKeyframes = [0, -10, 0] as const;
animate={{ y: floatKeyframes }}
```

### 4. useScroll Hook - Valid Options Only

**NEVER use deprecated or invalid options:**

```tsx
// ❌ WRONG - layoutEffect is not a valid option
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
  layoutEffect: false,  // ❌ INVALID - will cause build failure
});

// ✅ CORRECT - Only use valid options
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"] as const,
});

// Valid useScroll options (Framer Motion 12.x):
// - target: RefObject<Element>
// - container: RefObject<Element>
// - offset: ScrollOffset (e.g., ["start start", "end end"])
// - axis: "x" | "y"
```

### 5. Type-Safe Variants

**Explicitly type variants when needed:**

```tsx
import { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1] as const
    }
  }
};
```

### 6. Offset Arrays

**Use `as const` for scroll offset tuples:**

```tsx
// ❌ May cause issues
offset: ["start start", "end end"]

// ✅ SAFER
offset: ["start start", "end end"] as const
```

### 7. React Hooks Rules - No Hooks in Callbacks

**NEVER call hooks inside callbacks, loops, or conditions:**

```tsx
// ❌ WRONG - Hook called inside .map() callback
{values.map((value, index) => {
  const iconOpacity = useTransform(
    scrollYProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [0, 1]
  );  // ❌ BREAKS BUILD - Hook in callback
  return <div>...</div>;
})}

// ✅ CORRECT - Extract to separate component
import { MotionValue } from "framer-motion";

function ValueItem({ 
  value, 
  index, 
  scrollYProgress 
}: { 
  value: typeof values[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  // ✅ Hooks at top level of component
  const iconOpacity = useTransform(
    scrollYProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [0, 1]
  );
  return <div>...</div>;
}

// Usage
{values.map((value, index) => (
  <ValueItem 
    key={index} 
    value={value} 
    index={index} 
    scrollYProgress={scrollYProgress} 
  />
))}
```

### 8. React.memo Display Names

**ALWAYS add display names to memoized components:**

```tsx
// ❌ WRONG - Missing display name
const Panel = React.memo(({ active, children }: { 
  active: boolean; 
  children: React.ReactNode 
}) => {
  return <div>...</div>;
});

// ✅ CORRECT - Add display name
const Panel = React.memo(({ active, children }: { 
  active: boolean; 
  children: React.ReactNode 
}) => {
  return <div>...</div>;
});
Panel.displayName = 'Panel';
```

### 9. TypeScript `any` Types

**NEVER use `any` - use proper types:**

```tsx
// ❌ WRONG - Will cause ESLint error
interface ContentPanelProps {
  fillProgress?: any;  // ❌ BREAKS BUILD
}

// ✅ CORRECT - Use proper types
import { MotionValue } from "framer-motion";

interface ContentPanelProps {
  fillProgress?: MotionValue<number> | number;  // ✅ Properly typed
}
```

### 10. useEffect Dependencies

**Include all dependencies or use refs to prevent loops:**

```tsx
// ⚠️ WARNING - Missing dependency
useEffect(() => {
  const measureHeader = () => {
    if (newHeight !== headerHeight) {
      setHeaderHeight(newHeight);
    }
  };
  // ...
}, []); // ❌ Missing headerHeight dependency

// ✅ CORRECT - Include dependency (with guard to prevent loops)
useEffect(() => {
  const measureHeader = () => {
    const newHeight = header.getBoundingClientRect().height;
    // Guard prevents infinite loop
    if (newHeight !== headerHeight) {
      setHeaderHeight(newHeight);
    }
  };
  measureHeader();
  // ...
}, [headerHeight]); // ✅ Include dependency

// ✅ ALTERNATIVE - Use ref to track previous value
const prevHeightRef = useRef(0);
useEffect(() => {
  const measureHeader = () => {
    const newHeight = header.getBoundingClientRect().height;
    if (newHeight !== prevHeightRef.current) {
      setHeaderHeight(newHeight);
      prevHeightRef.current = newHeight;
    }
  };
  // ...
}, []); // ✅ No dependency needed with ref
```

---

## Nonprofit Website Best Practices

### Trust & Credibility

1. **Consistent Branding**: Same colors, fonts, logos across all pages
2. **Transparent Impact**: Show real metrics, not vague claims
3. **Social Proof**: Testimonials from partners (with permission)
4. **Clear Mission**: Immediately communicate what PALcares does
5. **Honest Language**: Avoid marketing-speak; be direct and humble

### User Experience

1. **Simple Navigation**: Clear menu structure, max 5-7 main items
2. **Mobile-First**: 60%+ of nonprofit traffic is mobile
3. **Fast Loading**: Optimize images, minimize JavaScript
4. **Accessible CTAs**: High contrast, clear action words
5. **Easy Contact**: Multiple ways to reach out, prominently displayed

### Content Strategy

1. **Storytelling Over Stats**: Share real impact stories
2. **Scannable Content**: Headers, short paragraphs, whitespace
3. **Clear Value Proposition**: What problem do you solve?
4. **Authentic Voice**: Match PALcares' humble, grounded tone
5. **Regular Updates**: Keep news/blog content fresh

### Conversion Optimization

1. **Visible Contact CTA**: On every page, in header/footer
2. **Multiple Engagement Paths**: Partner, volunteer, learn more
3. **Low Friction Forms**: Minimal required fields
4. **Trust Signals**: Partner logos, testimonials, certifications

---

## Animation Patterns with Framer Motion

### Scroll-Triggered Entrance Animations

```tsx
"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";

export default function Section() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: [0.25, 0.4, 0.25, 1] as const
      }
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.h2 variants={itemVariants}>Title</motion.h2>
      <motion.p variants={itemVariants}>Content</motion.p>
    </motion.section>
  );
}
```

### Scroll-Linked Transforms (Parallax)

```tsx
import { useScroll, useTransform, useSpring, motion, MotionValue } from "framer-motion";
import { useRef } from "react";

export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ✅ CORRECT - Only valid options
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] as const,
  });

  // Transform scroll progress to visual values
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Add spring physics for smoothness
  const smoothY = useSpring(y, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001 
  });

  return (
    <div ref={containerRef}>
      <motion.div style={{ y: smoothY, opacity }}>
        Parallax content
      </motion.div>
    </div>
  );
}
```

### Hover & Interaction States

```tsx
<motion.button
  whileHover={{ 
    scale: 1.02,
    transition: { duration: 0.2 }
  }}
  whileTap={{ scale: 0.98 }}
  className="..."
>
  Get in Touch
</motion.button>
```

### Looping Animations

```tsx
<motion.div
  animate={{ 
    y: [0, -8, 0] as const,  // ✅ MUST use as const
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

PALcares serves diverse communities. The website MUST be accessible to all users.

### Required Implementation

```tsx
// 1. Semantic HTML
<section aria-label="About PALcares programs">
  <h2>Our Services</h2>
  ...
</section>

// 2. Reduced Motion Support
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={{ 
    y: prefersReducedMotion ? 0 : [0, -10, 0] as const 
  }}
  transition={{ 
    duration: prefersReducedMotion ? 0 : 3 
  }}
/>

// 3. Focus Management
<button
  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)] focus-visible:ring-offset-2"
  tabIndex={0}
>

// 4. Screen Reader Announcements
<div className="sr-only" role="status" aria-live="polite">
  {`Viewing section ${activeIndex + 1} of ${total}`}
</div>

// 5. Alt Text for Images
<img 
  src="/image/team.jpg" 
  alt="PALcares team members collaborating with partner organization staff"
/>

// 6. Skip Links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Color Contrast Requirements

| Element | Foreground | Background | Ratio Required |
|---------|------------|------------|----------------|
| Body text | `#5F6368` | `#FFFFFF` | 4.5:1 minimum |
| Headlines | `#5C306C` | `#FFFFFF` | 4.5:1 minimum |
| Large text | `#5C306C` | `#F8F8F8` | 3:1 minimum |
| Links | `#5C306C` | `#FFFFFF` | 4.5:1 minimum |
| Buttons | `#FFFFFF` | `#5C306C` | 4.5:1 minimum |

### Keyboard Navigation

- All interactive elements must be focusable
- Tab order must be logical
- Focus states must be visible
- No keyboard traps

---

## UI/UX Design Principles

### Visual Hierarchy

1. **Headlines**: Large, light-weight (font-light), tight tracking
2. **Subheadings**: Medium size, regular weight
3. **Body**: Comfortable reading size (18px base), relaxed line-height
4. **Labels**: Small caps, semi-bold, wide tracking

### Spacing System

```tsx
// Generous whitespace - sections breathe
<section className="py-24 lg:py-32">

// Content max-widths for readability
<div className="max-w-4xl mx-auto">  // Narrow content
<div className="max-w-5xl mx-auto">  // Medium content
<div className="max-w-6xl mx-auto">  // Wide content
<div className="max-w-7xl mx-auto">  // Full-width content

// Consistent padding
<div className="px-6 lg:px-12">
```

### Background Effects (Subtle)

```tsx
// Gradient orbs - low opacity, organic feel
<div 
  className="absolute top-20 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none"
  style={{ background: 'rgba(255, 153, 102, 0.12)' }}
/>

// Grain texture overlay
<div 
  className="absolute inset-0 opacity-[0.015] pointer-events-none"
  style={{ backgroundImage: 'url(/svg/noise.svg)' }}
/>
```

### Typography Patterns

```tsx
// Hero headline - fluid sizing
<h1 className="text-[clamp(2rem,5vw,4rem)] font-light tracking-[-0.02em] leading-tight">

// Section headline
<h2 className="text-3xl lg:text-4xl font-light tracking-tight">

// Body text
<p className="text-lg text-[var(--color-dark-gray)] leading-relaxed">

// Label/eyebrow
<span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-orange)]">
```

### Button Patterns

```tsx
// Primary CTA
<button className="
  bg-[var(--foreground)] 
  text-white 
  px-8 py-4 
  rounded-full 
  font-medium
  hover:bg-[var(--foreground-dark)] 
  transition-all duration-300
  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]
">
  Get in Touch
</button>

// Secondary/Ghost
<button className="
  border-2 border-[var(--foreground)]
  text-[var(--foreground)]
  px-8 py-4 
  rounded-full 
  font-medium
  hover:bg-[var(--foreground)] hover:text-white
  transition-all duration-300
">
  Learn More
</button>
```

---

## Component Structure Pattern

### Standard Section Component Template

```tsx
// app/components/SectionName.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, Variants, MotionValue } from "framer-motion";
import { SomeIcon } from "lucide-react";

// ============================================
// TYPES
// ============================================
interface DataItem {
  id: string;
  title: string;
  content: string;
  icon?: React.ReactNode;
}

// ============================================
// CONSTANTS
// ============================================
const EASE_SMOOTH = [0.25, 0.4, 0.25, 1] as const;

const items: DataItem[] = [
  { 
    id: 'item-1', 
    title: 'Title', 
    content: 'Content...' 
  },
];

// ============================================
// COMPONENT
// ============================================
export default function SectionName() {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants with reduced motion support
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: prefersReducedMotion ? 0 : 0.15 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: EASE_SMOOTH
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="section-anchor"
      className="relative min-h-screen py-24 lg:py-32 overflow-hidden"
      aria-label="Descriptive section label"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div 
          className="absolute top-20 -right-32 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(255, 153, 102, 0.1)' }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-orange)] block mb-4">
            Label
          </span>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-[var(--foreground)]">
            Section Title
          </h2>
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h3 className="text-xl font-medium text-[var(--foreground)] mb-4">
                {item.title}
              </h3>
              <p className="text-[var(--color-dark-gray)] leading-relaxed">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

---

## Styling Pattern (Hybrid Tailwind + SCSS)

### When to Use Tailwind

- Layout utilities (flex, grid, spacing)
- Responsive breakpoints
- Simple state changes (hover, focus)
- One-off styling
- Quick prototyping

### When to Use SCSS

- Complex component-specific styles
- CSS custom properties / design tokens
- Pseudo-elements (::before, ::after)
- Keyframe animations
- Nested selectors
- Mixins and functions

### SCSS Module Pattern

```scss
// app/_styles/component_example.scss
@use "sass:math";

.component-wrapper {
  position: relative;
  
  // Pseudo-element decorations
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--color-orange);
    border-radius: 2px;
  }

  // Nested elements
  &__title {
    font-size: var(--text-2xl);
    color: var(--foreground);
  }

  &__content {
    color: var(--color-dark-gray);
    line-height: 1.7;
  }

  // State variations
  &--active {
    background: var(--color-light-gray);
  }

  // Responsive
  @media (min-width: 1024px) {
    padding: var(--space-12);
  }
}
```

### Importing SCSS

```scss
// app/globals.scss
@use "./_styles/typography" as typography;
@use "./_styles/buttons" as buttons;
@use "./_styles/component_example" as example;
```

---

## Common Tasks Reference

### Adding a New Section

1. Create component: `app/components/NewSection.tsx`
2. Follow the [Component Structure Pattern](#component-structure-pattern)
3. Add to page composition in `app/page.tsx`
4. Add SCSS if needed in `app/_styles/component_newsection.scss`
5. Import SCSS in `globals.scss`

### Creating Scroll-Linked Animation

```tsx
import { useScroll, useTransform, useSpring, motion, MotionValue } from "framer-motion";
import { useRef } from "react";

// ✅ CORRECT - Hooks at top level
export default function ParallaxSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"] as const,
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={containerRef}>
      <motion.div style={{ y: smoothY }}>
        Parallax content
      </motion.div>
    </motion.div>
  );
}

// ✅ CORRECT - Multiple items with scroll-linked animations
function ScrollItem({ 
  index, 
  scrollYProgress 
}: { 
  index: number; 
  scrollYProgress: MotionValue<number> 
}) {
  // ✅ Hooks at top level of component
  const opacity = useTransform(
    scrollYProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [0, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [20, 0]
  );

  return (
    <motion.div style={{ opacity, y }}>
      Item {index}
    </motion.div>
  );
}

// Usage
{items.map((item, index) => (
  <ScrollItem 
    key={index} 
    index={index} 
    scrollYProgress={scrollYProgress} 
  />
))}
```

### Adding Form Handling

```tsx
const [formData, setFormData] = useState({ 
  name: '', 
  email: '', 
  message: '' 
});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    // Form submission logic
    setSubmitStatus('success');
  } catch (error) {
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
};
```

### Adding New Icon

```tsx
// From Lucide
import { Heart, Users, Building2 } from "lucide-react";

// Custom SVG component
const CustomIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    aria-hidden="true"
  >
    {/* SVG paths */}
  </svg>
);
```

---

## Build & Deploy

### Development

```bash
npm run dev      # Starts dev server with Turbopack
```

### Production Build

```bash
npm run build    # Creates static export in out/
```

### Pre-Deployment Checklist

- [ ] Run `npm run build` locally - no errors
- [ ] All `ease: [...]` arrays have `as const`
- [ ] All keyframe arrays have `as const`
- [ ] No `layoutEffect` in `useScroll()` calls
- [ ] All hooks called at top level (not in callbacks)
- [ ] All `React.memo` components have `displayName`
- [ ] No `any` types (use proper TypeScript types)
- [ ] Test at 375px, 768px, 1024px, 1440px widths
- [ ] Verify all animations respect reduced motion
- [ ] Check color contrast with accessibility tools
- [ ] Validate all links work
- [ ] Test keyboard navigation
- [ ] Verify images have alt text

### Static Export Notes

- No server-side features (API routes, server actions)
- Images must use `unoptimized: true` in config
- All pages pre-rendered at build time
- Output directory: `out/`

---

## Troubleshooting Guide

### Common Build Errors

#### Error: `ease` type inference
```
Type 'number[]' is not assignable to type 'Easing'
```
**Fix:** Add `as const` to all cubic bezier arrays
```tsx
ease: [0.25, 0.4, 0.25, 1] as const
```

#### Error: `layoutEffect` does not exist
```
'layoutEffect' does not exist in type 'UseScrollOptions'
```
**Fix:** Remove the `layoutEffect` property entirely from `useScroll()` options

#### Error: Keyframe array type
```
Type 'number[]' is not assignable to type...
```
**Fix:** Add `as const` to keyframe arrays
```tsx
y: [0, -10, 0] as const
```

#### Error: React Hook called inside callback
```
React Hook "useTransform" cannot be called inside a callback
```
**Fix:** Extract component and call hooks at top level
```tsx
// Create separate component
function Item({ value, index, scrollYProgress }) {
  const opacity = useTransform(...); // ✅ Top level
  return <div>...</div>;
}

// Use in map
{items.map((item, i) => (
  <Item key={i} value={item} index={i} scrollYProgress={scrollYProgress} />
))}
```

#### Error: Missing display name
```
Component definition is missing display name
```
**Fix:** Add display name after component definition
```tsx
const Panel = React.memo(...);
Panel.displayName = 'Panel';
```

#### Error: Unexpected `any` type
```
Unexpected any. Specify a different type.
```
**Fix:** Use proper TypeScript types
```tsx
// Instead of: fillProgress?: any;
import { MotionValue } from "framer-motion";
fillProgress?: MotionValue<number> | number;
```

#### Warning: Missing dependency in useEffect
```
React Hook useEffect has a missing dependency: 'headerHeight'
```
**Fix:** Add dependency or use ref pattern
```tsx
// Option 1: Add dependency (with guard)
useEffect(() => {
  // ... code that uses headerHeight
}, [headerHeight]); // ✅ Include dependency

// Option 2: Use ref to avoid dependency
const prevRef = useRef(0);
useEffect(() => {
  // ... code using prevRef.current instead
}, []); // ✅ No dependency needed
```

### SCSS Deprecation Warnings

If you see Sass deprecation warnings about `/` for division:

```scss
// ❌ Deprecated
$half: $value / 2;

// ✅ Modern
@use "sass:math";
$half: math.div($value, 2);
```

### Framer Motion Performance

If animations feel janky:

1. Use `useSpring` for scroll-linked values
2. Add `will-change: transform` for heavy animations
3. Reduce `staggerChildren` values
4. Use `viewport={{ once: true }}` to animate only once

---

## When Improving This Site

### Do ✅

- Enhance existing patterns
- Add meaningful animations that serve UX
- Improve accessibility
- Optimize performance
- Document changes clearly
- Test across devices
- Respect PALcares' humble, grounded voice

### Don't ❌

- Change core dependencies without justification
- Remove accessibility features
- Add heavy libraries for simple features
- Break mobile responsiveness
- Override design tokens inconsistently
- Use marketing-speak or promotional language
- Make claims that imply other organizations fail

### Improvement Priorities

1. **Accessibility**: Color contrast, keyboard navigation, screen reader support
2. **Performance**: Image optimization, code splitting, lazy loading
3. **SEO**: Structured data, meta tags, semantic HTML
4. **UX**: Loading states, error handling, form validation
5. **Visual Polish**: Micro-animations, transitions, hover states

---

## Reference Resources

### Design Inspiration
- [Awwwards Nonprofit Collection](https://www.awwwards.com/awwwards/collections/nonprofit-websites/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)

---

*This document serves as Claude's authoritative guide for maintaining and improving the PALcares website while preserving code quality, design consistency, accessibility standards, and the organization's authentic voice.*

