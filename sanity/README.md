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

- **Home Page** (`homePage`) — landing page content and SEO
- **Settings** (`settings`) — scripts and redirect rules
- **Site** (`site`) — global navigation, organization info, and site-level SEO

### Documents

- **Page** (`page`) — generic content pages with a sections array
- **Project** (`project`) — portfolio/case study entries
- **Product** (`product`) — Shopify-synced product documents (optional)
- **Product Variant** (`productVariant`) — Shopify-synced variant documents (optional)
- **Collection** (`collection`) — Shopify-synced collection documents (optional)

### Sections

Sections are the content-block system. Each type maps 1:1 to an Astro/Svelte component in `astro/src/components/sections/`.

| Type                   | Description                     |
| ---------------------- | ------------------------------- |
| `section.example`      | Minimal starter section         |
| `section.media`        | Full-bleed image or video block |
| `section.productsList` | Grid of Shopify products        |
| `section.projectsList` | Grid of project entries         |

### Schema File Locations

| Schema category | Location                                         |
| --------------- | ------------------------------------------------ |
| Singletons      | `src/schemas/singletons/<name>.ts`               |
| Documents       | `src/schemas/documents/<name>.ts` / `.tsx`       |
| Objects         | `src/schemas/objects/<name>.ts`                  |
| Section schemas | `src/schemas/objects/sections/<name>.ts`         |
| SEO objects     | `src/schemas/objects/seo/<name>.ts`              |
| Shopify objects | `src/schemas/objects/shopify/<name>.ts` / `.tsx` |

## Section Pattern

Adding a new section requires changes in **both** sub-projects:

| Layer                  | Location                                                  | Purpose                                  |
| ---------------------- | --------------------------------------------------------- | ---------------------------------------- |
| Sanity section schema  | `sanity/src/schemas/objects/sections/<name>.ts`           | Defines the content fields               |
| `SECTION_REFERENCES`   | `sanity/src/constants.ts`                                 | Registers the type in the sections array |
| Schema index           | `sanity/src/schemas/index.ts`                             | Adds type to `schema.types`              |
| Astro/Svelte component | `astro/src/components/sections/<Name>.astro` or `.svelte` | Renders the section                      |
| Section dispatcher     | `astro/src/components/Sections.astro`                     | Maps `_type` to the component            |

## Conventions

### Naming

- **Type names:** `camelCase` for documents and singletons (`page`, `homePage`); `section.<name>` for sections; `<domain>.<name>` for composed objects (`seo.page`); `camelCase` for simple objects (`altImage`).
- **Export names:** Always `<name>Type` — e.g. `export const settingsType = defineType(...)`.
- **File extensions:** `.ts` by default. Only `.tsx` when a file contains JSX (custom inputs, `media` in `prepare()`).

### Icons

- Documents and singletons always have an `icon` set as an emoji arrow function: `icon: () => '📄'`.
- Objects and sections may optionally include an icon for clarity in array item UIs.
- Import from `@sanity/icons` only when used as the `media` value inside `prepare()` (e.g. as image fallback) — never as the schema-level `icon`.

### Preview — Required

Every `defineType` schema must include a `preview` config. Without it, Sanity renders a raw JavaScript object string as the item label in the Studio UI.

- **Sections:** static readable `title` + dynamic `subtitle` summarising content (e.g. item count).
- **Documents:** `title` from the primary name field, `subtitle` from a secondary descriptor, `media` from the primary image.
- **Singletons:** at minimum a static label — `prepare: () => ({ title: 'Settings' })`.
- **Objects:** most meaningful field as `title`, type or context as `subtitle`.

Even a static `prepare: () => ({ title: 'My Type' })` is better than omitting `preview` entirely.

### Constants

Shared config lives in `src/constants.ts`. Never duplicate these values in individual schema files — always import from there.

| Constant                 | Purpose                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `SECTION_REFERENCES`     | `defineArrayMember` entries for all registered section types       |
| `GROUPS`                 | Field group definitions (`content`, `seo`)                         |
| `PAGE_REFERENCES`        | Internal link reference types for `link` fields                    |
| `LOCKED_DOCUMENT_TYPES`  | Singleton/system types excluded from create, duplicate, and delete |
| `SHOPIFY_DOCUMENT_TYPES` | Shopify-synced document types                                      |
