import {defineField, defineType} from 'sanity'

export const seoPageType = defineType({
  name: 'seo.page',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Defaults to the documents title',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description:
        'A summary of the page content in 150-160 characters. This appears in search results and social shares. Write naturally, include relevant keywords.',
      validation: (Rule) =>
        Rule.max(150).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      description:
        'Add 3-5 specific keywords or phrases that best describe this content. Focus on terms your target audience would use to find this page. Avoid overstuffing with similar variations.',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Used for both search engine results and social cards. Image should have a 16:9 aspect ratio. eg. 1920 x 1080 pixels',
    }),
    defineField({
      name: 'schema',
      title: 'Schema Data (JSON-LD)',
      type: 'schema',
    }),
  ],
  options: {
    collapsible: true,
  },
})
