import type { PortableText } from "./portableText";
import type { Media } from "./images";
// #region shopify
import type { AstroImage } from "./images";
// #endregion shopify
import type { ProjectsData } from "./pages";
// #region shopify
import type { ProductsData } from "./pages";
// #endregion shopify

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

// #region shopify
export interface ProductsListSection extends BaseSection {
  _type: "section.productsList";
  products: ProductsData<AstroImage>[];
}
// #endregion shopify

export type Section =
  // #region shopify
  | ProductsListSection
  // #endregion shopify
  | ExampleSection
  | MediaSection
  | ProjectsListSection;

export type Sections = Section[];

export type SectionMap = {
  // #region shopify
  productsList: ProductsListSection;
  // #endregion shopify
  example: ExampleSection;
  media: MediaSection;
  projectsList: ProjectsListSection;
};
