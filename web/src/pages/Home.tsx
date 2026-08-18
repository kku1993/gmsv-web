import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {client} from '../sanity/client'
import {PAGES_QUERY} from '../sanity/queries'
import type {PAGES_QUERY_RESULT} from '../../sanity.types'

type PageSummary = PAGES_QUERY_RESULT[number]

export default function Home() {
  const [pages, setPages] = useState<PageSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    client
      .fetch(PAGES_QUERY)
      .then(setPages)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading pages…</p>
  if (error) return <p>Failed to load pages: {error.message}</p>
  if (pages.length === 0) return <p>No pages yet. Add some in the Studio.</p>

  return (
    <main>
      <h1>Pages</h1>
      <ul>
        {pages.map((page) => (
          <li key={page._id}>
            <Link to={`/${page.slug?.current}`}>{page.title}</Link>
            {page.excerpt ? <p>{page.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  )
}
