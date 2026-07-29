import {defineField, defineType} from 'sanity'
import {PAGE_REFERENCES} from '../../constants'

/**
 * The portable-text annotation counterpart to `link`. Identical apart from having no `label`
 * field — the annotated text is the label — which is why this cannot simply reuse `link`,
 * whose label is required.
 */
export const inlineLinkType = defineType({
  name: 'inlineLink',
  title: 'Link',
  type: 'object',
  icon: () => '🔗',
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
  preview: {
    select: {
      type: 'type',
      url: 'url',
      fileName: 'file.asset.originalFilename',
      referenceTitle: 'reference.title',
    },
    prepare: ({type, url, fileName, referenceTitle}: any) => ({
      title: referenceTitle || fileName || url || 'Untitled link',
      subtitle: type,
    }),
  },
})
