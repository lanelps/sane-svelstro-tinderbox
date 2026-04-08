import type { PageTypes } from "@/types";

/**
 * @name getPageSeo
 * @function
 * @description Extracts SEO metadata from a page object, falling back to sensible defaults for missing fields.
 * @param {PageTypes} page - The page object containing title, seo, and related fields.
 * @returns {{ title: string; description: string; keywords: string[]; image: string }} A normalized SEO object.
 */
export const getPageSeo = (page: PageTypes) => {
  const seo = {
    title: page?.title || page?.seo?.title || "",
    description: page?.seo?.description || "",
    keywords: page?.seo?.keywords || [],
    image: page?.seo?.image || "",
  };

  return seo;
};

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
