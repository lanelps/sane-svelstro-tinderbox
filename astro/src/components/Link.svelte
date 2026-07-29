<script lang="ts">
  import type { Snippet } from "svelte";

  import { getLinkAttributes } from "@utils/links";

  import type { Link } from "@/types";

  interface Props {
    class?: string;
    link: Link;
    label?: string;
    children?: Snippet;
  }

  let { class: className, link, label, children }: Props = $props();

  // Base styling for all links with option to merge additional classes
  const linkClass = "inline-block text-b1";

  // Use provided label, link's label property, or fallback to slot content
  let displayLabel = $derived(
    label ||
      (typeof link === "object" && "label" in link ? link.label : undefined)
  );

  let attributes = $derived(getLinkAttributes(link));
</script>

{#if attributes}
  <a class={[linkClass, className]} {...attributes}>
    {#if displayLabel}
      {displayLabel}
    {:else}
      {@render children?.()}
    {/if}
  </a>
{:else if displayLabel}
  <span class={[linkClass, className]}>{displayLabel}</span>
{/if}
