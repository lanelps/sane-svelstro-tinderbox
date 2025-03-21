import type { SchemaTypeDefinition } from "sanity";

// singletons
import homePage from "./singletons/homePage";
import settings from "./singletons/settings";
import site from "./singletons/site";

const singletons = [homePage, settings, site] as any[];

// documents
import page from "./documents/page";
import project from "./documents/project";

const documents = [page, project] as any[];

// sections
import exampleSection from "./sections/example";
import mediaSection from "./sections/media";
import projectsListSection from "./sections/projectsList";

const sections = [exampleSection, mediaSection, projectsListSection] as any[];

// objects
import altImage from "./objects/altImage";
import link from "./objects/link";
import media from "./objects/media";
import portableText from "./objects/portableText";
import scriptInline from "./objects/scriptInline";
import scriptSrc from "./objects/scriptSrc";

// SEO types
import seoPage from "./objects/seo/page";
import seoSite from "./objects/seo/site";
import schemaJSON from "./objects/schema";

const objects = [
  altImage,
  link,
  media,
  portableText,
  scriptInline,
  scriptSrc,
  // SEO types
  seoPage,
  seoSite,
  schemaJSON,
] as any[];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...singletons, ...documents, ...sections, ...objects],
};
