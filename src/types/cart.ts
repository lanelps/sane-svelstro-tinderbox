// ==============================
// Cart
// ==============================

export interface CartItem {
  variantId: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
}

export interface CartStore {
  isOpen: boolean;
  items: CartItem[];
  cartId: string | null;
}
