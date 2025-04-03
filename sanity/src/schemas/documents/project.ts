import {defineField, defineType} from 'sanity'

import sections from '../objects/sections'
import {GROUPS} from '../../constants'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: GROUPS,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'media'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    sections,
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      image: 'thumbnail.image',
      video: 'thumbnail.video.poster',
    },
    prepare: ({title, subtitle, image, video}) => ({
      title,
      subtitle,
      media: image || video,
    }),
  },
})
