import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import sanity from "@sanity/astro";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://sane-svelstro-tinderbox.com",

  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/s/files/1/0811/2134/5851/files/**",
      },
    ],
  },

  integrations: [
    sanity({
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET,
      useCdn: false,
      apiVersion: "2025-03-21", // insert the current date to access the latest version of the API
      studioBasePath: "/admin", // If you want to access the Studio on a route
      stega: {
        studioUrl: "/admin",
      },
    }),
    svelte(),
    react(),
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

  adapter: cloudflare(),
});
