import type {ComponentType} from 'react'
import type {StructureBuilder, ListItemBuilder, Divider} from 'sanity/structure'
import {DocumentIcon, InfoOutlineIcon} from '@sanity/icons'

interface GroupStructureParams {
  title: string
  type: 'group'
  icon?: ComponentType
  items: DocumentItem[]
  divider?: boolean
}

type StructureReturn = (ListItemBuilder | Divider)[]

interface DocumentItem {
  title: string
  type: string
  icon?: ComponentType
  singleton?: boolean
  divider?: boolean
  orderBy?: string
}

interface GroupDocument {
  title: string
  type: 'group'
  icon?: () => string
  items: DocumentItem[]
  divider?: boolean
}

type Document = DocumentItem | GroupDocument

export const productStructure = (S: StructureBuilder) =>
  S.listItem()
    .title('Products')
    .schemaType('product')
    .child(
      S.documentTypeList('product')
        // .defaultLayout('detail')
        .child(async (id) =>
          S.list()
            .title('Product')
            .canHandleIntent(
              (intentName, params) => intentName === 'edit' && params.type === 'product',
            )
            .items([
              // Details
              S.listItem()
                .title('Details')
                .icon(InfoOutlineIcon)
                .schemaType('product')
                .id(id)
                .child(S.document().schemaType('product').documentId(id)),
              // Product variants
              S.listItem()
                .title('Variants')
                .schemaType('productVariant')
                .child(
                  S.documentList()
                    .title('Variants')
                    .schemaType('productVariant')
                    .filter(
                      `
                      _type == "productVariant"
                      && store.productId == $productId
                    `,
                    )
                    .params({
                      productId: Number(id.replace('shopifyProduct-', '')),
                    })
                    .canHandleIntent(
                      (intentName, params) =>
                        intentName === 'edit' && params.type === 'productVariant',
                    ),
                ),
            ]),
        ),
    )

export const generateDocumentStructure = (
  S: StructureBuilder,
  {title, type, icon, divider, orderBy}: DocumentItem,
): StructureReturn => {
  const structure =
    type === 'product'
      ? productStructure(S)
      : S.listItem()
          .title(title)
          .icon(icon || DocumentIcon)
          .schemaType(type)
          .child(
            S.documentTypeList(type).defaultOrdering([
              {
                field: orderBy || 'title',
                direction: 'asc',
              },
            ]),
          )

  return divider ? [structure, S.divider()] : [structure]
}

export const generateSingletonStructure = (
  S: StructureBuilder,
  {title, type, icon, divider}: DocumentItem,
): StructureReturn => {
  const structure = S.listItem()
    .title(title)
    .schemaType(type)
    .icon(icon || DocumentIcon)
    .child(S.editor().title(title).schemaType(type).documentId(type))

  return divider ? [structure, S.divider()] : [structure]
}

const generateGroupStructure = (
  S: StructureBuilder,
  {title, icon, items, divider}: GroupStructureParams,
): StructureReturn => {
  const structure = S.listItem()
    .title(title)
    .icon(icon || DocumentIcon)
    .child(
      S.list()
        .title(title)
        .items(
          items.flatMap((item) =>
            'singleton' in item && item.singleton
              ? generateSingletonStructure(S, item)
              : generateDocumentStructure(S, item),
          ),
        ),
    )

  return divider ? [structure, S.divider()] : [structure]
}

const generateStructure = (
  S: StructureBuilder,
  document: DocumentItem | GroupStructureParams,
): StructureReturn => {
  if (document.type === 'group') {
    return generateGroupStructure(S, document as GroupStructureParams)
  } else if ('singleton' in document && document.singleton) {
    return generateSingletonStructure(S, document)
  } else {
    return generateDocumentStructure(S, document)
  }
}

export const generateDeskStructure = (
  S: StructureBuilder,
  documents: (DocumentItem | GroupStructureParams)[],
): StructureReturn => {
  return documents.flatMap((document) => generateStructure(S, document))
}

//

const documents: Document[] = [
  {
    title: 'Pages',
    type: 'group',
    icon: () => '📚',
    divider: true,
    items: [
      {
        title: 'Home',
        type: 'homePage',
        icon: () => '🏠',
        singleton: true,
      },
      {
        title: 'Page',
        type: 'page',
        icon: () => '📄',
      },
    ],
  },
  {
    title: 'Projects',
    type: 'project',
    icon: () => '📁',
    divider: true,
  },
  {
    title: 'Collections',
    type: 'collection',
    icon: () => '📦',
    orderBy: 'titleProxy',
  },
  {
    title: 'Products',
    type: 'product',
    icon: () => '🛍',
    divider: true,
  },
  {
    title: 'Site',
    type: 'site',
    icon: () => '🌐',
    singleton: true,
  },
  {
    title: 'Settings',
    type: 'settings',
    icon: () => '⚙️',
    singleton: true,
  },
]

const hiddenDocuments = ['media.tag', 'mux.videoAsset', 'productVariant']

const DOCUMENT_TYPES_IN_STRUCTURE = [
  ...hiddenDocuments,
  ...documents.flatMap((document) => {
    if (document.type === 'group') {
      return (document as GroupDocument).items.map((item) => item.type)
    }

    return document.type
  }),
] as string[]

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      ...generateDeskStructure(S, documents),
      ...S.documentTypeListItems().filter(
        (listItem) => !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId() || ''),
      ),
    ])
