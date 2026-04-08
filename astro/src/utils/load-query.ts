import type { QueryParams } from "sanity";
import { sanityClient } from "sanity:client";

import { processNestedImages } from "@utils/image";

/**
 * @name fetchQuery
 * @function
 * @description Fetches published data from Sanity using a raw GROQ query.
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
    perspective: "published",
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
 * @description Placeholder for Sanity live preview integration. Currently delegates to fetchQuery.
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
  // TODO: integrate Sanity live preview
  return fetchQuery<QueryResponse>({ query, params });
};
