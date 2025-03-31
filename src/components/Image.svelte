<script lang="ts">
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { getImageProps } from "@sanity/lib/image";
  import type { RawImage, Image as ImageType } from "@/types";

  interface Props {
    class?: string;
    image: RawImage;
    width?: number;
  }

  const { image: node, class: className, width }: Props = $props();

  let image: ImageType | undefined = $state();
  let imageLoaded = $state(false);

  onMount(() => {
    try {
      if (node && node.asset) {
        image = getImageProps({ image: node, maxWidth: width });
      }
    } catch (error) {
      console.error(error);
    }
  });

  const handleImageLoaded = () => {
    imageLoaded = true;
  };
</script>

{#if image}
  <figure class={twMerge("relative", className)}>
    <img
      class="block h-full w-full object-cover"
      loading="lazy"
      src={image.src}
      srcset={image.srcset}
      sizes={image.sizes}
      width={image.width}
      height={image.height}
      alt={node.alt || ""}
      title={node.alt}
      onload={handleImageLoaded}
    />
    <img
      class={[
        "pointer-events-none absolute inset-0 top-0 left-0 block h-full w-full object-cover transition-opacity",
        imageLoaded ? "opacity-0" : "opacity-100",
      ]}
      src={image.placeholder}
      width={image.width}
      height={image.height}
      alt=""
      aria-hidden="true"
      role="presentation"
      loading="eager"
    />
  </figure>
{/if}
