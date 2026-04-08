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

// Helper function to handle cart ID formatting
const ensureFullCartId = (cartId: string): string => {
  if (!cartId.startsWith(SHOPIFY_CART_PREFIX)) {
    return `${SHOPIFY_CART_PREFIX}${cartId}`;
  }
  return cartId;
};

const extractCartId = (fullCartId: string): string => {
  return fullCartId.replace(SHOPIFY_CART_PREFIX, "");
};

// Initialize cart, checking storage and creating new cart if needed
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

// Helper function to create a new cart and store its ID
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
        throw new Error(errors.map((e: any) => e.message).join(", "));
      }

      return data as T;
    } catch (error) {
      console.error(`Shopify Storefront Error in ${caller}:`, error);
      throw error;
    }
  },
};

// Create a new cart
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

// Get an existing cart
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

// Add item to cart
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

// Update cart item
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

// Remove item from cart
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

// Remove multiple items from cart
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

// Fetch all products
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
    const result = await storefrontClient.fetch<{ products: { edges: any[] } }>(
      query,
      {},
      "fetchAllProducts"
    );
    return result.products.edges.map(({ node }) => ({
      ...node,
      images: node.images.edges.map(({ node }: any) => node),
      variants: node.variants.edges.map(({ node }: any) => node),
    }));
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    throw error;
  }
};

// Fetch a single product by handle
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
    const result = await storefrontClient.fetch<{ productByHandle: any }>(
      query,
      { handle },
      `fetchProduct(${handle})`
    );
    if (!result.productByHandle) {
      throw new Error(`Product with handle '${handle}' not found`);
    }

    return {
      ...result.productByHandle,
      images: result.productByHandle.images.edges.map(({ node }: any) => node),
      variants: result.productByHandle.variants.edges.map(
        ({ node }: any) => node
      ),
    };
  } catch (error) {
    console.error(`Failed to fetch product ${handle}:`, error);
    throw error;
  }
};

// Get checkout URL for a cart
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
