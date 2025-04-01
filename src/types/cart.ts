// ==============================
// Cart
// ==============================

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  title: string;
  variantTitle: string;
  price: number;
  image: string;
}

export interface CartStore {
  isOpen: boolean;
  items: CartItem[];
  cartId: string | null;
}

// Shopify specific cart types
export interface ShopifyCartLineItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      originalSrc: string;
    };
    product: {
      title: string;
      handle?: string;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: ShopifyCartLineItem;
    }[];
  };
}

export interface ShopifyCartResponse<T = ShopifyCart> {
  cart: T;
  userErrors: {
    field: string;
    message: string;
  }[];
}
