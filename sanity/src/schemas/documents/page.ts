import {defineField, defineType} from 'sanity'

import sections from '../objects/sections'
import {GROUPS} from '../../constants'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: () => '📄',
  groups: GROUPS,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    sections,
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
    }),
  ],
})
