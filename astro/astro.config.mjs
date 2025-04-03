import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
// import cloudflare from "@astrojs/cloudflare";
import sanity from "@sanity/astro";

import { loadEnv } from "vite";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, SANITY_TOKEN } =
  loadEnv(process.env.NODE_ENV, process.cwd(), "");

export default defineConfig({
  site: "https://sane-svelstro-tinderbox.pages.dev",
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
    svelte(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      token: SANITY_TOKEN,
      useCdn: false,
      apiVersion: "2025-03-21",
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
  // adapter: cloudflare({
  //   platformProxy: {
  //     enabled: true,
  //   },
  // }),
});
