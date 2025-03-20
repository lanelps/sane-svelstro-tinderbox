import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, process.cwd(), ["SANITY_"]),
};

// https://astro.build/config
export default defineConfig({
  site: "https://sane-svelstro-tinderbox.com",
  integrations: [
    svelte(),
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      token: env.SANITY_TOKEN,
      useCdn: false,
    }),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  output: "static",
  prefetch: {
    prefetchAll: true,
  },
  vite: {
    assetsInclude: ["**/*.glsl"],
    plugins: [tailwindcss()],
  },
});
