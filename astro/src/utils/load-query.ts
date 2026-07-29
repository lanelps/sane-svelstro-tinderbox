import type { QueryParams } from "sanity";
import { sanityClient } from "sanity:client";

import { processNestedImages } from "@utils/image";

/**
 * Preview builds read unpublished content. See `PUBLIC_BUILD_MODE` in astro.config.mjs.
 * Vite inlines this at build time, so the unused branch is dead-code-eliminated.
 */
const isPreview = import.meta.env.PUBLIC_BUILD_MODE === "preview";

/**
 * @name fetchQuery
 * @function
 * @description Fetches data from Sanity using a raw GROQ query. Reads published content in
 * production builds and draft content in preview builds (PUBLIC_BUILD_MODE=preview).
 * @param {object} options - The query options.
 * @param {string} options.query - The GROQ query string.
 * @param {QueryParams} [options.params] - Optional GROQ query parameters.
 * @returns {Promise<{ data: QueryResponse }>} The query result.
 */
export const fetchQuery = async <QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}): Promise<{ data: QueryResponse }> => {
  const data = await sanityClient.fetch<QueryResponse>(query, params ?? {}, {
    perspective: isPreview ? "drafts" : "published",
  });

  return { data };
};

/**
 * @name fetchPage
 * @function
 * @description Fetches a page from Sanity and automatically processes all nested images.
 * @param {object} options - The query options.
 * @param {string} options.query - The GROQ query string.
 * @param {QueryParams} [options.params] - Optional GROQ query parameters.
 * @returns {Promise<{ data: QueryResponse }>} The query result with all nested images processed.
 */
export const fetchPage = async <QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}): Promise<{ data: QueryResponse }> => {
  const { data } = await fetchQuery<QueryResponse>({ query, params });

  return { data: await processNestedImages(data) };
};

/**
 * @name loadQuery
 * @function
 * @description Entry point for site-level data. Delegates to fetchQuery, which selects the
 * published or drafts perspective based on the build mode.
 * @param {object} options - The query options.
 * @param {string} options.query - The GROQ query string.
 * @param {QueryParams} [options.params] - Optional GROQ query parameters.
 * @returns {Promise<{ data: QueryResponse }>} The query result.
 */
export const loadQuery = async <QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}): Promise<{ data: QueryResponse }> => {
  return fetchQuery<QueryResponse>({ query, params });
};
