import {defineLocations} from 'sanity/presentation'
import type {PresentationPluginOptions} from 'sanity/presentation'

type PageDocument = Record<'title' | 'slug', any>
type ProjectDocument = Record<'title' | 'slug', any>

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    page: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc: PageDocument | null) => {
        if (!doc?.slug) return null
        return {
          locations: [{title: doc.title, href: `/${doc.slug}`}],
        }
      },
    }),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc: ProjectDocument | null) => {
        if (!doc?.slug) return null
        return {
          locations: [
            {title: doc.title, href: `/projects/${doc.slug}`},
            {title: 'Projects Index', href: `/projects`},
          ],
        }
      },
    }),
  },
}
