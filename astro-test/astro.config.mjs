// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    svelte(),
    sanity({
      projectId: "yxrebkrn",
      dataset: "production",
      apiVersion: "2025-04-01",
      useCdn: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
