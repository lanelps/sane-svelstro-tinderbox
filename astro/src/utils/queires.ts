import groq from "groq";

// Relative import: Sanity's typegen module resolver runs from the `sanity/`
// workspace and can't see astro's `@utils/*` tsconfig path alias.
import { image, link, sections, siteSEO, pageSEO, media } from "./groq";

export const siteQuery = groq`*[_type == "site"][0]{
	navigation[]{
		_key,
		${link}
	},
	organization{
		name,
		description,
		logo {
			${image}
		},
		address,
	},
	socialLinks[]{
		_key,
		link {
			${link}
		}
	},
	${siteSEO}
}`;

export const settingsQuery = groq`*[_type == "settings"][0]{
	"scripts": coalesce(scripts[]{
		_type,
		title,
		value
	}, [])
}`;

export const redirectsQuery = groq`*[_type == "settings"][0]{
	"redirects": coalesce(redirects[]{
		source,
		destination,
		permanent
	}, [])
}`;

export const homePageQuery = groq`*[_type == "homePage"][0] {
	title,
	${pageSEO}
}`;

export const pageQuery = groq`*[_type == "page" && slug.current == $slug][0] {
	_id,
	title,
	slug {
		current
	},
	${sections}
	${pageSEO}
}`;

export const pagesQuery = groq`*[_type == "page"] {
	_id,
	title,
	slug {
		current
	},
}`;

export const projectQuery = groq`*[_type == "project" && slug.current == $slug][0] {
	_id,
	title,
	slug {
		current
	},
	date,
	gallery[] {
		${image}
	},
	${sections}
	${pageSEO}
}`;

export const projectsQuery = groq`*[_type == "project"] | order(date desc) {
	_id,
	title,
	slug {
		current
	},
	date,
	thumbnail {
		${media}
	},
}`;

// #region shopify
// Self-joins variants via `^.store.id` so the query needs only `$slug`.
// This works identically for SSG (getStaticPaths) and SSR builds.
export const productQuery = groq`*[_type == "product" && store.slug.current == $slug][0] {
	...,
	"details": @,
	"variants": *[_type == "productVariant" && store.productId == ^.store.id]
}`;

export const productsQuery = groq`*[_type == "product"] {
	_id,
	"slug": store.slug,
	"productId": store.id,
}`;
// #endregion shopify
