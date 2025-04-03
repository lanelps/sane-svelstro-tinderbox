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
      description: 'Configure URL redirects',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
})
