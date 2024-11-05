import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import sanity from "@sanity/astro";
import react from "@astrojs/react";
import { loadEnv } from "vite";

const env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV, process.cwd(), ["PUBLIC_SANITY_"]),
};

// 'sanity' check...
if (
  !(
    env.PUBLIC_SANITY_PROJECT_ID &&
    env.PUBLIC_SANITY_DATASET &&
    env.PUBLIC_SANITY_VIEWER_TOKEN &&
    env.PUBLIC_SANITY_API_VERSION
  )
) {
  throw new Error(
    "You have to fill in all your /.env environmental variables, " +
      "from the example in /.env_example, before you can run this site..."
  );
}

// https://astro.build/config
export default defineConfig({
  site: "https://sane-svelstro-tinderbox.com",
  integrations: [
    sanity({
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET,
      apiVersion: env.PUBLIC_SANITY_API_VERSION,
      useCdn: false,
      perspective: "previewDrafts",
      token: env.PUBLIC_SANITY_VIEWER_TOKEN,
      stega: {
        studioUrl:
          env.PUBLIC_SANITY_STUDIO_PREVIEW_URL +
          env.PUBLIC_SANITY_STUDIO_BASE_PATH,
      },
      studioBasePath: env.PUBLIC_SANITY_STUDIO_BASE_PATH,
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
