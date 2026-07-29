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

// Field names whose value (or array items) hold raw image data. `*Image`-suffixed keys are
// matched by `isImageKey` rather than listed here. Only add a key here if it holds images
// directly — `gallery`, for instance, holds `media` objects, which must stay raw so `Media`
// can switch on their `type`.
const IMAGE_FIELD_KEYS = ["image", "mainImage", "backgroundImage"];

/**
 * @name isImageKey
 * @function
 * @description Determines whether an object key names an image field, either by exact match against `IMAGE_FIELD_KEYS` or by the `*Image` suffix convention.
 * @param {string} key - The object key to test.
 * @returns {boolean} True when the key names an image field.
 */
const isImageKey = (key: string): boolean =>
  IMAGE_FIELD_KEYS.includes(key) || key.endsWith("Image");

/**
 * @name isImageValue
 * @function
 * @description Determines whether a value is raw image data — either a URL string or a Sanity image object carrying an `asset`.
 * @param {unknown} value - The value to test.
 * @returns {boolean} True when the value can be handed to `processImage`.
 */
const isImageValue = (value: unknown): boolean =>
  typeof value === "string" ||
  (!!value && typeof value === "object" && "asset" in value);

/**
 * @name processNestedImages
 * @function
 * @description Recursively traverses a deeply nested object or array and processes any image fields (see `isImageKey`) into normalized Image objects. An image field may hold a single image or an array of them (e.g. `gallery`).
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
      // Check if this is an image field holding a single image
      if (isImageKey(key) && isImageValue(value)) {
        processed[key] = await processImage(value as SanityImageData | string);
      }
      // ...or an array of images, e.g. a gallery
      else if (isImageKey(key) && Array.isArray(value)) {
        processed[key] = await Promise.all(
          value.map((item) =>
            isImageValue(item)
              ? processImage(item as SanityImageData | string)
              : processNestedImages(item)
          )
        );
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
