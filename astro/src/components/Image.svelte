<script lang="ts">
  import type { Image } from "@/types";

  interface Props {
    class?: string;
    image?: Image;
    alt?: string;
  }

  const { image, alt = "", class: className }: Props = $props();
  let imageLoaded = $state(false);

  const srcSet = $derived(
    !image?.srcSet
      ? ""
      : typeof image.srcSet === "string"
        ? image.srcSet
        : image.srcSet.attribute || ""
  );

  const placeholderSrc = $derived(
    !image?.placeholder
      ? ""
      : typeof image.placeholder === "string"
        ? image.placeholder
        : image.placeholder.src || ""
  );

  const placeholderAttrs = $derived(
    !image?.placeholder
      ? {}
      : typeof image.placeholder === "string"
        ? {}
        : image.placeholder?.attributes || {}
  );

  /**
   * @name handleImageLoaded
   * @function
   * @description Callback fired when the main image finishes loading. Sets `imageLoaded` to true, triggering the placeholder fade-out transition.
   * @returns {void}
   */
  const handleImageLoaded = () => {
    imageLoaded = true;
  };
</script>

{#if image?.src}
  <figure class={["relative w-full", className]}>
    <img
      class="block h-full w-full object-cover"
      src={image.src}
      srcset={srcSet}
      sizes={image.sizes}
      title={alt}
      {...image.attributes}
      alt={alt || image.attributes?.alt || ""}
      onload={handleImageLoaded}
    />
    {#if image.placeholder}
      <img
        class={[
          "pointer-events-none absolute inset-0 block h-full w-full object-cover transition-opacity",
          imageLoaded ? "opacity-0" : "opacity-100",
        ]}
        src={placeholderSrc}
        width={image.attributes?.width}
        height={image.attributes?.height}
        alt=""
        aria-hidden="true"
        role="presentation"
        loading="eager"
        decoding="sync"
      />
    {/if}
  </figure>
{/if}
