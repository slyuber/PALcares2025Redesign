# PALcares Website - Technical Stack Documentation

## Core Framework
| Technology | Version | Configuration |
|------------|---------|---------------|
| **Next.js** | 15.5.9 | App Router, Static Export (`output: "export"`) |
| **React** | 19.1.0 | Client Components (`"use client"`) |
| **TypeScript** | 5.9.2 | Strict mode |

## Styling
| Technology | Version | Usage |
|------------|---------|-------|
| **Tailwind CSS** | 4.x | Utility classes, custom @theme inline |
| **SCSS/Sass** | 1.92.1 | Component-specific styles in `app/_styles/` |
| **PostCSS** | via `@tailwindcss/postcss` | CSS processing |

## Animation
| Technology | Version | Usage Pattern |
|------------|---------|---------------|
| **Framer Motion** | 12.23.13 | Scroll-linked animations (`useScroll`, `useTransform`, `useSpring`), entrance animations (`whileInView`), reduced motion support (`useReducedMotion`) |

## Icons
| Technology | Version |
|------------|---------|
| **Lucide React** | 0.468.0 |

## Key Animation APIs in Use
- `useScroll({ target, offset })` - Track scroll progress within containers
- `useTransform(scrollProgress, inputRange, outputRange)` - Map scroll to CSS values
- `useSpring(value, config)` - Smooth animations with spring physics
- `useReducedMotion()` - Accessibility for motion sensitivity
- `motion.div` with `whileInView`, `initial`, `animate` - Scroll-triggered animations

---

## Page Structure

```
app/
├── page.tsx              # Homepage composition
├── layout.tsx            # Root layout (Raleway font)
├── globals.scss          # Global styles + CSS custom properties
│
├── components/
│   ├── Header.tsx        # Fixed nav, logo, mobile drawer
│   ├── Hero.tsx          # Hero section with large logo
│   ├── NeedWeNoticed.tsx # "Where We Started" section
│   ├── Storytelling.tsx  # Scroll-jacking Teams/Research/Labs
│   ├── DeeperContext.tsx # "The Deeper Context" section
│   ├── Values.tsx        # "What We Believe" (5 values)
│   ├── Testimonials.tsx  # Partner testimonials
│   ├── Contact.tsx       # Contact form/info
│   ├── Footer.tsx        # Site footer
│   └── ScrollBackground.tsx # Fixed parallax background layer
│
├── _styles/
│   ├── header.scss       # Header + drawer styles
│   ├── component_values.scss
│   └── [other component styles]
```

---

## Component Map

### Page Composition (`page.tsx`)
```tsx
<main>
  <ScrollBackground />  // Fixed, -z-10, parallax orbs + texture
  <Hero />              // id="top", hero logo + CTA
  <NeedWeNoticed />     // id="where-we-started"
  <Storytelling />      // id="storytelling", h-[500vh] scroll-jacking
  <DeeperContext />     // id="context"
  <Values />            // id="values", "What We Believe"
  <Testimonials />      // id="testimonials"
  <Contact />           // id="contact"
</main>
```

### Key Component Details

#### Header.tsx
- Fixed position, z-50
- Logo: `/svg/PALcares_logo_light.svg` (140x38, h-8/h-10)
- Scroll state: `scrolled` (after 50px) adds backdrop blur
- Mobile drawer with AnimatePresence

#### Hero.tsx
- Desktop logo: `max-w-[280px]`, centered, visible on `lg:` screens
- Mobile logo: `max-w-[180px]`, hidden on desktop
- Scroll indicator: ArrowDown icon with bounce animation
- Background: Radial gradient orbs + SVG organic lines

#### Storytelling.tsx
- Container: `h-[500vh]` for scroll-jacking
- Sticky inner: `h-[100svh]`, holds all panels
- **5 Panels**: Intro → Teams → Research → Labs → Ecosystem Summary
- **Center Progress Line** (ISSUE): Lines 69-81, fills on scroll
- **ContentPanel**: Two-column grid (5 + 7 cols), `lg:border-l` divider
- Progress indicator: Right side dots

#### DeeperContext.tsx
- 4 "beats" in alternating left/right layout
- Vertical connecting line with scroll-fill
- Labels: `text-[10px]` with colored text
- Body: `text-base md:text-lg`

#### Values.tsx
- **5 values** defined in data array
- Layout: First 3 in `grid-cols-3`, last 2 in `grid-cols-2` centered
- Issue: Only 3 visible in screenshot

---

## CSS Custom Properties (Design Tokens)

```scss
:root {
  --foreground: #5C306C;        // Primary purple
  --foreground-dark: #472055;   // Darker purple
  --color-orange: #FF9966;      // Accent orange
  --color-light-gray: #F8F8F8;  // Light background
  --color-dark-gray: #5F6368;   // Body text
}
```

Body background: `#F5F2EE` (warm cream)

---

## Build Commands

```bash
npm run dev    # Development with Turbopack
npm run build  # Static build with Turbopack
```

Output: Static HTML in `out/` directory

---

## Animation Reference

### Scroll-Fill Pattern (used in Storytelling center line)
```tsx
const { scrollYProgress } = useScroll({ target: containerRef });
const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

<motion.div style={{ scaleY: smoothProgress, transformOrigin: "top" }} />
```

### Entrance Animation Pattern
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
/>
```
