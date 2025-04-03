import {defineField, defineType} from 'sanity'

import sections from '../objects/sections'
import {GROUPS} from '../../constants'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  icon: () => `🏠`,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    sections,
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
  ],
})
