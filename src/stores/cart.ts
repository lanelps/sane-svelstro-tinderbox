import { atom } from "nanostores";
import type { CartStore, CartItem } from "@/types";

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
        ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
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

export const clearCart = () => {
  const currentCart = cart.get();
  cart.set({ ...currentCart, items: [], cartId: null });
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
