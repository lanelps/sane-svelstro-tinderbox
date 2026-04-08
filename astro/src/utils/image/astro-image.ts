import { getImage, inferRemoteSize } from "astro:assets";

/**
 * @name getAstroImage
 * @function
 * @description Fetches and processes a remote image using Astro's image optimization pipeline. Infers the original dimensions, generates an optimized AVIF srcset, and produces a tiny placeholder image for lazy-loading effects.
 * @param {{ image: string; alt: string; width: number }} options - The remote image URL, alt text, and desired display width.
 * @returns {Promise<{ src: string; sizes: string; placeholder: GetImageResult } & GetImageResult>} The processed image result with srcset attributes and a placeholder.
 */
export const getAstroImage = async ({
  image,
  alt,
  width,
}: {
  image: string;
  alt: string;
  width: number;
}) => {
  const { width: imgWidth, height: imgHeight } = await inferRemoteSize(image);
  const aspectRatio = imgWidth / imgHeight;

  const processedImage = await getImage({
    src: image,
    alt,
    width: imgWidth,
    height: imgHeight,
    widths: [width],
    format: "avif",
    quality: "max",
  });

  const placeholder = await getImage({
    src: image,
    width: 32,
    height: Math.round(32 / aspectRatio),
    format: "avif",
    quality: "max",
  });

  return {
    ...processedImage,
    sizes: `(min-width: ${width}px) ${width}px, 100vw`,
    placeholder,
  };
};
