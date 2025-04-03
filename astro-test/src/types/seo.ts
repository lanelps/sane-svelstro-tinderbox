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
import type { SanityImageData } from "./images";
import type { Links } from "./links";

// ==============================
// SEO
// ==============================

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Organization {
  name: string;
  logo?: SanityImageData;
  sameAs?: string[];
  address?: Address;
}

export interface Author {
  name: string;
  url?: string;
  image?: SanityImageData;
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

export interface SEOPage {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: SanityImageData | string;
  createdAt?: string;
  updatedAt?: string;
  schema?: Schema;
}

export interface SEOSite {
  title?: string;
  description?: string;
  keywords?: string[];
  favicon?: SanityImageData;
  image?: SanityImageData | string;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: SanityImageData | string;
  favicon?: SanityImageData;
  createdAt?: string;
  updatedAt?: string;
  schema?: Schema;
}

export type SiteData = {
  navigation: Links;
  organization: {
    name?: string;
    description?: string;
    logo?: SanityImageData;
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
