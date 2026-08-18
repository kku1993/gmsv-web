import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {PortableText} from '@portabletext/react'
import {client} from '../sanity/client'
import {PAGE_QUERY} from '../sanity/queries'
import type {PAGE_QUERY_RESULT} from '../../sanity.types'

export default function PageDetail() {
  const {slug} = useParams<{slug: string}>()
  const [page, setPage] = useState<PAGE_QUERY_RESULT | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    client
      .fetch(PAGE_QUERY, {slug})
      .then(setPage)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <p>Loading…</p>
  if (error) return <p>Failed to load page: {error.message}</p>
  if (!page) return <p>Page not found.</p>

  return (
    <main>
      <p>
        <Link to="/">← All pages</Link>
      </p>
      <h1>{page.title}</h1>
      {page.excerpt ? <p>{page.excerpt}</p> : null}
      {Array.isArray(page.body) && page.body.length > 0 && (
        <PortableText value={page.body} />
      )}
    </main>
  )
}
