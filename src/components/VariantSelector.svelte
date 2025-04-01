<script lang="ts">
  import { addItem } from "@stores/cart";
  import { cart } from "@stores/cart";
  import { addToCart as shopifyAddToCart } from "@/lib/shopify";
  import type { ProductVariant } from "@/types";

  const { variants = null } = $props<{
    variants: ProductVariant[];
  }>();

  let selectedVariant = $state<ProductVariant | null>(variants?.[0] || null);
  let quantity = $state(1);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  const addToCart = async () => {
    if (!selectedVariant) return;

    // TypeScript type guard - create a non-null variable
    const variant = selectedVariant;

    error = null;
    isLoading = true;

    try {
      // If we have a Shopify cartId, add to Shopify first
      if ($cart.cartId) {
        const response = await shopifyAddToCart({
          cartId: $cart.cartId,
          variantId: variant.store.gid,
          quantity,
        });

        // Extract the line item ID from the response
        const lineItem = response.cart.lines.edges.find(
          ({ node }) => node.merchandise.id === variant.store.gid
        );

        // Then update local cart store with the correct ID from Shopify
        addItem({
          id: lineItem ? lineItem.node.id : "",
          variantId: variant.store.gid,
          quantity,
          title: variant.store.title,
          price: variant.store.price,
          image: variant.store.previewImageUrl || "",
        });
      } else {
        // No Shopify cart yet, just add to local store
        addItem({
          id: "",
          variantId: variant.store.gid,
          quantity,
          title: variant.store.title,
          price: variant.store.price,
          image: variant.store.previewImageUrl || "",
        });
      }

      // Reset quantity after adding
      quantity = 1;
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      error = "Failed to add item to cart. Please try again.";
    } finally {
      isLoading = false;
    }
  };

  const decrementQuantity = () => (quantity = Math.max(1, quantity - 1));
  const incrementQuantity = () => (quantity += 1);
</script>

<div class="variant-selector">
  <select bind:value={selectedVariant} disabled={isLoading}>
    {#each variants as variant}
      <option value={variant}>
        {variant.store.title} - ${variant.store.price}
        {variant.store.inventory.isAvailable ? "" : " (Sold Out)"}
      </option>
    {/each}
  </select>

  <div class="quantity-selector">
    <button onclick={decrementQuantity} disabled={isLoading}>-</button>
    <input type="number" bind:value={quantity} min="1" disabled={isLoading} />
    <button onclick={incrementQuantity} disabled={isLoading}>+</button>
  </div>

  <button
    class="cursor-pointer"
    onclick={addToCart}
    disabled={!selectedVariant?.store.inventory.isAvailable || isLoading}
  >
    {isLoading ? "Adding..." : "Add to Cart"}
  </button>

  {#if error}
    <p class="mt-2 text-red-500">{error}</p>
  {/if}
</div>
