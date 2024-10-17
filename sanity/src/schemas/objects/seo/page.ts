import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo.page',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Defaults to the projects title',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) =>
        Rule.max(150).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      name: `keywords`,
      title: `Keywords`,
      type: `array`,
      of: [{type: `string`}],
      options: {layout: `tags`},
    }),
    defineField({
      name: `image`,
      title: `Image`,
      type: `image`,
      description: `Used for both search engine results and social cards. Image should have a 16:9 aspect ratio. eg. 1200 x 675 pixels`,
    }),
  ],
  options: {
    collapsible: true,
  },
})
