import {Link} from 'react-router-dom'
import {useFetch} from '@/hooks/useFetch'
import {fetchPodcasts, type PodcastSummary} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Container, PageHeading} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'
import {Badge} from '@/components/ui/badge'
import {formatDate} from '@/lib/format'

function PodcastRow({podcast}: {podcast: PodcastSummary}) {
  const slug = podcast.slug?.current
  const to = slug ? `/podcasts/${slug}` : '#'
  const date = formatDate(podcast.date)

  return (
    <Link
      to={to}
      className="flex flex-col gap-4 border-b border-border py-6 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
    >
      <SanityImage
        image={podcast.bannerPhoto}
        alt={podcast.title ?? ''}
        width={320}
        height={200}
        aspect="aspect-video"
        className="w-full rounded-lg sm:w-64 sm:shrink-0"
      />
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{podcast.title}</h2>
        {date ? <Badge variant="secondary">{date}</Badge> : null}
      </div>
    </Link>
  )
}

function PodcastRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-border py-6 sm:flex-row sm:items-center">
      <Skeleton className="aspect-video w-full rounded-lg sm:w-64 sm:shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  )
}

export default function Podcasts() {
  const {data: podcasts, loading, error} = useFetch('podcasts', fetchPodcasts)

  return (
    <Container>
      <PageHeading title="Podcast" />
      {error ? (
        <p className="text-muted-foreground">Unable to load podcasts.</p>
      ) : loading ? (
        <div className="flex flex-col">
          {Array.from({length: 4}).map((_, i) => (
            <PodcastRowSkeleton key={i} />
          ))}
        </div>
      ) : podcasts && podcasts.length > 0 ? (
        <div className="flex flex-col">
          {podcasts.map((podcast) => (
            <PodcastRow key={podcast._id} podcast={podcast} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No podcasts yet.</p>
      )}
    </Container>
  )
}
