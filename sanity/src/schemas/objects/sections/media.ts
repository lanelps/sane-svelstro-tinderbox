import {defineField, defineType} from 'sanity'

export const mediaSectionType = defineType({
  name: 'section.media',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'media',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      image: 'media.image',
      video: 'media.video.poster',
    },
    prepare: ({image, video}) => ({
      title: 'Media',
      media: image || video,
    }),
  },
})
