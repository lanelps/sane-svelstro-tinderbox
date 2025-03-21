import { defineField, defineType } from "sanity";

import sections from "@sanity/lib/sections";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    {
      title: "Content",
      name: "content",
    },
    {
      title: "SEO",
      name: "seo",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    sections,
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo.page",
    }),
  ],
});
