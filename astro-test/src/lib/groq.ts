export const image = `
    alt,
    asset {
        _ref,
    },
    "url": asset->url,
    crop {
        left,
        right,
        top,
        bottom,
    },
    hotspot {
        x,
        y,
        height,
        width,
    },
   "dimensions": asset->metadata.dimensions {
        aspectRatio,
        width,
        height,
   },
`;

export const video = `
     asset {
        playbackId,
        assetId,
        filename,
      },
      poster {
        ${image}
      }
`;

export const media = `
    type,
    type == "image" => {
        image {
            ${image}
        },
    },
    type == "video" => {
        video {
            ${video}
        },
    },
`;

// Author Template
export const author = `
    "author": {
        "name": author.name,
        "url": author.url,
        "image": author.image {
            ${image}
        },
    },
`;

// Schema Template
export const schema = `
    "schema": {
        "type": seo.schema.type,
        ${author}
        "publishedAt": seo.schema.publishedAt,
        "modifiedAt": seo.schema.modifiedAt
    },
`;

// SEO Templates
export const baseSEO = `
    "title": seo.title,
    "description": seo.description,
    "keywords": seo.keywords,
    "image": seo.image {
        ${image}
    },
`;

export const siteSEO = `
    "seo": {
        ${baseSEO}
        "favicon": seo.favicon {
            ${image}
        }
    }
`;

export const pageSEO = `
    "seo": {
        ${baseSEO}
        "createdAt": _createdAt,
        "updatedAt": _updatedAt,
        ${schema}
    },
`;

// Content Templates
export const sections = `
    sections[] {
        _key,
        _type,

        // Example
        _type == "example.section" => {
            heading,
            content,
        },

        // Media
        _type == "media.section" => {
            media {
                ${media}
            },
        },

        // Projects List
        _type == "projectsList.section" => {
            projects[] -> {
                _id,
                title,
                slug {
                    current,
                },
                date,
                thumbnail {
                    ${media}
                },
            },
        },

        // Products List
        _type == "productsList.section" => {
            products[] -> {
                _id,
                "slug": store.slug,
	            "productId": store.id,
                "title": store.title,
	            "image": store.previewImageUrl
            },
        },
    },
`;

export const link = `
    type,
    label,
    url,
    newTab,
    file {
        asset -> {
            url,
        },
    },
    reference -> {
        _type,
        _id,
        title,
        slug {
            current,
        },
    },
`;
