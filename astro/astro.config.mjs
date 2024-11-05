import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import sanity from "@sanity/astro";

import { loadEnv } from "vite";
import react from "@astrojs/react";
const env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, process.cwd(), ["SANITY_"]),
};

// https://astro.build/config
export default defineConfig({
  site: "https://sane-svelstro-tinderbox.com",
  integrations: [
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      token: env.SANITY_TOKEN,
      useCdn: true,
      // studioBasePath: env.SANITY_STUDIO_URL,
      stega: {
        studioUrl: env.SANITY_STUDIO_URL,
      },
    }),
    svelte(),
    react(),
    tailwind(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  prefetch: true,
  output: "server",
});
