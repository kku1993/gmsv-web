import {defineQuery} from 'groq'

export const PAGES_QUERY = defineQuery(
  `*[_type == "page" && defined(slug.current)] | order(title asc){ _id, title, slug, excerpt }`,
)

export const PAGE_QUERY = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]{ _id, title, slug, excerpt, body }`,
)
