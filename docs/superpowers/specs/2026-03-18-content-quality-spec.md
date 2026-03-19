# Content Quality Spec

**Date:** 2026-03-18
**Status:** Draft for review (Rev 2 — post spec review)
**Goal:** Fix all confirmed content issues from 3-agent editorial review.

---

## Approved — Do NOT Change

- **"Genuine partnerships, not transactions."** (footer) — Values statement, not competitive positioning.
- **"We're not here to transform the sector--we're here to support the organizations already doing transformative work."** (hero) — Humble deflation. Keep the em dash here (it's earned).
- **Testimonials content** — Client's own words. Exempt from all editorial rules.
- **Data Sovereignty and Building Capacity values cards** — Original versions preferred. Do not rewrite without asking.
- **"When five organizations independently build similar solutions"** (need-we-noticed) — Sector reference, not reader address.

---

## Em Dashes: Reduce from 22 to fewer than 5

**Rule:** Fewer than 5 total across all content. Each must be deliberately chosen for impact.

### Current count (22 total):

| File | Count | Instances |
|---|---|---|
| `hero.json` | 1 | "sector--we're here" (KEEP — approved line) |
| `contact.json` | 2 | "brought you here--a specific" (x2 in description) |
| `meta.json` | 1 | "organizations--building" |
| `need-we-noticed.json` | 1 | "released openly--the patterns" |
| `storytelling.json` | 11 | Across all 3 panels + ecosystem |
| `deeper-context.json` | 6 | Across beats 3 + 4 (includes paired "--and it will--") |

### Kept (up to 4):
1. `hero.json` — "sector--we're here" (approved)
2. TBD — user picks up to 3 more that earn their place

### Removed (18+):
All others replaced with periods, commas, or restructured sentences.

---

## "organization(s)" → "you/your" (14 fix candidates)

Replace where addressing the reader. Keep where referring to third parties.

### Fix:

| File | Current | Fix |
|---|---|---|
| `contact.json` | "We engage with organizations" | "There are a few ways we can work together" |
| `contact.json` | "Tell us about your organization" | "Tell us what you're working on" |
| `meta.json` | "social service organizations--building" | "social services, building" |
| `storytelling.json` | "inside the organization long enough" | "embedded long enough" |
| `storytelling.json` | "connecting students and newcomers to organizations" | "connecting students and newcomers to partners like you" |
| `storytelling.json` | "organizations don't pay for it" | "you don't pay for it" |
| `storytelling.json` | "Organizations know their investment" | "You know your investment" |
| `storytelling.json` | "learning your organization" (ecosystem) | "learning how you work" |
| `storytelling.json` | "no financial cost to the receiving organization" | "no financial cost to you" |
| `deeper-context.json` | "this organization's environment" | "your environment" |
| `testimonials.json` | "Organizations We Work With" (title) | "Who We Work With" |
| `need-we-noticed.json` | "your organization works" | "how you work" |
| `values.json` | "your organization holds" | "you hold" |
| `values.json` | "organizational data" | "yours" |

### Keep as-is (sector references):
- `hero.json` — "organizations already doing transformative work"
- `need-we-noticed.json` — "organizations are questioning"
- `storytelling.json` — "partner organizations", "The organizations we work with", "larger organizations help build, smaller organizations"
- `testimonials.json` — inside client testimonial (not editable)
- `deeper-context.json` — "five organizations independently build"

---

## Confirmed Issues — Need Rewrite (user approval required)

### 1. DeeperContext Beat 3: "What Time Makes Possible"
Three overlapping violations:
- **Self-congratulatory:** "Our structure buys us something most consultancies can't offer" — direct match to banned pattern
- **Anaphora:** "time. Time to... Time for..." — banned repetitive parallel
- **Em dashes:** 3 instances in this beat

*User has already rejected multiple rewrite attempts. Needs a fresh approach.*

### 2. Storytelling Teams Panel: "Some... Some... Some..."
**"Some have dedicated technical staff. Some have consultants. Some have systems..."**
*User flagged this. Previous rewrite was reverted. Needs fresh approach.*

### 3. DeeperContext Beat 4: Negation Density
3 negations: "doesn't go as planned", "doesn't always look like", "isn't looseness"
*Light edit needed — rephrase 2 of the 3 positively.*

### 4. Storytelling Labs Panel: Negation Density
3 negations in details field alone.
*Light edit needed.*

---

## Domain Issue (factual, not editorial)

| File | Current | Question |
|---|---|---|
| `global.json` | `support@palcares.ca` | Is `.ca` correct? Memory says domain was fixed to `.org` |
| `meta.json` | `https://www.palcares.ca` (x2) | Same question |

*User confirmed `.ca` is correct earlier in session.*

---

## Execution Order

0. Update voice profile (em dash rule: fewer than 5, not zero) — DONE
1. **Em dashes** — Remove 18+, keep up to 4. Mechanical.
2. **"organization(s)" swaps** — 14 instances. Mechanical with judgment.
3. **DeeperContext Beat 3 + Storytelling Teams** — Present rewrite options for approval.
4. **Negation cleanup** in DeeperContext Beat 4 + Labs. Light edits, present for approval.

---

## Success Criteria

1. Fewer than 5 em dashes total, each deliberately placed
2. "organization(s)" only used for third-party sector references
3. No "Some X. Some Y. Some Z." parallel structures
4. No self-congratulatory positioning against competitors
5. Max 1 negation per section (exception: Values Card 4, approved as-is with 4)
6. User approves all content changes before they're applied
