import type { QueryParams } from "sanity";
import { sanityClient } from "sanity:client";

/**
 * @name loadQuery
 * @function
 * @description Fetches published data from Sanity.
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
  const data = await sanityClient.fetch<QueryResponse>(query, params ?? {}, {
    perspective: "published",
  });

  return { data };
};
