// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
});
