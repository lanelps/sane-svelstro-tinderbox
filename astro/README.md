# astro/

Astro 6 frontend for the Sane-Svelstro Tinderbox boilerplate. Prerendered (SSG) by default and deployed to Cloudflare Workers, using Svelte 5 for interactive components and Tailwind CSS v4 for styling.

> For full setup instructions, environment variables, and architecture docs see the [root README](../README.md).

## Commands

Run from `astro/`:

| Command          | Action                               |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Start dev server at `localhost:4321` |
| `pnpm build`     | Type-check + build for production    |
| `pnpm preview`   | Preview production build locally     |
| `pnpm astro ...` | Run Astro CLI commands               |

> Client-side navigation is enabled globally via Astro's `<ClientRouter />` (from `astro:transitions`), giving the site SPA-like page transitions without a full reload.

## Structure

```
src/
├── components/        # Shared UI + section components
│   └── sections/      # One component per Sanity section type
├── layouts/           # Astro layout wrappers
├── pages/             # File-based routing
├── stores/            # Nanostores atoms (nav)
├── styles/            # Global CSS & typography
├── types/             # Shared TypeScript types
└── utils/
    ├── groq.ts        # Reusable GROQ fragments
    ├── queires.ts     # Full composed GROQ queries
    ├── load-query.ts  # Data fetching helpers
    └── image/         # Sanity image processing
```

## Path Aliases

Defined in `tsconfig.json`:

| Alias           | Resolves to        |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@components/*` | `src/components/*` |
| `@layouts/*`    | `src/layouts/*`    |
| `@stores/*`     | `src/stores/*`     |
| `@styles/*`     | `src/styles/*`     |
| `@utils/*`      | `src/utils/*`      |
| `@assets/*`     | `src/assets/*`     |
