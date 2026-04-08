import { atom } from "nanostores";
import type {
  CartStore,
  CartItem,
  ShopifyCart,
  ShopifyCartLineItem,
} from "@/types";
import { removeLineItems, createNewCart } from "@utils/shopify";

export const cart = atom<CartStore>({
  isOpen: false,
  items: [],
  cartId: null,
});

/**
 * @name toggleCart
 * @function
 * @description Toggles the cart open state between open and closed.
 * @returns {void}
 */
export const toggleCart = () => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, isOpen: !currentCart.isOpen });
};

/**
 * @name openCart
 * @function
 * @description Sets the cart open state to true, making it visible.
 * @returns {void}
 */
export const openCart = () => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, isOpen: true });
};

/**
 * @name closeCart
 * @function
 * @description Sets the cart open state to false, hiding it.
 * @returns {void}
 */
export const closeCart = () => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, isOpen: false });
};

/**
 * @name addItem
 * @function
 * @description Adds a cart item to the store. If the item already exists (by variantId), increments its quantity. Opens the cart after adding.
 * @param {CartItem} item - The cart item to add.
 * @returns {void}
 */
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

/**
 * @name removeItem
 * @function
 * @description Removes a cart item from the store by variant ID.
 * @param {string} variantId - The Shopify variant ID of the item to remove.
 * @returns {void}
 */
export const removeItem = (variantId: string) => {
  const currentCart = cart.get();
  cart.set({
    ...currentCart,
    items: currentCart.items.filter((item) => item.variantId !== variantId),
  });
};

/**
 * @name setCartId
 * @function
 * @description Stores the Shopify cart ID in the cart store.
 * @param {string} id - The full Shopify cart GID.
 * @returns {void}
 */
export const setCartId = (id: string) => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, cartId: id });
};

/**
 * @name clearCart
 * @function
 * @description Clears all items from the cart. If a Shopify cart ID exists, removes all line items from Shopify and creates a fresh cart. Preserves the current open/closed state.
 * @returns {Promise<void>}
 */
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

/**
 * @name updateQuantity
 * @function
 * @description Updates the quantity of a cart item identified by variant ID. Does nothing if newQuantity is less than 1.
 * @param {string} variantId - The Shopify variant ID of the item to update.
 * @param {number} newQuantity - The new quantity to set. Must be >= 1.
 * @returns {void}
 */
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

/**
 * @name updateLineItemIds
 * @function
 * @description Syncs Shopify line item IDs from an API cart response into the local cart store.
 * @param {ShopifyCart} cartData - The Shopify cart object containing lines and edges.
 * @returns {void}
 */
export const updateLineItemIds = (cartData: ShopifyCart) => {
  if (!cartData || !cartData.lines || !cartData.lines.edges) return;

  const currentCart = cart.get();
  const updatedItems = [...currentCart.items];

  cartData.lines.edges.forEach(({ node }: { node: ShopifyCartLineItem }) => {
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
