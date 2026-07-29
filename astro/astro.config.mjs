// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import cloudflare from "@astrojs/cloudflare";

import { sanityRedirects } from "./integrations/sanity-redirects";

import { loadEnv } from "vite";

const {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  SANITY_TOKEN,
  PUBLIC_BUILD_MODE,
  PUBLIC_SITE_URL,
} = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

// Check if required environment variables are present
if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
  console.warn(
    "Warning: Sanity project ID or dataset not defined in environment variables"
  );
}

/**
 * Build mode drives the difference between the two Cloudflare Worker deployments
 * built from this single branch:
 *
 *   production (default) — SSG, published content, no visual editing
 *   preview              — SSR, draft content, Sanity Visual Editing overlay
 *
 * The preview Worker is what SANITY_STUDIO_PREVIEW_URL should point at.
 */
const isPreview = PUBLIC_BUILD_MODE === "preview";

// The `drafts` perspective requires an authenticated token, not just a public dataset.
if (isPreview && !SANITY_TOKEN) {
  console.warn(
    "Warning: PUBLIC_BUILD_MODE=preview requires SANITY_TOKEN to read draft content"
  );
}

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE_URL || "https://www.example.com",

  output: isPreview ? "server" : "static",

  vite: {
    plugins: [tailwindcss()],
  },

  // #region shopify
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/s/files/**",
      },
    ],
  },
  // #endregion shopify

  integrations: [
    svelte(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      token: SANITY_TOKEN,
      apiVersion: "2026-04-01",
      useCdn: false,
      // Stega encodes content source maps so Visual Editing supports click-to-edit.
      stega: isPreview,
    }),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    // Static builds have no request to run middleware in, so redirects are baked into a
    // `_redirects` file Cloudflare serves at the edge. Preview is SSR — `src/middleware.ts`
    // resolves them per request there instead, so this is a no-op.
    sanityRedirects({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-04-01",
      token: SANITY_TOKEN,
      enabled: !isPreview,
    }),
  ],

  adapter: cloudflare(),
});
