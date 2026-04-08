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
  - Example: `import { helper } from '$utils/helpers';`
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
