import {defineField, defineType} from 'sanity'

export const schemaJSONType = defineType({
  name: 'schema',
  title: 'Schema Data (JSON-LD)',
  type: 'object',
  description:
    'Enhanced page information that helps search engines better understand and display your content. This data powers rich search results, making your pages stand out in search listings.',
  fields: [
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      description:
        'What kind of content is this? This helps search engines show your content in relevant searches and with the right visual treatment.',
      options: {
        list: [
          {title: 'Web Page', value: 'WebPage'},
          {title: 'Article', value: 'Article'},
          {title: 'Blog Post', value: 'BlogPosting'},
          {title: 'News Article', value: 'NewsArticle'},
          {title: 'About Page', value: 'AboutPage'},
          {title: 'Contact Page', value: 'ContactPage'},
          {title: 'FAQ Page', value: 'FAQPage'},
          {title: 'Product', value: 'Product'},
          {title: 'Service', value: 'Service'},
          {title: 'Event', value: 'Event'},
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'WebPage',
    }),
    defineField({
      name: 'author',
      title: 'Content Author',
      type: 'object',
      description:
        'Information about who created this content. This helps establish expertise and authority for search engines.',
      fields: [
        {
          name: 'name',
          type: 'string',
          title: 'Name',
          description: 'Full name of the content author',
        },
        {
          name: 'url',
          type: 'url',
          title: 'URL',
          description: 'Link to author profile or bio page',
        },
        {
          name: 'image',
          type: 'image',
          title: 'Photo',
          description: 'Professional photo of the author',
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      description:
        'When was this content first published? Leave empty to use the documents creation date.',
    }),
    defineField({
      name: 'modifiedAt',
      title: 'Last Modified Date',
      type: 'datetime',
      description:
        'When was this content last updated? Leave empty to use the documents last edit date.',
    }),
  ],
})
