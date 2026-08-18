import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {PortableText} from '@portabletext/react'
import {client} from '../sanity/client'
import {PAGE_QUERY} from '../sanity/queries'
import {urlFor} from '../sanity/image'
import {DEFAULT_LOCALE, isLocaleId, localePrefix, type LocaleId} from '../sanity/i18n'
import {LocaleSwitcher} from './Home'
import type {PAGE_QUERY_RESULT} from '../../sanity.types'

type PageData = NonNullable<PAGE_QUERY_RESULT>
type Person = NonNullable<NonNullable<PageData['people']>[number]>

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
          This page isn't available in {locale} yet — showing the English version.
        </p>
      )}
      <h1>{page.title}</h1>
      {page.excerpt ? <p>{page.excerpt}</p> : null}
      {Array.isArray(page.body) && page.body.length > 0 && (
        <PortableText value={page.body} />
      )}
      {Array.isArray(page.people) && page.people.length > 0 && (
        <People people={page.people.filter(Boolean) as Person[]} />
      )}
    </main>
  )
}

function People({people}: {people: Person[]}) {
  return (
    <section aria-label="Our team" style={{marginTop: '2rem'}}>
      <h2>Our Team</h2>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {people.map((person) => {
          const image = person.image
          const imageUrl = urlFor(image) ? urlFor(image)!.width(320).height(320).fit('crop').url() : null
          const alt = image?.alt ?? person.name ?? 'Portrait'

          const card = (
            <article>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={alt}
                  width={180}
                  height={180}
                  style={{width: '100%', height: 'auto', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px'}}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: '4px',
                    background: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                  }}
                >
                  No photo
                </div>
              )}
              <h4 style={{margin: '0.5rem 0 0'}}>
                {person.name}
              </h4>
              {person.role ? <p style={{margin: '0.25rem 0 0'}}>{person.role}</p> : null}
            </article>
          )

          return (
            <li key={person._id}>
              {person.url ? (
                <a href={person.url} target="_blank" rel="noreferrer noopener" style={{color: 'inherit', textDecoration: 'none'}}>
                  {card}
                </a>
              ) : (
                card
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
