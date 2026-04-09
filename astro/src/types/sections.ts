import type { PortableText } from "./portableText";
import type { Media } from "./images";
import type { ProjectsData } from "./pages";

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

export type Section =
  | ExampleSection
  | MediaSection
  | ProjectsListSection;

export type Sections = Section[];

export type SectionMap = {
  example: ExampleSection;
  media: MediaSection;
  projectsList: ProjectsListSection;
};
