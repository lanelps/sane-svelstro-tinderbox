import {generateDocumentStructure, generateSingletonStructure} from '../utils/desk'
import type {StructureBuilder} from 'sanity/structure'

const documents = [] as any[]

const DOCUMENT_TYPES_IN_STRUCTURE = [
  `media.tag`,
  `homePage`,
  `project`,
  `settings`,
  ...documents.map((document) => document.type),
] as string[]

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title(`Content`)
    .items([
      ...documents.map((document) => generateDocumentStructure(S, document)),
      S.divider(),
      generateSingletonStructure(S, {
        title: `Home`,
        type: `homePage`,
        icon: () => `🏠`,
      }),
      S.divider(),
      generateDocumentStructure(S, {
        title: `Projects`,
        type: `project`,
        icon: () => `📁`,
      }),
      S.divider(),
      generateSingletonStructure(S, {
        title: `Settings`,
        type: `settings`,
        icon: () => `⚙️`,
      }),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId()
        return id && !DOCUMENT_TYPES_IN_STRUCTURE.includes(id)
      }),
    ])
