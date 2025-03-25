import { defineArrayMember, defineField } from "sanity";

export const portableTextSimpleType = defineField({
  name: "portableTextSimple",
  type: "array",
  of: [
    defineArrayMember({
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          {
            title: "Italic",
            value: "em",
          },
          {
            title: "Strong",
            value: "strong",
          },
        ],
        annotations: [
          {
            name: "productLink",
            type: "productLink",
          },
          {
            name: "link",
            type: "link",
          },
        ],
      },
      type: "block",
    }),
  ],
});
