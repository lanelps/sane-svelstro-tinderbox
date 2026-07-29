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
| Redirects | `_redirects` written at build time | `src/middleware.ts`, per request |

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
- Middleware only runs per request in `preview`. A static build has no request to run it
  in, so anything request-shaped needs a build-time equivalent — redirects are the worked
  example: `astro/integrations/sanity-redirects.ts` bakes them into a `_redirects` file
  that Cloudflare serves at the edge, and the middleware short-circuits outside preview.
  Editors therefore see redirect changes immediately in preview, but only after a rebuild
  in production.

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

Generated files are the one exception — they cannot carry markers, so they are listed in
the script's `SKIP_PATHS`/`SKIP_EXT` instead. **Run `pnpm typegen` again after stripping**
to regenerate Shopify-free types.

<!-- #endregion shopify -->

## Sanity TypeGen

`cd sanity && pnpm typegen` extracts the schema to `sanity/schema.json` and generates
`astro/src/types/sanity.types.ts` — a `*QueryResult` type per exported GROQ query, plus a
type per schema document/object. Both are configured by `sanity/sanity-typegen.json`.

- **Re-run it after any schema or query change.** Nothing runs it automatically, so stale
  types are silent.
- Queries are only picked up when tagged with `` groq`…` `` and exported from
  `astro/src/utils/queires.ts`. That file imports its fragments with a **relative** path —
  typegen resolves modules from `sanity/` and cannot see astro's `@utils/*` alias.
- Prefer deriving hand-written types from the generated ones
  (`type SettingsData = NonNullable<SettingsQueryResult>`) over restating field shapes.
  `astro/src/types/seo.ts` shows the pattern.
- `schema.json` is gitignored; `sanity.types.ts` is committed so a fresh clone typechecks
  without Sanity credentials.
- Typegen prints a `prettier-plugin-astro` resolution warning when formatting its output.
  Harmless — the plugin lives in the astro workspace, and the generated file is already
  formatted.

## Project Setup & Deployment

For setting up a new project from this boilerplate — env wiring and the two-Worker
Cloudflare deployment, including the required Access policy on the preview Worker — use
the **`setup-project`** skill in `.claude/skills/setup-project/`.

## Known Repo Issues

- TypeScript is pinned to **6.x on purpose**. TypeScript 7 does not expose the programmatic
  API the Astro language server needs, which breaks `astro check` entirely. Do not bump it
  to 7 until Astro ships support.
- `astro/src/components/Seo.astro` fails Prettier (adjacent JSX without a fragment), so
  `pnpm format` exits non-zero. Pre-existing.
