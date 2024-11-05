export const image = `
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
`;

export const altImage = `
    alt,
    ${image}
    mobile {
        asset {
            _ref,
        },
    },
`;

export const cloudinaryVideo = `
    public_id,
    width,
    height,
    "url": secure_url,
`;

export const video = `
    url,
    poster {
        ${image}
    },
`;

export const media = `
    type,
    image {
        ${image}
    },
    video {
        ${video}
    },
    layout,
`;

export const sections = `
    _key,
    _type,

    // Example Section
    _type == "example.section" => {
        heading,
        content
    },
`;

export const seoSettings = `
    title,
    description,
    keywords,
    favicon {
        ${image}
    },
    image {
        ${image}
    },
`;

export const seoPage = `
    title,
    description,
    keywords,
    image {
        ${image}
    },
`;
