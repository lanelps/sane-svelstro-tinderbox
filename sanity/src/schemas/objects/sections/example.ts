import {defineField, defineType} from 'sanity'

export const exampleSectionType = defineType({
  name: 'section.example',
  title: 'Example',
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
    select: {heading: 'heading'},
    prepare: ({heading}: any) => ({
      title: 'Example',
      subtitle: heading || 'No heading',
    }),
  },
})
