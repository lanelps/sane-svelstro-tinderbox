import {defineField, defineType} from 'sanity'
import {PAGE_REFERENCES} from '../../constants'

export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: ['external', 'file', 'internal'],
        direction: 'horizontal',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'external',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((label, {parent}: any) => {
          if (parent?.type && !label) {
            return 'Label is required'
          }
          return true
        }),
      hidden: ({parent}: any) => !parent?.type,
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'e.g https://example.com, or mailto:example@gmail.com, or tel:+1234567890',
      validation: (Rule) =>
        Rule.custom((url, {parent}: any) => {
          if (parent?.type === 'external' && !url) {
            return 'External link must have a URL'
          }
          return true
        }).uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
      hidden: ({parent}: any) => parent?.type !== 'external',
    }),
    defineField({
      name: 'newTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}: any) => parent?.type !== 'external',
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        storeOriginalFilename: true,
      },
      validation: (Rule) =>
        Rule.custom((file, {parent}: any) => {
          if (parent?.type === 'file' && !file) {
            return 'File link must have a file'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.type !== 'file',
    }),
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'reference',
      to: PAGE_REFERENCES,
      validation: (Rule) =>
        Rule.custom((reference, {parent}: any) => {
          if (parent?.type === 'internal' && !reference) {
            return 'Internal link must have a reference'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.type !== 'internal',
    }),
  ],
})
