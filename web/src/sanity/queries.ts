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

export type PageDocument = {
  _id: string
  title: string | null
  slug: {current?: string | null} | null
  body: string | null
  bannerImage: QueryImage
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

export type GallerySummary = {
  _id: string
  title: string | null
  slug: {current?: string | null} | null
  coverPhoto: QueryImage
  photoCount: number
}

export type GalleryPhoto = QueryImage & {_key: string}

export type GalleryDetail = Omit<GallerySummary, 'photoCount'> & {
  photos: GalleryPhoto[] | null
}

// -----------------------------------------------------------------------------
// Queries
// -----------------------------------------------------------------------------

const PAGE_BY_SLUG = (slug: string) =>
  `*[_type == "page" && slug.current == "${slug}"][0] {
    _id, title, slug, body,
    "bannerImage": bannerImage${IMAGE_PROJECTION}
  }`

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

const GALLERIES = `*[_type == "gallery" && defined(slug.current)] | order(_createdAt desc) {
  _id, title, slug,
  "coverPhoto": coverPhoto${IMAGE_PROJECTION},
  "photoCount": count(photos)
}`

const GALLERY_BY_SLUG = (slug: string) =>
  `*[_type == "gallery" && slug.current == "${slug}"][0] {
    _id, title, slug,
    "coverPhoto": coverPhoto${IMAGE_PROJECTION},
    photos[]{_key, asset->{_id, url}, alt}
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

export const fetchGalleries = () => client.fetch<GallerySummary[]>(GALLERIES)

export const fetchGallery = (slug: string) =>
  client.fetch<GalleryDetail | null>(GALLERY_BY_SLUG(slug))
