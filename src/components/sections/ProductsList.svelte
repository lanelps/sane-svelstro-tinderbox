<script lang="ts">
  import Image from "@components/Image.svelte";
  import type { ProductsListSection, AstroImage } from "@/types";

  interface Props {
    data: ProductsListSection<AstroImage>;
  }

  const { data }: Props = $props();
</script>

<section>
  <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each data.products as product}
      <li class="rounded-lg border border-gray-200 p-4">
        <h2 class="text-h2">{product.title}</h2>
        <Image image={product.image} alt={product.title} />
      </li>
    {/each}
  </ul>
</section>
