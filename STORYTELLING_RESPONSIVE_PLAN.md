# Storytelling Section - Responsive Design Fix Plan

## Problem Statement
The navbar (fixed header) cuts off text content in the Storytelling section on mobile devices. The sticky container uses `top-0` which doesn't account for the fixed header height, causing content overlap.

## Root Cause Analysis

### Identified Issues:
1. **Sticky container positioning**: Uses `top-0` which places content behind fixed header
2. **No header height compensation**: Content container doesn't account for header height (~64-72px on mobile, ~72-80px on desktop)
3. **Viewport height calculations**: `h-[100svh]` doesn't subtract header height
4. **Content padding**: No top padding/margin to prevent header overlap
5. **Responsive breakpoints**: Not accounting for different header heights across devices

## Responsive Design Plan

### Breakpoint Strategy
- **Mobile**: < 768px (header ~64-72px)
- **Tablet**: 768px - 1024px (header ~72-76px)
- **Desktop**: > 1024px (header ~72-80px)

### Solution Approach

#### 1. Header Height Compensation
- **Option A (Recommended)**: Use CSS custom properties to dynamically calculate header height
- **Option B**: Use JavaScript to measure header height and apply as inline style
- **Option C**: Use fixed padding values per breakpoint (less flexible)

#### 2. Sticky Container Adjustments
- Change `top-0` to account for header height
- Use `top-[var(--header-height)]` or similar dynamic value
- Adjust viewport height: `h-[calc(100svh-var(--header-height))]`

#### 3. Content Container Spacing
- Add top padding: `pt-[var(--header-height)]` or `pt-16 md:pt-20`
- Ensure content doesn't overlap with header
- Maintain vertical centering within available space

#### 4. Mobile-Specific Considerations
- Increase padding on mobile: `px-6` → `px-4` (already good)
- Ensure text doesn't get cut off at top
- Test with various mobile viewport heights (including browser chrome)

#### 5. Tablet Considerations
- Medium padding: `px-8` or `px-12`
- Balanced spacing between mobile and desktop

#### 6. Desktop Considerations
- Larger padding: `px-12` (already implemented)
- More vertical space available, less critical but still important

## Implementation Details

### Step 1: Measure Header Height
- Use instrumentation logs to determine actual header heights
- Account for different states (scrolled vs not scrolled)
- Consider logo visibility changes

### Step 2: Apply Dynamic Spacing
- Calculate header height on mount and resize
- Apply as CSS variable or inline style
- Update on window resize

### Step 3: Adjust Sticky Container
```tsx
// Current:
className="sticky top-0 h-[100svh]"

// Proposed:
className="sticky top-[var(--header-height)] h-[calc(100svh-var(--header-height))]"
// OR with Tailwind arbitrary values:
className="sticky top-[64px] md:top-[72px] h-[calc(100svh-64px)] md:h-[calc(100svh-72px)]"
```

### Step 4: Adjust Content Container
```tsx
// Current:
className="relative z-10 w-full max-w-[1200px] px-6 md:px-12 h-full flex flex-col justify-center"

// Proposed:
className="relative z-10 w-full max-w-[1200px] px-6 md:px-12 pt-16 md:pt-20 h-full flex flex-col justify-center"
```

### Step 5: Test Across Devices
- Mobile: iPhone SE (375px), iPhone 12/13/14 (390px), iPhone 14 Pro Max (430px)
- Tablet: iPad (768px), iPad Pro (1024px)
- Desktop: 1280px, 1440px, 1920px

## Best Practices Applied

1. **Progressive Enhancement**: Works without JavaScript, enhanced with JS
2. **Accessibility**: Maintains proper spacing for screen readers
3. **Performance**: Uses CSS where possible, minimal JS calculations
4. **Maintainability**: Clear breakpoints and consistent spacing system
5. **Flexibility**: Adapts to different header heights automatically

## Testing Checklist

- [ ] Mobile portrait (375px - 430px)
- [ ] Mobile landscape (667px - 932px)
- [ ] Tablet portrait (768px)
- [ ] Tablet landscape (1024px)
- [ ] Desktop (1280px+)
- [ ] Header scrolled state
- [ ] Header not scrolled state
- [ ] Different browser chrome heights
- [ ] Text readability at all breakpoints
- [ ] No content cut-off at top
- [ ] Proper vertical centering maintained

## Expected Outcomes

1. ✅ No text cut-off by navbar on any device
2. ✅ Proper spacing between header and content
3. ✅ Content remains vertically centered in available space
4. ✅ Smooth transitions across breakpoints
5. ✅ Maintains visual design integrity

