# PALcares Website - Issues Checklist

## Summary of Issues

| # | Issue | Severity | Component(s) | Status |
|---|-------|----------|--------------|--------|
| 1 | Duplicate logo visible (header + hero) | High | Header.tsx, Hero.tsx | ✅ FIXED |
| 2 | Visible seam line between Hero and Where We Started | Medium | Hero.tsx, NeedWeNoticed.tsx, ScrollBackground.tsx | ✅ FIXED |
| 3 | Hard-edged background shapes (visible circle edges) | Medium | ScrollBackground.tsx, Hero.tsx | ✅ FIXED |
| 4 | Wrong ecosystem divider line (center, not column) | High | Storytelling.tsx | ✅ FIXED |
| 5 | Deeper Context text too small | Medium | DeeperContext.tsx | ✅ FIXED |
| 6 | Deeper Context emphasis colors too contrasting | Low | DeeperContext.tsx | ✅ FIXED |
| 7 | "What We Believe" only shows 3 values, layout broken | High | Values.tsx | ✅ FIXED |

---

## Issue 1: Logo Morph on Scroll

### Problem
Both the header logo AND the hero logo are visible simultaneously when viewing the hero section. As you scroll, the large hero logo disappears behind the header while the header logo is already showing—creating a jarring duplicate effect.

### Current Code Locations

**Header Logo (always visible):**
```
File: app/components/Header.tsx
Lines: 91-101

<Link href="/" className="flex-shrink-0">
  <Image
    src="/svg/PALcares_logo_light.svg"
    alt="PALcares logo"
    width={140}
    height={38}
    className="h-8 w-auto lg:h-10"
    priority
  />
</Link>
```

**Hero Logo (desktop):**
```
File: app/components/Hero.tsx
Lines: 118-136

<motion.div className="hidden lg:flex justify-center mb-12">
  <Image
    src="/svg/PALcares_logo_light.svg"
    alt="PALcares"
    width={280}
    height={76}
    className="w-full max-w-[280px] h-auto"
  />
</motion.div>
```

### Desired Behavior
1. When hero logo is fully visible, header logo should be hidden/transparent
2. As hero logo scrolls up toward header, it should animate (scale + translate) to become the header logo
3. Single perceived logo throughout the scroll experience

### Implementation Notes
- Need shared scroll progress tracking between components
- Calculate bounding boxes for both logo positions
- Use Framer Motion `layoutId` or manual transform interpolation
- State handoff: when animation completes, hide hero logo and show header logo

---

## Issue 2: Visible Section Seam Line

### Problem
There's a visible horizontal line/seam when scrolling from the Hero section into the "Where We Started" section.

### Current Code Locations

**Hero Background:**
```
File: app/components/Hero.tsx
Lines: 36-46

<div className="absolute inset-0 z-0">
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.5)_0%,_transparent_60%)]" />
  <div className="absolute top-[30%] left-[20%] w-[60vw] h-[40vh] bg-[radial-gradient(ellipse,_rgba(255,250,245,0.4)_0%,_transparent_50%)] blur-3xl" />
</div>

{/* Primary Orb */}
<div className="absolute top-[40%] left-[50%] ... bg-[radial-gradient(circle,_rgba(255,153,102,0.12)_0%,_transparent_70%)]" />
```

**NeedWeNoticed Background:**
```
File: app/components/NeedWeNoticed.tsx
Line: 16

<div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF9F5]/30 to-transparent pointer-events-none" />
```

### Likely Causes
1. Different background gradient endpoints not matching
2. Section container boundaries creating visual edge
3. Z-index stacking causing color banding

### Desired Behavior
- No visible line when scrolling
- Continuous, seamless background flow
- Colors should blend naturally

---

## Issue 3: Hard-Edged Background Shapes

### Problem
The large circle shapes in the background have clearly visible edges instead of soft, feathered falloffs.

### Current Code Location
```
File: app/components/ScrollBackground.tsx
Lines: 91-115 (Parallax Layer 1)

<div 
  className="w-full h-full rounded-full"
  style={{
    background: `
      radial-gradient(circle at 40% 40%, 
        rgba(255,210,180,0.22) 0%, 
        rgba(255,190,160,0.12) 30%,
        rgba(255,170,140,0.05) 50%,
        transparent 70%
      )
    `,
  }}
/>
```

### Desired Behavior
- Shapes should fade gradually with no perceptible edge
- More blur, more feathering
- Multiple gradient stops for smoother falloff (extend to 85-90% before fully transparent)

---

## Issue 4: Wrong Ecosystem Divider Line

### Problem
There's a vertical progress line in the CENTER of the Storytelling section that fills as you scroll. This is NOT the desired behavior. The fill effect should happen on the COLUMN DIVIDER (the gray line between the two columns in the ContentPanel).

### Current Code - WRONG LINE (to be removed):
```
File: app/components/Storytelling.tsx
Lines: 69-81

{/* Center Progress Line - Scroll-linked fill animation */}
<div className="absolute left-1/2 top-[15%] bottom-[15%] w-px -translate-x-1/2 hidden md:block pointer-events-none">
  {/* Background line */}
  <div className="absolute inset-0 bg-[#5C306C]/10 rounded-full" />
  {/* Animated fill */}
  <motion.div
    className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-[#8FAE8B] via-[#FF9966] to-[#5C306C] origin-top"
    style={{ 
      scaleY: prefersReducedMotion ? 1 : smoothProgress,
      height: "100%"
    }}
  />
</div>
```

### Current Code - CORRECT LINE (to be animated):
```
File: app/components/Storytelling.tsx
Line: 253 (inside ContentPanel function)

<div className="lg:col-span-7 space-y-6 lg:pl-10 lg:border-l lg:border-[#5C306C]/10 py-2">
```

### Desired Behavior
1. Remove the center progress line entirely
2. Keep the column divider (`lg:border-l lg:border-[#5C306C]/10`)
3. Overlay a fill element on the column divider
4. Each section (Teams/Research/Labs) should have its own divider that:
   - Starts unfilled (gray track visible)
   - Fills as you scroll through that section
   - Is fully filled by the time you transition to next section
5. "How It Connects" panel (single column) has no divider

---

## Issue 5: Deeper Context Typography Size

### Problem
The main body text and the section labels are too small.

### Current Code Location
```
File: app/components/DeeperContext.tsx

Labels (line 73, 104, 130, 159):
<span className="inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6B9B67] mb-4">

Body text (lines 76-86, 107-113, etc.):
<p className="text-base md:text-lg text-[#4A2756] leading-[1.8] mb-4">
```

### Desired Changes
- Increase main body text by ~15%
- Current: `text-base md:text-lg` (18px → 20.25px on desktop)
- Target: `text-lg md:text-xl` (~20px → ~22.5px)
- Increase labels from `text-[10px]` to `text-[11px]` or `text-[12px]`

---

## Issue 6: Deeper Context Emphasis Colors Too Contrasting

### Problem
The emphasized phrases (spans with different colors) have too much color contrast with the surrounding text, making it feel "neon" or jarring.

### Current Code Locations
```
File: app/components/DeeperContext.tsx

Various colored spans:
- text-[#E07B4C] (bright orange)
- text-[#6B9B67] (sage green)

Examples:
Line 78-80: <span className="text-[#4A2756] font-semibold">...</span>
Line 109: <span className="text-[#E07B4C] font-semibold">take doing the job to understand</span>
Line 135: <span className="text-[#6B9B67] font-semibold">build relationships...</span>
```

### Desired Changes
- Reduce color saturation/brightness
- Consider using `font-medium` instead of `font-semibold`
- Or use subtle underline/background highlight instead of color
- Maintain accessibility contrast ratios

---

## Issue 7: "What We Believe" Values Layout

### Problem
From the screenshots, only 3 values are visible:
1. Relationships Before Technology
2. Community Ownership
3. Data Sovereignty

The layout appears broken—the content shows a 3+2 grid structure but values 4 and 5 seem cut off or missing.

### Current Code Location
```
File: app/components/Values.tsx
Lines: 13-44: Values array (5 items)
Lines: 68-96: First row (3 values)
Lines: 98-126: Second row (2 values)
```

### Current Layout Logic
```tsx
{/* First row - 3 values */}
<div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-8 lg:mb-10">
  {values.slice(0, 3).map(...)}
</div>

{/* Second row - 2 values, centered */}
<div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
  {values.slice(3).map(...)}
</div>
```

### User Requirement
- Show exactly 4 values (not 5)
- Use 2x2 grid layout
- Need to determine which value to remove (likely "Still Learning" #5)

### Desired Layout
```
Desktop (md+): 2x2 grid
┌───────────────┬───────────────┐
│  Value 1      │  Value 2      │
├───────────────┼───────────────┤
│  Value 3      │  Value 4      │
└───────────────┴───────────────┘

Mobile: Single column stack
```

---

## Task Prioritization

### Phase 1: Critical Layout Fixes
1. ⬜ Fix "What We Believe" to show 4 values in 2x2 grid
2. ⬜ Remove wrong center divider line from Storytelling

### Phase 2: Logo Behavior
3. ⬜ Implement logo morph on scroll

### Phase 3: Background Polish
4. ⬜ Remove visible seam between Hero and Where We Started
5. ⬜ Soften background shape edges

### Phase 4: Typography Refinement
6. ⬜ Increase Deeper Context text sizes
7. ⬜ Soften emphasis color contrast

### Phase 5: Advanced Animation
8. ⬜ Implement column divider fill animation in Storytelling
