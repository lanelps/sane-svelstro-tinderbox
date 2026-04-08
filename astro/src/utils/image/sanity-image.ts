import { sanityClient } from "sanity:client";
import { createImageUrlBuilder } from "@sanity/image-url";

import type {
  UrlFor,
  GetImageProps,
  ProcessSanityImage,
  GetImageDimensions,
  GetRetinaSizes,
} from "@/types";

const LARGEST_VIEWPORT = 1920;
const LARGEST_VIEWPORT_MOBILE = 768;

const DEFAULT_MIN_STEP = 0.1;
const DEFAULT_FULL_WIDTH_STEPS = [
  320, 375, 428, 768, 960, 1280, 1366, 1440, 1536, 1728,
];

export const imageBuilder = createImageUrlBuilder(sanityClient);

/**
 * @name urlFor
 * @function
 * @description Builds a Sanity image URL using the image URL builder, applying quality, format, and fit options.
 * @param {Parameters<UrlFor>[0]} imgRef - The Sanity image reference or object.
 * @param {Parameters<UrlFor>[1]} [options] - Optional quality and format overrides.
 * @returns {ReturnType<UrlFor>} A Sanity image URL builder instance.
 */
export const urlFor: UrlFor = (imgRef, options) => {
  const { quality = 100, format } = options || {};

  let builder = imageBuilder.image(imgRef).fit("max").quality(quality);

  if (format) {
    builder = builder.format(format);
  } else {
    builder = builder.auto("format");
  }

  return builder;
};

/**
 * @name getImageDimensions
 * @function
 * @description Calculates the effective pixel dimensions and aspect ratio of a Sanity image asset, taking any crop settings into account.
 * @param {Parameters<GetImageDimensions>[0]} image - The Sanity image object with asset ref and optional crop.
 * @returns {{ width: number; height: number; aspectRatio: number }} The effective image dimensions and aspect ratio.
 */
export const getImageDimensions: GetImageDimensions = (image) => {
  const { asset, crop } = image;

  const [originalWidth, originalHeight] = asset._ref
    .split("-")[2]
    .split("x")
    .map(Number);
  let aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (crop) {
    const cropWidth = crop.right + crop.left;
    const cropHeight = crop.top + crop.bottom;

    width = originalWidth * (1 - cropWidth);
    height = originalHeight * (1 - cropHeight);
    aspectRatio = width / height;
  }

  if (!width || !height) {
    throw new Error("Unable to determine image dimensions");
  }

  return { width, height, aspectRatio };
};

/**
 * @name getRetinaSizes
 * @function
 * @description Generates a deduplicated, sorted list of image widths including 1x, 2x, and 3x retina sizes, filtered by the image's maximum width and the minimum step threshold.
 * @param {Parameters<GetRetinaSizes>[0]} baseSizes - The base set of widths to generate retina variants from.
 * @param {Parameters<GetRetinaSizes>[1]} imageWidth - The pixel width of the source image.
 * @param {Parameters<GetRetinaSizes>[2]} maxWidth - The maximum display width constraint.
 * @param {Parameters<GetRetinaSizes>[3]} minimumWidthStep - The minimum fractional step between consecutive sizes.
 * @returns {ReturnType<GetRetinaSizes>} A filtered array of pixel widths for use in a srcset.
 */
const getRetinaSizes: GetRetinaSizes = (
  baseSizes,
  imageWidth,
  maxWidth,
  minimumWidthStep
) => {
  const allSizes = [
    imageWidth,
    ...baseSizes,
    ...baseSizes.map((size) => size * 2),
    ...baseSizes.map((size) => size * 3),
  ];

  const uniqueSizes = Array.from(new Set(allSizes)).sort((a, b) => a - b);

  const filteredSizes = uniqueSizes
    .filter((size) => size <= imageWidth && size <= maxWidth * 3)
    .filter((size, i, arr) => {
      const nextSize = arr[i + 1];
      return nextSize ? nextSize / size > minimumWidthStep + 1 : true;
    });

  return filteredSizes.length > 0 ? filteredSizes : [imageWidth];
};

/**
 * @name getImageProps
 * @function
 * @description Builds all image props needed to render an optimized, responsive Sanity image with retina srcset, sizes string, and a low-quality placeholder URL.
 * @param {Parameters<GetImageProps>[0]} options - Options including the Sanity image object, max width, minimum width step, and optional custom width steps.
 * @returns {ReturnType<GetImageProps>} Image props including src, srcSet, sizes, attributes, and placeholder, or undefined if the image has no asset reference.
 */
export const getImageProps: GetImageProps = ({
  image,
  maxWidth: userMaxWidth = LARGEST_VIEWPORT,
  minimumWidthStep = DEFAULT_MIN_STEP,
  customWidthSteps,
}) => {
  if (!image?.asset?._ref) {
    return undefined;
  }

  /**
   * @name processImage
   * @function
   * @description Builds the full srcset, src, sizes, attributes, and placeholder for a single Sanity image at a given max width.
   * @param {Parameters<ProcessSanityImage>[0]} img - The Sanity image object to process.
   * @param {Parameters<ProcessSanityImage>[1]} maxWidth - The maximum width constraint for this image variant.
   * @returns {ReturnType<ProcessSanityImage>} The processed image props object.
   */
  const processImage: ProcessSanityImage = (img, maxWidth) => {
    const { width: imageWidth, aspectRatio } = getImageDimensions(img);
    const baseSizes = [
      maxWidth,
      ...(customWidthSteps || DEFAULT_FULL_WIDTH_STEPS),
    ];
    const retinaSizes = getRetinaSizes(
      baseSizes,
      imageWidth,
      maxWidth,
      minimumWidthStep
    );

    return {
      attributes: {
        alt: img?.alt || "",
        decoding: "async",
        height: imageWidth / aspectRatio,
        loading: "lazy",
        width: imageWidth,
      },
      src: urlFor(img).width(maxWidth).url(),
      srcSet: {
        attribute: retinaSizes
          .map((size) => `${urlFor(img).width(size).url()} ${size}w`)
          .join(", "),
        values: retinaSizes,
      },
      sizes: userMaxWidth
        ? `(max-width: ${userMaxWidth}px) 100vw, ${userMaxWidth}px`
        : `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`,
      placeholder: urlFor(img, { quality: 100 }).width(32).url(),
    };
  };

  const mainImageProps = processImage(
    image,
    typeof userMaxWidth === "number" ? userMaxWidth : LARGEST_VIEWPORT
  );

  let mobileImageProps;
  if (image?.mobile?.asset?._ref) {
    mobileImageProps = processImage(
      image.mobile,
      typeof userMaxWidth === "number" ? userMaxWidth : LARGEST_VIEWPORT_MOBILE
    );
  }

  return {
    ...mainImageProps,
    ...(mobileImageProps && { mobile: mobileImageProps }),
  };
};
