import type { Slug } from "./links";
import type { SEOPage } from "./seo";
import type { Media } from "./images";
import type { Sections } from "./sections";

// ==============================
// Pages Data
// ==============================

export interface HomePageData {
  _id: string;
  title: string;
  seo: SEOPage;
}

export type PageData = {
  _id: string;
  title: string;
  slug: Slug;
  sections: Sections;
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
  sections: Sections;
  seo: SEOPage;
};

export type ProjectsData = {
  _id: string;
  title: string;
  slug: Slug;
  date: string;
  thumbnail: Media;
}[];

export interface ProductsData<T = string> {
  _id: string;
  slug: Slug;
  productId: number;
  title: string;
  image: T;
}

export type PageTypes = HomePageData | PageData | ProjectData;
