import {useFetch} from '@/hooks/useFetch'
import {useSeo} from '@/hooks/useSeo'
import {fetchPage} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Markdown} from '@/components/Markdown'
import {Container, PageHeading} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'

export default function Mission() {
  const {data: page, loading, error} = useFetch('mission', () => fetchPage('mission'))

  useSeo({
    title: page?.title ?? 'Mission',
    description:
      'Learn about the Good Morning Silicon Valley mission and the values that guide our nonprofit work in the Bay Area.',
  })

  return (
    <>
      {page?.bannerImage ? (
        <SanityImage
          image={page.bannerImage}
          alt={page.title ?? ''}
          width={1600}
          height={600}
          className="h-[40vh] min-h-64 w-full object-cover"
        />
      ) : null}

      <Container className="max-w-3xl">
        <PageHeading title={page?.title ?? 'Mission'} />
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <p className="text-muted-foreground">Unable to load content.</p>
        ) : page?.body ? (
          <Markdown content={page.body} />
        ) : (
          <p className="text-muted-foreground">No content yet.</p>
        )}
      </Container>
    </>
  )
}
