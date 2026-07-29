import {defineField, defineType} from 'sanity'

export const seoSiteType = defineType({
  name: 'seo.site',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description:
        'Every page falls back to this description when it has no page-specific one, so this is worth getting right.',
      validation: (Rule) =>
        Rule.max(150).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Image should have a 1:1 aspect ratio, no larger that 512x512 pixels',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Used for both search engine results and social cards. Image should have a 16:9 aspect ratio. eg. 1200 x 675 pixels. Every page falls back to this image when it has no page-specific one.',
    }),
  ],
  // Field-level rules on an object's children only run once the object itself has a value,
  // so an entirely empty `seo` block shows no warnings/errors at all until one field is
  // filled in. A single object-level custom rule always runs, even against `undefined`.
  validation: (Rule) => [
    Rule.custom((value: {title?: string} | undefined) =>
      !value?.title
        ? {
            message:
              'Add a site title — this is the primary title search engines and browsers show for the site.',
            path: ['title'],
          }
        : true,
    ),
    Rule.custom((value: {description?: string; favicon?: unknown; image?: unknown} | undefined) => {
      const warnings: {message: string; path: string[]}[] = []

      if (!value?.description) {
        warnings.push({
          message:
            'Add a site description — every page falls back to this when it has no page-specific description.',
          path: ['description'],
        })
      }

      if (!value?.favicon) {
        warnings.push({
          message: 'Add a favicon — without one, no browser tab icon will be shown.',
          path: ['favicon'],
        })
      }

      if (!value?.image) {
        warnings.push({
          message:
            'Add a site image — pages fall back to this for social link previews when they have no page-specific image.',
          path: ['image'],
        })
      }

      return warnings.length > 0 ? warnings : true
    }).warning(),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}: any) => ({title: title || 'Site SEO'}),
  },
  options: {
    collapsible: true,
  },
})
