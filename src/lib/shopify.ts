import type { CartItem } from "@/types";

export const shopifyConfig = {
  isEnabled: import.meta.env.PUBLIC_ENABLE_SHOPIFY === "true", // todo: implement this
  storefrontToken: import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  store: import.meta.env.PUBLIC_SHOPIFY_STORE,
};

export const storefrontClient = {
  endpoint: `https://${shopifyConfig.store}.myshopify.com/api/2025-01/graphql.json`,
  async fetch<T>(query: string, variables = {}) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": shopifyConfig.storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      return data as T;
    } catch (error) {
      console.error("Shopify Storefront Error:", error);
      throw error;
    }
  },
};

export async function createCheckout(cartItems: CartItem[]) {
  const query = `
    mutation createCheckout($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    },
  };

  const response = await storefrontClient.fetch(query, variables);
  return response.checkoutCreate.checkout;
}
