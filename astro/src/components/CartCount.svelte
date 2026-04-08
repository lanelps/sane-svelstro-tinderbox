<script lang="ts">
  import { cart, openCart } from "@stores/cart";

  const totalItems = $derived(
    $cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  /**
   * @name handleClick
   * @function
   * @description Handles the cart button click event. Stops propagation to prevent triggering the global click-outside handler, then opens the cart.
   * @param {MouseEvent} e - The mouse click event.
   * @returns {void}
   */
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    openCart();
  };
</script>

<button onclick={handleClick}>Cart ({totalItems})</button>
