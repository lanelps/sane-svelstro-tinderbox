import { media, sections, seoSettings, seoPage } from "@utils/groq";

export const settingsQuery = `*[_type == "settings"][0] {
    seo {
        ${seoSettings}
    },
    scripts[] {
        title,
        value,
    }
}`;

export const homePageQuery = `*[_type == "homePage"][0] {
    title,
    seo {
        ${seoPage}
    }
}`;

export const projectsQuery = `*[_type == "project"] | order(date desc) {
    _id,
    slug, 
    title,
    description,
    categories,
    collaborators,
    software,
    date,
    thumbnail {
        ${media}
    },
    gallery[] {
        _key,
        ${media}
    },
    sections[] {
        ${sections}
    },
    seo {
        ${seoPage}
    }
}`;
