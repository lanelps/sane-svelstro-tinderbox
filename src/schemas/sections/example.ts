import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'example.section',
  title: 'Example Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText',
    }),
  ],

  preview: {
    select: {
      title: 'heading',
    },
  },
})
