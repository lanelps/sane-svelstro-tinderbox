import type { PortableText } from "./portableText";
import type { Media, AstroImage } from "./images";
import type { ProjectsData, ProductsData } from "./pages";

// ==============================
// Sections
// ==============================

// Base section interface all sections must implement
export interface BaseSection {
  _type: string;
}

export interface ExampleSection extends BaseSection {
  _type: "section.example";
  heading: string;
  content: PortableText;
}

export interface MediaSection extends BaseSection {
  _type: "section.media";
  media: Media;
}

export interface ProjectsListSection extends BaseSection {
  _type: "section.projectsList";
  projects: ProjectsData;
}

export interface ProductsListSection extends BaseSection {
  _type: "section.productsList";
  products: ProductsData<AstroImage>[];
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
  productsList: ProductsListSection;
};
