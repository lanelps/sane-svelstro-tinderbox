<script lang="ts">
  import { onMount } from "svelte";

  import {
    cart,
    removeItem,
    clearCart,
    updateQuantity,
    closeCart,
    setCartId,
    updateLineItemIds,
  } from "@stores/cart";

  import {
    initializeCart,
    getCheckoutURL,
    getCart,
    updateCart as shopifyUpdateCart,
    removeLineItem as shopifyRemoveLineItem,
  } from "@utils/shopify";

  import type { CartItem, ShopifyCart, ShopifyCartLineItem } from "@/types";

  let cartRef = $state<HTMLDivElement>();
  let isLoading = $state(false);

  /**
   * @name convertShopifyCartItems
   * @function
   * @description Converts a Shopify cart API response into the local CartItem format used by the cart store.
   * @param {{ cart: ShopifyCart | null }} response - The raw Shopify cart response object.
   * @returns {CartItem[]} An array of normalized cart items, or an empty array if the response is invalid.
   */
  const convertShopifyCartItems = (response: {
    cart: ShopifyCart | null;
  }): CartItem[] => {
    if (!response?.cart?.lines?.edges) return [];

    return response.cart.lines.edges.map(
      ({ node }: { node: ShopifyCartLineItem }) => ({
        id: node.id,
        variantId: node.merchandise.id,
        quantity: node.quantity,
        title: node.merchandise.product.title,
        variantTitle: node.merchandise.title,
        price: parseFloat(node.merchandise.priceV2.amount),
        image: node.merchandise.image?.originalSrc || "",
      })
    );
  };

  /**
   * @name syncCartFromShopify
   * @function
   * @description Fetches the current cart state from Shopify and syncs it into the local cart store, updating items and line item IDs.
   * @returns {Promise<void>}
   */
  const syncCartFromShopify = async () => {
    if (!$cart.cartId) return;

    try {
      const response = await getCart({ cartId: $cart.cartId });
      if (response?.cart) {
        const items = convertShopifyCartItems(response);
        cart.set({ ...$cart, items });
        updateLineItemIds(response.cart);
      }
    } catch (error) {
      console.error("Failed to sync cart from Shopify:", error);
    }
  };

  // Initialize Shopify cart on component load
  onMount(async () => {
    try {
      isLoading = true;
      const { cartId } = await initializeCart();
      setCartId(cartId);

      if (cartId) {
        await syncCartFromShopify();
      }
    } catch (error) {
      console.error("Failed to initialize cart:", error);
    } finally {
      isLoading = false;
    }
  });

  /**
   * @name handleKeyDown
   * @function
   * @description Handles keyboard events on the window. Closes the cart when the Escape key is pressed.
   * @param {KeyboardEvent} event - The keyboard event.
   * @returns {void}
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeCart();
    }
  };

  /**
   * @name handleClickOutside
   * @function
   * @description Handles global click events. Closes the cart when the user clicks outside the cart element.
   * @param {MouseEvent} event - The mouse click event.
   * @returns {void}
   */
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      $cart.isOpen &&
      cartRef &&
      !cartRef.contains(target) &&
      !event.defaultPrevented
    ) {
      closeCart();
    }
  };

  // Calculate total price
  const totalPrice = $derived(
    $cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  /**
   * @name handleRemoveItem
   * @function
   * @description Removes a cart item by variant ID. Performs an optimistic local update first, then syncs with Shopify. Reverts on error.
   * @param {string} variantId - The Shopify variant GID of the item to remove.
   * @param {string} itemId - The Shopify line item ID.
   * @returns {Promise<void>}
   */
  const handleRemoveItem = async (variantId: string, itemId: string) => {
    try {
      isLoading = true;
      // Optimistic UI update
      removeItem(variantId);

      if ($cart.cartId && itemId?.trim()) {
        await shopifyRemoveLineItem({ cartId: $cart.cartId, itemId });
      } else if ($cart.cartId) {
        await syncCartFromShopify();
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
      // Restore correct state on failure
      await syncCartFromShopify();
    } finally {
      isLoading = false;
    }
  };

  /**
   * @name handleUpdateQuantity
   * @function
   * @description Updates the quantity of a cart line item in Shopify and syncs the local cart store. Does nothing if newQuantity is less than 1.
   * @param {string} variantId - The Shopify variant GID of the item.
   * @param {string} itemId - The Shopify line item ID.
   * @param {number} newQuantity - The desired new quantity.
   * @returns {Promise<void>}
   */
  const handleUpdateQuantity = async (
    variantId: string,
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      isLoading = true;
      if ($cart.cartId) {
        await shopifyUpdateCart({
          cartId: $cart.cartId,
          itemId,
          variantId,
          quantity: newQuantity,
        });
      }
      // Update local cart state
      updateQuantity(variantId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      await syncCartFromShopify();
    } finally {
      isLoading = false;
    }
  };

  /**
   * @name handleClearCart
   * @function
   * @description Clears all items from the cart by dispatching the clearCart store action.
   * @returns {Promise<void>}
   */
  const handleClearCart = async () => {
    try {
      isLoading = true;
      await clearCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      isLoading = false;
    }
  };

  /**
   * @name handleCheckout
   * @function
   * @description Retrieves the Shopify checkout URL for the current cart and redirects the user to it.
   * @returns {Promise<void>}
   */
  const handleCheckout = async () => {
    if (!$cart.cartId) return;

    try {
      isLoading = true;

      // Get checkout URL and redirect
      const checkoutData = await getCheckoutURL({ cartId: $cart.cartId });
      window.location.href = checkoutData.checkoutUrl;
    } catch (error) {
      console.error("Failed to checkout:", error);
    } finally {
      isLoading = false;
    }
  };
</script>

<svelte:window onkeydown={handleKeyDown} onclick={handleClickOutside} />

<div
  bind:this={cartRef}
  class={[
    "fixed top-0 right-0 z-50 h-full w-96 bg-gray-100 p-4 pb-22 shadow-lg transition-transform",
    $cart.isOpen ? "translate-x-0" : "translate-x-full",
  ]}
>
  {#if $cart.items.length === 0}
    <p
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold uppercase"
    >
      Your cart is empty
    </p>
  {:else}
    <ul class="h-full space-y-4 overflow-hidden overflow-y-scroll bg-white p-4">
      {#each $cart.items as item}
        <li class="border p-2">
          {#if item.image}
            <img
              src={item.image}
              alt={item.title}
              class="h-16 w-16 object-cover"
            />
          {/if}
          <div>
            <h3>{item.title} - {item.variantTitle}</h3>
            <p>${item.price}</p>
            <div>
              <button
                onclick={() =>
                  handleUpdateQuantity(
                    item.variantId,
                    item.id,
                    item.quantity - 1
                  )}
                disabled={isLoading}>-</button
              >
              <span>{item.quantity}</span>
              <button
                onclick={() =>
                  handleUpdateQuantity(
                    item.variantId,
                    item.id,
                    item.quantity + 1
                  )}
                disabled={isLoading}>+</button
              >
            </div>
            <button
              onclick={() => handleRemoveItem(item.variantId, item.id)}
              disabled={isLoading}
            >
              Remove
            </button>
          </div>
        </li>
      {/each}
    </ul>
    <div class="absolute right-0 bottom-0 left-0 h-22 p-4">
      <div class="flex w-full justify-between">
        <p>Total: ${totalPrice.toFixed(2)}</p>
        <button onclick={handleClearCart} disabled={isLoading}
          >Clear Cart</button
        >
      </div>
      <button
        onclick={handleCheckout}
        disabled={isLoading || !$cart.cartId}
        class="mt-2 w-full bg-black p-2 text-white disabled:bg-gray-400"
      >
        {isLoading ? "Processing..." : "Proceed to Checkout"}
      </button>
    </div>
  {/if}
</div>
