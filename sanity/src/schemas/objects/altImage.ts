import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'altImage',
  title: 'Image (with alt)',
  type: 'image',
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: 'mobile',
      title: 'Mobile Image',
      type: 'image',
      description: 'Optional. If not set, the main image will be used for mobile.',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Important for SEO and accessiblity.',
    }),
  ],
  preview: {
    select: {
      alt: 'alt',
      image: 'asset',
    },
    prepare: ({alt, image}) => ({
      title: alt || 'Image',
      media: image,
    }),
  },
})
