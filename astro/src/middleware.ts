import { defineMiddleware } from "astro:middleware";

import { fetchQuery } from "@utils/load-query";
import { redirectsQuery } from "@utils/queires";

import type { RedirectsData } from "@/types";

/**
 * Redirects are applied differently per build mode:
 *
 *   preview (SSR)     — resolved per request, here, so editors see redirect changes
 *                       immediately without a rebuild.
 *   production (SSG)  — baked into a `_redirects` file at build time by the
 *                       `sanityRedirects` integration; Cloudflare serves them at the
 *                       edge before the Worker runs, so this middleware is a no-op.
 *
 * Vite inlines this at build time, so the fetch below is dead-code-eliminated out of
 * production builds entirely.
 */
const isPreview = import.meta.env.PUBLIC_BUILD_MODE === "preview";

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isPreview) return next();

  const { data: settings } = await fetchQuery<RedirectsData>({
    query: redirectsQuery,
  });

  const match = settings?.redirects?.find(
    (redirect) => redirect.source === context.url.pathname
  );

  if (match?.destination) {
    return context.redirect(match.destination, match.permanent ? 308 : 307);
  }

  return next();
});
