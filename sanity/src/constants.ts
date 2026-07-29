import {defineArrayMember} from 'sanity'

// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
export const LOCKED_DOCUMENT_TYPES = ['settings', 'site', 'homePage', 'media.tag', 'mux.videoAsset']

// #region shopify
// Document types which:
// - cannot be created in the 'new document' menu
// - cannot be duplicated, unpublished or deleted
// - are from the Sanity Connect Shopify app - and can be linked to on Shopify
export const SHOPIFY_DOCUMENT_TYPES = ['product', 'productVariant', 'collection']

// Currency code (ISO 4217) to use when displaying prices in the studio
// https://en.wikipedia.org/wiki/ISO_4217
export const DEFAULT_CURRENCY_CODE = 'USD'

// Your Shopify store ID — the ID in your Shopify admin URL
// (e.g. 'my-store-name' in https://admin.shopify.com/store/my-store-name).
// Enables helper links in document status banners and shortcuts on products/collections.
export const SHOPIFY_STORE_ID = process.env.SANITY_STUDIO_SHOPIFY_STORE_ID || ''
// #endregion shopify

// References to include in 'internal' links
export const PAGE_REFERENCES = [
  // #region shopify
  {type: 'collection'},
  {type: 'product'},
  // #endregion shopify
  {type: 'homePage'},
  {type: 'page'},
  {type: 'project'},
]

export const SECTION_REFERENCES = [
  // #region shopify
  defineArrayMember({
    type: 'section.productsList',
  }),
  // #endregion shopify
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
