/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  // sanity
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly SANITY_TOKEN: string;
  readonly PUBLIC_SANITY_VISUAL_EDITING_ENABLED: string;
  readonly PUBLIC_SANITY_STUDIO_PREVIEW_URL: string;

  // shopify
  readonly PUBLIC_ENABLE_SHOPIFY: string;
  readonly PUBLIC_SHOPIFY_STOREFRONT_TOKEN: string;
  readonly PUBLIC_SHOPIFY_STORE: string;
  readonly SHOPIFY_STOREFRONT_PROVATE_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
