import {useFetch} from '@/hooks/useFetch'
import {useSeo} from '@/hooks/useSeo'
import {fetchPage} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Markdown} from '@/components/Markdown'
import {Container, PageHeading} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'

export default function Sponsors() {
  const {data: page, loading, error} = useFetch('sponsors', () => fetchPage('sponsors'))

  useSeo({
    title: page?.title ?? 'Sponsors',
    description:
      'The sponsors and partners who make Good Morning Silicon Valley events, podcasts, and programs possible.',
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
        <PageHeading title={page?.title ?? 'Sponsors'} />
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
