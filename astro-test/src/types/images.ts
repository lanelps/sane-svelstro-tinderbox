import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type {
  SanityImageObject,
  SanityImageDimensions,
} from "@sanity/image-url/lib/types/types";
import type { GetImageResult } from "astro";

// ==============================
// Image Types
// ==============================

export interface SanityImageSource extends SanityImageObject {
  alt?: string;
  url?: string;
  dimensions: SanityImageDimensions;
}

export interface SanityImageData extends SanityImageSource {
  mobile?: SanityImageSource;
}

export interface SanityProcessedImage {
  attributes: {
    alt: string;
    decoding?: "async" | "auto" | "sync";
    height?: number;
    loading?: "lazy" | "eager";
    width?: number;
  };
  src: string;
  srcSet: {
    attribute: string;
    values: number[];
  };
  sizes: string;
  placeholder?: string;
}

export interface SanityImage extends SanityProcessedImage {
  mobile?: SanityProcessedImage;
}

export interface AstroImage extends GetImageResult {
  sizes: string;
  placeholder: GetImageResult;
}

export type Image = AstroImage | SanityImage;

export interface MuxVideo {
  asset: {
    playbackId: string;
    assetId: string;
    filename: string;
  };
  poster: SanityImageData;
}

export interface Media {
  _key?: string;
  type: "image" | "video";
  image?: SanityImage;
  video?: MuxVideo;
  layout: "full" | "center" | "left" | "right";
}

// ==============================
// Image Function Types
// ==============================

export type UrlFor = (
  imgRef: SanityImageData,
  options?: { quality?: number; format?: "png" | "webp" | "jpg" }
) => ImageUrlBuilder;

export type GetImageProps = (props: {
  image: SanityImageData;
  maxWidth?: number;
  minimumWidthStep?: number;
  customWidthSteps?: number[];
}) => SanityImage | undefined;

export type ProcessSanityImage = (
  img: SanityImageData,
  maxWidth: number
) => SanityProcessedImage;

export type GetImageDimensions = (image: SanityImageData) => {
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
