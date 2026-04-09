# Sane-Svelstro Tinderbox

A full-stack monorepo boilerplate for building content-driven websites. It pairs a **Sanity v5** CMS studio with an **Astro 6** frontend deployed to **Cloudflare Workers**, using **Svelte 5** for interactive components and **Tailwind CSS v4** for styling.

---

## Tech Stack

| Layer                 | Technology                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Frontend              | [Astro 6](https://astro.build) — SSG on Cloudflare Workers (SSR opt-in per page)                             |
| UI Components         | [Svelte 5](https://svelte.dev)                                                                               |
| Styling               | [Tailwind CSS v4](https://tailwindcss.com)                                                                   |
| CMS                   | [Sanity v5](https://sanity.io)                                                                               |
| Deployment            | [Cloudflare Workers](https://workers.cloudflare.com) via `@astrojs/cloudflare`                               |
| State                 | [Nanostores](https://github.com/nanostores/nanostores)                                                       |
| Routing               | [Astro ClientRouter](https://docs.astro.build/en/guides/view-transitions/) (SPA-mode client-side navigation) |
| Video                 | [Mux](https://mux.com) + [hls.js](https://github.com/video-dev/hls.js)                                       |
| E-commerce (optional) | [Shopify Storefront API](https://shopify.dev/docs/api/storefront)                                            |

---

## Prerequisites

- **Node.js** `>=22.12.0`
- **pnpm** (recommended package manager)
- A [Sanity](https://sanity.io) account and project
- A [Cloudflare](https://cloudflare.com) account (for deployment)
- _(Optional)_ A [Shopify](https://shopify.dev) store with a Storefront API token

---

## Project Structure

```
sane-svelstro-tinderbox/
├── astro/                        # Astro 6 frontend
│   ├── public/
│   └── src/
│       ├── components/           # Shared & section components
│       │   └── sections/         # One component per Sanity section type
│       ├── layouts/              # Astro layout wrappers
│       ├── pages/                # File-based routing ([slug].astro, etc.)
│       ├── stores/               # Nanostores atoms (cart, nav)
│       ├── styles/               # Global CSS & typography
│       ├── types/                # Shared TypeScript types (barrel: index.ts)
│       └── utils/
│           ├── groq.ts           # Reusable GROQ field-selection fragments
│           ├── queires.ts        # Full composed GROQ queries
│           ├── load-query.ts     # fetchQuery / fetchPage / loadQuery helpers
│           ├── image/            # Sanity image processing (processNestedImages)
│           └── shopify.ts        # Shopify Storefront API client (optional)
└── sanity/                       # Sanity v5 Studio
    └── src/
        ├── schemas/
        │   ├── documents/        # Page, Project, Product, Collection
        │   ├── objects/
        │   │   └── sections/     # One schema file per section type
        │   └── singletons/       # Home Page, Settings, Site
        ├── lib/                  # Desk structure & visual editing resolve
        └── plugins/              # Custom document actions (Shopify sync)
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

# Shopify — optional (set PUBLIC_ENABLE_SHOPIFY="true" to enable)
PUBLIC_ENABLE_SHOPIFY="false"
# PUBLIC_SHOPIFY_STORE="your-store.myshopify.com"
# PUBLIC_SHOPIFY_STOREFRONT_TOKEN="your-storefront-token"
```

Start the dev server:

```bash
cd astro && pnpm dev
```

---

## Environment Variables

### `astro/`

| Variable                          | Required     | Description                                          |
| --------------------------------- | ------------ | ---------------------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID`        | ✅           | Sanity project ID                                    |
| `PUBLIC_SANITY_DATASET`           | ✅           | Sanity dataset (`production`)                        |
| `SANITY_TOKEN`                    | —            | Read token — only needed for private Sanity projects |
| `PUBLIC_ENABLE_SHOPIFY`           | —            | Set `"true"` to enable Shopify features              |
| `PUBLIC_SHOPIFY_STORE`            | Shopify only | `your-store.myshopify.com`                           |
| `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Shopify only | Storefront API public token                          |

### `sanity/`

| Variable                               | Required | Description                                                            |
| -------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `SANITY_STUDIO_PROJECT_ID`             | ✅       | Sanity project ID                                                      |
| `SANITY_STUDIO_DATASET`                | ✅       | Sanity dataset                                                         |
| `SANITY_STUDIO_VISUAL_EDITING_ENABLED` | —        | Enables the Presentation tool (visual editing not yet integrated)      |
| `SANITY_STUDIO_PREVIEW_URL`            | —        | Origin URL of the Astro dev server (visual editing not yet integrated) |

---

## Commands

### `astro/`

| Command        | Action                                     |
| -------------- | ------------------------------------------ |
| `pnpm dev`     | Start Astro dev server at `localhost:4321` |
| `pnpm build`   | Type-check + build for production          |
| `pnpm preview` | Preview the production build locally       |

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
- **`loadQuery<T>()`** — intended entry point for pages; will integrate Sanity Live Preview.

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

Included section types: `example`, `media`, `productsList`, `projectsList`.

### Shopify (Optional)

Shopify integration is gated behind the `PUBLIC_ENABLE_SHOPIFY` environment variable. When disabled, all Shopify code is excluded at runtime.

- Check `shopifyConfig.isEnabled` from `@utils/shopify` before any Shopify logic.
- Cart state lives in `@stores/cart` as a nanostores atom.

### State Management

Client-side state uses nanostores atoms in `src/stores/`:

- `@stores/cart` — Shopify cart (`cart`, `toggleCart`, `openCart`, `closeCart`, `removeItem`)
- `@stores/nav` — Navigation open/close state

Nanostores implements the Svelte store contract natively, so you can read store values in Svelte components using the `$` prefix (e.g. `$cart`, `$nav`) without any additional imports.

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
