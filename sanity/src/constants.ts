// Currency code (ISO 4217) to use when displaying prices in the studio
import {defineArrayMember} from 'sanity'

// https://en.wikipedia.org/wiki/ISO_4217
export const DEFAULT_CURRENCY_CODE = 'USD'

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['settings', 'site', 'homePage', 'media.tag', 'mux.videoAsset']

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
// - are from the Sanity Connect Shopify app - and can be linked to on Shopify
export const SHOPIFY_DOCUMENT_TYPES = ['product', 'productVariant', 'collection']

// References to include in 'internal' links
export const PAGE_REFERENCES = [
  {type: 'collection'},
  {type: 'homePage'},
  {type: 'page'},
  // { type: "productVariant" },
  {type: 'product'},
  {type: 'project'},
]

export const SECTION_REFERENCES = [
  defineArrayMember({
    type: 'example.section',
  }),
  defineArrayMember({
    type: 'media.section',
  }),
  defineArrayMember({
    type: 'productsList.section',
  }),
  defineArrayMember({
    type: 'projectsList.section',
  }),
]

// API version to use when using the Sanity client within the studio
// https://www.sanity.io/help/studio-client-specify-api-version
export const SANITY_API_VERSION = '2022-10-25'

// Your Shopify store ID.
// This is the ID in your Shopify admin URL (e.g. 'my-store-name' in https://admin.shopify.com/store/my-store-name).
// You only need to provide the ID, not the full URL.
// Set this to enable helper links in document status banners and shortcut links on products and collections.
export const SHOPIFY_STORE_ID = 'sprout-and-spore'

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
