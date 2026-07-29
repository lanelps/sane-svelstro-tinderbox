# Sane-Svelstro Tinderbox

A full-stack monorepo boilerplate for building content-driven websites. It pairs a **Sanity v6** CMS studio with an **Astro 7** frontend deployed to **Cloudflare Workers**, using **Svelte 5** for interactive components and **Tailwind CSS v4** for styling.

---

## Tech Stack

| Layer                 | Technology                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Frontend              | [Astro 7](https://astro.build) — SSG on Cloudflare Workers (SSR opt-in per page)                                      |
| UI Components         | [Svelte 5](https://svelte.dev)                                                                                        |
| Styling               | [Tailwind CSS v4](https://tailwindcss.com)                                                                            |
| CMS                   | [Sanity v6](https://sanity.io)                                                                                        |
| Deployment            | [Cloudflare Workers](https://workers.cloudflare.com) via `@astrojs/cloudflare`                                        |
| State                 | [Nanostores](https://github.com/nanostores/nanostores)                                                                |
| Routing               | [Astro ClientRouter](https://docs.astro.build/en/guides/view-transitions/) (SPA-mode client-side navigation)          |
| Video                 | [Mux](https://mux.com) + [hls.js](https://github.com/video-dev/hls.js)                                                |

---

## Deployment Model

This boilerplate lives on a **single branch**. Everything is configured through build
mode and a one-time setup script, rather than through per-variant branches.

### Two Workers, one branch

A project deploys as two Cloudflare Workers, both built from `main`:

| | Production | Preview |
| --- | --- | --- |
| Build command | `pnpm build` | `pnpm build:preview` |
| `PUBLIC_BUILD_MODE` | `production` | `preview` |
| Astro `output` | `static` (SSG) | `server` (SSR) |
| Sanity perspective | `published` | `drafts` |
| `<VisualEditing />` | excluded from the bundle | rendered |
| Wrangler config | `wrangler.jsonc` | `wrangler.preview.jsonc` |
| Access | public | **Cloudflare Access** |

The preview Worker exists solely to back the Studio's Presentation tab — it is what
`SANITY_STUDIO_PREVIEW_URL` points at. Production stays fully static.

Cloudflare Workers Builds lets each Worker define its own build command, so both watch
`main` and neither needs a dedicated branch.

> **⚠️ Protect the preview Worker.** It serves unpublished draft content. Put a
> Zero Trust Access policy in front of it (Cloudflare dashboard → Zero Trust → Access →
> Applications) scoped to your team's email domain, before pointing the Studio at it.
> Without one, anyone with the URL can read your drafts.

<!-- #region shopify -->
### Removing Shopify

The boilerplate ships **with** the Shopify Storefront API integration. If a project
doesn't need e-commerce, strip it once at project setup:

```bash
pnpm strip:shopify:dry   # preview what will be removed
pnpm strip:shopify       # do it
```

This deletes the Shopify files and code regions outright, then reinstalls and
reformats. It is a one-way operation — run it on a fresh clone, before you start
building. See [`scripts/strip-shopify.mjs`](scripts/strip-shopify.mjs) for how the
markers work; adding new Shopify code means adding markers, not editing the script.
<!-- #endregion shopify -->

---

## Prerequisites

- **Node.js** `>=22.12.0`
- **pnpm** (recommended package manager)
- A [Sanity](https://sanity.io) account and project
- A [Cloudflare](https://cloudflare.com) account (for deployment)

---

## Project Structure

```
sane-svelstro-tinderbox/
├── astro/                        # Astro 7 frontend
│   ├── public/
│   └── src/
│       ├── components/           # Shared & section components
│       │   └── sections/         # One component per Sanity section type
│       ├── layouts/              # Astro layout wrappers
│       ├── pages/                # File-based routing ([slug].astro, etc.)
│       ├── stores/               # Nanostores atoms (nav, cart)
│       ├── styles/               # Global CSS & typography
│       ├── types/                # Shared TypeScript types (barrel: index.ts)
│       └── utils/
│           ├── groq.ts           # Reusable GROQ field-selection fragments
│           ├── queires.ts        # Full composed GROQ queries
│           ├── load-query.ts     # fetchQuery / fetchPage / loadQuery helpers
│           └── image/            # Sanity image processing (processNestedImages)
└── sanity/                       # Sanity v6 Studio
    └── src/
        ├── schemas/
        │   ├── documents/        # Page, Project, Product, Collection
        │   ├── objects/
        │   │   └── sections/     # One schema file per section type
        │   └── singletons/       # Home Page, Settings, Site
        ├── lib/                  # Desk structure & presentation resolve
        └── plugins/              # Custom document actions
```

---

## Getting Started

### 1. Use as a GitHub template

Click **[Use this template](https://github.com/lanelps/sane-svelstro-tinderbox)** on GitHub to generate your own copy of this repository. Then clone it:

```bash
git clone https://github.com/your-username/your-repo-name.git

cd your-repo-name/astro && pnpm install
cd ../sanity && pnpm install
```

### 2. Set up the Sanity Studio

Create a new Sanity project at [sanity.io/manage](https://sanity.io/manage), then copy your **Project ID** and **Dataset** name.

```bash
# sanity/
cp .env.example .env
```

Edit `sanity/.env`:

```env
SANITY_STUDIO_PROJECT_ID="your-project-id"
SANITY_STUDIO_DATASET="production"
```

Start the studio:

```bash
cd sanity && pnpm dev
```

### 3. Set up the Astro frontend

```bash
# astro/
cp .env.example .env
```

Edit `astro/.env`:

```env
# Sanity — required
PUBLIC_SANITY_PROJECT_ID="your-project-id"
PUBLIC_SANITY_DATASET="production"

# Sanity Token — only needed for private Sanity projects
# SANITY_TOKEN="your-sanity-read-token"
```

Start the dev server:

```bash
cd astro && pnpm dev
```

---

## Environment Variables

### `astro/`

| Variable                          | Required        | Description                                                            |
| --------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID`        | ✅              | Sanity project ID                                                      |
| `PUBLIC_SANITY_DATASET`           | ✅              | Sanity dataset (`production`)                                          |
| `SANITY_TOKEN`                    | Preview Worker  | Read token. **Required** in preview mode — `drafts` needs auth         |
| `PUBLIC_BUILD_MODE`               | —               | `production` (default) or `preview`. `pnpm build:preview` sets it      |
| `PUBLIC_SITE_URL`                 | —               | Canonical site URL; feeds `site` in astro.config (sitemap + canonicals) |

### `sanity/`

| Variable                               | Required | Description                                                              |
| -------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `SANITY_STUDIO_PROJECT_ID`             | ✅       | Sanity project ID                                                        |
| `SANITY_STUDIO_DATASET`                | ✅       | Sanity dataset                                                           |
| `SANITY_STUDIO_VISUAL_EDITING_ENABLED` | —        | Set `"true"` to enable the Presentation tool                             |
| `SANITY_STUDIO_PREVIEW_URL`            | —        | Bare origin of the **preview** Worker. No path, no trailing slash        |

---

## Commands

### `astro/`

| Command               | Action                                                        |
| --------------------- | ------------------------------------------------------------- |
| `pnpm dev`            | Start Astro dev server at `localhost:4321`                    |
| `pnpm build`          | Build the production (SSG) Worker                             |
| `pnpm build:preview`  | Build the preview (SSR + Visual Editing) Worker               |
| `pnpm deploy`         | Deploy the production Worker                                  |
| `pnpm deploy:preview` | Deploy the preview Worker (`wrangler.preview.jsonc`)          |
| `pnpm preview`        | Serve the built output locally                                |

`build:preview` sets `PUBLIC_BUILD_MODE` inline, which is POSIX shell syntax. On
Windows, set the variable separately or run the builds through WSL / Cloudflare Builds.

In preview mode Astro logs `getStaticPaths() ignored in dynamic page …` once per
dynamic route. That is expected — the same page files serve both modes, and
`getStaticPaths` is only used by the SSG build.

<!-- #region shopify -->
### Repo root

| Command                  | Action                                             |
| ------------------------ | -------------------------------------------------- |
| `pnpm strip:shopify:dry` | List what the Shopify strip would remove           |
| `pnpm strip:shopify`     | Permanently remove the Shopify integration         |
<!-- #endregion shopify -->

### `sanity/`

| Command       | Action                                     |
| ------------- | ------------------------------------------ |
| `pnpm dev`    | Start Sanity Studio at `localhost:3333`    |
| `pnpm build`  | Build the studio for self-hosting          |
| `pnpm deploy` | Deploy studio to `<project>.sanity.studio` |

---

## Architecture

### Data Fetching

Content flows from Sanity to Astro through a structured GROQ pipeline:

```
@utils/groq.ts          → reusable field-selection fragments (image, sections, pageSEO, …)
@utils/queires.ts       → full page-level queries composed from fragments
@utils/load-query.ts    → fetchQuery<T> / fetchPage<T> / loadQuery<T>
```

- **`fetchQuery<T>()`** — raw GROQ fetch, no image processing.
- **`fetchPage<T>()`** — fetches and auto-processes all nested Sanity images. Prefer this in page-level `.astro` files.
- **`loadQuery<T>()`** — entry point for site-level data; delegates to `fetchQuery`.

`fetchQuery` selects its Sanity perspective from the build mode: `published` in
production builds, `drafts` in preview builds. Vite inlines `PUBLIC_BUILD_MODE` at build
time, so only one branch survives into each bundle.

All Sanity image data must flow through `@utils/image`. Never construct image URLs manually.

### Section Pattern

Sections are the primary content building block. Every new section type requires four changes:

| Layer                  | Location                                                  |
| ---------------------- | --------------------------------------------------------- |
| Sanity schema          | `sanity/src/schemas/objects/sections/<name>.ts`           |
| Sanity sections array  | `sanity/src/schemas/objects/sections.ts`                  |
| Sanity schema index    | `sanity/src/schemas/index.ts`                             |
| Astro/Svelte component | `astro/src/components/sections/<Name>.astro` or `.svelte` |
| Astro registration     | `astro/src/components/Sections.astro`                     |

Included section types: `example`, `media`, `projectsList`.

<!-- #region shopify -->
### Shopify

The Shopify Storefront API integration ships enabled. It is removed by
`pnpm strip:shopify`, not by a runtime flag — there is no `isEnabled` gate.

- Product, Product Variant and Collection documents are synced by the Sanity Connect
  Shopify app and are read-only in the Studio.
- Cart state lives in `@stores/cart` as a nanostores atom (`cart`, `toggleCart`,
  `openCart`, `closeCart`, `removeItem`).
- Requests go straight to the Storefront GraphQL endpoint via `fetch` — there is no SDK
  dependency.
<!-- #endregion shopify -->

### State Management

Client-side state uses nanostores atoms in `src/stores/`:

- `@stores/nav` — Navigation open/close state
<!-- #region shopify -->
- `@stores/cart` — Shopify cart state
<!-- #endregion shopify -->

Nanostores implements the Svelte store contract natively, so you can read store values in Svelte components using the `$` prefix (e.g. `$nav`) without any additional imports.

---

## Deployment

The Astro frontend uses the `@astrojs/cloudflare` adapter. By default all pages are **prerendered at build time (SSG)** — the static output is served via Cloudflare Workers.

To opt a page into **on-demand (server-side) rendering**, export `prerender = false` from that page file. To enable it globally, add it to `src/layouts/Layout.astro`:

```astro
---
export const prerender = false;
---
```

### Deploy steps

1. Run `pnpm build` from `astro/` to generate the static output.
2. Deploy via [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (connect your repo in the Cloudflare dashboard) or run `npx wrangler deploy` from `astro/`.
3. Set secret environment variables via the [Wrangler CLI](https://developers.cloudflare.com/workers/configuration/secrets/) or the Cloudflare dashboard — never commit them to your repository.

> A `wrangler.jsonc` is only required for custom Worker configurations (e.g. KV bindings, Durable Objects). For simple static deployments, Astro auto-generates the Worker configuration.
