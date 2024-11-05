import type { PageData } from "../types";

export const getPageSeo = (page: PageData) => {
  const seo = {
    title: page?.title || page?.seo?.title || "",
    description: page?.seo?.description || "",
    keywords: page?.seo?.keywords || "",
    image: page?.seo?.image || "",
  };

  return seo;
};
