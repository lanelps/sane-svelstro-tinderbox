import type { ComponentType } from "react";
import type {
  StructureBuilder,
  ListItemBuilder,
  Divider,
} from "sanity/structure";
import { DocumentIcon } from "@sanity/icons";

interface StructureParams {
  title: string;
  type: string;
  icon?: ComponentType;
  singleton?: boolean;
  divider?: boolean;
}

interface GroupStructureParams {
  title: string;
  type: "group";
  icon?: ComponentType;
  items: StructureParams[];
  divider?: boolean;
}

type StructureReturn = (ListItemBuilder | Divider)[];

export const generateDocumentStructure = (
  S: StructureBuilder,
  { title, type, icon, divider }: StructureParams
): StructureReturn => {
  const structure = S.listItem()
    .title(title)
    .icon(icon || DocumentIcon)
    .schemaType(type)
    .child(
      S.documentTypeList(type).defaultOrdering([
        { field: "title", direction: "asc" },
      ])
    );

  return divider ? [structure, S.divider()] : [structure];
};

export const generateSingletonStructure = (
  S: StructureBuilder,
  { title, type, icon, divider }: StructureParams
): StructureReturn => {
  const structure = S.listItem()
    .title(title)
    .schemaType(type)
    .icon(icon || DocumentIcon)
    .child(S.editor().title(title).schemaType(type).documentId(type));

  return divider ? [structure, S.divider()] : [structure];
};

const generateGroupStructure = (
  S: StructureBuilder,
  { title, icon, items, divider }: GroupStructureParams
): StructureReturn => {
  const structure = S.listItem()
    .title(title)
    .icon(icon || DocumentIcon)
    .child(
      S.list()
        .title(title)
        .items(
          items.flatMap((item) =>
            "singleton" in item && item.singleton
              ? generateSingletonStructure(S, item)
              : generateDocumentStructure(S, item)
          )
        )
    );

  return divider ? [structure, S.divider()] : [structure];
};

const generateStructure = (
  S: StructureBuilder,
  document: StructureParams | GroupStructureParams
): StructureReturn => {
  if (document.type === "group") {
    return generateGroupStructure(S, document as GroupStructureParams);
  } else if ("singleton" in document && document.singleton) {
    return generateSingletonStructure(S, document);
  } else {
    return generateDocumentStructure(S, document);
  }
};

export const generateDeskStructure = (
  S: StructureBuilder,
  documents: (StructureParams | GroupStructureParams)[]
): StructureReturn => {
  return documents.flatMap((document) => generateStructure(S, document));
};

//

interface DocumentItem {
  title: string;
  type: string;
  icon?: () => string;
  singleton?: boolean;
  divider?: boolean;
}

interface GroupDocument {
  title: string;
  type: "group";
  icon?: () => string;
  items: DocumentItem[];
  divider?: boolean;
}

type Document = DocumentItem | GroupDocument;

const documents: Document[] = [
  {
    title: "Pages",
    type: "group",
    icon: () => "📚",
    divider: true,
    items: [
      {
        title: "Home",
        type: "homePage",
        icon: () => "🏠",
        singleton: true,
      },
      {
        title: "Page",
        type: "page",
        icon: () => "📄",
      },
    ],
  },
  {
    title: "Projects",
    type: "project",
    icon: () => "📁",
    divider: true,
  },
  {
    title: "Site",
    type: "site",
    icon: () => "🌐",
    singleton: true,
  },
  {
    title: "Settings",
    type: "settings",
    icon: () => "⚙️",
    singleton: true,
  },
];

const DOCUMENT_TYPES_IN_STRUCTURE = [
  "media.tag",
  "mux.videoAsset",
  ...documents.flatMap((document) => {
    if (document.type === "group") {
      return (document as GroupDocument).items.map((item) => item.type);
    }

    return document.type;
  }),
] as string[];

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      ...generateDeskStructure(S, documents),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId() || "")
      ),
    ]);
