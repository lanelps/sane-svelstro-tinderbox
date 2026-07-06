# AI Coding Instructions

## 1. TypeScript & Functions

### Strict TypeScript

- All new code and edits MUST use TypeScript.
- Svelte files: Always use `<script lang="ts">`.
- Migration: If editing a JS file, convert it to TS as part of the task.
- **Legacy JS exception:** Only files that **cannot be statically analyzed** (e.g., third-party code with `eval()`, runtime-generated code, or code with dynamic imports that prevent type inference) qualify as legacy. Document the reason in a `// TODO: convert to TS` comment and proceed with only type-annotation updates and syntax fixes — no logic changes.

### Arrow Functions

- **TypeScript files:** Use `const x = () => {}` for all functions, methods, and object literals.
- **Legacy JS files:** The `function` keyword is permitted only in legacy JS files that cannot be converted to TS.

### Explicit Typing

- Type all variables, function parameters, and return types. Avoid `any`.

---

## 2. Styling (Tailwind & Svelte)

### Conditional Classes

Use the array-syntax pattern for readability:

- ✅ `class={['base-class', condition && 'active-class']}` (Single condition)
- ✅ `class={['base-class', condition ? 'true-class' : 'false-class']}` (Binary condition)
- ❌ Avoid: `condition ? 'class' : ''` when `&&` suffices.

### Svelte Native Handling

- In Svelte class handling, NEVER use `.join(' ')` or `.filter(Boolean)`.
- Svelte 5 (and 4) automatically handles array-to-class conversion, omitting falsy values and adding spaces. Manual joining is redundant and creates over-engineered code.

### No Dynamic Strings

All possible class values must be explicitly written as literals in the source so Tailwind detects them at build time.

- ❌ `class={[`bg-${color}-500`]}` — template literal, Tailwind cannot detect
- ✅ `class={[condition ? 'bg-red-500' : 'bg-green-500']}` — both values are static literals

Conditional class names are allowed **only when every possible value is a static string literal**.

### Invalid Class Names

If a class name is not a known Tailwind utility, fall back to a default class or a plain CSS variable. Do not attempt to generate dynamic class names as a workaround.

---

## 3. Imports & Organization

### Aliased Imports

Always use `tsconfig.json` aliases. Avoid relative paths (e.g., `../`).

- Example: `import { helper } from '@utils/helpers';`
- Available aliases: `@/*`, `@layouts/*`, `@components/*`, `@assets/*`, `@styles/*`, `@stores/*`, `@utils/*`

**Missing alias fallback:** If an alias is missing or incorrectly configured in `tsconfig.json`:

1. Log a `console.warn` with the missing alias path.
2. Use a relative path as a temporary fallback.
3. Add a `// TODO: fix alias` comment on the import.

Example:

```ts
// TODO: fix alias
import { helper } from "../../utils/helpers";
```

### Import Ordering

Alphabetize within groups. Separate groups with a single newline in this order:

1. External dependencies (npm packages)
2. Global Stores
3. Components
4. Assets
5. Utilities
6. Types

---

## 4. Documentation & Logic

### JSDoc Required

Use JSDoc for all functions, classes, and complex logic blocks.

- **Format:** Include `@name`, `@function`, `@description`, `@param` (with types), and `@returns`.

### Logic

- Prioritize readability and functional programming patterns.

---

## 5. Project Architecture

### Monorepo Structure

This is a monorepo with two sub-projects:

- **`astro/`** — Astro 6 frontend, server-rendered on Cloudflare Workers. Uses Svelte 5 for interactive components and Tailwind v4 for styling.
- **`sanity/`** — Sanity v5 Studio. The CMS that drives all content for the Astro frontend.

### Data Fetching (Sanity → Astro)

Data flows from Sanity to Astro through a structured GROQ pipeline. Follow these rules in order:

#### Step 1 — Check for GROQ Fragments

Reusable field selection strings live in `@utils/groq` (e.g., `image`, `media`, `pageSEO`, `sections`). Before writing a query, check if a matching fragment exists.

- **Fragment exists:** Use it. Never duplicate field selections.
- **Fragment missing or invalid:** A fragment is **missing** when no matching export exists in `@utils/groq`, or **invalid** when it references fields that do not exist on the target Sanity document type. In either case:
  1. Log a `console.warn` with the fragment name.
  2. Construct a minimal inline query containing only the fields you actually need.
  3. Create a `// TODO: add GROQ fragment` comment at the query location.

Example:

```ts
// Fragment @groq/image is missing — use inline fallback
const query = `*[_type == "project"][0] {
  title,
  "mainImage": mainImage.asset->url
}`;
```

#### Step 2 — Compose Full Queries

Composed queries built from fragments live in `@utils/queries` (e.g., `pageQuery`, `homePageQuery`, `siteQuery`). Always reference existing fragments; never duplicate field selections.

#### Step 3 — Fetch Data

All data is fetched via helpers in `@utils/load-query`:

- `fetchQuery<T>()` — raw GROQ fetch, no image processing.
- `fetchPage<T>()` — fetches and auto-processes all nested images via `processNestedImages`.
- `loadQuery<T>()` — intended entry point for pages; delegates to `fetchQuery` today, will integrate Sanity Live Preview.

**Error handling:** If `fetchPage` or `processNestedImages` fails:

1. Log the error with `console.error` including the page name or query context.
2. Retry up to three times with a 100ms delay between attempts.
3. If all retries fail, return a default fallback value: an empty object `{}` typed as `T` for single-page fetches, or an empty array `[]` typed as `T[]` for list fetches.
4. Do not crash the page — always render a graceful fallback.

Example:

```ts
const data = await fetchPage<Home>("home").catch((err) => {
  console.error("Failed to fetch home page:", err);
  return {} as Home;
});
```

#### Step 4 — Process Images

All Sanity image data must flow through `@utils/image`. Never transform image URLs manually. `fetchPage` handles this automatically; call `processNestedImages` explicitly only when using `fetchQuery` directly.

### Section Pattern

Sections are the primary content building block. Every new section requires changes in both sub-projects:

| Layer                  | Location                                                  | Purpose                                   |
| ---------------------- | --------------------------------------------------------- | ----------------------------------------- |
| Sanity schema          | `sanity/src/schemas/objects/sections/<name>.ts`           | Defines the content fields                |
| Sanity sections array  | `sanity/src/schemas/objects/sections.ts`                  | Adds the type to the sections field       |
| Sanity schema index    | `sanity/src/schemas/index.ts`                             | Registers the type globally in the schema |
| Astro/Svelte component | `astro/src/components/sections/<Name>.astro` or `.svelte` | Renders the section                       |
| Astro registration     | `astro/src/components/Sections.astro`                     | Maps `_type` to component                 |

### State Management

Client-side state uses [nanostores](https://github.com/nanostores/nanostores) atoms:

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

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
