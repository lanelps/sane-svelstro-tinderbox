<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { onMount } from "svelte";

  import {
    cart,
    removeItem,
    clearCart,
    updateQuantity,
    closeCart,
    setCartId,
  } from "@stores/cart";

  import {
    initializeCart,
    getCheckoutURL,
    addToCart as shopifyAddToCart,
    updateCart as shopifyUpdateCart,
    removeLineItem as shopifyRemoveLineItem,
  } from "@/lib/shopify";

  let cartRef = $state<HTMLDivElement>();
  let checkoutUrl = $state<string | null>(null);
  let isLoading = $state(false);

  // Initialize Shopify cart on component load
  onMount(async () => {
    try {
      isLoading = true;
      const { cartId } = await initializeCart();
      setCartId(cartId);

      // If we have a cart ID, get the checkout URL
      if (cartId) {
        const checkoutData = await getCheckoutURL({ cartId });
        checkoutUrl = checkoutData.checkoutUrl;
      }
    } catch (error) {
      console.error("Failed to initialize cart:", error);
    } finally {
      isLoading = false;
    }
  });

  // Handle checkout
  const handleCheckout = async () => {
    if (!$cart.cartId) return;

    try {
      isLoading = true;

      // Sync any remaining local cart changes to Shopify
      for (const item of $cart.items) {
        await shopifyAddToCart({
          cartId: $cart.cartId,
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }

      // Get fresh checkout URL
      const checkoutData = await getCheckoutURL({ cartId: $cart.cartId });

      // Redirect to checkout
      window.location.href = checkoutData.checkoutUrl;
    } catch (error) {
      console.error("Failed to checkout:", error);
    } finally {
      isLoading = false;
    }
  };

  const totalPrice = $derived(
    $cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeCart();
    }
  };

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

  // Enhanced removeItem that syncs with Shopify
  const handleRemoveItem = async (variantId: string, itemId: string) => {
    try {
      if ($cart.cartId) {
        await shopifyRemoveLineItem({
          cartId: $cart.cartId,
          itemId,
        });
      }
      // Remove from local cart state
      removeItem(variantId);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Enhanced updateQuantity that syncs with Shopify
  const handleUpdateQuantity = async (
    variantId: string,
    itemId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
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
    }
  };
</script>

<svelte:window onkeydown={handleKeyDown} onclick={handleClickOutside} />

<div
  bind:this={cartRef}
  class={[
    twMerge(
      "fixed top-0 right-0 z-50 h-full w-96 bg-gray-100 p-4 pb-22 shadow-lg transition-transform",
      $cart.isOpen ? "translate-x-0" : "translate-x-full"
    ),
  ]}
>
  {#if isLoading}
    <p
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold"
    >
      Loading...
    </p>
  {:else if $cart.items.length === 0}
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
            <h3>{item.title}</h3>
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
        <button onclick={clearCart} disabled={isLoading}>Clear Cart</button>
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
