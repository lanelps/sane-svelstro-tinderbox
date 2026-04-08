<script lang="ts">
  import { cart, addItem } from "@stores/cart";
  import { addToCart as shopifyAddToCart } from "@utils/shopify";
  import type { CartItem, ProductVariant } from "@/types";

  const { title, variants = null } = $props<{
    title: string;
    variants: ProductVariant[];
  }>();

  let selectedVariant = $state<ProductVariant | null>(variants?.[0] || null);
  let quantity = $state(1);
  let isLoading = $state(false);
  let error = $state<string | null>(null);

  /**
   * @name createCartItemData
   * @function
   * @description Builds a CartItem object from a ProductVariant and an optional Shopify line item ID.
   * @param {ProductVariant} variant - The selected product variant.
   * @param {string} [lineItemId] - The Shopify line item ID (empty string if not yet synced).
   * @returns {CartItem} The constructed cart item ready to be added to the store.
   */
  const createCartItemData = (
    variant: ProductVariant,
    lineItemId = ""
  ): CartItem => ({
    id: lineItemId,
    variantId: variant.store.gid,
    quantity,
    title: title,
    variantTitle: variant.store.title,
    price: variant.store.price,
    image: variant.store.previewImageUrl || "",
  });

  /**
   * @name addToCart
   * @function
   * @description Adds the selected product variant to the cart. If a Shopify cartId is available, syncs with Shopify first to obtain the line item ID, then commits to the local store.
   * @returns {Promise<void>}
   */
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

        const lineItemId = lineItem ? lineItem.node.id : "";
        addItem(createCartItemData(variant, lineItemId));
      } else {
        // No Shopify cart yet, just add to local store
        addItem(createCartItemData(variant));
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

  /**
   * @name decrementQuantity
   * @function
   * @description Decrements the selected quantity by 1, with a minimum value of 1.
   * @returns {void}
   */
  const decrementQuantity = () => (quantity = Math.max(1, quantity - 1));
  /**
   * @name incrementQuantity
   * @function
   * @description Increments the selected quantity by 1.
   * @returns {void}
   */
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
