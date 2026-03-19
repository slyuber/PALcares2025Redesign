# Decap CMS Integration Design Spec

**Date:** 2026-03-18
**Status:** Approved
**Goal:** Add a browser-based admin panel at `/admin` for editing site content via Decap CMS, using GitHub PKCE auth (no proxy server needed).

---

## What Gets Added

Two static files in `public/admin/`:
- `index.html` — loads Decap CMS from CDN
- `config.yml` — maps the 12 `content/*.json` files to editor form fields

## Auth

- GitHub OAuth App with PKCE flow (client-side only, no server secret)
- One-time setup: create OAuth App at github.com/settings/developers
- Callback URL: `https://<site-domain>/admin/`
- Client ID goes in `config.yml`
- Single user (repo owner) — no team/role management needed

## Content Mapping

Each `content/*.json` file becomes a Decap "file" collection. Decap reads/writes the JSON files directly in the git repo.

| JSON File | Decap Collection | Widget Types |
|---|---|---|
| `global.json` | Global Settings | string |
| `meta.json` | SEO & Meta | string, object |
| `hero.json` | Hero Section | string (tagline fields), string (rich text) |
| `need-we-noticed.json` | Where We Started | string, list of strings (rich text) |
| `storytelling.json` | How We Work | object list (panels), nested objects |
| `deeper-context.json` | Our Approach | object list (beats with paragraph lists) |
| `values.json` | Values | object list (cards) |
| `testimonials.json` | Testimonials | object list (testimonial items) |
| `contact.json` | Contact | string, nested objects |
| `footer.json` | Footer | nested objects |
| `navigation.json` | Navigation | object list (nav items) |
| `loader.json` | Loader | list of strings |

## Rich Text Convention

Editors type the markup conventions directly in string fields:
- `**bold text**` for emphasis
- `{{Teams}}` for brand orange
- `--` for em-dash

This is simple enough for a single technical editor. No WYSIWYG needed.

## What Does NOT Change

- The `content/*.json` file structure
- The `content-collections.ts` schemas
- Any component code
- The build pipeline
- The Vercel deployment

## Constraints

- No new npm dependencies (Decap loads from CDN)
- No server-side code (PKCE auth is client-only)
- Only files in `public/admin/` are added
- The admin panel is a static page — works with `output: 'export'`

## Success Criteria

1. `yoursite.com/admin` loads the Decap CMS editor
2. GitHub OAuth login works via PKCE
3. All 12 content files are editable via form fields
4. Saving a change commits to the repo
5. Vercel auto-deploys from the commit
6. Build still passes (`next build`)
