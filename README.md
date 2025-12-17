# PALcares Website - Content-Aligned Update

## What Changed in This Update

### Content Alignment
All content has been aligned with the original PALcares content guide, including:

- **Hero**: Updated treaty language to factual format: "Serving Calgary (Treaty 7) and Edmonton (Treaty 6)"
- **MeetingYouWhereYouAre**: Now centered, more prominent, with decorative background elements
- **DeeperContext**: New alternating timeline layout from Figma design
- **Testimonials**: Placeholders for real partner testimonials (Reach, 24-7 Crisis Diversion)
- **Footer**: Updated treaty language format

### Design Updates
- MeetingYouWhereYouAre section now has centered layout with label badge
- DeeperContext uses alternating left/right cards with center timeline
- Subtle background orbs and decorative elements added

### Terminology
- "2-4 year partnerships" → "multi-year partnerships" throughout
- "Treaty 6 & 7 communities" → "Calgary (Treaty 7) and Edmonton (Treaty 6)"

## Installation

```bash
npm install
npm run dev
```

## File Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Homepage composition
├── globals.scss            # Global styles
├── components/
│   ├── Hero.tsx            # Hero with updated treaty language
│   ├── Storytelling.tsx    # Scroll-jacking ecosystem panels
│   ├── MeetingYouWhereYouAre.tsx  # New centered design
│   ├── DeeperContext.tsx   # Alternating timeline design
│   ├── Values.tsx          # Values grid
│   ├── Testimonials.tsx    # Placeholder testimonials
│   ├── Contact.tsx         # Contact form
│   ├── Footer.tsx          # Updated footer
│   ├── Header.tsx          # Navigation
│   └── partials/
│       └── Loader.tsx      # Word animation loader
```

## Content Guide Alignment

This update addresses the content audit recommendations:

✅ Treaty language factual and parenthetical
✅ "Meeting You Where You Are" section prominent
✅ Testimonials as placeholders (not fake)
✅ Footer with full serving/creating/focus content
✅ DeeperContext with Indigenous data sovereignty context

## Todo (Requires Real Content)

- [ ] Get real testimonials from Reach, 24-7 Crisis Diversion
- [ ] Add Waterloo student story quote (when available)
- [ ] Add partner photos/logos
