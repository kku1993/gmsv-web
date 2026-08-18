import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {PortableText} from '@portabletext/react'
import {client} from '../sanity/client'
import {PAGE_QUERY} from '../sanity/queries'
import {DEFAULT_LOCALE, isLocaleId, localePrefix, type LocaleId} from '../sanity/i18n'
import {LocaleSwitcher} from './Home'
import type {PAGE_QUERY_RESULT} from '../../sanity.types'

export default function PageDetail() {
  const {locale: localeParam, slug} = useParams<{locale: string; slug: string}>()
  const locale: LocaleId = isLocaleId(localeParam) ? localeParam : DEFAULT_LOCALE

  const [page, setPage] = useState<PAGE_QUERY_RESULT | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    client
      .fetch(PAGE_QUERY, {slug, locale})
      .then(setPage)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [slug, locale])

  if (loading) return <p>Loading…</p>
  if (error) return <p>Failed to load page: {error.message}</p>
  if (!page) return <p>Page not found.</p>

  const isFallback = page.language !== locale

  return (
    <main>
      <p>
        <Link to={localePrefix(locale) || '/'}>← All pages</Link>
      </p>
      <LocaleSwitcher locale={locale} slug={slug ?? null} />
      {isFallback && (
        <p style={{fontStyle: 'italic'}}>
          This page isn’t available in {locale} yet — showing the English version.
        </p>
      )}
      <h1>{page.title}</h1>
      {page.excerpt ? <p>{page.excerpt}</p> : null}
      {Array.isArray(page.body) && page.body.length > 0 && (
        <PortableText value={page.body} />
      )}
    </main>
  )
}
