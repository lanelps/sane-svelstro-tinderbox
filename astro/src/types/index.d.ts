import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { PortableTextBlock } from "@portabletext/types";

export interface Image {
  src: string;
  srcset: string;
  sizes: string;
  width: number;
  height: number;
  aspectRatio: number;
  placeholder: string;
  mobile?:
    | {
        src: string;
        srcset: string;
        sizes: string;
        width: number;
        height: number;
        aspectRatio: number;
        placeholder: string;
      }
    | undefined;
}

export interface RawImage {
  alt?: string;
  asset: {
    _ref: string;
  };
  url?: string;
  crop?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  mobile?: {
    asset: {
      _ref: string;
    };
  };
}

export interface Video {
  url: string;
  mimeType: "video/mp4" | "video/webm" | "video/ogg";
  poster: RawImage;
}

export interface Media {
  _key?: string | undefined;
  type: "image" | "video";
  image?: RawImage;
  video?: Video;
  layout: "full" | "center" | "left" | "right";
}

export type PortableText = PortableTextBlock[];

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

export type Section = ExampleSection;

export type Sections = Section[];

export type SectionMap = {
  example: typeof ExampleSection;
};

//

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: RawImage;
  favicon?: RawImage;
}

export interface PageSeo {
  title: string;
  description: string;
  keywords: string;
  image: string;
}

export interface Slug {
  current: string;
}

export interface HomePageData {
  title: string;
  seo: PageSeo;
}

export interface Project {
  _id: string;
  title: string;
  slug: Slug;
  date: string;
  thumbnail: Media;
  gallery: Media[];
  sections: Sections;
  seo: PageSeo;
}

export type PageData = HomePageData | Project;

export interface SiteSettings {
  seo: SettingsSeo;
  scripts?: {
    _key: string;
    title: string;
    value: string;
  }[];
}
