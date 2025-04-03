// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_TOKEN } =
  loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

// Check if required environment variables are present
if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
  console.warn(
    "Warning: Sanity project ID or dataset not defined in environment variables"
  );
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      token: SANITY_TOKEN,
      apiVersion: "2025-04-01",
      useCdn: false,
    }),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
