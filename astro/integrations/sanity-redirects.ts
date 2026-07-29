import { writeFile } from "node:fs/promises";
import { createClient } from "@sanity/client";

import type { AstroIntegration } from "astro";

interface SanityRedirectsOptions {
  projectId?: string;
  dataset?: string;
  apiVersion: string;
  token?: string;
  /** Skip generation entirely — the preview Worker resolves redirects per request instead. */
  enabled: boolean;
}

interface RedirectRow {
  source?: string | null;
  destination?: string | null;
  permanent?: boolean | null;
}

const REDIRECTS_QUERY = `*[_type == "settings"][0]{
	"redirects": coalesce(redirects[]{
		source,
		destination,
		permanent
	}, [])
}`;

/**
 * @name formatRule
 * @function
 * @description Formats a single Sanity redirect into a Cloudflare `_redirects` rule line.
 * @param {RedirectRow} redirect - The redirect entry from Sanity.
 * @returns {string} A single `<source> <destination> <status>` line.
 */
const formatRule = (redirect: RedirectRow): string =>
  `${redirect.source} ${redirect.destination} ${redirect.permanent === false ? 307 : 308}`;

/**
 * @name sanityRedirects
 * @function
 * @description Astro integration that bakes the redirects configured in Sanity into a
 * `_redirects` file in the build output. Cloudflare's static asset handling serves these at
 * the edge, which is the only way redirects can work in a fully static (SSG) build — there is
 * no Worker request to run middleware in. Failures are logged and skipped rather than thrown,
 * so an unreachable Sanity never breaks a deploy.
 * @param {SanityRedirectsOptions} options - Sanity connection details and an enable flag.
 * @returns {AstroIntegration} The configured Astro integration.
 */
export const sanityRedirects = (
  options: SanityRedirectsOptions
): AstroIntegration => ({
  name: "sanity-redirects",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const { projectId, dataset, apiVersion, token, enabled } = options;

      if (!enabled) return;

      if (!projectId || !dataset) {
        logger.warn("Sanity project ID or dataset missing — skipping _redirects");
        return;
      }

      try {
        const client = createClient({
          projectId,
          dataset,
          apiVersion,
          token,
          useCdn: false,
        });

        const settings = await client.fetch<{ redirects?: RedirectRow[] }>(
          REDIRECTS_QUERY,
          {},
          { perspective: "published" }
        );

        const rules = (settings?.redirects ?? [])
          .filter((redirect) => redirect.source && redirect.destination)
          .map(formatRule);

        if (rules.length === 0) return;

        await writeFile(new URL("_redirects", dir), `${rules.join("\n")}\n`);
        logger.info(`Wrote ${rules.length} redirect(s) to _redirects`);
      } catch (error) {
        logger.warn(`Failed to generate _redirects: ${error}`);
      }
    },
  },
});
