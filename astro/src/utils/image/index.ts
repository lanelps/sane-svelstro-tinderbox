import { getImageProps } from "@utils/image/sanity-image";
import { getAstroImage } from "@utils/image/astro-image";

import type { SanityImageData, Image, AstroImage } from "@/types";

/**
 * @name processImage
 * @function
 * @description Processes a raw image value (URL string or Sanity image reference) into a normalized Image or AstroImage object for use in the Image Svelte component.
 * @param {SanityImageData | string | undefined | null} image - The raw image to process.
 * @param {{ width?: number; alt?: string }} [options] - Optional width and alt text overrides.
 * @returns {Promise<Image | AstroImage | undefined>} The processed image object, or undefined if the input is falsy or processing fails.
 */
export const processImage = async (
  image: SanityImageData | string | undefined | null,
  options: { width?: number; alt?: string } = {}
): Promise<Image | AstroImage | undefined> => {
  if (!image) return undefined;

  try {
    const { width = 1920, alt = "" } = options;

    if (typeof image === "string") {
      return getAstroImage({
        image,
        alt,
        width,
      });
    } else if (image?.asset) {
      return getImageProps({ image, maxWidth: width });
    }

    return undefined;
  } catch (error) {
    console.error("Failed to process image:", error);
    return undefined;
  }
};

/**
 * @name processNestedImages
 * @function
 * @description Recursively traverses a deeply nested object or array and processes any image fields (keys named "image", "mainImage", "backgroundImage", or ending in "Image") into normalized Image objects.
 * @param {T} data - The data structure to traverse and process.
 * @returns {Promise<T>} The same data structure with all image fields replaced by processed image objects.
 */
export const processNestedImages = async <T>(data: T): Promise<T> => {
  if (!data) return data;

  // Handle arrays
  if (Array.isArray(data)) {
    const processed = await Promise.all(
      data.map((item) => processNestedImages(item))
    );
    return processed as unknown as T;
  }

  // Handle objects
  if (typeof data === "object") {
    const processed = { ...data } as Record<string, unknown>;

    for (const [key, value] of Object.entries(processed)) {
      // Check if this is an image field
      if (
        (key === "image" ||
          key === "mainImage" ||
          key === "backgroundImage" ||
          key.endsWith("Image")) &&
        (typeof value === "string" ||
          (value && typeof value === "object" && "asset" in value))
      ) {
        processed[key] = await processImage(value as SanityImageData | string);
      }
      // Recursively process nested objects and arrays
      else if (typeof value === "object" && value !== null) {
        processed[key] = await processNestedImages(
          value as Record<string, unknown>
        );
      }
    }

    return processed as T;
  }

  // Return primitive values as is
  return data;
};
