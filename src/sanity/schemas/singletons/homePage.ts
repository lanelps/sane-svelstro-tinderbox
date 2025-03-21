import { defineField, defineType } from "sanity";

import sections from "@sanity/lib/sections";

export default defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  icon: () => `🏠`,
  groups: [
    {
      name: "content",
      title: "Content",
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "content",
    }),
    sections,
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo.page",
      group: "seo",
    }),
  ],
});
