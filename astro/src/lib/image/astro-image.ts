import { getImage, inferRemoteSize } from "astro:assets";

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
