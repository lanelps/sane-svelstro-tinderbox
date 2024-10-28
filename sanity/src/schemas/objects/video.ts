import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
    }),
    defineField({
      name: 'mimeType',
      title: 'MIME Type',
      type: 'string',
      options: {
        list: [
          {title: 'video/mp4', value: 'video/mp4'},
          {title: 'video/webm', value: 'video/webm'},
          {title: 'video/ogg', value: 'video/ogg'},
        ],
      },
      initialValue: 'video/mp4',
    }),
    defineField({
      name: 'poster',
      title: 'Poster',
      type: 'altImage',
    }),
  ],

  preview: {
    select: {
      url: 'url',
      poster: 'poster',
    },
    prepare({url, poster}: any) {
      return {
        title: url,
        media: poster,
      }
    },
  },
})
