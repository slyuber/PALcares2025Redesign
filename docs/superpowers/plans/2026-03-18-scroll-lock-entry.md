# Scroll-Lock Entry Smoothing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Smooth the scroll-lock entry transition in Storytelling.tsx by adjusting 4 useTransform timing values.

**Architecture:** All changes are in one file — adjusting existing `useTransform` scroll-linked ranges. One new `useTransform` for heading translateY.

**Tech Stack:** Framer Motion `useTransform`, existing animation-constants

**Spec:** `docs/superpowers/specs/2026-03-18-scroll-lock-entry-design.md`

---

## File Map

### Modified files
| File | Change |
|---|---|
| `app/components/Storytelling.tsx` | Adjust 3 existing useTransform ranges + add 1 new heading translateY |

---

## Task 1: Adjust subtitle and scroll cue timing

**Files:**
- Modify: `app/components/Storytelling.tsx` (lines ~95-101)

- [ ] **Step 1: Update subtitleOpacity range**

Find:
```typescript
const subtitleOpacity = useTransform(scrollYProgress, [0.02, 0.06], [0, 1]);
```

Replace with:
```typescript
const subtitleOpacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);
```

- [ ] **Step 2: Update scrollCueOpacity range**

Find:
```typescript
const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.01, 0.04, 0.06], [0, 0.6, 0.6, 0]);
```

Replace with:
```typescript
const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.005, 0.03, 0.05], [0, 0.6, 0.6, 0]);
```

- [ ] **Step 3: Update contentEntryOpacity range**

Find:
```typescript
const contentEntryOpacity = useTransform(scrollYProgress, [0, 0.025], [0, 1]);
```

Replace with:
```typescript
const contentEntryOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

---

## Task 2: Add heading drift-in translateY

**Files:**
- Modify: `app/components/Storytelling.tsx`

- [ ] **Step 1: Add heading translateY transform**

After the existing `contentEntryOpacity` line, add:
```typescript
// Subtle heading drift: disguises scroll-lock engagement
const introHeadingY = useTransform(scrollYProgress, [0, 0.03], [8, 0]);
```

- [ ] **Step 2: Apply translateY to the intro heading wrapper**

Find the Panel 0 heading `<div>` inside the `<Panel active={activeIndex === 0}>`:
```tsx
<div className="text-center max-w-4xl mx-auto space-y-6 relative">
```

Wrap the heading content in a motion.div with the translateY. Change:
```tsx
<Panel active={activeIndex === 0}>
  <div className="text-center max-w-4xl mx-auto space-y-6 relative">
    <h2
```

To:
```tsx
<Panel active={activeIndex === 0}>
  <motion.div
    className="text-center max-w-4xl mx-auto space-y-6 relative"
    style={prefersReducedMotion ? {} : { y: introHeadingY }}
  >
    <h2
```

And update the closing tag from `</div>` to `</motion.div>` (the one that closes this wrapper, before `</Panel>`).

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

---

## Task 3: Build and commit

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: passes with static export.

- [ ] **Step 2: Commit**

```bash
git add app/components/Storytelling.tsx docs/superpowers/specs/2026-03-18-scroll-lock-entry-design.md docs/superpowers/plans/2026-03-18-scroll-lock-entry.md
git commit -m "animation: smooth scroll-lock entry transition in Storytelling

Adjust useTransform timing to eliminate the jarring scroll-lock entry:
- subtitleOpacity starts at 0% (was 2%) for immediate content fill
- scrollCueOpacity appears 50% sooner to guide scrolling
- contentEntryOpacity widens to 5% band (was 2.5%) for gradual panel fade
- Add subtle 8px heading drift-in to disguise sticky engagement"
```

- [ ] **Step 3: Push**

```bash
git push
```

- [ ] **Step 4: Visual verification**

Open localhost:4000 and scroll from NeedWeNoticed into Storytelling. Verify:
- Heading drifts subtly into position
- Subtitle and scroll cue appear without blank gap
- Transition feels continuous, not jarring
- Panels 1-3 still crossfade correctly when scrolling further
