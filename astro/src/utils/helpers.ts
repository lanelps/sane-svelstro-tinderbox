import type { PageTypes } from "@/types";

/**
 * @name getPageSeo
 * @function
 * @description Extracts SEO metadata from a page object. `seo.title` takes precedence over the
 * document title, so the SEO override actually wins on documents that have both. Fields left unset
 * in Sanity resolve to `undefined` rather than empty strings/arrays, so Layout.astro's `||` merge
 * can fall through to the site-wide SEO defaults instead of short-circuiting on an empty-but-truthy
 * value (`[]` is truthy).
 * @param {PageTypes} page - The page object containing title, seo, and related fields.
 * @returns {{ title?: string; description?: string; keywords?: string[]; image?: SEOPage["image"] }} A normalized SEO object.
 */
export const getPageSeo = (page: PageTypes) => {
  return {
    title: page?.seo?.title || page?.title || undefined,
    description: page?.seo?.description || undefined,
    keywords: page?.seo?.keywords?.length ? page.seo.keywords : undefined,
    image: page?.seo?.image || undefined,
  };
};

// #region shopify
/**
 * @name stripHtml
 * @function
 * @description Removes all HTML tags from a string, returning plain text. Primarily used on Shopify product descriptions.
 * @param {string} html - The HTML string to strip.
 * @returns {string} The plain text string with all HTML tags removed.
 */
export const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};
// #endregion shopify
