import {defineField, defineType} from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'scripts',
      title: 'Scripts',
      description: 'Add custom scripts (analytics, tracking, etc.)',
      type: 'array',
      of: [{type: 'scriptInline'}, {type: 'scriptSrc'}],
    }),
    defineField({
      name: 'redirects',
      title: 'Redirects',
      description:
        'Send visitors from an old path to a new one. Applied before the page is served, so a redirect always wins over a real page at the same path.',
      type: 'array',
      of: [{type: 'redirect'}],
    }),
  ],
  preview: {
    select: {},
    prepare: () => ({title: 'Settings'}),
  },
})
