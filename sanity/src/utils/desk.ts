import {DocumentIcon} from '@sanity/icons'
import type {StructureBuilder} from 'sanity/structure'

interface StructureParams {
  title: string
  type: string
  icon?: React.ComponentType
}

export const generateDocumentStructure = (
  S: StructureBuilder,
  {title, type, icon}: StructureParams,
) => {
  return S.listItem()
    .title(title)
    .icon(icon || DocumentIcon)
    .schemaType(type)
    .child(S.documentTypeList(type).defaultOrdering([{field: 'title', direction: 'asc'}]))
}

export const generateSingletonStructure = (
  S: StructureBuilder,
  {title, type, icon}: StructureParams,
) => {
  return S.listItem()
    .title(title)
    .schemaType(type)
    .icon(icon || DocumentIcon)
    .child(S.editor().title(title).schemaType(type).documentId(type))
}
