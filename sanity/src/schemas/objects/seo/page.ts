import {defineField, defineType} from 'sanity'

export const seoPageType = defineType({
  name: 'seo.page',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        "Falls back to the document's title if left empty. Recommended: a unique, descriptive title written for search results, 50-60 characters.",
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description:
        'A summary of the page content in 150-160 characters. This appears in search results and social shares. Write naturally, include relevant keywords.',
      validation: (Rule) =>
        Rule.max(150).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      description:
        'Add 3-5 specific keywords or phrases that best describe this content. Focus on terms your target audience would use to find this page. Avoid overstuffing with similar variations.',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Used for both search engine results and social cards. Image should have a 16:9 aspect ratio. eg. 1920 x 1080 pixels',
    }),
    defineField({
      name: 'schema',
      title: 'Schema Data (JSON-LD)',
      type: 'schema',
    }),
  ],
  // Field-level `required().warning()` rules on an object's children only run once the
  // object itself has a value, so an entirely empty `seo` block shows no warnings at all.
  // A single object-level custom rule always runs, even against `undefined`.
  validation: (Rule) =>
    Rule.custom((value: {title?: string; description?: string; image?: unknown} | undefined) => {
      const warnings: {message: string; path: string[]}[] = []

      if (!value?.title) {
        warnings.push({
          message:
            "Add a page title — without one this page reuses the document's title rather than one written for search results and social shares.",
          path: ['title'],
        })
      }

      if (!value?.description) {
        warnings.push({
          message:
            'Add a description — without one this page falls back to the site-wide description, which is worse for search engines and social shares.',
          path: ['description'],
        })
      }

      if (!value?.image) {
        warnings.push({
          message:
            'Add an image — without one this page falls back to the site-wide image (or nothing), which weakens link previews on social platforms.',
          path: ['image'],
        })
      }

      return warnings.length > 0 ? warnings : true
    }).warning(),
  preview: {
    select: {title: 'title'},
    prepare: ({title}: any) => ({title: title || 'Page SEO'}),
  },
  options: {
    collapsible: true,
  },
})
