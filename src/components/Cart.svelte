<script lang="ts">
  import { twMerge } from "tailwind-merge";

  import {
    cart,
    removeItem,
    clearCart,
    updateQuantity,
    closeCart,
  } from "@stores/cart";

  let cartRef = $state<HTMLDivElement>();

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
</script>

<svelte:window onkeydown={handleKeyDown} onclick={handleClickOutside} />

<div
  bind:this={cartRef}
  class={[
    twMerge(
      "fixed top-0 right-0 h-full w-96 bg-gray-100 p-4 pb-22 shadow-lg transition-transform",
      $cart.isOpen ? "translate-x-0" : "translate-x-full"
    ),
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
            <h3>{item.title}</h3>
            <p>${item.price}</p>
            <div>
              <button
                onclick={() =>
                  updateQuantity(item.variantId, item.quantity - 1)}>-</button
              >
              <span>{item.quantity}</span>
              <button
                onclick={() =>
                  updateQuantity(item.variantId, item.quantity + 1)}>+</button
              >
            </div>
            <button onclick={() => removeItem(item.variantId)}> Remove </button>
          </div>
        </li>
      {/each}
    </ul>
    <div class="absolute right-0 bottom-0 left-0 h-22 p-4">
      <div class="flex w-full justify-between">
        <p>Total: ${totalPrice.toFixed(2)}</p>
        <button onclick={clearCart}>Clear Cart</button>
      </div>
      <button>Proceed to Checkout</button>
    </div>
  {/if}
</div>
