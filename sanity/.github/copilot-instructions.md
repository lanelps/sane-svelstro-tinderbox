# AI Coding Instructions — Sanity Studio

## 🛠 Core Language & Syntax

- **Strict TypeScript:** All new code and edits MUST use TypeScript.
  - Use `.ts` by default. Only use `.tsx` when a file contains JSX (e.g. a React component used as `media` inside `prepare`, or a custom input).
  - Migration: If editing a `.js` file, convert it to `.ts` as part of the task.
- **Explicit Typing:** Type all variables, function parameters, and return types.
  - **`any` is permitted only for known Sanity API limitations:**
    - `validation` callbacks when accessing `parent`: `Rule.custom((value, {parent}: any) => ...)`
    - `prepare()` function arguments when Sanity's generic inference falls short: `prepare({title, image}: any)`
  - Never use `any` for your own data structures or return types.
- **Arrow Functions Only:** Use `const x = () => {}` for all functions and object methods.
  - ❌ NEVER use the `function` keyword.
- **Sanity Builders:** Always use `defineType`, `defineField`, and `defineArrayMember`. Never use raw object literals for schema definitions.
  - ✅ `defineField({ name: 'title', type: 'string' })`
  - ❌ `{ name: 'title', type: 'string' }`

## 🏷 Naming Conventions

### Type Names (`name` property inside `defineType`)

| Schema category        | Convention        | Examples                             |
| ---------------------- | ----------------- | ------------------------------------ |
| Documents & singletons | `camelCase`       | `page`, `homePage`, `productVariant` |
| Sections               | `section.<name>`  | `section.example`, `section.media`   |
| Composed objects       | `<domain>.<name>` | `seo.page`, `seo.site`               |
| Simple objects         | `camelCase`       | `altImage`, `link`, `media`          |

### Export Names

All `defineType` schemas must be exported as a named `const` following the pattern `<name>Type`:

```ts
export const settingsType = defineType({ name: 'settings', ... })
export const exampleSectionType = defineType({ name: 'section.example', ... })
export const altImageType = defineType({ name: 'altImage', ... })
```

## 🎨 Icons

- **Documents and singletons** — always provide an `icon` using an emoji arrow function:
  ```ts
  icon: () => '📄',
  ```
- **Objects and sections** — icons are optional but encouraged for clarity in the array item UI.
- **`@sanity/icons`** — import named icon components only when used as the `media` value inside a `prepare()` function (e.g. as an image fallback), not as the schema-level `icon`.

## 👁 Preview — REQUIRED

**Every `defineType` schema MUST include a `preview` config.** Without it, Sanity renders a raw JavaScript object string as the item label, which is unreadable in the Studio UI.

Use `select` to map schema fields to preview keys, and `prepare` to transform them into a human-readable `{ title, subtitle, media }` object.

### By schema category

**Sections** — a static, readable `title` plus a dynamic `subtitle` summarizing the content:

```ts
preview: {
  select: { items: 'items' },
  prepare: ({ items }) => ({
    title: 'My Section Name',
    subtitle: items?.length ? `${items.length} item${items.length === 1 ? '' : 's'}` : 'No items',
  }),
},
```

**Documents** — pull `title` from the primary name field, `subtitle` from a secondary descriptor (date, type, slug), and `media` from the primary image:

```ts
preview: {
  select: {
    title: 'title',
    subtitle: 'date',
    image: 'thumbnail.image',
    video: 'thumbnail.video.poster',
  },
  prepare: ({ title, subtitle, image, video }) => ({
    title,
    subtitle,
    media: image || video,
  }),
},
```

**Singletons** — these are single-instance documents, so a static label is sufficient (no `prepare` needed):

```ts
preview: {
  select: { title: 'title' },
},
```

Or with a hardcoded static label when there is no `title` field:

```ts
preview: {
  select: {},
  prepare: () => ({ title: 'Settings' }),
},
```

**Objects** — use the most meaningful field as `title`, and type or context info as `subtitle`:

```ts
preview: {
  select: {
    title: 'url',
    subtitle: 'type',
  },
},
```

Or with a `prepare` for conditional logic (e.g. image vs. video):

```ts
preview: {
  select: { type: 'type', image: 'image', video: 'video' },
  prepare: ({ type, image, video }: any) => ({
    title: type === 'image' ? 'Image' : 'Video',
    media: type === 'image' ? image : PlayIcon,
  }),
},
```

### Rules

- ✅ Every `defineType` call must have a `preview` block.
- ✅ Prefer `prepare` over relying on Sanity's default rendering when the raw field value needs transformation.
- ✅ In sections, `title` should always be a human-readable static string (the section type name), never a raw field value.
- ❌ Never leave `preview` out — even a static `prepare: () => ({ title: 'My Type' })` is better than nothing.

## 📦 Constants & Shared Config

Centralised constants live in `src/constants.ts`. Do not duplicate their values in individual schema files — always import from there.

| Constant                 | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `SECTION_REFERENCES`     | `defineArrayMember` entries for all registered section types            |
| `GROUPS`                 | Field group definitions (`content`, `seo`) used across document schemas |
| `PAGE_REFERENCES`        | Internal link reference types for `link` fields                         |
| `LOCKED_DOCUMENT_TYPES`  | Singleton/system types that cannot be created, duplicated, or deleted   |
| `SHOPIFY_DOCUMENT_TYPES` | Shopify-synced types                                                    |

When adding a new section, register its `defineArrayMember` in `SECTION_REFERENCES` in `constants.ts` and add the type to `schema.types` in `schemas/index.ts`.

## 🏗 Project Architecture

### Monorepo Context

This is a monorepo. The Sanity Studio (`sanity/`) is the CMS backend for the Astro frontend (`astro/`). Schema changes here have a direct counterpart on the frontend — see the Section Pattern below.

### Schema File Locations

| Schema category | Location                                         |
| --------------- | ------------------------------------------------ |
| Singletons      | `src/schemas/singletons/<name>.ts`               |
| Documents       | `src/schemas/documents/<name>.ts` / `.tsx`       |
| Objects         | `src/schemas/objects/<name>.ts`                  |
| Section schemas | `src/schemas/objects/sections/<name>.ts`         |
| SEO objects     | `src/schemas/objects/seo/<name>.ts`              |
| Shopify objects | `src/schemas/objects/shopify/<name>.ts` / `.tsx` |

### Section Pattern

Adding a new section requires changes in **both** sub-projects:

| Layer                  | Location                                                  | Purpose                                  |
| ---------------------- | --------------------------------------------------------- | ---------------------------------------- |
| Sanity section schema  | `sanity/src/schemas/objects/sections/<name>.ts`           | Defines the content fields               |
| `SECTION_REFERENCES`   | `sanity/src/constants.ts`                                 | Registers the type in the sections array |
| Schema index           | `sanity/src/schemas/index.ts`                             | Adds type to `schema.types`              |
| Astro/Svelte component | `astro/src/components/sections/<Name>.astro` or `.svelte` | Renders the section                      |
| Section dispatcher     | `astro/src/components/Sections.astro`                     | Maps `_type` to the component            |

### Shopify (Optional Module)

Shopify document types (`product`, `productVariant`, `collection`) are synced via the Sanity Connect Shopify plugin. They live in `src/schemas/documents/` and their schema objects in `src/schemas/objects/shopify/`.

- Do not add Shopify dependencies to schemas unrelated to e-commerce.
- Preview rules still apply to Shopify schemas, but the `ShopifyDocumentStatus` React component is the standard `media` pattern for Shopify document types.
