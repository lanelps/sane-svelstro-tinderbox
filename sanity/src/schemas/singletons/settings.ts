import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: () => `⚙️`,
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'scripts',
      title: 'External Scripts',
    },
  ],
  fields: [
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.settings',
      group: 'seo',
      options: {
        collapsed: false,
        collapsible: true,
      },
    }),
    // Scripts
    defineField({
      name: 'scripts',
      title: 'External Scripts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'scriptSrc',
        }),
        defineArrayMember({
          type: 'scriptInline',
        }),
      ],
      group: 'scripts',
      description:
        'Add external scripts to the <head> of the document. For example, Google Analytics. These fields are not sanitized, so be careful what you put in here.',
    }),
  ],
  preview: {
    select: {},
    prepare: () => ({
      title: 'Settings',
    }),
  },
})
