import {useEffect} from 'react'

// Default site-wide title suffix. Individual pages override the title and meta
// description via useSeo() to set route-specific SEO metadata.
const DEFAULT_TITLE = 'Good Morning Silicon Valley'

type SeoOptions = {
  title?: string
  description?: string
}

// Set the document title and <meta name="description"> for a route. Keeps SEO
// metadata co-located with the page that owns it; safe to call on every render
// since the effect only updates the DOM when values change.
export function useSeo({title, description}: SeoOptions) {
  useEffect(() => {
    document.title = title ? `${title} · ${DEFAULT_TITLE}` : DEFAULT_TITLE

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
      )
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])
}
