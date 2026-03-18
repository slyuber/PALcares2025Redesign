# Content Centralization Design Spec

**Date:** 2026-03-17
**Status:** Draft (Rev 2 -- post spec review)
**Dependency approval:** User approved `content-collections` packages on 2026-03-17
**Goal:** Extract all hardcoded content from components into structured, schema-validated content files that non-technical editors can safely modify, with an upgrade path to a visual CMS.

---

## Problem Statement

~95% of user-visible content is hardcoded directly in 10 component files. Only ~8 items live in the existing `app/lib/site-content.ts`. This makes content editing error-prone (editors must touch TSX/JSX), prevents non-technical editors from updating copy, and violates separation of concerns.

## Decision: `content-collections` + Structured Content Files

### Why This Approach

| Criterion | Decision |
|---|---|
| **Battle-tested?** | Yes -- used by Vercel's next-forge template, Dub.co, shadcn/ui |
| **Open source?** | Yes -- MIT license |
| **Free?** | Yes -- no hosted service, no paid tier |
| **Works with `output: 'export'`?** | Yes -- resolves content at build time, zero runtime |
| **Handles rich text?** | Yes -- JSON with lightweight markup convention for bold, emphasis |
| **Non-technical editor friendly?** | Editors modify JSON files (no TSX syntax) |
| **Upgrade path to visual CMS?** | TinaCMS or Decap bolt on to the same content files |
| **Vendor lock-in?** | Zero -- content is files in your git repo |

### What Was Rejected and Why

- **Decap CMS**: Zero presence in premium site ecosystem, adds auth complexity, volunteer-maintained. The admin panel is a bolt-on for later if needed.
- **Sanity**: Broken with `output: 'export'` by default (GitHub issue #1899). Overkill for a single-page site.
- **Storyblok**: 1-user free tier, $99/month for additional editors. Dealbreaker.
- **Contentful**: Free tier shrinking, $489/month paid. Proprietary rich text AST. Risky trajectory.
- **Prismic**: Most used among Awwwards winners, but not open source. Good fallback if CMS is ever needed.
- **Plain JSON (without content-collections)**: No schema validation, no build-time error catching, manual import wiring.

---

## Architecture

### Content File Structure

```
content/
  hero.json                # Hero tagline, buttons, description
  need-we-noticed.json     # Section label, headline, body copy
  storytelling.json        # All 3 panels + intro + ecosystem summary
  deeper-context.json      # Section header + 4 beats
  values.json              # Section header + 4 value cards
  contact.json             # Labels, headings, form labels, success messages
  footer.json              # Brand text, links, newsletter labels
  testimonials.json        # Section header + testimonials array
  navigation.json          # Nav items, drawer items, CTA labels
  meta.json                # Site title, descriptions, OG tags
  global.json              # Support email, shared strings
  loader.json              # Loader animation words
```

Each file is its own `content-collections` collection with its own Zod schema. This avoids the single-collection-heterogeneous-schema problem -- every file type gets strict, specific validation.

### Why JSON, Not YAML or MDX

**Critical finding from spec review:** `content-collections` is built for Markdown/MDX and JSON files. It does not have built-in YAML parsing. YAML would require a custom parser or a pre-processing build step -- unnecessary complexity.

**Why JSON over MDX:**
PALcares content is structured data with inline emphasis, not free-form prose. It's consumed by complex animation components (Framer Motion wrappers, scroll-linked panels). MDX is overkill for this -- JSON with a lightweight rich-text convention is simpler and more editor-friendly.

**File format:** `.json` with a rich-text markup convention for formatted strings. All content files live in `content/` and are validated by Zod schemas at build time.

> **Implementation gate:** Before committing to the full migration, build a proof-of-concept with one JSON file, one collection, and `output: 'export'` to verify `content-collections` + Next.js 15 compatibility.

### Rich Text Convention

The codebase uses **four distinct** inline formatting patterns. All four must be preserved exactly for pixel-identical output.

#### The Four Patterns

| Convention | Renders as | CSS classes | Used for |
|---|---|---|---|
| `**bold text**` | `<strong>` | `font-semibold text-[#5C306C]` | Key phrases in prose (most common) |
| `{{word}}` | `<span>` | `font-semibold text-[#FF9966]` | Brand names: Teams, Research, Labs (orange) |
| `__medium text__` | `<span>` | `font-medium text-[#5C306C]` | Lighter emphasis with explicit color |
| `{_context text_}` | `<span>` | `font-medium` (inherits parent color) | Contextual emphasis that inherits parent opacity |

Example in a JSON content file:
```json
{
  "description": "We **inherit whatever you have**. That Excel sheet from 2008 holds years of **institutional knowledge**.",
  "brandRef": "PAL {{Teams}} embeds technical teams directly within partner organizations.",
  "lighter": "When __trust and technology develop together__, what emerges fits.",
  "contextual": "Working with community has taught us what matters. {_Nonprofit structure, multi-year agreements, open licensing, relationship-centered contracts_}."
}
```

Additional conventions:
- `--` between word characters --> `&mdash;` (em-dash). Standalone `--` is left as-is.
- Apostrophes can be typed naturally (`'`) -- no `&apos;` escaping needed in JSON values.

A single `renderRichText(text: string): React.ReactNode` utility in `app/lib/rich-text.tsx` handles all conversions. Components never parse formatting themselves.

#### Content That Cannot Use `renderRichText()`

Some content is interleaved with animation state and requires component-level rendering:

1. **Hero tagline** -- The word "relationships" has its own independent scroll-linked color animation. The tagline structure (`line1` / `emphasisPrefix` / `emphasisWord` / `line2`) must be consumed as individual fields, not as a single rich-text string.
2. **Storytelling intro heading** -- "An {{ecosystem}} in three parts" has scroll-linked color and letter-spacing animation on the word "ecosystem". The heading is split into `prefix`, `animatedWord`, `suffix` fields.

These components consume structured fields directly. The spec marks them explicitly in the content schemas below.

### Schema Validation

Each JSON file gets its own collection with a dedicated Zod schema in `content-collections.ts`. Example:

```typescript
// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";

const hero = defineCollection({
  name: "hero",
  directory: "content",
  include: "hero.json",
  schema: (z) => ({
    tagline: z.object({
      line1: z.string(),
      emphasisPrefix: z.string(),
      emphasisWord: z.string(),
      line2: z.string(),
    }),
    description: z.string(),
    location: z.string(),
    buttonPrimary: z.string(),
    buttonSecondary: z.string(),
    scrollLabel: z.string(),
  }),
});

const testimonials = defineCollection({
  name: "testimonials",
  directory: "content",
  include: "testimonials.json",
  schema: (z) => ({
    label: z.string(),
    title: z.string(),
    items: z.array(z.object({
      pullQuote: z.string(),
      fullTestimonial: z.array(z.string()),
      author: z.string(),
      role: z.string(),
      org: z.string(),
    })),
  }),
});

// ... one collection per content file
```

Build-time validation means: if a non-technical editor deletes a required field or breaks JSON syntax, the build fails with a clear error message pointing to the exact file and field.

### Next.js Config Integration

The `content-collections` Next.js plugin requires wrapping `next.config.ts`. This must compose with the existing `withBundleAnalyzer`:

```typescript
// next.config.ts
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = { /* ... existing config ... */ };

export default withContentCollections(withBundleAnalyzer(nextConfig));
```

---

## Content Inventory & Extraction Plan

### Tier 1: Easy (Plain strings, flat structure)

**Footer** (`content/footer.json`)
```json
{
  "brandDescription": "Embedded technology partnerships for Alberta's social services.",
  "location": "Serving Calgary, Edmonton & Rural Alberta",
  "tagline": "Open tools \u00b7 Shared resources \u00b7 Local expertise",
  "motto": "Genuine partnerships, not transactions.",
  "quickLinksLabel": "Quick Links",
  "links": [
    { "name": "What We Do", "href": "#storytelling" },
    { "name": "Our Values", "href": "#values" },
    { "name": "Partner Stories", "href": "#testimonials" },
    { "name": "Contact", "href": "#contact" }
  ],
  "stayUpdatedLabel": "Stay Updated",
  "subscribedMessage": "Thanks for subscribing!",
  "subscribeButton": "Subscribe",
  "emailPlaceholder": "Your email",
  "copyrightEntity": "PALcares (Perseverance Analytics Ltd.)",
  "privacyLink": "Privacy",
  "termsLink": "Terms"
}
```

**Contact** (`content/contact.json`)
```json
{
  "label": "Let's Connect",
  "heading": "We engage with organizations in different ways",
  "intro": "Whatever brought you here--a specific challenge, a question about fit, or just curiosity about what we do--we're glad to talk.",
  "location": "Calgary, Edmonton, and Rural Alberta",
  "form": {
    "firstName": "First Name",
    "lastName": "Last Name",
    "email": "Email",
    "organization": "Organization",
    "organizationNote": "(optional)",
    "message": "How can we help?",
    "messagePlaceholder": "Tell us about your organization and what you're looking for...",
    "submitButton": "Send Message",
    "submittingButton": "Sending..."
  },
  "success": {
    "heading": "Message Sent",
    "message": "We'll be in touch soon.",
    "resetLink": "Send another message"
  }
}
```

**Navigation** (`content/navigation.json`) -- Component derives `drawerItems` by prepending "Top" and appending "Contact Us" to `navItems`.
```json
{
  "navItems": [
    { "id": "where-we-started", "label": "Our Story" },
    {
      "id": "storytelling",
      "label": "How We Work",
      "submenu": [
        { "id": "storytelling", "label": "Teams", "scrollOffset": 0.2 },
        { "id": "storytelling", "label": "Research", "scrollOffset": 0.4 },
        { "id": "storytelling", "label": "Labs", "scrollOffset": 0.6 }
      ]
    },
    { "id": "context", "label": "Our Approach" },
    { "id": "values", "label": "Values" },
    { "id": "testimonials", "label": "Partners" }
  ],
  "drawerTopLabel": "Top",
  "drawerContactLabel": "Contact Us",
  "ctaLabel": "Get in Touch"
}
```

**Meta** (`content/meta.json`)
```json
{
  "title": "PALcares | Technology That Strengthens Relationships",
  "description": "PALcares embeds technical teams inside Alberta's social service organizations--building the infrastructure and processes that let technology change with the work.",
  "ogDescription": "Embedded partnerships and open-source tools for Alberta's social sector.",
  "siteName": "PALcares",
  "locale": "en_CA",
  "url": "https://www.palcares.ca",
  "ogImage": {
    "path": "/image/pal-hero-bg-enhanced.png",
    "alt": "PALcares - Sustainable Technology Partnerships"
  }
}
```

**Global** (`content/global.json`)
```json
{
  "supportEmail": "support@palcares.ca"
}
```

**Loader** (`content/loader.json`)
```json
{
  "words": ["teams", "labs", "research", "cares"]
}
```

### Tier 2: Medium (Rich text with bold/emphasis)

**Hero** (`content/hero.json`) -- Note: tagline fields consumed directly, NOT via `renderRichText()`
```json
{
  "tagline": {
    "line1": "Technology that",
    "emphasisPrefix": "strengthens the",
    "emphasisWord": "relationships",
    "line2": "your work depends on"
  },
  "description": "We're not here to transform the sector--we're here to **support the organizations already doing transformative work**.",
  "location": "Supporting social service providers in __Calgary__, __Edmonton__, and __Rural Alberta__.",
  "buttonPrimary": "Start a Conversation",
  "buttonSecondary": "See How We Work",
  "scrollLabel": "Scroll"
}
```

**NeedWeNoticed** (`content/need-we-noticed.json`)
```json
{
  "label": "Where We Started",
  "headline": "We noticed a need in our communities.",
  "leftColumn": [
    "Across North America, organizations are questioning why technology that should serve communities often ends up extracting from them. We're part of this broader conversation, but **our focus is specific**.",
    "**Those closest to the work should shape the tools they use**. **What gets built should stay with the communities that helped create it**. **The people building the tools and the people using them should work side by side**.",
    "Working with community has taught us what matters. {_Nonprofit structure, multi-year agreements, open licensing, relationship-centered contracts_}. The kinds of decisions that keep the work accountable to the people it's for."
  ],
  "rightColumn": [
    "Our technical teams **learn how your organization works before jointly deciding with you what to build**. Students and newcomers develop skills through supervised placements with real scope. Solutions that prove themselves get released openly--**the patterns, not your data**.",
    "**Sustainable technology starts with trust.**"
  ]
}
```

**Values** (`content/values.json`)
```json
{
  "label": "What Guides Us",
  "heading": "What We Believe",
  "cards": [
    {
      "title": "Trust as Infrastructure",
      "icon": "HeartHandshake",
      "color": "#E07B4C",
      "description": "Good technology can't be separated from the relationships that create it. We don't finish understanding your organization and then start building--**the building is part of the understanding**. The small fixes, the documentation, the patient learning alongside your team. That IS the technical work. When {_trust and technology develop together_}, what emerges fits how your organization operates."
    },
    {
      "title": "Community Ownership",
      "icon": "ShieldCheck",
      "color": "#8FAE8B",
      "description": "What we build together comes from your organization's knowledge and the communities you serve. It shouldn't be locked in proprietary systems or sold back to you. **Tools shaped by community expertise belong to the people who shaped them**, to use, change, and share freely. That's not a philosophy we apply at the end of an engagement. It's built into how we license what we create."
    },
    {
      "title": "Data Sovereignty",
      "icon": "Database",
      "color": "#5C306C",
      "description": "Indigenous-led movements, including {_OCAP principles_} here in Alberta, have shown that data about communities should be governed by those communities. We're learning from that leadership. The data your organization holds isn't really organizational data--it's data about the people you serve. When organizations lose control of it through vendor lock-in or proprietary systems, they lose the ability to tell their own stories and advocate on their own terms. Where we inherit systems that don't yet support data portability, moving toward it is part of the work. **Your data stays yours.** That's the goal, and when it isn't the current state, it's what we're building toward."
    },
    {
      "title": "Building Capacity, Not Dependency",
      "icon": "Sprout",
      "color": "#FF9966",
      "description": "We don't aim to stay forever. The goal is an organization that understands its own systems, has staff who can maintain and adapt them, and isn't dependent on us to keep the lights on. Part of how we get there is helping staff develop a working sense of what kinds of changes are quick and cheap versus what touches something structural. That calibration is what makes feedback useful and makes the organization more capable over time. Some organizations get there faster; some choose to keep us deeply involved. Either way, what we leave behind is real capability--not a finder's fee, a handshake, or dependency dressed up as partnership."
    }
  ]
}
```

### Tier 3: Complex (Deeply nested, rich text, duplicated across mobile/desktop)

**DeeperContext** (`content/deeper-context.json`) -- abbreviated for readability; full content preserved in implementation
```json
{
  "heading": "Our Approach",
  "subheading": "What makes partnership like this possible, and why it matters.",
  "beats": [
    {
      "label": "Meeting You Where You Are",
      "paragraphs": [
        "We **inherit whatever you have**. That Excel sheet from 2008 holds years of **institutional knowledge**. Those workarounds everyone relies on reveal where systems fall short. We learn from what's already working and what isn't--not from assumptions about what you need. When five organizations independently build similar solutions, {_that pattern tells us something the sector has been trying to say_}."
      ]
    },
    {
      "label": "Building Infrastructure Before Changing Systems",
      "paragraphs": [
        "Frontline staff know **complexity that never makes it into a requirements document**. That knowledge should shape technology development, but it only does if two things are true.",
        "First: **a relationship where feedback travels**. Staff tell you what isn't working when they trust it won't create problems and believe something will happen as a result.",
        "Second, and harder: **the infrastructure to act on that feedback safely**. We start with smaller, lower-stakes work. Not to delay, but because that's where surprises surface, and catching them early gives us room to respond. By the time we're touching the systems that matter most, we've already learned how this organization's environment behaves.",
        "That's the sequence. **Relationship first, infrastructure second**. Both have to exist before feedback does anything useful."
      ]
    },
    {
      "label": "What Time Makes Possible",
      "paragraphs": ["(3 paragraphs -- see component for full text)"]
    },
    {
      "label": "When Plans Change",
      "paragraphs": ["(3 paragraphs -- see component for full text)"]
    }
  ]
}
```

**Storytelling** (`content/storytelling.json`) -- the most complex; abbreviated, showing structure:

Note: The intro heading uses structured fields (NOT `renderRichText()`) because "ecosystem" has scroll-linked animation.
```json
{
  "intro": {
    "headingPrefix": "An",
    "headingAnimatedWord": "ecosystem",
    "headingSuffix": "in three parts",
    "subtitle": "Not three separate services. **One approach** where each part **strengthens the others**.",
    "scrollLabel": "Scroll"
  },
  "panels": [
    {
      "id": "teams",
      "icon": "Users",
      "label": "Embedded Partnerships",
      "title": "PAL Teams",
      "description": "PAL {{Teams}} embeds technical teams directly within partner organizations for **multi-year partnerships**--building the relationships, processes, and infrastructure that let frontline expertise guide technology development.",
      "secondaryDescription": "(full text in implementation)",
      "details": "(full text in implementation)",
      "items": [
        "**Multi-year partnerships** that give time to build relationships, processes, and real understanding",
        "**Contracts structured for flexibility,** so roadblocks become problems to solve, not threats to the project",
        "**Infrastructure built to make changes cheaper, faster,** and lower-risk over time"
      ],
      "quote": "Once shared understanding and working processes are in place, iteration becomes affordable and quick. That tweak to a report? A five-minute conversation, not a new statement of work."
    },
    { "id": "research", "icon": "BookOpen", "label": "Shared Solutions", "title": "PAL Research", "...": "same structure" },
    { "id": "labs", "icon": "Sprout", "label": "Building Local Capacity", "title": "PAL Labs", "...": "same structure" }
  ],
  "ecosystem": {
    "heading": "How It Connects",
    "description": "**Each part sustains the others.** {{Teams}} does the foundational work--learning your organization, building __processes and tools__. {{Research}} generalizes what survives __daily use__ and releases it under open license. {{Labs}} builds on that foundation to __grow local expertise__.",
    "nodes": [
      { "label": "Research", "sublabel": "Generalizes & shares", "icon": "BookOpen", "color": "#7388e0" },
      { "label": "Teams", "sublabel": "Foundational work", "icon": "Users", "color": "#ea5dff" },
      { "label": "Labs", "sublabel": "Extends capacity", "icon": "FlaskConical", "color": "#FF9966" }
    ]
  },
  "progressLabels": ["Intro", "Teams", "Research", "Labs", "How It Connects"]
}
```

Note: The ecosystem visual uses **different icons and colors** from the content panels (e.g., Labs uses `FlaskConical` in the triangle but `Sprout` in the panel). This is intentional design -- the nodes and the panels are separate visual contexts.

**Testimonials** (`content/testimonials.json`) -- includes section header + all testimonials in one file
```json
{
  "label": "Partner Voices",
  "title": "Organizations We Work With",
  "readMoreLabel": "Read full testimonial",
  "showLessLabel": "Show less",
  "items": [
    {
      "pullQuote": "I often refer to PALcares as a \u201cunicorn.\u201d It is rare to find a team that genuinely understands the nonprofit sector...",
      "fullTestimonial": [
        "Working alongside PALcares has been an exceptional experience for our 24/7 Crisis Diversion program.",
        "From the very beginning, Sasha and the team took the time to truly understand our initiative..."
      ],
      "author": "Claire MacDonald",
      "role": "Program Manager, 24/7 Crisis Diversion",
      "org": "REACH Edmonton Council for Safe Communities"
    }
  ]
}
```

---

## Key Design Decisions

### 1. Content is duplicated in Storytelling -- by design

The Storytelling component renders identical content for both mobile (`ContentPanelMobile`) and desktop (`ContentPanel`). After extraction, both read from the **same** `storytelling.json` data. This eliminates the current duplication where content is copy-pasted across mobile and desktop markup.

### 2. Icon references are strings, resolved in components

JSON stores `"icon": "Users"`, the component maps `"Users"` --> the Lucide React icon. This keeps JSON clean and avoids importing React components in content files.

### 3. `renderRichText()` is a single utility

All rich-text rendering goes through one function: `app/lib/rich-text.tsx`. Components never parse `**bold**` or `{{emphasis}}` themselves. This guarantees consistent styling across the site.

### 4. The existing `site-content.ts` is replaced, not extended

The current `site-content.ts` has only ~8 items. Rather than maintaining two content systems (TS + JSON), we migrate everything to JSON and delete `site-content.ts`. Components import from content-collections.

### 5. `content-collections` is the only new dependency

```
@content-collections/core
@content-collections/next
```

Both are build-time only. No runtime cost. No hosted service.

### 6. Ecosystem visual uses distinct icons/colors from panels

The triangle diagram uses `FlaskConical` (blue) for Labs while content panels use `Sprout` (orange). These are intentionally different visual contexts. The JSON stores both: panel `icon` on each panel object, ecosystem node `icon`/`color` on each node object.

### 7. `aria-label` attributes that describe section content are extracted

Any `aria-label` that repeats or paraphrases section content (e.g., "Our foundational values") should be derived from the content file. Layout-structural `aria-label`s like "Navigation menu" or "Close menu" remain hardcoded.

### 8. CLAUDE.md must be updated post-migration

The current CLAUDE.md says: "Content: Centralized in `app/lib/site-content.ts`". This must be updated to reference the `content/` directory and `content-collections` after migration is complete.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Rich text rendering doesn't match current JSX exactly | Medium | Medium | Pixel-comparison testing of before/after for each section. Four distinct patterns documented. |
| Storytelling scroll mechanics break during refactor | Low | High | Content extraction only -- component structure unchanged |
| JSON syntax errors from editors | Medium | Low | Zod schema validation catches at build time with clear error messages |
| `content-collections` + Next.js 15 + `output: 'export'` | Medium | High | **Implementation gate:** proof-of-concept with one JSON file before full migration |
| Hero tagline / Storytelling intro animation breaks | Medium | High | These use structured fields consumed directly, not `renderRichText()`. Tested independently. |

---

## Out of Scope

- Adding a visual CMS admin panel (future phase)
- Changing any component's visual design or animation behavior
- Restructuring component files
- Adding MDX (JSON + `renderRichText` is sufficient for this content structure)
- Updating CLAUDE.md content location reference (done as a final step after migration)

---

## Success Criteria

1. Zero hardcoded user-visible text in component files (except layout-structural `aria-label`s like "Navigation menu")
2. All content lives in `content/` directory as JSON files
3. Zod schemas validate every content file at build time
4. A non-technical editor can modify text by editing a JSON file on GitHub.com
5. The site renders pixel-identical before and after extraction (all four rich text patterns preserved)
6. Build passes (`tsc --noEmit`, `next lint`, `next build`)
7. Existing Playwright tests pass without modification
8. `content-collections` proof-of-concept passes before full migration begins
