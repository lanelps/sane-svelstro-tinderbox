import { media, seoSettings, seoPage } from "@utils/groq";

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
    seo {
        ${seoPage}
    }
}`;

export const settingsQuery = `*[_type == "settings"][0] {
    seo {
        ${seoSettings}
    },
    scripts[] {
        title,
        value,
    }
}`;
