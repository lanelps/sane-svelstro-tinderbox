# AI Coding Instructions

## Monorepo Overview

This project is a monorepo with two sub-projects:

- **`astro/`** — Astro 7 frontend, deployed to Cloudflare Workers. Uses Svelte 5 and Tailwind v4.
- **`sanity/`** — Sanity v6 Studio CMS. Drives all content for the Astro frontend.

## Sub-project Instructions

Load the relevant instructions based on the files you are working in:

- Working in `astro/` → read `./astro/CLAUDE.md`
- Working in `sanity/` → read `./sanity/CLAUDE.md`
- Working across both → read **both** files

## Cross-cutting Tasks

The following tasks always require changes in **both** sub-projects. Load both files before starting:

- Adding or modifying a **Section** (Sanity schema + Astro component)
- Adding or modifying a **document type** that the frontend queries
- Changing a **GROQ field** that has a corresponding TypeScript type in `astro/src/types/`

## Build Modes

This repo is a **single branch**. There are no per-variant branches — every configuration
axis is handled in-tree.

One env var, `PUBLIC_BUILD_MODE`, produces the two Cloudflare Worker deployments:

| | `production` (default) | `preview` |
| --- | --- | --- |
| Command | `pnpm build` | `pnpm build:preview` |
| Astro `output` | `static` (SSG) | `server` (SSR) |
| Sanity perspective | `published` | `drafts` |
| `<VisualEditing />` | excluded from bundle | rendered |

Both Workers build from `main`. The preview Worker exists only to back the Studio's
Presentation panel; production stays fully static.

Rules when touching this:

- Read the mode via `import.meta.env.PUBLIC_BUILD_MODE === "preview"`. Vite inlines it, so
  the unused branch is dead-code-eliminated — **do not** read it at runtime.
- Preview-only heavyweight imports must be **dynamic** (`await import(...)`), not static.
  A static import still emits the chunk into the production build even when the render is
  guarded. See `astro/src/layouts/Layout.astro`.
- Page files must work in **both** modes: keep `getStaticPaths` (used by SSG, ignored by
  SSR), read params as `Astro.params as QueryParams`, and guard with
  `if (!data) return Astro.redirect("/404")`.
- Never add `export const prerender`. `output` decides, in `astro.config.mjs`.

<!-- #region shopify -->

## Shopify Is Strippable

Shopify ships enabled and is removed per-project by `pnpm strip:shopify`. There is **no
runtime feature flag** — do not add one, and do not assume `shopifyConfig` gates anything.

**Any new Shopify-touching code must carry a strip marker**, or the strip will fail its
"no surviving reference" assertion. There are two markers — a whole-file one and a
region pair. Read the header comment of `scripts/strip-shopify.mjs` for their exact
spelling; it is the single source of truth and is deliberately not duplicated here.

Only the marker token is matched, not the comment syntax, so `//`, `<!-- -->`, `{/* */}`,
`#` and GROQ template-literal comments all work.

When Shopify code cannot be expressed as one contiguous region — a partial-line import, a
ternary, a spread inside a one-line array — **restructure the source** so it can. Existing
examples: the `specialStructures` record in `sanity/src/lib/desk.ts`, the multi-line
`types` array in `sanity/src/schemas/index.ts`, and the `ShopifyNavbar` extraction. Do not
add special cases to the strip script.

<!-- #endregion shopify -->

## Project Setup & Deployment

For setting up a new project from this boilerplate — env wiring and the two-Worker
Cloudflare deployment, including the required Access policy on the preview Worker — use
the **`setup-project`** skill in `.claude/skills/setup-project/`.

## Known Repo Issues

- `astro check` fails repo-wide: TypeScript 7 does not expose the programmatic API the
  Astro language server requires. Use `pnpm build` as the typecheck.
- `astro/src/components/Seo.astro` fails Prettier (adjacent JSX without a fragment), so
  `pnpm format` exits non-zero. Pre-existing.
