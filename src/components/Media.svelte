<script lang="ts">
  import Image from "@components/Image.svelte";
  import Video from "@components/Video.svelte";
  import type { Media } from "@/types";

  interface Props {
    media: Media;
    class?: string;
  }

  const { media, class: className }: Props = $props();
</script>

{#if media.type === "image" && media.image}
  <Image image={media.image} class={className} />
{:else if media.video}
  <Video video={media.video} class={className} />
{/if}
