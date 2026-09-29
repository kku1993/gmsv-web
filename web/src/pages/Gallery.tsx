import {Link} from 'react-router-dom'
import {useFetch} from '@/hooks/useFetch'
import {useSeo} from '@/hooks/useSeo'
import {fetchGalleries, type GallerySummary} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Skeleton} from '@/components/ui/skeleton'
import {Container, PageHeading} from '@/components/Page'

function GalleryCard({gallery}: {gallery: GallerySummary}) {
  const slug = gallery.slug?.current
  const to = slug ? `/gallery/${slug}` : '/gallery'

  return (
    <Link
      to={to}
      className="group flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-md"
    >
      <div className="overflow-hidden rounded-lg">
        <SanityImage
          image={gallery.coverPhoto}
          alt={gallery.title ?? ''}
          width={600}
          height={400}
          aspect="aspect-[3/2]"
          className="w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-medium md:text-xl">{gallery.title ?? 'Untitled gallery'}</h2>
        <p className="text-sm text-muted-foreground">
          {gallery.photoCount} photo{gallery.photoCount === 1 ? '' : 's'}
        </p>
      </div>
    </Link>
  )
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({length: 3}).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Skeleton className="aspect-[3/2] w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  )
}

export default function Gallery() {
  useSeo({
    title: 'Gallery',
    description:
      'Browse photo galleries from Good Morning Silicon Valley events and community gatherings.',
  })
  const {data: galleries, loading, error} = useFetch('galleries', fetchGalleries)

  return (
    <Container>
      <PageHeading
        title="Gallery"
        subtitle="Photos from our events and community gatherings."
      />
      {loading ? (
        <GallerySkeleton />
      ) : error ? (
        <p className="text-muted-foreground">Unable to load galleries.</p>
      ) : !galleries || galleries.length === 0 ? (
        <p className="text-muted-foreground">No galleries yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <GalleryCard key={gallery._id} gallery={gallery} />
          ))}
        </div>
      )}
    </Container>
  )
}
