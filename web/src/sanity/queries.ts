import {defineQuery} from 'groq'

// List pages: iterate over default-locale (en) documents only (one row per
// slug), then project each locale's translation alongside. Falls back to the
// default locale for any slug that hasn't been translated yet.
export const PAGES_QUERY = defineQuery(
  `*[_type == "page" && language == "en" && defined(slug.current)] {
    "key": slug.current,
    "en": { _id, title, slug, excerpt, language },
    "zh-Hant": *[_type == "page" && language == "zh-Hant" && slug.current == ^.slug.current][0] { _id, title, slug, excerpt, language },
  } | order(en.title asc)`,
)

// Fetch a single page by slug + locale, with fallback to the default locale
// (en) when a translation doesn't exist yet. Resolves the `people` array of
// references into the referenced person documents, including their image asset
// (hosted on Sanity) so the frontend can render portraits via the image URL
// builder.
export const PAGE_QUERY = defineQuery(
  `coalesce(
    *[_type == "page" && language == $locale && slug.current == $slug][0] {
      _id, title, slug, excerpt, body, language,
      "people": people[]->{_id, name, role, url, "image": image{asset->{_id, url}, alt}}
    },
    *[_type == "page" && language == "en" && slug.current == $slug][0] {
      _id, title, slug, excerpt, body, language,
      "people": people[]->{_id, name, role, url, "image": image{asset->{_id, url}, alt}}
    }
  )`,
)
