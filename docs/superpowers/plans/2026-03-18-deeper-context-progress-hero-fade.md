# DeeperContext Progress + Hero Fade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Traveling ball progress animation in DeeperContext + single fade-in for Hero.

**Architecture:** DeeperContext uses `useScroll` + `useTransform` for ball position and content reveal. Hero wraps content in a single `motion.div` fade.

**Tech Stack:** Framer Motion `useScroll`/`useTransform`/`useMotionValueEvent`, CSS keyframes for pulse

**Spec:** `docs/superpowers/specs/2026-03-18-deeper-context-progress-hero-fade-design.md`

---

## File Map

| File | Change |
|---|---|
| `app/components/DeeperContext.tsx` | Rewrite progress system: traveling ball, deposit dots, scroll-linked reveal |
| `app/components/Hero.tsx` | Simplify entrance to single fade-in |
| `app/globals.scss` | Add `@keyframes dot-pulse` for the beat arrival effect |

---

## Task 1: Hero — Single Clean Fade-In

**Files:** `app/components/Hero.tsx`

- [ ] **Step 1: Wrap content in single motion.div**

Find the `<div className="space-y-8 md:space-y-10">` that wraps all hero text content (around line 171). Wrap it in:
```tsx
<motion.div
  className="space-y-8 md:space-y-10"
  initial={{ opacity: 0 }}
  animate={isReady ? { opacity: 1 } : undefined}
  transition={{
    duration: prefersReducedMotion ? 0 : DURATION_SLOW,
    ease: EASE_PREMIUM,
  }}
>
```

- [ ] **Step 2: Remove per-element motion wrappers on tagline**

Replace the three `motion.span` wrappers on tagline lines with plain `<span>`:
- Line 1 (`hero.tagline.line1`): `motion.span` → `<span className="inline-block">`
- Line 2 (`hero.tagline.emphasisPrefix`): `motion.span` → `<span className="font-medium inline-block">`
- Line 3 (`hero.tagline.line2`): `motion.span` → `<span className="inline-block">`

Remove `initial`, `animate`, `transition` props from all three. Keep them as plain `<span>`.

**Keep** the inner `motion.span` on `hero.tagline.emphasisWord` — that's the "relationships" color animation. Update its delay to `0.8` (so it plays after the parent fade completes).

- [ ] **Step 3: Simplify description and location**

Replace `motion.p` on description (line ~230) and location (line ~244) with plain `<p>`. Remove their individual `initial`, `animate`, `transition` props. They now inherit the parent `motion.div` fade.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add app/components/Hero.tsx
git commit -m "animation: simplify hero entrance to single fade-in

Remove per-element staggered delays (bom bom bom effect).
Entire hero content fades in as one unit over 800ms.
Only animation after fade: relationships color change."
```

---

## Task 2: DeeperContext — Traveling Ball Progress System

**Files:** `app/components/DeeperContext.tsx`, `app/globals.scss`

This is the main task. The component needs significant rework of its animation system.

- [ ] **Step 1: Add CSS keyframe for dot pulse**

Add to `app/globals.scss`:
```scss
@keyframes dot-pulse {
  0% { transform: translate(-50%, 0) scale(1); box-shadow: 0 0 12px rgba(224, 123, 76, 0.4); }
  50% { transform: translate(-50%, 0) scale(1.3); box-shadow: 0 0 20px rgba(224, 123, 76, 0.6); }
  100% { transform: translate(-50%, 0) scale(1); box-shadow: 0 0 12px rgba(224, 123, 76, 0.4); }
}
```

- [ ] **Step 2: Remove AnimatedBeat component**

Delete the `AnimatedBeat` function component (around lines 10-42). Content reveal will now be scroll-linked.

- [ ] **Step 3: Rewrite the progress line**

Replace the gradient fill with solid `#E07B4C`:
```tsx
// OLD:
<motion.div
  className="absolute inset-0 bg-gradient-to-b from-[#8FAE8B] via-[#FF9966] to-[#5C306C] origin-top"
  style={{ scaleY: lineScale }}
/>

// NEW:
<motion.div
  className="absolute inset-0 bg-[#E07B4C] origin-top"
  style={{ scaleY: lineScale }}
/>
```

- [ ] **Step 4: Add the traveling ball**

After the line fill div, add a traveling ball positioned at the leading edge:
```tsx
<motion.div
  className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#E07B4C] z-10"
  style={{
    top: useTransform(scrollYProgress, [0, 0.85], ['0%', '100%']),
    boxShadow: '0 0 12px rgba(224, 123, 76, 0.4)',
    display: prefersReducedMotion ? 'none' : 'block',
  }}
/>
```

Note: The ball's `top` percentage maps to the container's height. It should travel from the first beat to the last beat.

- [ ] **Step 5: Replace beat dots with deposit system**

Remove the existing static colored dots. Replace with deposit dots that appear when the ball passes:

For each beat, track whether the ball has passed using `useMotionValueEvent` on `scrollYProgress`. When progress crosses the beat's threshold, set a state flag. Render a deposit dot (8px, `#E07B4C`, no glow) only when the flag is true.

```tsx
const [depositedDots, setDepositedDots] = useState<boolean[]>([false, false, false, false]);

// Beat positions as fractions of the scroll range [0, 0.85]
const beatPositions = [0.12, 0.37, 0.62, 0.87];

useMotionValueEvent(scrollYProgress, "change", (latest) => {
  const normalized = latest / 0.85; // Map to 0-1 within the line range
  setDepositedDots(prev => {
    const next = [...prev];
    let changed = false;
    beatPositions.forEach((pos, i) => {
      if (normalized >= pos && !next[i]) {
        next[i] = true;
        changed = true;
      }
    });
    return changed ? next : prev;
  });
});
```

Each deposit dot:
```tsx
<div
  className={cn(
    "hidden md:block absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#E07B4C] transition-opacity duration-300",
    depositedDots[beatIdx] ? "opacity-100" : "opacity-0"
  )}
  style={{
    top: '1rem',
    boxShadow: depositedDots[beatIdx] ? '0 0 0 4px rgba(224, 123, 76, 0.12)' : 'none',
  }}
/>
```

When a dot deposits, apply the `dot-pulse` animation class briefly (use a CSS animation that runs once).

- [ ] **Step 6: Replace AnimatedBeat with scroll-linked content reveal**

Each beat's content should fade in based on scroll position rather than `useInView`. Use `useTransform` to map scroll progress to per-beat opacity and translateY:

```tsx
// For each beat, calculate opacity based on scroll position
const beatRevealStart = beatPositions[beatIdx] - 0.15; // Start revealing before ball arrives
const beatRevealEnd = beatPositions[beatIdx]; // Fully visible when ball arrives
const beatOpacity = useTransform(scrollYProgress,
  [beatRevealStart * 0.85, beatRevealEnd * 0.85],
  [0, 1]
);
const beatY = useTransform(scrollYProgress,
  [beatRevealStart * 0.85, beatRevealEnd * 0.85],
  [12, 0]
);
```

Wrap each beat in `<motion.div style={{ opacity: beatOpacity, y: beatY }}>` instead of `<AnimatedBeat>`.

Note: Since `useTransform` can't be called inside a `.map()` loop (hooks rules), either:
- Create a `BeatReveal` child component that calls the hooks internally
- Or pre-compute all 4 transforms outside the loop

The cleanest approach: create a `ScrollRevealBeat` component that accepts `scrollYProgress` and `revealStart`/`revealEnd` as props, and calls `useTransform` internally.

- [ ] **Step 7: Bump subheading font weight**

Change `font-light` to `font-normal` on the subheading `<p>` element.

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 9: Build**

```bash
npm run build
```

- [ ] **Step 10: Commit**

```bash
git add app/components/DeeperContext.tsx app/globals.scss
git commit -m "animation: traveling ball progress with dot deposits in DeeperContext

- Scroll-linked ball travels down the center line
- Deposits static dots at each beat with a pulse effect
- Content fades in as ball approaches each beat position
- Single color (#E07B4C) for all dots and line fill
- Replaces AnimatedBeat with scroll-linked reveal
- Subheading bumped to font-normal"
```

---

## Task 3: Final verification + push

- [ ] **Step 1: Full build**

```bash
npx tsc --noEmit && npm run build
```

- [ ] **Step 2: Visual check**

Scroll through:
- Hero: should fade in smoothly as one unit, "relationships" changes color after
- DeeperContext: ball should travel, deposit dots, content reveals progressively

- [ ] **Step 3: Push**

```bash
git push
```
