# sanity/

Sanity v5 Studio for the Sane-Svelstro Tinderbox boilerplate. Manages all content consumed by the Astro frontend.

> For full setup instructions and environment variables see the [root README](../README.md).

## Commands

Run from `sanity/`:

| Command       | Action                                  |
| ------------- | --------------------------------------- |
| `pnpm dev`    | Start Sanity Studio at `localhost:3333` |
| `pnpm build`  | Build the studio for self-hosting       |
| `pnpm deploy` | Deploy to `<project>.sanity.studio`     |

## Schema Overview

### Singletons

- **Home Page** — landing page content and SEO
- **Settings** — scripts and redirect rules
- **Site** — global navigation, organization info, and site-level SEO

### Documents

- **Page** — generic content pages with a sections array
- **Project** — portfolio/case study entries
- **Product** — Shopify-synced product documents (optional)
- **Product Variant** — Shopify-synced variant documents (optional)
- **Collection** — Shopify-synced collection documents (optional)

### Sections

Sections are the content-block system. Each type maps 1:1 to an Astro/Svelte component in `astro/src/components/sections/`.

| Type           | Description                     |
| -------------- | ------------------------------- |
| `example`      | Minimal starter section         |
| `media`        | Full-bleed image or video block |
| `productsList` | Grid of Shopify products        |
| `projectsList` | Grid of project entries         |

To add a new section type, see the section pattern in the [root README](../README.md#section-pattern).
