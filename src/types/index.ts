import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type {
  SanityImageObject,
  SanityImageDimensions,
} from "@sanity/image-url/lib/types/types";
import type { PortableTextBlock } from "@portabletext/types";
import type {
  WebPage,
  Article,
  BlogPosting,
  NewsArticle,
  AboutPage,
  ContactPage,
  FAQPage,
  Product,
  Service,
  Event,
} from "schema-dts";

export interface SanityImageRaw extends SanityImageObject {
  alt?: string;
  url?: string;
  dimensions: SanityImageDimensions;
}

export interface RawImage extends SanityImageRaw {
  mobile?: SanityImageRaw;
}

export interface ImageObject {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: number;
  placeholder: string;
}

export interface Image extends ImageObject {
  mobile?: ImageObject;
}

export interface MuxVideo {
  asset: {
    playbackId: string;
    assetId: string;
    filename: string;
  };
  poster: RawImage;
}

export interface Media {
  _key?: string | undefined;
  type: "image" | "video";
  image?: RawImage;
  video?: MuxVideo;
  layout: "full" | "center" | "left" | "right";
}

export type Slug = {
  current: string;
};

export type Reference = {
  _id: string;
  title: string;
  slug: Slug;
};

export interface ObjLink {
  label: string;
  url: string;
}

export interface ExternalLink {
  type: "external";
  label: string;
  url: string;
  newTab: boolean;
}

export interface FileLink {
  type: "file";
  label: string;
  file: {
    _type: "file";
    asset: {
      url: string;
    };
  };
}

export interface InternalLink {
  type: "internal";
  label: string;
  reference: Reference;
}

export type Link = ExternalLink | FileLink | InternalLink | ObjLink | string;

export type Links = Link[];

export type PortableText = PortableTextBlock[];

export interface NavStore {
  readonly isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export type UrlFor = (
  imgRef: RawImage,
  options?: { quality?: number }
) => ImageUrlBuilder;

export type GetImageProps = (props: {
  image: RawImage;
  maxWidth?: number;
  minimumWidthStep?: number;
  customWidthSteps?: number[];
}) => Image;

export type ProcessImage = (
  img: RawImage,
  maxWidth: number
) => {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: number;
  placeholder: string;
};

export type GetImageDimensions = (image: RawImage) => {
  width: number;
  height: number;
  aspectRatio: number;
};

export type GetRetinaSizes = (
  baseSizes: number[],
  imageWidth: number,
  maxWidth: number,
  minimumWidthStep: number
) => number[];

//

export interface ExampleSection {
  _key: string;
  _type: "example.section";
  heading: string;
  content: PortableText;
}

export interface MediaSection {
  _key: string;
  _type: "media.section";
  media: Media;
}

export interface ProjectsListSection {
  _key: string;
  _type: "projectsList.section";
  projects: ProjectsData;
}

export type Section = ExampleSection | MediaSection | ProjectsListSection;

export type Sections = Section[];

export type SectionMap = {
  example: ExampleSection;
  media: MediaSection;
  projectsList: ProjectsListSection;
};

//

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Organization {
  name: string;
  logo?: RawImage;
  sameAs?: string[];
  address?: Address;
}

export interface Author {
  name: string;
  url?: string;
  image?: RawImage;
}

export type SchemaType =
  | WebPage["@type"]
  | Article["@type"]
  | BlogPosting["@type"]
  | NewsArticle["@type"]
  | AboutPage["@type"]
  | ContactPage["@type"]
  | FAQPage["@type"]
  | Product["@type"]
  | Service["@type"]
  | Event["@type"];

export interface Schema {
  type: SchemaType;
  author?: Author;
  publishedAt?: string;
  modifiedAt?: string;
}

export type SiteData = {
  navigation: Links;
  organization: {
    name?: string;
    description?: string;
    logo?: RawImage;
    address?: Address;
  };
  socialLinks: Links;
  address?: Address;
  seo: SEOSite;
};

export type InlineScript = {
  _type: "scriptInline";
  content: string;
};

export type SrcScript = {
  _type: "scriptSrc";
  src: string;
};

export type Script = InlineScript | SrcScript;

export type SettingsData = {
  scripts: Script[];
  redirects: string[];
};

export interface SEOPage {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: RawImage;
  createdAt?: string;
  updatedAt?: string;
  schema?: Schema;
}

export interface SEOSite {
  title?: string;
  description?: string;
  keywords?: string[];
  favicon?: RawImage;
  image?: RawImage;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: RawImage;
  favicon?: RawImage;
  createdAt?: string;
  updatedAt?: string;
  schema?: Schema;
}

export interface HomePageData {
  _id: string;
  title: string;
  seo: SEOPage;
}

export type PageData = {
  _id: string;
  title: string;
  slug: Slug;
  sections: Section[];
  seo: SEOPage;
};

export type PagesData = {
  _id: string;
  title: string;
  slug: Slug;
}[];

export type ProjectData = {
  _id: string;
  title: string;
  slug: Slug;
  date: string;
  gallery: Media[];
  sections: Section[];
  seo: SEOPage;
};

export type ProjectsData = {
  _id: string;
  title: string;
  slug: Slug;
  date: string;
  thumbnail: Media;
}[];

export type PageTypes = HomePageData | PageData | ProjectData | ProjectsData;
