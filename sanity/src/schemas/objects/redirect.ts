import {defineField, defineType} from 'sanity'

export const redirectType = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'object',
  icon: () => '↪️',
  fields: [
    defineField({
      name: 'source',
      title: 'Source path',
      type: 'string',
      description: 'The path to redirect from, e.g. /old-page. Must start with a forward slash.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (value && !value.startsWith('/')) {
            return 'Must start with a forward slash, e.g. /old-page'
          }
          return true
        }),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'string',
      description:
        'Where to send visitors instead — an internal path (e.g. /new-page) or a full external URL (e.g. https://example.com).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent redirect',
      type: 'boolean',
      description:
        'Permanent (308) tells search engines and browsers to update their records — use for content that has moved for good. Leave off for a temporary (307) redirect.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      source: 'source',
      destination: 'destination',
      permanent: 'permanent',
    },
    prepare: ({source, destination, permanent}: any) => ({
      title: `${source} → ${destination}`,
      subtitle: permanent ? 'Permanent (308)' : 'Temporary (307)',
    }),
  },
})
