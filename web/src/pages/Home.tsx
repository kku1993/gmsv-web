import {useFetch} from '@/hooks/useFetch'
import {fetchPage} from '@/sanity/queries'
import {PortableText} from '@/components/PortableText'
import {Container} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'

export default function Home() {
  const {data: page, loading, error} = useFetch('home', () => fetchPage('home'))

  return (
    <>
      {/* Full-width banner image */}
      <div className="relative w-full">
        <img
          src="/home-visual.jpg"
          alt="GMSV"
          className="h-[50vh] min-h-80 w-full object-cover"
        />
      </div>

      <Container className="max-w-3xl">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
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
    </>
  )
}
