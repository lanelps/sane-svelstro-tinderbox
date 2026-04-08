<script lang="ts">
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

  /**
   * @name isType
   * @function
   * @description Generic type guard that checks whether a link object has a `type` property matching the given string.
   * @param {Link} link - The link to inspect.
   * @param {string} type - The expected type string to match against.
   * @returns {link is T} True if the link's type property equals the given type.
   */
  const isType = <T extends Link>(link: Link, type: string): link is T =>
    typeof link === "object" &&
    link !== null &&
    "type" in link &&
    link.type === type;

  /**
   * @name isExternalLink
   * @function
   * @description Type guard: returns true if the link is an ExternalLink.
   * @param {Link} link - The link to test.
   * @returns {link is ExternalLink}
   */
  const isExternalLink = (link: Link): link is ExternalLink =>
    isType<ExternalLink>(link, "external");
  /**
   * @name isFileLink
   * @function
   * @description Type guard: returns true if the link is a FileLink.
   * @param {Link} link - The link to test.
   * @returns {link is FileLink}
   */
  const isFileLink = (link: Link): link is FileLink =>
    isType<FileLink>(link, "file");
  /**
   * @name isInternalLink
   * @function
   * @description Type guard: returns true if the link is an InternalLink.
   * @param {Link} link - The link to test.
   * @returns {link is InternalLink}
   */
  const isInternalLink = (link: Link): link is InternalLink =>
    isType<InternalLink>(link, "internal");
  /**
   * @name isObjLink
   * @function
   * @description Type guard: returns true if the link is an ObjLink (an object with a `url` property but no `type` property).
   * @param {Link} link - The link to test.
   * @returns {link is ObjLink}
   */
  const isObjLink = (link: Link): link is ObjLink =>
    typeof link === "object" &&
    link !== null &&
    !("type" in link) &&
    "url" in link;
  /**
   * @name isStringLink
   * @function
   * @description Type guard: returns true if the link is a plain string.
   * @param {Link} link - The link to test.
   * @returns {link is string}
   */
  const isStringLink = (link: Link): link is string => typeof link === "string";

  /**
   * @name shouldIncludeType
   * @function
   * @description Determines whether the reference type segment should be prepended to the URL path for an internal link. Returns true for all reference types except 'page'.
   * @param {InternalLink} link - The internal link to evaluate.
   * @returns {boolean} True if the reference type should be included in the URL path.
   */
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

  /**
   * @name getLinkAttributes
   * @function
   * @description Resolves the appropriate anchor attributes (href, target, rel, download) for the given link by testing each type guard in order.
   * @returns {{ href: string; target?: string; rel?: string; download?: boolean } | null} The resolved attributes object, or null if the link is falsy or unrecognized.
   */
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

  // Use provided label, link's label property, or fallback to slot content
  let displayLabel = $derived(
    label ||
      (typeof link === "object" && "label" in link ? link.label : undefined)
  );

  let attributes = $derived(getLinkAttributes());
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
