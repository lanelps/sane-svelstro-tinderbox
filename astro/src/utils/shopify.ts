import type { ShopifyCart, ShopifyCartResponse } from "@/types/cart";

export const shopifyConfig = {
  isEnabled: import.meta.env.PUBLIC_ENABLE_SHOPIFY === "true",
  storefrontToken: import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  store: import.meta.env.PUBLIC_SHOPIFY_STORE,
  apiVersion: "2025-01", // Make sure this matches your desired API version
};

// Constants
const CART_ID_KEY = "shopify_cart_id";
const SHOPIFY_CART_PREFIX = "gid://shopify/Cart/";

/**
 * @name ensureFullCartId
 * @function
 * @description Ensures a cart ID has the full Shopify GID prefix. If it already does, returns it unchanged.
 * @param {string} cartId - The cart ID to normalize.
 * @returns {string} The cart ID with the full Shopify GID prefix.
 */
const ensureFullCartId = (cartId: string): string => {
  if (!cartId.startsWith(SHOPIFY_CART_PREFIX)) {
    return `${SHOPIFY_CART_PREFIX}${cartId}`;
  }
  return cartId;
};

/**
 * @name extractCartId
 * @function
 * @description Strips the Shopify GID prefix from a full cart ID, returning only the raw ID segment.
 * @param {string} fullCartId - The full Shopify GID cart ID.
 * @returns {string} The raw cart ID without the GID prefix.
 */
const extractCartId = (fullCartId: string): string => {
  return fullCartId.replace(SHOPIFY_CART_PREFIX, "");
};

/**
 * @name initializeCart
 * @function
 * @description Initializes the Shopify cart by checking localStorage for an existing cart ID and verifying it is still valid. Creates a new cart if none is found or the stored one is no longer valid.
 * @returns {Promise<{ cartId: string }>} The full Shopify GID cart ID.
 */
export const initializeCart = async (): Promise<{ cartId: string }> => {
  try {
    if (typeof window === "undefined") {
      throw new Error("Cannot initialize cart on server-side");
    }

    // Check local storage for existing cart ID
    const storedCartId = localStorage.getItem(CART_ID_KEY);

    if (storedCartId) {
      console.log("Found existing cart ID in storage:", storedCartId);
      // Verify the cart still exists
      try {
        const fullCartId = ensureFullCartId(storedCartId);
        await getCart({ cartId: fullCartId });
        return { cartId: fullCartId };
      } catch (error) {
        console.log("Stored cart no longer valid, creating new cart");
        // Cart not found or invalid, create new one
        return await createNewCart();
      }
    }

    // No cart ID in storage, create new cart
    return await createNewCart();
  } catch (error) {
    console.error("Failed to initialize cart:", error);
    throw error;
  }
};

/**
 * @name createNewCart
 * @function
 * @description Creates a new Shopify cart, stores its stripped ID in localStorage, and returns the full GID cart ID.
 * @returns {Promise<{ cartId: string }>} The full Shopify GID cart ID of the newly created cart.
 */
export const createNewCart = async (): Promise<{ cartId: string }> => {
  const newCart = await createCart();
  const fullCartId = ensureFullCartId(newCart.id);

  // Store the cart ID in local storage
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_ID_KEY, extractCartId(fullCartId));
  }

  return { cartId: fullCartId };
};

export const storefrontClient = {
  endpoint: `https://${shopifyConfig.store}.myshopify.com/api/${shopifyConfig.apiVersion}/graphql.json`,
  /**
   * @name fetch
   * @function
   * @description Sends a GraphQL query or mutation to the Shopify Storefront API and returns the typed response data.
   * @param {string} query - The GraphQL query or mutation string.
   * @param {object} [variables] - Optional GraphQL variables to send with the query.
   * @param {string} [caller] - An optional label identifying the calling function, used in error messages.
   * @returns {Promise<T>} The typed data returned by the Shopify API.
   */
  fetch: async <T>(query: string, variables = {}, caller = "Unknown") => {
    try {
      const response = await fetch(storefrontClient.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": shopifyConfig.storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const { data, errors } = await response.json();

      if (errors && errors.length > 0) {
        throw new Error(
          (errors as { message: string }[]).map((e) => e.message).join(", ")
        );
      }

      return data as T;
    } catch (error) {
      console.error(`Shopify Storefront Error in ${caller}:`, error);
      throw error;
    }
  },
};

/**
 * @name createCart
 * @function
 * @description Creates a new empty Shopify cart via the Storefront API and returns the cart object with its ID.
 * @returns {Promise<ShopifyCart & { id: string }>} The newly created Shopify cart with its ID stripped of the GID prefix.
 */
export const createCart = async () => {
  console.log("Creating new cart");
  const query = `
    mutation {
        cartCreate {
            cart {
                id
                checkoutUrl
                totalQuantity
                lines(first: 100) {
                    edges {
                        node {
                            id
                            quantity
                            merchandise {
                                ... on ProductVariant {
                                    id
                                    title
                                    priceV2 {
                                        amount
                                        currencyCode
                                    }
                                    image {
                                        originalSrc
                                    }
                                    product {
                                        title
                                    }
                                }
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }`;

  try {
    const response = await storefrontClient.fetch<{
      cartCreate: ShopifyCartResponse<ShopifyCart>;
    }>(query, {}, "createCart");
    console.log("Cart creation raw response:", response);

    if (response.cartCreate.userErrors?.length > 0) {
      throw new Error(response.cartCreate.userErrors[0].message);
    }

    if (!response.cartCreate?.cart) {
      throw new Error("Invalid cart creation response from Shopify");
    }

    const cart = response.cartCreate.cart;
    const cleanCart = {
      ...cart,
      id: cart.id.replace("gid://shopify/Cart/", ""),
    };
    console.log("Created cart with clean ID:", cleanCart.id);
    return cleanCart;
  } catch (error) {
    console.error("Failed to create cart:", error);
    throw error;
  }
};

/**
 * @name getCart
 * @function
 * @description Retrieves an existing Shopify cart by its ID, including all line items and their merchandise details.
 * @param {{ cartId: string }} options - The full Shopify GID cart ID.
 * @returns {Promise<{ cart: ShopifyCart }>} The cart data from the Shopify API.
 */
export const getCart = async ({ cartId }: { cartId: string }) => {
  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  console.log("Getting cart with cart ID:", cartId);
  const formattedCartId = ensureFullCartId(cartId);

  const query = `
    query getCart($cartId: ID!) {
        cart(id: $cartId) {
            id
            checkoutUrl
            totalQuantity
            lines(first: 100) {
                edges {
                    node {
                        id
                        quantity
                        merchandise {
                            ... on ProductVariant {
                                id
                                title
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                                image {
                                    originalSrc
                                }
                                product {
                                    title
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    `;

  try {
    const data = await storefrontClient.fetch<{ cart: ShopifyCart | null }>(
      query,
      { cartId: formattedCartId },
      "getCart"
    );
    if (!data.cart) {
      throw new Error("Cart not found");
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    throw new Error("Cart not found");
  }
};

/**
 * @name addToCart
 * @function
 * @description Adds a product variant as a line item to an existing Shopify cart.
 * @param {{ cartId: string; variantId: string; quantity: number }} options - The cart ID, product variant GID, and quantity to add.
 * @returns {Promise<{ cart: ShopifyCart }>} The updated cart returned by the Shopify API.
 */
export const addToCart = async ({
  cartId,
  variantId,
  quantity,
}: {
  cartId: string;
  variantId: string;
  quantity: number;
}) => {
  const formattedCartId = ensureFullCartId(cartId);
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
                id
                checkoutUrl
                totalQuantity
                lines(first: 100) {
                    edges {
                        node {
                            id
                            quantity
                            merchandise {
                                ... on ProductVariant {
                                    id
                                    title
                                    priceV2 {
                                        amount
                                        currencyCode
                                    }
                                    image {
                                        originalSrc
                                    }
                                    product {
                                        title
                                        handle
                                    }
                                }
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }`;

  try {
    const data = await storefrontClient.fetch<{
      cartLinesAdd: ShopifyCartResponse<ShopifyCart>;
    }>(
      query,
      {
        cartId: formattedCartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity: parseInt(String(quantity), 10),
          },
        ],
      },
      "addToCart"
    );

    if (data.cartLinesAdd.userErrors?.length > 0) {
      throw new Error(data.cartLinesAdd.userErrors[0].message);
    }

    if (!data.cartLinesAdd?.cart) {
      throw new Error("Failed to add item to cart");
    }

    return {
      cart: data.cartLinesAdd.cart,
    };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
};

/**
 * @name updateCart
 * @function
 * @description Updates the quantity of an existing line item in a Shopify cart.
 * @param {{ cartId: string; itemId: string; variantId: string; quantity: number }} options - The cart ID, line item ID, variant GID, and new quantity.
 * @returns {Promise<{ cart: ShopifyCart }>} The updated cart returned by the Shopify API.
 */
export const updateCart = async ({
  cartId,
  itemId,
  variantId,
  quantity,
}: {
  cartId: string;
  itemId: string;
  variantId: string;
  quantity: number;
}) => {
  const formattedCartId = ensureFullCartId(cartId);
  console.log("Update cart input:", { cartId, itemId, variantId, quantity });

  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
                id
                checkoutUrl
                totalQuantity
                lines(first: 100) {
                    edges {
                        node {
                            id
                            quantity
                            merchandise {
                                ... on ProductVariant {
                                    id
                                    title
                                    priceV2 {
                                        amount
                                        currencyCode
                                    }
                                    image {
                                        originalSrc
                                    }
                                    product {
                                        title
                                        handle
                                    }
                                }
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }`;

  try {
    const data = await storefrontClient.fetch<{
      cartLinesUpdate: ShopifyCartResponse<ShopifyCart>;
    }>(
      query,
      {
        cartId: formattedCartId,
        lines: [
          {
            id: itemId,
            merchandiseId: variantId,
            quantity: parseInt(String(quantity), 10),
          },
        ],
      },
      "updateCart"
    );

    if (data.cartLinesUpdate.userErrors?.length > 0) {
      throw new Error(data.cartLinesUpdate.userErrors[0].message);
    }

    if (!data.cartLinesUpdate?.cart) {
      throw new Error("Failed to update cart");
    }

    return {
      cart: data.cartLinesUpdate.cart,
    };
  } catch (error) {
    console.error("Failed to update cart:", error);
    throw error;
  }
};

/**
 * @name removeLineItem
 * @function
 * @description Removes a single line item from a Shopify cart by its line item ID.
 * @param {{ cartId: string; itemId: string }} options - The cart ID and line item ID to remove.
 * @returns {Promise<{ cart: ShopifyCart }>} The updated cart returned by the Shopify API.
 */
export const removeLineItem = async ({
  cartId,
  itemId,
}: {
  cartId: string;
  itemId: string;
}) => {
  const formattedCartId = ensureFullCartId(cartId);
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds ) {
            cart {
                id
                checkoutUrl
                totalQuantity
                lines(first: 100) {
                    edges {
                        node {
                            id
                            quantity
                            merchandise {
                                ... on ProductVariant {
                                    id
                                    title
                                    priceV2 {
                                        amount
                                        currencyCode
                                    }
                                    image {
                                        originalSrc
                                    }
                                    product {
                                        title
                                        handle
                                    }
                                }
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }`;

  try {
    const data = await storefrontClient.fetch<{
      cartLinesRemove: ShopifyCartResponse<ShopifyCart>;
    }>(
      query,
      {
        cartId: formattedCartId,
        lineIds: [itemId],
      },
      "removeLineItem"
    );

    if (data.cartLinesRemove.userErrors?.length > 0) {
      throw new Error(data.cartLinesRemove.userErrors[0].message);
    }

    if (!data.cartLinesRemove?.cart) {
      throw new Error("Failed to remove item from cart");
    }

    return {
      cart: data.cartLinesRemove.cart,
    };
  } catch (error) {
    console.error("Failed to remove line item:", error);
    throw error;
  }
};

/**
 * @name removeLineItems
 * @function
 * @description Removes multiple line items from a Shopify cart in a single mutation.
 * @param {{ cartId: string; itemIds: string[] }} options - The cart ID and array of line item IDs to remove.
 * @returns {Promise<{ cart: ShopifyCart | null }>} The updated cart returned by the Shopify API, or null if itemIds was empty.
 */
export const removeLineItems = async ({
  cartId,
  itemIds,
}: {
  cartId: string;
  itemIds: string[];
}) => {
  if (!itemIds.length) return { cart: null };

  const formattedCartId = ensureFullCartId(cartId);
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds ) {
            cart {
                id
                checkoutUrl
                totalQuantity
                lines(first: 100) {
                    edges {
                        node {
                            id
                            quantity
                            merchandise {
                                ... on ProductVariant {
                                    id
                                    title
                                    priceV2 {
                                        amount
                                        currencyCode
                                    }
                                    image {
                                        originalSrc
                                    }
                                    product {
                                        title
                                        handle
                                    }
                                }
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }`;

  try {
    const data = await storefrontClient.fetch<{
      cartLinesRemove: ShopifyCartResponse<ShopifyCart>;
    }>(
      query,
      {
        cartId: formattedCartId,
        lineIds: itemIds,
      },
      "removeLineItems"
    );

    if (data.cartLinesRemove.userErrors?.length > 0) {
      throw new Error(data.cartLinesRemove.userErrors[0].message);
    }

    if (!data.cartLinesRemove?.cart) {
      throw new Error("Failed to remove items from cart");
    }

    return {
      cart: data.cartLinesRemove.cart,
    };
  } catch (error) {
    console.error("Failed to remove line items:", error);
    throw error;
  }
};

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  updatedAt: string;
  images: { edges: { node: { originalSrc: string } }[] };
  variants: {
    edges: { node: { priceV2: { amount: string; currencyCode: string } } }[];
  };
};

/**
 * @name fetchAllProducts
 * @function
 * @description Fetches up to 100 products from Shopify, including their first image and first variant price.
 * @returns {Promise<ShopifyProductNode[]>} An array of product nodes with inlined images and variants arrays.
 */
export const fetchAllProducts = async () => {
  const query = `
    {
        products(first: 100) {
            edges {
                node {
                    id
                    title
                    handle
                    description
                    updatedAt
                    images(first: 1) {
                        edges {
                            node {
                                originalSrc
                            }
                        }
                    }
                    variants(first: 1) {
                        edges {
                            node {
                                priceV2 {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                }
            }
        }
    }
  `;

  try {
    const result = await storefrontClient.fetch<{
      products: { edges: { node: ShopifyProductNode }[] };
    }>(query, {}, "fetchAllProducts");
    return result.products.edges.map(({ node }) => ({
      ...node,
      images: node.images.edges.map(({ node: imageNode }) => imageNode),
      variants: node.variants.edges.map(({ node: variantNode }) => variantNode),
    }));
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    throw error;
  }
};

type ShopifyProductByHandle = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  material: { value: string } | null;
  shipping: { value: string } | null;
  images: { edges: { node: { originalSrc: string } }[] };
  options: { id: string; name: string; values: string[] }[];
  variants: {
    edges: {
      node: {
        id: string;
        sku: string;
        title: string;
        priceV2: { amount: string; currencyCode: string };
        image: { originalSrc: string } | null;
        availableForSale: boolean;
        currentlyNotInStock: boolean;
        quantityAvailable: number;
      };
    }[];
  };
};

/**
 * @name fetchProduct
 * @function
 * @description Fetches a single Shopify product by its URL handle, including all images, variants, options, and metafields.
 * @param {string} handle - The product URL handle.
 * @returns {Promise<ShopifyProductByHandle & { images: { originalSrc: string }[]; variants: ShopifyProductByHandle['variants']['edges'][number]['node'][] }>} The product with flattened images and variants arrays.
 */
export const fetchProduct = async (handle: string) => {
  const query = `
    query getProduct($handle: String!) {
        productByHandle(handle: $handle) {
            id
            title
            handle
            description
            availableForSale
            material: metafield(namespace: "custom", key: "material") {
                value
            }
            shipping: metafield(namespace: "custom", key: "shipping") {
                value
            }
            images(first: 100) {
                edges {
                    node {
                        originalSrc
                    }
                }
            }
            options {
                id
                name
                values
            }
            variants(first: 100) {
                edges {
                    node {
                        id
                        sku
                        title
                        priceV2 {
                            amount
                            currencyCode
                        }
                        image {
                            originalSrc
                        }
                        availableForSale
                        currentlyNotInStock
                        quantityAvailable
                    }
                }
            }
        }
    }
    `;

  try {
    const result = await storefrontClient.fetch<{
      productByHandle: ShopifyProductByHandle | null;
    }>(query, { handle }, `fetchProduct(${handle})`);
    if (!result.productByHandle) {
      throw new Error(`Product with handle '${handle}' not found`);
    }

    return {
      ...result.productByHandle,
      images: result.productByHandle.images.edges.map(
        ({ node: imageNode }) => imageNode
      ),
      variants: result.productByHandle.variants.edges.map(
        ({ node: variantNode }) => variantNode
      ),
    };
  } catch (error) {
    console.error(`Failed to fetch product ${handle}:`, error);
    throw error;
  }
};

/**
 * @name getCheckoutURL
 * @function
 * @description Retrieves the Shopify checkout URL for an existing cart.
 * @param {{ cartId: string }} options - The full Shopify GID cart ID.
 * @returns {Promise<{ checkoutUrl: string }>} The checkout URL for redirecting the user.
 */
export const getCheckoutURL = async ({ cartId }: { cartId: string }) => {
  const formattedCartId = ensureFullCartId(cartId);
  const query = `
    query checkoutURL($cartId: ID!) {
      cart(id: $cartId) {
        checkoutUrl
      }
    }`;

  try {
    const data = await storefrontClient.fetch<{
      cart: { checkoutUrl: string } | null;
    }>(query, { cartId: formattedCartId }, "getCheckoutURL");

    if (!data.cart) {
      throw new Error("Failed to get checkout URL");
    }

    return data.cart;
  } catch (error) {
    console.error("Failed to get checkout URL:", error);
    throw error;
  }
};
