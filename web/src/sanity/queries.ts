import {client} from './client'

// -----------------------------------------------------------------------------
// Shared projections
// -----------------------------------------------------------------------------

// Inline image projection used across schemas. Resolves the asset document so
// the frontend can build optimized CDN URLs via @sanity/image-url.
const IMAGE_PROJECTION = `{
  asset->{_id, url},
  alt,
}`

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type QueryImage = {
  asset: {_id: string; url: string | null} | null
  alt: string | null
} | null

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
  listItem?: 'bullet' | 'number'
  level?: number
  children?: Array<{_type: 'span'; _key: string; text?: string; marks?: string[]}>
  markDefs?: Array<{_type: 'link'; _key: string; href?: string}>
}

export type PageDocument = {
  _id: string
  title: string | null
  slug: {current?: string | null} | null
  excerpt: string | null
  body: PortableTextBlock[] | null
}

export type Person = {
  _id: string
  name: string | null
  role: string | null
  url: string | null
  image: QueryImage
}

export type EventSummary = {
  _id: string
  title: string | null
  slug: {current?: string | null} | null
  date: string | null
  startTime: string | null
  endTime: string | null
  locationName: string | null
  bannerPhoto: QueryImage
}

export type EventDetail = EventSummary & {
  locationAddress: string | null
  description: string | null
}

export type PodcastSummary = {
  _id: string
  title: string | null
  slug: {current?: string | null} | null
  date: string | null
  youtubeLink: string | null
  bannerPhoto: QueryImage
}

export type PodcastDetail = PodcastSummary

// -----------------------------------------------------------------------------
// Queries
//
// The `page` schema is internationalized via @sanity/document-internationalization,
// but not every page has its `language` field populated (e.g. the Mission page
// has language == null). Per the project plan we assume English content, so we
// fetch by slug and prefer an `en`-tagged version when one exists, falling back
// to any page with that slug.
// -----------------------------------------------------------------------------

const PAGE_BY_SLUG = (slug: string) =>
  `coalesce(
    *[_type == "page" && language == "en" && slug.current == "${slug}"][0] {
      _id, title, slug, excerpt, body
    },
    *[_type == "page" && slug.current == "${slug}"][0] {
      _id, title, slug, excerpt, body
    }
  )`

const PEOPLE = `*[_type == "person"] | order(name asc) {
  _id, name, role, url,
  "image": image${IMAGE_PROJECTION}
}`

const EVENTS = `*[_type == "event" && defined(slug.current)] | order(date desc) {
  _id, title, slug, date, startTime, endTime, locationName,
  "bannerPhoto": bannerPhoto${IMAGE_PROJECTION}
}`

const EVENT_BY_SLUG = (slug: string) =>
  `*[_type == "event" && slug.current == "${slug}"][0] {
    _id, title, slug, date, startTime, endTime, locationName, locationAddress,
    description,
    "bannerPhoto": bannerPhoto${IMAGE_PROJECTION}
  }`

const PODCASTS = `*[_type == "podcast" && defined(slug.current)] | order(date desc) {
  _id, title, slug, date, youtubeLink,
  "bannerPhoto": bannerPhoto${IMAGE_PROJECTION}
}`

const PODCAST_BY_SLUG = (slug: string) =>
  `*[_type == "podcast" && slug.current == "${slug}"][0] {
    _id, title, slug, date, youtubeLink,
    "bannerPhoto": bannerPhoto${IMAGE_PROJECTION}
  }`

// -----------------------------------------------------------------------------
// Fetch helpers
// -----------------------------------------------------------------------------

export const fetchPage = (slug: string) =>
  client.fetch<PageDocument | null>(PAGE_BY_SLUG(slug))

export const fetchPeople = () => client.fetch<Person[]>(PEOPLE)

export const fetchEvents = () => client.fetch<EventSummary[]>(EVENTS)

export const fetchEvent = (slug: string) =>
  client.fetch<EventDetail | null>(EVENT_BY_SLUG(slug))

export const fetchPodcasts = () => client.fetch<PodcastSummary[]>(PODCASTS)

export const fetchPodcast = (slug: string) =>
  client.fetch<PodcastDetail | null>(PODCAST_BY_SLUG(slug))
