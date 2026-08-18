import {useFetch} from '@/hooks/useFetch'
import {fetchPage} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Markdown} from '@/components/Markdown'
import {Container} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'

export default function Home() {
  const {data: page, loading, error} = useFetch('home', () => fetchPage('home'))

  return (
    <>
      {/* Full-width banner image: prefer the page's banner, fall back to the static asset */}
      <div className="relative w-full">
        {page?.bannerImage ? (
          <SanityImage
            image={page.bannerImage}
            alt={page.title ?? 'GMSV'}
            width={1600}
            height={800}
            className="h-[50vh] min-h-80 w-full object-cover"
          />
        ) : (
          <img
            src="/home-visual.jpg"
            alt="GMSV"
            className="h-[50vh] min-h-80 w-full object-cover"
          />
        )}
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
          <Markdown content={page.body} />
        ) : (
          <p className="text-muted-foreground">No content yet.</p>
        )}
      </Container>
    </>
  )
}
