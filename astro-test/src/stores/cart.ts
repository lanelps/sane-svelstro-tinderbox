import { atom } from "nanostores";
import type { CartStore, CartItem } from "@/types";
import { removeLineItems, createNewCart } from "@lib/shopify";

export const cart = atom<CartStore>({
  isOpen: false,
  items: [],
  cartId: null,
});

export const toggleCart = () => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, isOpen: !currentCart.isOpen });
};

export const openCart = () => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, isOpen: true });
};

export const closeCart = () => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, isOpen: false });
};

export const addItem = (item: CartItem) => {
  const currentCart = cart.get();
  const existingItem = currentCart.items.find(
    (i) => i.variantId === item.variantId
  );

  if (existingItem) {
    const updatedItems = currentCart.items.map((cartItem) =>
      cartItem.variantId === item.variantId
        ? {
            ...cartItem,
            quantity: cartItem.quantity + item.quantity,
            // If the item has a Shopify ID and the existing one doesn't, use the new ID
            id: item.id || cartItem.id,
          }
        : cartItem
    );
    cart.set({
      ...currentCart,
      items: updatedItems,
    });
  } else {
    cart.set({
      ...currentCart,
      items: [...currentCart.items, item],
    });
  }

  // Open the cart when an item is added
  openCart();
};

export const removeItem = (variantId: string) => {
  const currentCart = cart.get();
  cart.set({
    ...currentCart,
    items: currentCart.items.filter((item) => item.variantId !== variantId),
  });
};

export const setCartId = (id: string) => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, cartId: id });
};

export const clearCart = async () => {
  const currentCart = cart.get();
  const isCurrentlyOpen = currentCart.isOpen; // Explicitly preserve the open state

  // If we have a Shopify cart ID, we need to remove all items from the Shopify cart
  if (currentCart.cartId && currentCart.items.length > 0) {
    try {
      // Get all item IDs that exist in the Shopify cart
      const itemsToRemove = currentCart.items
        .filter((item) => item.id)
        .map((item) => item.id as string);

      // Remove all items from Shopify cart in a single call if there are any
      if (itemsToRemove.length > 0) {
        await removeLineItems({
          cartId: currentCart.cartId,
          itemIds: itemsToRemove,
        });
      }

      // Create a new cart in Shopify for a fresh start
      const newCartResponse = await createNewCart();

      // Update the cart store with the new cart ID and empty items
      cart.set({
        isOpen: isCurrentlyOpen, // Ensure we maintain the current open state
        items: [],
        cartId: newCartResponse.cartId,
      });
    } catch (error) {
      console.error("Failed to clear Shopify cart:", error);
      // Still clear the local cart even if there was an error with Shopify
      cart.set({
        isOpen: isCurrentlyOpen,
        items: [],
        cartId: currentCart.cartId,
      });
    }
  } else {
    // No Shopify cart ID or no items, just clear the local cart
    cart.set({
      isOpen: isCurrentlyOpen,
      items: [],
      cartId: currentCart.cartId,
    });
  }
};

export const updateQuantity = (variantId: string, newQuantity: number) => {
  if (newQuantity < 1) return;

  const currentCart = cart.get();
  const updatedItems = currentCart.items.map((item) =>
    item.variantId === variantId ? { ...item, quantity: newQuantity } : item
  );

  cart.set({
    ...currentCart,
    items: updatedItems,
  });
};

// Function to update Shopify line item IDs when we get them from API responses
export const updateLineItemIds = (cartData: any) => {
  if (!cartData || !cartData.lines || !cartData.lines.edges) return;

  const currentCart = cart.get();
  const updatedItems = [...currentCart.items];

  cartData.lines.edges.forEach(({ node }: any) => {
    const lineItem = node;
    const matchingItemIndex = updatedItems.findIndex(
      (item) => item.variantId === lineItem.merchandise.id
    );

    if (matchingItemIndex >= 0) {
      updatedItems[matchingItemIndex] = {
        ...updatedItems[matchingItemIndex],
        id: lineItem.id,
      };
    }
  });

  cart.set({
    ...currentCart,
    items: updatedItems,
  });
};
