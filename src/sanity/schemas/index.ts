import type { SchemaTypeDefinition } from "sanity";

// singletons
import { homePageType } from "./singletons/homePage";
import { settingsType } from "./singletons/settings";
import { siteType } from "./singletons/site";

const singletons = [homePageType, settingsType, siteType] as any[];

// documents
import { pageType } from "./documents/page";
import { projectType } from "./documents/project";

const documents = [pageType, projectType] as any[];

// sections
import { exampleSectionType } from "./sections/example";
import { mediaSectionType } from "./sections/media";
import { projectsListSectionType } from "./sections/projectsList";

const sections = [exampleSectionType, mediaSectionType, projectsListSectionType] as any[];

// objects
import { altImageType } from "./objects/altImage";
import { linkType } from "./objects/link";
import { mediaType } from "./objects/media";
import { portableTextType } from "./objects/portableText";
import { scriptInlineType } from "./objects/scriptInline";
import { scriptSrcType } from "./objects/scriptSrc";

// SEO types
import { seoPageType } from "./objects/seo/page";
import { seoSiteType } from "./objects/seo/site";
import { schemaJSONType } from "./objects/schema";

const objects = [
  altImageType,
  linkType,
  mediaType,
  portableTextType,
  scriptInlineType,
  scriptSrcType,
  // SEO types
  seoPageType,
  seoSiteType,
  schemaJSONType,
] as any[];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...singletons, ...documents, ...sections, ...objects],
};
