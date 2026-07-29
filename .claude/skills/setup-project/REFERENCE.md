# Cloudflare deployment reference

Two Workers, both built from `main`. There is no preview branch — Cloudflare Workers
Builds allows a per-Worker build command, which is what distinguishes them.

## The two Workers

| | Production | Preview |
| --- | --- | --- |
| Build command | `pnpm build` | `pnpm build:preview` |
| Root directory | `astro/` | `astro/` |
| Branch | `main` | `main` |
| `PUBLIC_BUILD_MODE` | `production` | `preview` |
| Astro `output` | `static` | `server` |
| Sanity perspective | `published` | `drafts` |
| `<VisualEditing />` | not in bundle | rendered |
| Wrangler config | `wrangler.jsonc` | `wrangler.preview.jsonc` |
| Access | public | **Cloudflare Access required** |

`build:preview` sets `PUBLIC_BUILD_MODE=preview` inline. That single variable drives the
output mode, the perspective, and whether the Visual Editing bundle is emitted at all —
Vite inlines it, so the unused branch is dead-code-eliminated.

## Setup

### 1. Production Worker

Cloudflare dashboard → Workers & Pages → Create → connect the repo.

- Branch `main`, root directory `astro/`
- Build command `pnpm build`
- Deploy command `pnpm deploy`
- Environment variables: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`,
  `PUBLIC_SITE_URL`

### 2. Preview Worker

Create a **second** Worker against the same repo and branch.

- Build command `pnpm build:preview`
- Deploy command `pnpm deploy:preview`
- Environment variables: the same three, **plus `SANITY_TOKEN`** — the `drafts`
  perspective is authenticated and the build warns if it is missing.

### 3. Cloudflare Access on the preview Worker — do this before it goes live

The preview Worker serves unpublished content to anyone who has the URL. Lock it down:

Zero Trust → Access → Applications → Add an application → Self-hosted

- Application domain: the preview Worker's hostname
- Policy: Allow, with an `Emails ending in` rule for your team's domain

The Studio's Presentation iframe will prompt for login once per session. The free Access
tier covers this.

### 4. Point the Studio at the preview Worker

In `sanity/.env`:

```env
SANITY_STUDIO_VISUAL_EDITING_ENABLED="true"
SANITY_STUDIO_PREVIEW_URL="https://<preview-worker-host>"
```

`SANITY_STUDIO_PREVIEW_URL` must be a **bare origin** — scheme and host only, no path and
no trailing slash. Presentation passes it straight through as an iframe origin and a
trailing slash breaks it. For local work use `http://localhost:4321` (http, not https).

Both variables must be set or the Presentation tab does not appear at all — the plugin is
conditionally registered in `sanity.config.ts`.

## Verifying live preview

1. `cd astro && pnpm dev` and `cd sanity && pnpm dev`
2. Open the Studio → Presentation tab
3. The site loads in the iframe; editing a field updates it without a rebuild

If the iframe stays blank, check in this order: the preview URL has no trailing slash;
both `SANITY_STUDIO_*` visual-editing vars are set; `SANITY_TOKEN` is present on the
Astro side.

## Adding a Presentation location for a new document type

`sanity/src/lib/resolve.ts` maps document types to front-end URLs so Presentation can
open the right page. `page`, `project` and `product` are wired. A new routable document
type needs an entry there or it will have no preview target.
