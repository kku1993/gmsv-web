import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {client} from '../sanity/client'
import {PAGES_QUERY} from '../sanity/queries'
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLocaleId,
  localePrefix,
  pagePath,
  type LocaleId,
} from '../sanity/i18n'
import type {PAGES_QUERY_RESULT} from '../../sanity.types'

type Row = PAGES_QUERY_RESULT[number]

function pickLocale(row: Row, locale: LocaleId) {
  return locale === 'zh-Hant' ? row['zh-Hant'] : row.en
}

export default function Home() {
  const {locale: localeParam} = useParams<{locale: string}>()
  const locale: LocaleId = isLocaleId(localeParam) ? localeParam : DEFAULT_LOCALE

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    client
      .fetch(PAGES_QUERY)
      .then(setRows)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading pages…</p>
  if (error) return <p>Failed to load pages: {error.message}</p>
  if (rows.length === 0) return <p>No pages yet. Add some in the Studio.</p>

  return (
    <main>
      <h1>Pages</h1>
      <LocaleSwitcher locale={locale} slug={null} />
      <ul>
        {rows.map((row) => {
          const page = pickLocale(row, locale) ?? row.en
          if (!page) return null
          const slug = page.slug?.current
          if (!slug) return null
          return (
            <li key={row.key}>
              <Link to={pagePath(locale, slug)}>{page.title}</Link>
              {page.excerpt ? <p>{page.excerpt}</p> : null}
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export function LocaleSwitcher({locale, slug}: {locale: LocaleId; slug: string | null}) {
  return (
    <nav aria-label="Language" style={{marginBottom: '1rem'}}>
      {LOCALES.map((l, i) => (
        <span key={l.id}>
          {i > 0 && ' | '}
          {l.id === locale ? (
            <strong>{l.title}</strong>
          ) : slug ? (
            <Link to={pagePath(l.id, slug)}>{l.title}</Link>
          ) : (
            <Link to={localePrefix(l.id) || '/'}>{l.title}</Link>
          )}
        </span>
      ))}
    </nav>
  )
}
