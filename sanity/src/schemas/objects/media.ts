import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const mediaType = defineType({
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
      options: {
        collapsible: false,
      },
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      validation: (Rule: any) =>
        Rule.custom((field: any, context: any) => {
          if (context.parent.type === 'video' && !field) {
            return 'A video is required'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.type !== 'video',
    }),
  ],

  preview: {
    select: {
      title: 'type',
      image: 'image',
      video: 'video',
    },

    prepare({title, image, video}: any) {
      return {
        title: title === 'image' ? 'Image' : 'Video',
        subtitle: title === 'video' && video,
        media: title === 'image' ? image : PlayIcon,
      }
    },
  },
})
