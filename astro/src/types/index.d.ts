export interface PageSeo {
  title: string;
  description: string;
  keywords: string;
  image: string;
}

export interface HomePageData {
  title: string;
  seo: PageSeo;
}

export type PageData = HomePageData;
