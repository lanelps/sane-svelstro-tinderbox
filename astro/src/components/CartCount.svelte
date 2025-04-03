<script lang="ts">
  import { cart, openCart } from "@stores/cart";

  const totalItems = $derived(
    $cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    openCart();
  };
</script>

<button onclick={handleClick}>Cart ({totalItems})</button>
