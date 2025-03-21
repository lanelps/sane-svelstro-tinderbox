import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "sections",
  title: "Sections",
  type: "array",
  group: "content",
  of: [
    defineArrayMember({
      type: "example.section",
    }),
    defineArrayMember({
      type: "media.section",
    }),
    defineArrayMember({
      type: "projectsList.section",
    }),
  ],
});
