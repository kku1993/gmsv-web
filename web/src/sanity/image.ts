import createImageUrlBuilder from '@sanity/image-url'
import {projectId, dataset} from './client'

const builder = createImageUrlBuilder({projectId, dataset})

// Shape of an image field as projected by our GROQ queries:
//   image{asset->{_id, url}, alt}
type QueryImage = {
  asset?: {_id?: string; _ref?: string; url?: string | null} | null
  alt?: string | null
} | null | undefined

// Build an optimized Sanity CDN URL for an image value (the `image` field
// projection from a GROQ query). Returns null when no asset is referenced.
export function urlFor(source: QueryImage) {
  if (!source?.asset) return null
  // @sanity/image-url accepts either an asset reference (`_ref`) or an
  // expanded asset document (`_id`); both work as image sources.
  return builder.image(source as never)
}

export {projectId, dataset}
