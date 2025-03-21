import type { PageTypes } from "@/types";

export const getPageSeo = (page: PageTypes) => {
  const seo = {
    title: page?.title || page?.seo?.title || "",
    description: page?.seo?.description || "",
    keywords: page?.seo?.keywords || "",
    image: page?.seo?.image || "",
  };

  return seo;
};
