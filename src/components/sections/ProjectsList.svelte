<script lang="ts">
  import Media from "@components/Media.svelte";
  import type { ProjectsListSection } from "@/types";

  interface Props {
    data: ProjectsListSection;
  }

  const { data }: Props = $props();
</script>

<section>
  <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each data.projects as project}
      <li class="rounded-lg border border-gray-200 p-4">
        <h2 class="text-h2">{project.title}</h2>
        <p>{project.date}</p>
        <Media media={project.thumbnail} />
      </li>
    {/each}
  </ul>
</section>
