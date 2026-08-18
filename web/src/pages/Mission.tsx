import {useFetch} from '@/hooks/useFetch'
import {fetchPage} from '@/sanity/queries'
import {PortableText} from '@/components/PortableText'
import {Container, PageHeading} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'

export default function Mission() {
  const {data: page, loading, error} = useFetch('mission', () => fetchPage('mission'))

  return (
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
        <PortableText value={page.body} />
      ) : (
        <p className="text-muted-foreground">No content yet.</p>
      )}
    </Container>
  )
}
