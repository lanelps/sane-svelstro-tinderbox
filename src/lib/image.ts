import { getImage, inferRemoteSize } from "astro:assets";
import { getImageProps } from "@sanity/lib/image";

import type { SanityImageData, Image, AstroImage } from "@/types";

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

/**
 * Process a raw image (either a URL string or Sanity image reference) into a format
 * that can be directly consumed by the Image Svelte component
 */
export async function processImage(
  image: SanityImageData | string | undefined | null,
  options: { width?: number; alt?: string } = {}
): Promise<Image | AstroImage | undefined> {
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
}

/**
 * Process image data in a deep structure like products or sections
 * Recursively traverses objects and arrays to find and process image fields
 */
export async function processNestedImages<T extends Record<string, any>>(
  data: T
): Promise<T> {
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
    const processed = { ...data } as Record<string, any>;

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
        processed[key] = await processNestedImages(value);
      }
    }

    return processed as T;
  }

  // Return primitive values as is
  return data;
}
