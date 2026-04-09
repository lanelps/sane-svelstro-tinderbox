# AI Coding Instructions

## 🛠 Core Language & Syntax

- **Strict TypeScript:** All new code and edits MUST use TypeScript.
  - Svelte files: Always use `<script lang="ts">`.
  - Migration: If editing a JS file, convert it to TS as part of the task.
- **Explicit Typing:** Type all variables, function parameters, and return types. Avoid `any`.
- **Arrow Functions Only:** Use `const x = () => {}` for all functions, methods, and object literals.
  - ❌ NEVER use the `function` keyword.

## 🎨 Styling (Tailwind & Svelte)

- **Conditional Classes:** Use the array-syntax pattern for readability:
  - ✅ `class={['base-class', condition && 'active-class']}` (Single condition)
  - ✅ `class={['base-class', condition ? 'true-class' : 'false-class']}` (Binary condition)
  - ❌ Avoid: `condition ? 'class' : ''` when `&&` suffices.
- **Svelte Native Handling:** NEVER use `.join(' ')` or `.filter(Boolean)`.
  - _Note:_ Svelte 5 (and 4) automatically handles array-to-class conversion, omitting falsy values and adding spaces. Manual joining is redundant and creates over-engineered code.
- **No Dynamic Strings:** Tailwind must see full class names at build time.
  - ❌ `class={[`bg-${color}-500`]}`
  - ✅ `class={[condition ? 'bg-red-500' : 'bg-green-500']}`

## 📦 Imports & Organization

- **Aliased Imports:** Always use `tsconfig.json` aliases. Avoid relative paths (e.g., `../`).
  - Example: `import { helper } from '@utils/helpers';`
  - Available aliases: `@/*`, `@layouts/*`, `@components/*`, `@assets/*`, `@styles/*`, `@stores/*`, `@utils/*`
- **Import Ordering:** Alphabetize within groups. Separate groups with a single newline in this order:
  1. External dependencies (npm packages)
  2. Global Stores
  3. Components
  4. Assets
  5. Utilities
  6. Types

## 📝 Documentation & Logic

- **JSDoc Required:** Use JSDoc for all functions, classes, and complex logic blocks.
- **Format:** Include `@name`, `@function`, `@description`, `@param` (with types), and `@returns`.
- **Logic:** Prioritize readability and functional programming patterns.

## 🏗 Project Architecture

### Monorepo Structure

This is a monorepo with two sub-projects:

- **`astro/`** — Astro 6 frontend, server-rendered on Cloudflare Workers. Uses Svelte 5 for interactive components and Tailwind v4 for styling.
- **`sanity/`** — Sanity v5 Studio. The CMS that drives all content for the Astro frontend.

### Data Fetching (Sanity → Astro)

Data flows from Sanity to Astro through a structured GROQ pipeline:

1. **GROQ fragments** — Reusable field selection strings live in `@utils/groq` (e.g., `image`, `media`, `pageSEO`, `sections`).
2. **Full queries** — Composed queries built from fragments live in `@utils/queires` (e.g., `pageQuery`, `homePageQuery`, `siteQuery`).
3. **Fetching** — All data is fetched via helpers in `@utils/load-query`:
   - `fetchQuery<T>()` — raw GROQ fetch, no image processing.
   - `fetchPage<T>()` — fetches and auto-processes all nested images via `processNestedImages`.
   - `loadQuery<T>()` — intended entry point for pages; delegates to `fetchQuery` today, will integrate Sanity Live Preview.
4. **Image processing** — All Sanity image data must flow through `@utils/image`. Never transform image URLs manually. `fetchPage` handles this automatically; call `processNestedImages` explicitly only when using `fetchQuery` directly.

### Section Pattern

Sections are the primary content building block. Every new section requires changes in both sub-projects:

| Layer                  | Location                                                  | Purpose                                       |
| ---------------------- | --------------------------------------------------------- | --------------------------------------------- |
| Sanity schema          | `sanity/src/schemas/objects/sections/<name>.ts`           | Defines the content fields                    |
| Sanity sections array  | `sanity/src/schemas/objects/sections.ts`                  | Adds the type to the sections field           |
| Sanity schema index    | `sanity/src/schemas/index.ts`                             | Registers the type globally in the schema     |
| Astro/Svelte component | `astro/src/components/sections/<Name>.astro` or `.svelte` | Renders the section                           |
| Astro registration     | `astro/src/components/Sections.astro`                     | Maps `_type` to component                     |

### Shopify (Optional Module)

Shopify integration is **optional** and controlled by the `PUBLIC_ENABLE_SHOPIFY` environment variable.

- Gate all Shopify-specific logic behind `shopifyConfig.isEnabled` from `@utils/shopify`.
- Cart state is managed as a nanostores atom in `@stores/cart`. Use `toggleCart`, `openCart`, `closeCart`, and `removeItem` from that store.
- Do not add Shopify dependencies to logic paths that are unrelated to e-commerce.

### State Management

Client-side state uses [nanostores](https://github.com/nanostores/nanostores) atoms:

- `@stores/cart` — Shopify cart state (`cart`, `toggleCart`, `openCart`, etc.)
- `@stores/nav` — Navigation open/close state

Create new stores as named atom exports in `src/stores/`. Nanostores implements the Svelte store contract natively — read store values in Svelte components using the `$` prefix (e.g. `$cart`, `$nav`) without any additional wrapper.

### Types

All shared types live in `src/types/` and are barrel-exported from `src/types/index.ts`.

- Import types via `@/types` (barrel) or directly (e.g., `@/types/cart`).
- Never inline complex types — add them to the appropriate file in `src/types/`.

### Key Conventions

- GROQ queries use `$param` syntax for variables; always type the generic on `fetchQuery<MyType>()`.
- Section Astro components receive a `section` prop typed against the matching type in `@/types/sections`.
- Prefer `fetchPage` over `fetchQuery` in page-level `.astro` files — it handles image processing automatically.
