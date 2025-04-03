import {defineField, defineType} from 'sanity'

export const seoSiteType = defineType({
  name: 'seo.site',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) =>
        Rule.max(150).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Image should have a 1:1 aspect ratio, no larger that 512x512 pixels',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Used for both search engine results and social cards. Image should have a 16:9 aspect ratio. eg. 1200 x 675 pixels',
    }),
  ],
  options: {
    collapsible: true,
  },
})
