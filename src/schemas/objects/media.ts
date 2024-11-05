import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
      validation: (Rule: any) =>
        Rule.custom((field: any, context: any) => {
          if (context.parent.type === 'image' && !field) {
            return 'An image is required'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.type !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'video',
      validation: (Rule: any) =>
        Rule.custom((field: any, context: any) => {
          if (context.parent.type === 'video' && !field) {
            return 'An video is required'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.type !== 'video',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Center', value: 'center'},
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'full',
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'image.alt',
      type: 'type',
      image: 'image',
      video: 'video',
    },
    prepare({type, title, image, video}: any) {
      return {
        title: type === 'image' && title ? title : 'Media',
        media: type === 'image' ? image : video,
      }
    },
  },
})
