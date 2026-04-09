import {defineArrayMember} from 'sanity'

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['settings', 'site', 'homePage', 'media.tag', 'mux.videoAsset']

// References to include in 'internal' links
export const PAGE_REFERENCES = [
  {type: 'homePage'},
  {type: 'page'},
  {type: 'project'},
]

export const SECTION_REFERENCES = [
  defineArrayMember({
    type: 'section.example',
  }),
  defineArrayMember({
    type: 'section.media',
  }),
  defineArrayMember({
    type: 'section.projectsList',
  }),
]

// API version to use when using the Sanity client within the studio
// https://www.sanity.io/help/studio-client-specify-api-version
export const SANITY_API_VERSION = '2022-10-25'

// Field groups used through schema types
export const GROUPS = [
  {
    title: 'Content',
    name: 'content',
  },
  {
    title: 'SEO',
    name: 'seo',
  },
]
