# DeeperContext Progress Animation + Hero Fade-In Design Spec

**Date:** 2026-03-18
**Status:** Approved
**Goal:** Replace DeeperContext static dots with a scroll-linked traveling ball that deposits trail dots at each beat, and simplify the Hero entrance from staggered "bom bom bom" to a single clean fade-in.

---

## Part 1: DeeperContext — Traveling Ball with Dot Trail

### Color

Single color for everything: `#E07B4C` (warm orange). Complements `#5C306C` purple text and `#FFF9F5` warm background. No gradient on the line — solid `#E07B4C`.

### The Line

- Replace the gradient fill (`from-[#8FAE8B] via-[#FF9966] to-[#5C306C]`) with solid `bg-[#E07B4C]`
- Line still fills top-to-bottom via `scaleY` driven by `scrollYProgress`
- The background track remains `bg-[#5C306C]/5`

### The Traveling Ball

- 10px circle, `bg-[#E07B4C]`, positioned at the leading edge of the line fill
- Position driven by `scrollYProgress` — `top` maps from 0% to 100% of the line's height
- Ambient glow while traveling: `box-shadow: 0 0 12px rgba(224, 123, 76, 0.4)`
- Reduced motion: ball jumps to position without glow

### Beat Arrival Pulse

When the ball reaches a beat's vertical position:
- Ball scales 1 → 1.3 → 1 over ~400ms (CSS keyframe animation, triggered once)
- Glow intensifies briefly: shadow spread doubles then returns
- A static deposit dot (8px, `bg-[#E07B4C]`, no glow) appears at the beat position
- Deposit dot has a subtle ring: `box-shadow: 0 0 0 4px rgba(224, 123, 76, 0.12)`
- The traveling ball continues moving downward past the deposit

### Beat Positions

4 beats mapped to scroll progress of the section:
- Beat 0 ("Meeting You Where You Are"): ~12% of section scroll
- Beat 1 ("Building Infrastructure..."): ~37%
- Beat 2 ("What Time Makes Possible"): ~62%
- Beat 3 ("When Plans Change"): ~87%

These are approximate — actual positions depend on the rendered layout. The implementation should calculate beat positions from DOM element offsets, not hardcoded percentages.

### Content Reveal

- Each beat's content (label + paragraphs) fades in via scroll-linked opacity + 12px translateY
- Content starts becoming visible when scroll reaches ~80% of the way to the beat's dot position
- Fully visible when the ball arrives at the beat
- Replaces the current `AnimatedBeat` component which uses `useSafeInView`
- Simple opacity + rise only — no scale, no slide, no clip-path

### What Gets Removed

- `AnimatedBeat` component (replaced with scroll-linked reveal)
- The 4 existing colored dots (green, orange, green, purple) with different colors
- The gradient on the progress line fill
- The `dotColors` and `dotRingColors` arrays

### What Stays

- The vertical center line structure
- The alternating left/right grid layout with negative margins
- The section header ("Our Approach" + subheading)
- All content from `content/deeper-context.json`

### Subheading Font Weight

Bump from `font-light` to `font-normal`:
```
"What makes partnership like this possible, and why it matters."
```

---

## Part 2: Hero — Single Clean Fade-In

### Current Behavior

Each element has a separate staggered entrance:
- Line 1 ("Technology that"): delay 0.2s, y: 16 → 0
- Line 2 ("strengthens the relationships"): delay 0.35s, y: 16 → 0
- Line 3 ("your work depends on"): delay 0.5s, y: 16 → 0
- Description: delay 0.6s, y: 16 → 0
- Location: delay 0.75s
- Buttons: implicit delay

This creates a "bom bom bom" staggered reveal that feels heavy after the loader.

### New Behavior

- The entire hero content block fades in as ONE unit: `opacity: 0 → 1` over ~800ms
- No per-element delays, no per-element y offsets
- All text, buttons, and location appear together
- The ONLY special animation: "relationships" word color change from `#5C306C` → `#E07B4C`
  - Keeps its existing delay (~1.0s after `isReady`) so it plays after the fade completes
  - This is the signature moment — it earns attention because nothing else is competing
- Reduced motion: content appears instantly, no color animation

### What Changes in Hero.tsx

- Remove individual `motion.span` wrappers on tagline lines 1, 2, 3 — replace with plain `<span>` elements
- Wrap the entire content block (`space-y-8`) in a single `motion.div` with `opacity: 0 → 1`
- Remove individual delays/y-offsets on description and location `motion.p` elements
- Keep the `motion.span` on "relationships" for the color transition
- Keep the desktop/mobile logo animations (those are scroll-linked, separate concern)

---

## Constraints

- Only `app/components/DeeperContext.tsx` and `app/components/Hero.tsx` modified
- All easing curves from `animation-constants.ts`
- Reduced motion respected in both components
- No new dependencies
- No content changes

## Success Criteria

1. DeeperContext: ball travels smoothly with scroll, deposits dots, content reveals progressively
2. DeeperContext: all dots are `#E07B4C` — no color variation
3. Hero: entire content appears as one clean fade after loader, no stagger
4. Hero: "relationships" color change is the only animation that plays after the fade
5. Build passes (`tsc --noEmit`, `next build`)
6. Reduced motion: all animations disabled gracefully
