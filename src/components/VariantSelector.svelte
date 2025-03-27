<script lang="ts">
  import { addItem } from "@stores/cart";
  import type { ProductVariant } from "@/types";

  const { variants = null } = $props<{
    variants: ProductVariant[];
  }>();

  let selectedVariant = $state<ProductVariant | null>(variants?.[0] || null);
  let quantity = $state(1);

  const addToCart = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.store.gid,
      quantity,
      title: selectedVariant.store.title,
      price: selectedVariant.store.price,
      image: selectedVariant.store.previewImageUrl || "",
    });
  };

  const decrementQuantity = () => (quantity = Math.max(1, quantity - 1));
  const incrementQuantity = () => (quantity += 1);
</script>

<div class="variant-selector">
  <select bind:value={selectedVariant}>
    {#each variants as variant}
      <option value={variant}>
        {variant.store.title} - ${variant.store.price}
        {variant.store.inventory.isAvailable ? "" : " (Sold Out)"}
      </option>
    {/each}
  </select>

  <div class="quantity-selector">
    <button onclick={decrementQuantity}>-</button>
    <input type="number" bind:value={quantity} min="1" />
    <button onclick={incrementQuantity}>+</button>
  </div>

  <button
    class="cursor-pointer"
    onclick={addToCart}
    disabled={!selectedVariant?.store.inventory.isAvailable}
  >
    Add to Cart
  </button>
</div>
