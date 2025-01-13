import { DocumentIcon } from "@sanity/icons";
import type { StructureBuilder } from "sanity/structure";

interface StructureParams {
  title: string;
  type: string;
  icon?: React.ComponentType;
}

export const generateDocumentStructure = (
  S: StructureBuilder,
  { title, type, icon }: StructureParams
) => {
  return S.listItem()
    .title(title)
    .icon(icon || DocumentIcon)
    .schemaType(type)
    .child(
      S.documentTypeList(type).defaultOrdering([
        { field: "title", direction: "asc" },
      ])
    );
};

export const generateSingletonStructure = (
  S: StructureBuilder,
  { title, type, icon }: StructureParams
) => {
  return S.listItem()
    .title(title)
    .schemaType(type)
    .icon(icon || DocumentIcon)
    .child(S.editor().title(title).schemaType(type).documentId(type));
};

const documents = [] as any[];

const DOCUMENT_TYPES_IN_STRUCTURE = [
  `media.tag`,
  `homePage`,
  `project`,
  `settings`,
  ...documents.map((document) => document.type),
] as string[];

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
        const id = listItem.getId();
        return id && !DOCUMENT_TYPES_IN_STRUCTURE.includes(id);
      }),
    ]);
