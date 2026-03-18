# Scroll-Lock Entry Smoothing Design Spec

**Date:** 2026-03-18
**Status:** Approved
**Goal:** Smooth the transition from NeedWeNoticed into the Storytelling scroll-lock section so it feels like a natural continuation of scrolling, not an abrupt mode change.

---

## Problem

When scrolling past "Where We Started" into the Storytelling section, normal page flow abruptly becomes a viewport-locked sticky section. Three things compound to make this jarring:

1. The subtitle doesn't start fading in until 2% scroll progress — half the screen is empty
2. The panels 1-4 wrapper fades from 0→1 over a very narrow `[0, 0.025]` band — abrupt pop-in
3. The heading sits static while scroll behavior changes underneath — no visual motion to disguise the lock

## Solution

Adjust scroll-linked animation timing values in `Storytelling.tsx` to create a gradual, natural-feeling entry. No structural changes — only `useTransform` range values.

### Changes

| Value | Current | Proposed | Effect |
|---|---|---|---|
| `subtitleOpacity` | `[0.02, 0.06] → [0, 1]` | `[0, 0.04] → [0, 1]` | Subtitle appears immediately on entry, fills the blank space |
| `scrollCueOpacity` | `[0, 0.01, 0.04, 0.06] → [0, 0.6, 0.6, 0]` | `[0, 0.005, 0.03, 0.05] → [0, 0.6, 0.6, 0]` | Scroll cue appears faster, signals "keep scrolling" sooner |
| `contentEntryOpacity` | `[0, 0.025] → [0, 1]` | `[0, 0.05] → [0, 1]` | Wider fade-in for panels = less abrupt appearance |
| Intro heading | No motion | `translateY: [8, 0]` over `[0, 0.03]` | Subtle drift disguises the scroll-lock engagement |

### What Does NOT Change

- The 500vh container height
- The sticky mechanism (`position: sticky`)
- Panel crossfade logic and clip-path wipes
- All panel content and ordering
- The progress rail
- The skip button behavior
- Mobile layout (unaffected — no scroll-lock on mobile)

## Constraints

- Only `app/components/Storytelling.tsx` is modified
- Only `useTransform` range values change — no new hooks, no new elements
- All easing curves from `animation-constants.ts`
- Reduced motion: all transforms gated on `prefersReducedMotion`

## Success Criteria

1. Scrolling from NeedWeNoticed into Storytelling feels continuous — no blank gap
2. The heading drifts into position naturally as the sticky section engages
3. Subtitle and scroll cue appear early enough to fill the viewport
4. Panels 1-4 fade in smoothly when transitioning from intro
5. Build passes (`tsc --noEmit`, `next build`)
6. No visual change to any other section
