# AI Coding Instructions

## Monorepo Overview

This project is a monorepo with two sub-projects:

- **`astro/`** — Astro 6 frontend, server-rendered on Cloudflare Workers. Uses Svelte 5 and Tailwind v4.
- **`sanity/`** — Sanity v5 Studio CMS. Drives all content for the Astro frontend.

## Sub-project Instructions

Load the relevant `AGENTS.md` based on the files you are working in:

- Working in `astro/` → read `./astro/AGENTS.md`
- Working in `sanity/` → read `./sanity/AGENTS.md`
- Working across both → read **both** files

## Cross-cutting Tasks

The following tasks always require changes in **both** sub-projects. Load both `AGENTS.md` files before starting:

- Adding or modifying a **Section** (Sanity schema + Astro component)
- Adding or modifying a **document type** that the frontend queries
- Changing a **GROQ field** that has a corresponding TypeScript type in `astro/src/types/`
