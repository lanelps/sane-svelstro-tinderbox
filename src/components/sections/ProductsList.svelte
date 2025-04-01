<script lang="ts">
  import Link from "@components/Link.svelte";
  import Image from "@components/Image.svelte";
  import type { InternalLink, ProductsListSection } from "@/types";

  interface Props {
    data: ProductsListSection;
  }

  const { data }: Props = $props();
</script>

<section>
  <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each data.products as product}
      {@const productLink: InternalLink = {
      type: "internal",
      label: "",
      reference: {
        _id: product._id,
        _type: "product",
        slug: { current: product.slug.current },
        title: product.title,
      },
    }}
      <li class="rounded-lg border border-gray-200 p-4">
        <Link link={productLink} class="block">
          <h2 class="text-h2">{product.title}</h2>
          <Image image={product.image} alt={product.title} />
        </Link>
      </li>
    {/each}
  </ul>
</section>
