---
name: setup-project
description: Guides one-time setup of a new project generated from the Sane-Svelstro Tinderbox boilerplate — deciding whether to keep Shopify, running the strip script, wiring Sanity and Astro env vars, and deploying the production + preview Cloudflare Workers. Use when starting a new project from this boilerplate, when the user asks to remove or strip Shopify / e-commerce, when configuring PUBLIC_BUILD_MODE or the Sanity Presentation preview URL, or when setting up the two Cloudflare Worker deployments.
---

# New project setup

Run once, on a fresh clone, before building anything. Steps 1–2 are hard to reverse
later, so do them first.

## 1. Decide on Shopify — do this first

First check whether it is still available:

```bash
grep -q "strip:shopify" package.json && echo "available" || echo "already stripped"
```

If **already stripped**, skip to step 2 — the script removes itself after running.

Otherwise ask the user whether the project needs e-commerce. Do not guess, and do not
run the strip without an explicit answer.

**No e-commerce** → strip it now, while the tree is untouched:

```bash
pnpm strip:shopify:dry   # review what will be removed
pnpm strip:shopify       # apply
```

This deletes ~34 files, edits ~20, asserts that no Shopify reference survives, reinstalls,
reformats, then deletes itself. It is **one-way** — there is no unstrip. If the user is
unsure, leave it in; stripping later still works, just less cleanly once their own code is
interleaved.

**Yes, e-commerce** → skip. Shopify ships enabled; there is no runtime feature flag.

If the strip aborts with `✗ N Shopify reference(s) survived`, that is a *missing marker*,
not a script bug. Run `git checkout .` to undo, add the appropriate marker to the offending
source (see the header comment of `scripts/strip-shopify.mjs` for the marker syntax), then
re-run. Never edit the script to special-case a path.

## 2. Sanity project

```bash
cd sanity && cp .env.example .env
```

Create a project at [sanity.io/manage](https://sanity.io/manage), then set
`SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. `sanity/.env` is gitignored —
never commit it.

## 3. Astro env

```bash
cd astro && cp .env.example .env
```

| Variable | Notes |
| --- | --- |
| `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET` | Must match the Studio |
| `SANITY_TOKEN` | Required for preview builds — `drafts` needs auth |
| `PUBLIC_SITE_URL` | Canonical URL; feeds sitemap + canonical tags |
| `PUBLIC_BUILD_MODE` | Leave `production` locally |

## 4. Rename the Workers

Both wrangler configs still carry the boilerplate name. Set `name` in
`astro/wrangler.jsonc` (production) and `astro/wrangler.preview.jsonc` (preview) to
something project-specific, keeping the `-preview` suffix on the second.

## 5. Verify locally

```bash
cd astro  && pnpm build && pnpm build:preview
cd sanity && pnpm build
```

The preview build logs `getStaticPaths() ignored in dynamic page …` once per dynamic
route. That is expected — the same page files serve both modes.

Note: `astro check` currently fails repo-wide (TypeScript 7 does not expose the API the
Astro language server needs). The builds are the effective typecheck.

## 6. Deploy

Two Workers from the one branch. See [REFERENCE.md](REFERENCE.md) for the full
walkthrough, including the **Cloudflare Access policy that must be in place before the
preview Worker goes live** — it serves unpublished drafts.
