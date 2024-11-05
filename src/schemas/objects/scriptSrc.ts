import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'scriptSrc',
  title: 'Script Src',
  type: 'object',
  icon: () => '📜',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      value: 'value',
    },
    prepare: ({title, value}) => ({
      title,
      subtitle: value,
    }),
  },
})
