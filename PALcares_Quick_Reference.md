# PALcares Code Fixes - Quick Reference Cheat Sheet

## 🚨 CRITICAL: Patterns That Break Builds

### 1. Cubic Bezier Arrays

```tsx
// ❌ BREAKS BUILD
ease: [0.25, 0.4, 0.25, 1]

// ✅ WORKS
ease: [0.25, 0.4, 0.25, 1] as const

// ✅ ALSO WORKS - Named easing
ease: "easeOut"
ease: "easeInOut"
ease: "anticipate"
```

### 2. Keyframe Arrays

```tsx
// ❌ BREAKS BUILD
animate={{ y: [0, -10, 0] }}
animate={{ scale: [1, 1.1, 1] }}
animate={{ opacity: [0, 1, 0.5, 1] }}

// ✅ WORKS
animate={{ y: [0, -10, 0] as const }}
animate={{ scale: [1, 1.1, 1] as const }}
animate={{ opacity: [0, 1, 0.5, 1] as const }}
```

### 3. useScroll Options

```tsx
// ❌ BREAKS BUILD - Invalid option
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
  layoutEffect: false,  // ❌ DELETE THIS
});

// ✅ WORKS - Only valid options
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"] as const,
});
```

### 4. React Hooks Rules

```tsx
// ❌ BREAKS BUILD - Hooks in callback
{values.map((value, index) => {
  const iconOpacity = useTransform(...);  // ❌ Hook in map callback
  return <div>...</div>;
})}

// ✅ WORKS - Extract to component
function ValueItem({ value, index, scrollYProgress }) {
  const iconOpacity = useTransform(...);  // ✅ Hook at top level
  return <div>...</div>;
}

{values.map((value, index) => (
  <ValueItem key={index} value={value} index={index} scrollYProgress={scrollYProgress} />
))}
```

### 5. Component Display Names

```tsx
// ❌ BREAKS BUILD - Missing display name
const Panel = React.memo(({ active, children }) => {
  return <div>...</div>;
});

// ✅ WORKS - Add display name
const Panel = React.memo(({ active, children }) => {
  return <div>...</div>;
});
Panel.displayName = 'Panel';
```

### 6. TypeScript `any` Types

```tsx
// ❌ BREAKS BUILD
fillProgress?: any;

// ✅ WORKS - Proper type
import { MotionValue } from "framer-motion";
fillProgress?: MotionValue<number> | number;
```

---

## ✅ Recommended Easing Constants

Add to top of component files or create `utils/animation.ts`:

```tsx
// Standard easing curves - all typed correctly
const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;
const EASE_IN_OUT_CUBIC = [0.65, 0, 0.35, 1] as const;
const EASE_SMOOTH = [0.25, 0.4, 0.25, 1] as const;
const EASE_BOUNCE = [0.68, -0.55, 0.265, 1.55] as const;

// Usage
transition: { duration: 0.8, ease: EASE_SMOOTH }
```

---

## 🔍 Find & Fix Commands

Run these in your terminal to find all instances:

```bash
# Find all cubic bezier arrays that need fixing
grep -rn "ease: \[" app/components/

# Find all keyframe arrays
grep -rn "y: \[" app/components/
grep -rn "x: \[" app/components/
grep -rn "scale: \[" app/components/
grep -rn "opacity: \[" app/components/

# Find layoutEffect usage (must be removed)
grep -rn "layoutEffect" app/components/

# Find all useScroll usage
grep -rn "useScroll" app/components/

# Find React.memo without displayName
grep -rn "React.memo" app/components/
```

---

## 📋 Component Checklist

Before committing any component:

- [ ] All `ease: [...]` arrays have `as const`
- [ ] All keyframe arrays like `y: [...]` have `as const`
- [ ] No `layoutEffect` in any `useScroll()` call
- [ ] All hooks called at top level (not in callbacks/loops)
- [ ] `React.memo` components have `displayName`
- [ ] No `any` types (use proper types)
- [ ] `useReducedMotion()` hook is used
- [ ] Animations respect `prefersReducedMotion`
- [ ] Section has `aria-label` attribute
- [ ] Interactive elements have focus states

---

## 🎨 PALcares Brand Quick Reference

| Element | Value | CSS Variable |
|---------|-------|--------------|
| Primary Purple | `#5C306C` | `var(--foreground)` |
| Dark Purple | `#472055` | `var(--foreground-dark)` |
| Accent Orange | `#FF9966` | `var(--color-orange)` |
| Sage Green | `#8FAE8B` | `var(--color-sage)` |
| Navy | `#3B4D81` | `var(--color-navy)` |
| Body Text | `#5F6368` | `var(--color-dark-gray)` |
| Background | `#F8F8F8` | `var(--color-light-gray)` |

---

## 🔧 Correct Variant Pattern

```tsx
import { Variants } from "framer-motion";

const EASE_SMOOTH = [0.25, 0.4, 0.25, 1] as const;

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
      duration: 0.8,
      ease: EASE_SMOOTH  // ✅ Pre-typed constant
    }
  }
};
```

---

## 🔄 Valid useScroll Options (Framer Motion 12.x)

```tsx
const { scrollYProgress } = useScroll({
  // ✅ VALID OPTIONS ONLY:
  target: containerRef,           // RefObject<Element>
  container: scrollContainerRef,  // RefObject<Element> (optional)
  offset: ["start end", "end start"] as const,  // ScrollOffset
  axis: "y",                      // "x" | "y" (optional)
});

// ❌ INVALID OPTIONS (will break build):
// layoutEffect: false
// smooth: 0.5
// momentum: true
```

---

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints used in project
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px

// Common patterns
className="text-sm lg:text-base"
className="grid grid-cols-1 lg:grid-cols-2"
className="px-6 lg:px-12"
className="py-16 lg:py-24"
```

---

## ⚡ Quick Copy-Paste Fixes

### Fix 1: Add `as const` to ease array
Find: `ease: [0.25, 0.4, 0.25, 1]`
Replace: `ease: [0.25, 0.4, 0.25, 1] as const`

### Fix 2: Remove layoutEffect
Find: `layoutEffect: false,` (or `layoutEffect: true,`)
Replace: (delete the entire line)

### Fix 3: Add `as const` to offset
Find: `offset: ["start start", "end end"]`
Replace: `offset: ["start start", "end end"] as const`

### Fix 4: Extract hooks from callbacks
Find: Hooks inside `.map()`, `.forEach()`, or other callbacks
Replace: Extract to separate component with hooks at top level

### Fix 5: Add display name to React.memo
Find: `const Component = React.memo(...)`
Add after: `Component.displayName = 'Component';`

---

## 🐛 Common Build Errors & Fixes

### Error: `Type 'number[]' is not assignable to type 'Easing'`
**Fix:** Add `as const` to cubic bezier array
```tsx
ease: [0.25, 0.4, 0.25, 1] as const
```

### Error: `React Hook "useTransform" cannot be called inside a callback`
**Fix:** Extract component and call hooks at top level
```tsx
// Create separate component
function Item({ value, index, scrollYProgress }) {
  const opacity = useTransform(...); // ✅ Top level
  return <div>...</div>;
}
```

### Error: `Component definition is missing display name`
**Fix:** Add display name after component definition
```tsx
const Panel = React.memo(...);
Panel.displayName = 'Panel';
```

### Error: `Unexpected any. Specify a different type`
**Fix:** Use proper TypeScript types
```tsx
// Instead of: fillProgress?: any;
fillProgress?: MotionValue<number> | number;
```

### Error: `'layoutEffect' does not exist in type 'UseScrollOptions'`
**Fix:** Remove `layoutEffect` property entirely

