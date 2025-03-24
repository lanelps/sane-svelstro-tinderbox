import { image, link, sections, siteSEO, pageSEO, media } from "@lib/groq";

export const siteQuery = `*[_type == "site"][0]{
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

export const settingsQuery = `*[_type == "settings"][0]{
	scripts[]{
		_type,
		content,
		src
	},
	redirects
}`;

export const homePageQuery = `*[_type == "homePage"][0] {
	title,
	${pageSEO}
}`;

export const pageQuery = `*[_type == "page" && slug.current == $slug][0] {
	_id,
	title,
	slug {
		current
	},
	${sections}
	${pageSEO}
}`;

export const pagesQuery = `*[_type == "page"] {
	_id,
	title,
	slug {
		current
	},
}`;

export const projectQuery = `*[_type == "project" && slug.current == $slug][0] {
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

export const projectsQuery = `*[_type == "project"] | order(date desc) {
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
