<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import type { Snippet } from "svelte";
  import type {
    Link,
    ExternalLink,
    FileLink,
    InternalLink,
    ObjLink,
  } from "@/types";

  interface Props {
    class?: string;
    link: Link;
    label?: string;
    children?: Snippet;
  }

  let { class: className, link, label, children }: Props = $props();

  // Helper function to check if a link matches a specific type
  const isType = <T extends Link>(link: Link, type: string): link is T =>
    typeof link === "object" &&
    link !== null &&
    "type" in link &&
    link.type === type;

  // Type guard functions to determine the specific type of link
  const isExternalLink = (link: Link): link is ExternalLink =>
    isType<ExternalLink>(link, "external");
  const isFileLink = (link: Link): link is FileLink =>
    isType<FileLink>(link, "file");
  const isInternalLink = (link: Link): link is InternalLink =>
    isType<InternalLink>(link, "internal");
  const isObjLink = (link: Link): link is ObjLink =>
    typeof link === "object" &&
    link !== null &&
    !("type" in link) &&
    "url" in link;
  const isStringLink = (link: Link): link is string => typeof link === "string";

  // Helper function to determine if we need to include reference type in URL
  const shouldIncludeType = (link: InternalLink): boolean => {
    return link.reference._type !== "page";
  };

  // Configuration object that defines how different types of links should be rendered
  const linkConfig = {
    string: (link: string) => ({ href: `/${link}/` }),
    external: (link: ExternalLink) => ({
      href: link.url,
      target: link.newTab ? "_blank" : "_self",
      rel: "noopener noreferrer",
    }),
    internal: (link: InternalLink) => {
      const typePath = shouldIncludeType(link)
        ? `${link.reference._type}s/`
        : "";
      return {
        href: `/${typePath}${link.reference.slug.current}/`,
      };
    },
    file: (link: FileLink) => ({
      href: link.file.asset.url,
      download: true,
      target: "_blank",
    }),
    obj: (link: ObjLink) => ({ href: link.url }),
  };

  // Determine the appropriate link attributes based on the link type
  const getLinkAttributes = () => {
    if (!link) return null;
    if (isStringLink(link)) return linkConfig.string(link);
    if (isExternalLink(link)) return linkConfig.external(link);
    if (isInternalLink(link)) return linkConfig.internal(link);
    if (isFileLink(link)) return linkConfig.file(link);
    if (isObjLink(link)) return linkConfig.obj(link);
    return null;
  };

  // Base styling for all links with option to merge additional classes
  const linkClass = "inline-block text-b1";
  let allLinkClasses = $derived(twMerge(linkClass, className));

  // Use provided label, link's label property, or fallback to slot content
  let displayLabel = $derived(
    label ||
      (typeof link === "object" && "label" in link ? link.label : undefined)
  );

  let attributes = $derived(getLinkAttributes());
</script>

{#if attributes}
  <a class={allLinkClasses} {...attributes}>
    {#if displayLabel}
      {displayLabel}
    {:else}
      {@render children?.()}
    {/if}
  </a>
{:else if displayLabel}
  <span class={allLinkClasses}>{displayLabel}</span>
{/if}
