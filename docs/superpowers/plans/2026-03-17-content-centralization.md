# Content Centralization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all hardcoded content from 10 component files into schema-validated JSON content files using `content-collections`, with a `renderRichText()` utility preserving all four inline formatting patterns.

**Architecture:** JSON content files in `content/` validated by Zod schemas via `content-collections`. A single `renderRichText()` utility converts markup conventions (`**bold**`, `{{brand}}`, `__medium__`, `{_context_}`) to React nodes. Components import typed content at build time. Hero tagline and Storytelling intro heading use structured fields directly (not renderRichText) because they have scroll-linked animations on individual words.

**Tech Stack:** content-collections, Zod, Next.js 15, TypeScript, React

**Spec:** `docs/superpowers/specs/2026-03-17-content-centralization-design.md`

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `content-collections.ts` | Root config: defines all collections with Zod schemas |
| `app/lib/rich-text.tsx` | `renderRichText()` utility: converts markup to React nodes |
| `app/lib/icon-map.ts` | Maps icon name strings to Lucide React components |
| `content/global.json` | Support email |
| `content/meta.json` | Site title, OG tags, descriptions |
| `content/loader.json` | Loader animation words |
| `content/navigation.json` | Nav items, drawer labels, CTA |
| `content/footer.json` | Footer copy, links, newsletter labels |
| `content/contact.json` | Contact section labels, form labels, success messages |
| `content/hero.json` | Hero tagline (structured), description, buttons |
| `content/need-we-noticed.json` | Section copy with rich text |
| `content/values.json` | Section header + 4 value cards |
| `content/deeper-context.json` | Section header + 4 beats |
| `content/storytelling.json` | Intro + 3 panels + ecosystem + progress labels |
| `content/testimonials.json` | Section header + testimonial items |

### Modified files
| File | Change |
|---|---|
| `next.config.ts` | Wrap with `withContentCollections` |
| `tsconfig.json` | Add `content-collections` path if needed |
| `app/layout.tsx` | Import meta from content/meta.json |
| `app/components/Hero.tsx` | Import from content, use renderRichText |
| `app/components/Header.tsx` | Import nav from content |
| `app/components/NeedWeNoticed.tsx` | Import from content, use renderRichText |
| `app/components/Storytelling.tsx` | Import from content, use renderRichText |
| `app/components/DeeperContext.tsx` | Import from content, use renderRichText |
| `app/components/Values.tsx` | Import from content, use renderRichText |
| `app/components/Testimonials.tsx` | Import from content |
| `app/components/Contact.tsx` | Import from content |
| `app/components/Footer.tsx` | Import from content |
| `app/components/partials/Loader.tsx` | Import from content |

### Deleted files
| File | When |
|---|---|
| `app/lib/site-content.ts` | After all components migrated (Task 11) |

---

## Task 0: Proof of Concept -- Verify content-collections + static export

**Why:** The spec has an implementation gate: verify `content-collections` works with `output: 'export'` and Next.js 15 before committing to the full migration.

**Files:**
- Create: `content/global.json`
- Create: `content-collections.ts`
- Modify: `next.config.ts`
- Modify: `app/components/Contact.tsx` (temporarily, to test import)

- [ ] **Step 1: Install content-collections**

```bash
npm install @content-collections/core @content-collections/next
```

- [ ] **Step 2: Create minimal content file**

Create `content/global.json`:
```json
{
  "supportEmail": "support@palcares.ca"
}
```

- [ ] **Step 3: Create content-collections config**

Create `content-collections.ts` at project root:
```typescript
import { defineCollection, defineConfig } from "@content-collections/core";

const global = defineCollection({
  name: "global",
  directory: "content",
  include: "global.json",
  schema: (z) => ({
    supportEmail: z.string().email(),
  }),
  parser: "json",
});

export default defineConfig({
  collections: [global],
});
```

- [ ] **Step 4: Wrap next.config.ts**

Modify `next.config.ts` to compose `withContentCollections` with `withBundleAnalyzer`:
```typescript
import { withContentCollections } from "@content-collections/next";
// ... existing code ...
export default withContentCollections(withBundleAnalyzer(nextConfig));
```

Note: The `require` for bundle-analyzer may need to become an `import`. Check if the config builds.

- [ ] **Step 5: Test import in Contact.tsx**

Temporarily replace the `site-content` import in `Contact.tsx`:
```typescript
// OLD:
import { global as siteGlobal } from "../lib/site-content";
// NEW (test):
import { allGlobals } from "content-collections";
const siteGlobal = allGlobals[0];
```

- [ ] **Step 6: Run build to verify**

```bash
npx next build
```

Expected: Build succeeds with static export. If it fails, check error messages and adjust config.

- [ ] **Step 7: Revert Contact.tsx test change**

Restore original import -- we'll do the real migration in later tasks.

- [ ] **Step 8: Commit proof of concept**

```bash
git add content/global.json content-collections.ts next.config.ts
git commit -m "feat: add content-collections with proof-of-concept global.json"
```

**STOP: If the build fails in Step 6, investigate before proceeding. The entire plan depends on this working.**

---

## Task 1: renderRichText utility

**Files:**
- Create: `app/lib/rich-text.tsx`
- Create: `app/lib/rich-text.test.tsx` (manual verification script)

- [ ] **Step 1: Create renderRichText**

Create `app/lib/rich-text.tsx`:
```tsx
import React from "react";

/**
 * Converts markup conventions in content strings to React nodes.
 *
 * Patterns (processed in order):
 *   **bold**    -> <strong className="font-semibold text-[#5C306C]">
 *   {{brand}}   -> <span className="font-semibold text-[#FF9966]">
 *   __medium__  -> <span className="font-medium text-[#5C306C]">
 *   {_context_} -> <span className="font-medium">
 *   word--word  -> word&mdash;word
 */
export function renderRichText(text: string): React.ReactNode {
  // Split on all markup patterns, keeping delimiters
  const pattern = /(\*\*[^*]+\*\*|\{\{[^}]+\}\}|__[^_]+__|{_[^}]+_}|\w--\w)/g;

  const parts = text.split(pattern);

  if (parts.length === 1 && !pattern.test(text)) {
    return text;
  }

  // Reset lastIndex after test()
  pattern.lastIndex = 0;

  return parts.map((part, i) => {
    // **bold** -> font-semibold text-[#5C306C]
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-semibold text-[#5C306C]">
          {inner}
        </strong>
      );
    }

    // {{brand}} -> font-semibold text-[#FF9966]
    if (part.startsWith("{{") && part.endsWith("}}")) {
      const inner = part.slice(2, -2);
      return (
        <span key={i} className="font-semibold text-[#FF9966]">
          {inner}
        </span>
      );
    }

    // __medium__ -> font-medium text-[#5C306C]
    if (part.startsWith("__") && part.endsWith("__")) {
      const inner = part.slice(2, -2);
      return (
        <span key={i} className="font-medium text-[#5C306C]">
          {inner}
        </span>
      );
    }

    // {_context_} -> font-medium (inherits parent color)
    if (part.startsWith("{_") && part.endsWith("_}")) {
      const inner = part.slice(2, -2);
      return (
        <span key={i} className="font-medium">
          {inner}
        </span>
      );
    }

    // word--word -> word&mdash;word
    if (/\w--\w/.test(part)) {
      const replaced = part.replace(/--/g, "\u2014");
      return <React.Fragment key={i}>{replaced}</React.Fragment>;
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/lib/rich-text.tsx
git commit -m "feat: add renderRichText utility for content markup conventions"
```

---

## Task 2: Icon map utility

**Files:**
- Create: `app/lib/icon-map.ts`

- [ ] **Step 1: Create icon map**

Create `app/lib/icon-map.ts`:
```typescript
import {
  HeartHandshake,
  ShieldCheck,
  Database,
  Sprout,
  Users,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  ShieldCheck,
  Database,
  Sprout,
  Users,
  BookOpen,
  FlaskConical,
};

export function getIcon(name: string): LucideIcon {
  const icon = iconMap[name];
  if (!icon) {
    throw new Error(`Unknown icon: ${name}. Add it to app/lib/icon-map.ts`);
  }
  return icon;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add app/lib/icon-map.ts
git commit -m "feat: add icon-map utility for string-to-Lucide-icon resolution"
```

---

## Task 3: Content-collections schemas for all 12 files

**Files:**
- Create: all 12 `content/*.json` files
- Modify: `content-collections.ts` (add all collection schemas)

This task creates ALL content JSON files and ALL schemas at once. The JSON files contain the actual content extracted from components. Components are NOT modified yet -- that happens in Tasks 4-9.

- [ ] **Step 1: Create content/meta.json**

Extract from `app/layout.tsx` lines 16-48. See spec for exact content.

- [ ] **Step 2: Create content/loader.json**

Extract from `app/components/partials/Loader.tsx`. See spec for exact content.

- [ ] **Step 3: Create content/navigation.json**

Extract from `app/components/Header.tsx` lines 247-281. See spec for exact content.

- [ ] **Step 4: Create content/footer.json**

Extract from `app/components/Footer.tsx`. See spec for exact content.

- [ ] **Step 5: Create content/contact.json**

Extract from `app/components/Contact.tsx`. See spec for exact content.

- [ ] **Step 6: Create content/hero.json**

Extract from `app/components/Hero.tsx`. Note: `tagline` uses structured fields (`line1`/`emphasisPrefix`/`emphasisWord`/`line2`), NOT renderRichText. See spec.

- [ ] **Step 7: Create content/need-we-noticed.json**

Extract from `app/components/NeedWeNoticed.tsx` lines 99-165. Convert all `<strong>` to `**`, all `<span className="font-medium">` to `{_..._}`, all `&apos;` to `'`, all `&mdash;` to `--`. See spec.

- [ ] **Step 8: Create content/values.json**

Extract from `app/components/Values.tsx`. 4 cards with icon string references. See spec.

- [ ] **Step 9: Create content/deeper-context.json**

Extract from `app/components/DeeperContext.tsx` lines 96-170. 4 beats with paragraph arrays. Convert all JSX formatting to markup conventions. **Include full text for all 4 beats** (spec abbreviates beats 3 and 4 -- copy from component).

- [ ] **Step 10: Create content/storytelling.json**

Extract from `app/components/Storytelling.tsx`. This is the largest file. Include:
- `intro` with structured heading fields (headingPrefix/headingAnimatedWord/headingSuffix)
- `panels` array (3 panels, each with description/secondaryDescription/details/items/quote)
- `ecosystem` with nodes (different icons/colors from panels)
- `progressLabels` array

Content for mobile and desktop panels is IDENTICAL. Extract once. Both `ContentPanel` and `ContentPanelMobile` will consume the same data.

- [ ] **Step 11: Create content/testimonials.json**

Merge `testimonials` and `testimonialsList` from existing `app/lib/site-content.ts` + "Read full testimonial"/"Show less" strings from `Testimonials.tsx`.

- [ ] **Step 12: Update content-collections.ts with all schemas**

Add a collection definition for each of the 12 JSON files. Each collection uses `directory: "content"`, `include: "<filename>.json"`, `parser: "json"`, and a Zod schema matching the JSON structure.

Export all collections in `defineConfig({ collections: [...] })`.

- [ ] **Step 13: Verify build passes**

```bash
npx next build
```

Expected: Build succeeds. Content files are validated but not yet consumed by components.

- [ ] **Step 14: Commit**

```bash
git add content/ content-collections.ts
git commit -m "feat: add all 12 content JSON files with Zod schemas"
```

---

## Task 4: Migrate Tier 1 components (Footer, Contact, Loader, Header)

These components use plain strings only -- no renderRichText needed.

**Files:**
- Modify: `app/components/Footer.tsx`
- Modify: `app/components/Contact.tsx`
- Modify: `app/components/partials/Loader.tsx`
- Modify: `app/components/Header.tsx`

- [ ] **Step 1: Migrate Footer.tsx**

Replace all hardcoded strings with imports from content-collections:
```typescript
import { allFooters } from "content-collections";
const content = allFooters[0];
```

Replace: `links` array, brand description, location, tagline, motto, labels, copyright, Privacy/Terms link text.

- [ ] **Step 2: Verify Footer build**

```bash
npx next build
```

- [ ] **Step 3: Migrate Contact.tsx**

Replace `site-content` import with content-collections imports:
```typescript
import { allContacts, allGlobals } from "content-collections";
const content = allContacts[0];
const global = allGlobals[0];
```

Replace: section label, heading, intro, location, form labels, submit/sending text, success messages.

- [ ] **Step 4: Migrate Loader.tsx**

```typescript
import { allLoaders } from "content-collections";
const content = allLoaders[0];
```

Replace `words` array.

- [ ] **Step 5: Migrate Header.tsx**

```typescript
import { allNavigations } from "content-collections";
const nav = allNavigations[0];
```

Replace `navItems` and `drawerItems` arrays. Derive `drawerItems` by prepending `{ id: "top", label: nav.drawerTopLabel }` and appending `{ id: "contact", label: nav.drawerContactLabel }` to `nav.navItems`. Replace CTA label.

- [ ] **Step 6: Verify full build**

```bash
npx next build
```

- [ ] **Step 7: Commit**

```bash
git add app/components/Footer.tsx app/components/Contact.tsx app/components/partials/Loader.tsx app/components/Header.tsx
git commit -m "feat: migrate Footer, Contact, Loader, Header to content-collections"
```

---

## Task 5: Migrate layout.tsx (meta content)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Migrate metadata**

Import meta content. Note: `layout.tsx` is a server component and uses `export const metadata`. Since content-collections resolves at build time, the import should work in the metadata export.

```typescript
import { allMetas } from "content-collections";
const meta = allMetas[0];

export const metadata = {
  title: meta.title,
  description: meta.description,
  // ... map all fields
};
```

- [ ] **Step 2: Verify build**

```bash
npx next build
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: migrate layout metadata to content-collections"
```

---

## Task 6: Migrate Tier 2 components (Hero, NeedWeNoticed, Values)

These components use renderRichText for formatted content.

**Files:**
- Modify: `app/components/Hero.tsx`
- Modify: `app/components/NeedWeNoticed.tsx`
- Modify: `app/components/Values.tsx`

- [ ] **Step 1: Migrate Hero.tsx**

```typescript
import { allHeros } from "content-collections";
import { renderRichText } from "../lib/rich-text";
const content = allHeros[0];
```

Hero tagline: consume `content.tagline.line1`, `.emphasisPrefix`, `.emphasisWord`, `.line2` as structured fields (NOT renderRichText). The word animation on "relationships" requires direct field access.

Description and location: use `renderRichText(content.description)` and `renderRichText(content.location)`.

Buttons: `content.buttonPrimary`, `content.buttonSecondary`.

Scroll label: `content.scrollLabel`.

Remove the `import { hero } from "../lib/site-content"` line.

- [ ] **Step 2: Verify Hero build**

```bash
npx next build
```

- [ ] **Step 3: Migrate NeedWeNoticed.tsx**

```typescript
import { allNeedWeNoticeds } from "content-collections";
import { renderRichText } from "../lib/rich-text";
const content = allNeedWeNoticeds[0];
```

Replace section label, headline, left column paragraphs, right column paragraphs. Each paragraph is a string in the JSON array -- render with `renderRichText()`.

- [ ] **Step 4: Migrate Values.tsx**

```typescript
import { allValues } from "content-collections";
import { renderRichText } from "../lib/rich-text";
import { getIcon } from "../lib/icon-map";
const content = allValues[0];
```

Replace header label, heading, and all 4 card descriptions. For each card:
- `getIcon(card.icon)` to get the Lucide component
- `renderRichText(card.description)` for the description
- `card.title`, `card.color` for title and theme color

The current code uses `values[0]`, `values[1]` etc. for colors/icons. Refactor to map over `content.cards`.

- [ ] **Step 5: Verify full build**

```bash
npx next build
```

- [ ] **Step 6: Commit**

```bash
git add app/components/Hero.tsx app/components/NeedWeNoticed.tsx app/components/Values.tsx
git commit -m "feat: migrate Hero, NeedWeNoticed, Values to content-collections"
```

---

## Task 7: Migrate DeeperContext

**Files:**
- Modify: `app/components/DeeperContext.tsx`

- [ ] **Step 1: Migrate DeeperContext.tsx**

```typescript
import { allDeeperContexts } from "content-collections";
import { renderRichText } from "../lib/rich-text";
const content = allDeeperContexts[0];
```

Replace:
- Section heading and subheading
- All 4 beat labels
- All beat paragraphs (each paragraph rendered with `renderRichText()`)

The component structure (AnimatedBeat wrappers, grid layout, progress line) stays unchanged. Only the text content moves to JSON.

- [ ] **Step 2: Verify build**

```bash
npx next build
```

- [ ] **Step 3: Commit**

```bash
git add app/components/DeeperContext.tsx
git commit -m "feat: migrate DeeperContext to content-collections"
```

---

## Task 8: Migrate Storytelling (most complex)

**Files:**
- Modify: `app/components/Storytelling.tsx`

This is the highest-risk task. The component is 1,310 lines with interleaved scroll animation logic. Only content strings change -- component structure is untouched.

- [ ] **Step 1: Import content**

```typescript
import { allStorytellings } from "content-collections";
import { renderRichText } from "../lib/rich-text";
import { getIcon } from "../lib/icon-map";
const content = allStorytellings[0];
```

- [ ] **Step 2: Migrate intro panel (Panel 0)**

Replace hardcoded heading with structured fields:
- `content.intro.headingPrefix` + animated `content.intro.headingAnimatedWord` + `content.intro.headingSuffix`
- `renderRichText(content.intro.subtitle)` for subtitle
- `content.intro.scrollLabel` for scroll cue

- [ ] **Step 3: Migrate desktop content panels (Panels 1-3)**

For each of the 3 `ContentPanel` calls, replace inline JSX content props with:
```typescript
const panel = content.panels[0]; // teams
// icon={<Users ... />} becomes icon={getIcon(panel.icon)} rendered inline
// label={panel.label}
// title={panel.title}
// description={renderRichText(panel.description)}
// secondaryDescription={renderRichText(panel.secondaryDescription)}
// details={renderRichText(panel.details)}
// items={panel.items.map((item, i) => <React.Fragment key={i}>{renderRichText(item)}</React.Fragment>)}
// quote={panel.quote}
```

- [ ] **Step 4: Migrate mobile content panels**

Same content, same approach. The 3 `ContentPanelMobile` calls use the same `content.panels` array.

- [ ] **Step 5: Migrate ecosystem panel (Panel 4)**

Desktop `EcosystemPanel`: use `content.ecosystem.heading`, `renderRichText(content.ecosystem.description)`.

Mobile ecosystem footer: use `content.ecosystem` heading, description, and `content.ecosystem.nodes` for the triangle labels/colors/icons.

- [ ] **Step 6: Migrate progress rail labels**

Replace hardcoded `labels` array with `content.progressLabels`.

- [ ] **Step 7: Verify build**

```bash
npx next build
```

**Critical:** If build fails, check for JSX fragment issues in renderRichText output passed as component props. The `ContentPanel` and `ContentPanelMobile` components expect `React.ReactNode` for description/details/items.

- [ ] **Step 8: Commit**

```bash
git add app/components/Storytelling.tsx
git commit -m "feat: migrate Storytelling to content-collections"
```

---

## Task 9: Migrate Testimonials

**Files:**
- Modify: `app/components/Testimonials.tsx`

- [ ] **Step 1: Migrate Testimonials.tsx**

```typescript
import { allTestimonials } from "content-collections";
const content = allTestimonials[0];
```

Replace:
- Section label and title (currently from `site-content.ts`)
- Testimonials list (currently from `site-content.ts`)
- "Read full testimonial" / "Show less" button text

Remove imports from `site-content.ts`.

- [ ] **Step 2: Verify build**

```bash
npx next build
```

- [ ] **Step 3: Commit**

```bash
git add app/components/Testimonials.tsx
git commit -m "feat: migrate Testimonials to content-collections"
```

---

## Task 10: Delete site-content.ts + cleanup

**Files:**
- Delete: `app/lib/site-content.ts`
- Modify: `CLAUDE.md` (update content location reference)

- [ ] **Step 1: Verify no remaining imports of site-content.ts**

```bash
grep -r "site-content" app/ --include="*.tsx" --include="*.ts"
```

Expected: Zero results. If any remain, migrate them first.

- [ ] **Step 2: Delete site-content.ts**

```bash
rm app/lib/site-content.ts
```

- [ ] **Step 3: Update CLAUDE.md**

Change the Content line in the Tech Stack section:
```
OLD: - **Content**: Centralized in `app/lib/site-content.ts` — edit content there, not in components
NEW: - **Content**: Centralized in `content/*.json` files, validated by `content-collections`. Edit content in `content/` directory, not in components. See `content-collections.ts` for schemas.
```

- [ ] **Step 4: Verify final build**

```bash
npx tsc --noEmit && npx next lint && npx next build
```

Expected: All three pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: delete site-content.ts, update CLAUDE.md for content-collections"
```

---

## Task 11: Final verification

- [ ] **Step 1: Run Playwright tests**

```bash
npm run dev -- --port 4000 &
npx playwright test
```

Expected: All existing tests pass without modification.

- [ ] **Step 2: Visual spot-check**

Open `http://localhost:4000` and scroll through the entire page. Verify:
- Hero tagline "relationships" word still animates color
- NeedWeNoticed bold phrases render correctly
- Storytelling panels all display content (mobile + desktop)
- DeeperContext beats show with strategic bolding
- Values cards have correct icons and formatted descriptions
- Contact form labels and success messages display
- Footer links, tagline, and copyright render
- Testimonials expand/collapse works

- [ ] **Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: post-migration visual fixes"
```
