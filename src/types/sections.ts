import type { PortableText } from "./portableText";
import type { Media } from "./images";
import type { ProjectsData, ProductsData } from "./pages";

// ==============================
// Sections
// ==============================

// Base section interface all sections must implement
export interface BaseSection {
  _type: string;
}

export interface ExampleSection extends BaseSection {
  _type: "example.section";
  heading: string;
  content: PortableText;
}

export interface MediaSection extends BaseSection {
  _type: "media.section";
  media: Media;
}

export interface ProjectsListSection extends BaseSection {
  _type: "projectsList.section";
  projects: ProjectsData;
}

export interface ProductsListSection<T = string> extends BaseSection {
  _type: "productsList.section";
  products: ProductsData<T>[];
}

export type Section =
  | ExampleSection
  | MediaSection
  | ProjectsListSection
  | ProductsListSection;

export type Sections = Section[];

export type SectionMap = {
  example: ExampleSection;
  media: MediaSection;
  projectsList: ProjectsListSection;
};
