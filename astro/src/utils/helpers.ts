import type { PageTypes } from "@/types";

export const getPageSeo = (page: PageTypes) => {
  const seo = {
    title: page?.title || page?.seo?.title || "",
    description: page?.seo?.description || "",
    keywords: page?.seo?.keywords || [],
    image: page?.seo?.image || "",
  };

  return seo;
};

// create a function that takes an HTML string and removes all the HTML tags and returns the plain text
export const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, "");
};
