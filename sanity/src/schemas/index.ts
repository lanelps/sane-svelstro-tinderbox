import type {SchemaTypeDefinition} from 'sanity'

// singletons
import {homePageType} from './singletons/homePage'
import {settingsType} from './singletons/settings'
import {siteType} from './singletons/site'

const singletons = [homePageType, settingsType, siteType] as any[]

// documents
// #region shopify
import {collectionType} from './documents/collection'
// #endregion shopify
import {pageType} from './documents/page'
// #region shopify
import {productType} from './documents/product'
import {productVariantType} from './documents/productVariant'
// #endregion shopify
import {projectType} from './documents/project'

const documents = [
  // #region shopify
  collectionType,
  productType,
  productVariantType,
  // #endregion shopify
  pageType,
  projectType,
] as any[]

// sections
import {exampleSectionType} from './objects/sections/example'
import {mediaSectionType} from './objects/sections/media'
// #region shopify
import {productsListSectionType} from './objects/sections/productsList'
// #endregion shopify
import {projectsListSectionType} from './objects/sections/projectsList'

const sections = [
  // #region shopify
  productsListSectionType,
  // #endregion shopify
  exampleSectionType,
  mediaSectionType,
  projectsListSectionType,
] as any[]

// objects
import {altImageType} from './objects/altImage'
import {linkType} from './objects/link'
import {mediaType} from './objects/media'
import {portableTextType} from './objects/portableText'
import {scriptInlineType} from './objects/scriptInline'
import {scriptSrcType} from './objects/scriptSrc'

// SEO types
import {seoPageType} from './objects/seo/page'
import {seoSiteType} from './objects/seo/site'
import {schemaJSONType} from './objects/schema'

const objects = [
  altImageType,
  linkType,
  mediaType,
  portableTextType,
  scriptInlineType,
  scriptSrcType,
  // SEO types
  seoPageType,
  seoSiteType,
  schemaJSONType,
] as any[]

// #region shopify
// Shopify-synced object types (managed by the Sanity Connect Shopify app)
import {collectionRuleType} from './objects/shopify/collectionRuleType'
import {inventoryType} from './objects/shopify/inventoryType'
import {optionType} from './objects/shopify/optionType'
import {priceRangeType} from './objects/shopify/priceRangeType'
import {productWithVariantType} from './objects/shopify/productWithVariantType'
import {proxyStringType} from './objects/shopify/proxyStringType'
import {shopifyCollectionType} from './objects/shopify/shopifyCollectionType'
import {shopifyProductType} from './objects/shopify/shopifyProductType'
import {shopifyProductVariantType} from './objects/shopify/shopifyProductVariantType'

const shopify = [
  collectionRuleType,
  inventoryType,
  optionType,
  priceRangeType,
  productWithVariantType,
  proxyStringType,
  shopifyCollectionType,
  shopifyProductType,
  shopifyProductVariantType,
] as any[]
// #endregion shopify

const types = [
  ...singletons,
  ...documents,
  ...sections,
  ...objects,
  // #region shopify
  ...shopify,
  // #endregion shopify
]

export const schema: {types: SchemaTypeDefinition[]} = {
  types,
}
