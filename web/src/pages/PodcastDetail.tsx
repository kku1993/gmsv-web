import {Link, useParams} from 'react-router-dom'
import {useFetch} from '@/hooks/useFetch'
import {useSeo} from '@/hooks/useSeo'
import {fetchPodcast} from '@/sanity/queries'
import {Container} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {youtubeId} from '@/lib/youtube'
import {formatDate} from '@/lib/format'

function YouTubePlayer({url}: {url: string | null}) {
  const id = youtubeId(url)
  if (!id) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
        No video available
      </div>
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}

export default function PodcastDetail() {
  const {slug} = useParams<{slug: string}>()
  const {data: podcast, loading, error} = useFetch(`podcast-${slug}`, () =>
    fetchPodcast(slug ?? ''),
  )

  useSeo({
    title: podcast?.title ?? 'Podcast',
    description:
      'A Good Morning Silicon Valley podcast episode. Watch the full conversation on YouTube.',
  })

  if (loading) {
    return (
      <Container>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <Skeleton className="mt-6 aspect-video w-full rounded-lg" />
      </Container>
    )
  }

  if (error || !podcast) {
    return (
      <Container className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Podcast not found</h1>
        <Button render={<Link to="/podcasts" />} className="mt-6">
          Back to podcasts
        </Button>
      </Container>
    )
  }

  const date = formatDate(podcast.date)

  return (
    <Container className="max-w-4xl">
      <div className="mb-6">
        <Button render={<Link to="/podcasts" />} variant="ghost" size="sm">
          ← All podcasts
        </Button>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight">{podcast.title}</h1>
      {date ? (
        <div className="mt-3">
          <Badge variant="secondary">{date}</Badge>
        </div>
      ) : null}

      <Separator className="my-6" />

      <YouTubePlayer url={podcast.youtubeLink} />
    </Container>
  )
}
