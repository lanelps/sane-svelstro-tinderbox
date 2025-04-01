<script lang="ts">
  import Link from "@components/Link.svelte";
  import Media from "@components/Media.svelte";
  import type { ProjectsListSection, InternalLink } from "@/types";

  interface Props {
    data: ProjectsListSection;
  }

  const { data }: Props = $props();

  $inspect(data.projects);
</script>

<section>
  <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each data.projects as project}
      {@const projectLink: InternalLink = {
        type: "internal",
        label: "",
        reference: {
          _id: project._id,
          _type: "project",
          slug: { current: project.slug.current },
          title: project.title,
        },
      }}

      <li class="rounded-lg border border-gray-200 p-4">
        <Link link={projectLink}>
          <h2 class="text-h2">{project.title}</h2>
          <p>{project.date}</p>
          <Media media={project.thumbnail} />
        </Link>
      </li>
    {/each}
  </ul>
</section>
