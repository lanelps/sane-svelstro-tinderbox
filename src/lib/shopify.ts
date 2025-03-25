export const shopifyConfig = {
  isEnabled: import.meta.env.PUBLIC_ENABLE_SHOPIFY === "true",
  storefrontToken: import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  storeDomain: import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN,
};
