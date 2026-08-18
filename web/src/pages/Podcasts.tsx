import {useFetch} from '@/hooks/useFetch'
import {fetchPodcasts, type PodcastSummary} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {formatDate} from '@/lib/format'
import {Skeleton} from '@/components/ui/skeleton'
import {Container} from '@/components/Page'
import Blog, {type BlogPost} from '@/components/shadcn-studio/blocks/blog-component-17/blog-component-17'

// Map a Sanity podcast summary to the BlogPost shape expected by the block.
// The "author" slot surfaces the YouTube link so listeners can jump straight
// to the episode; the card itself links to the local detail page.
function podcastToPost(podcast: PodcastSummary): BlogPost {
  const slug = podcast.slug?.current
  const blogLink = slug ? `/podcasts/${slug}` : '/podcasts'
  const youtube = podcast.youtubeLink ?? '#'

  return {
    title: podcast.title ?? 'Untitled episode',
    description: 'Listen to the latest episode on YouTube.',
    imageUrl: urlFor(podcast.bannerPhoto)?.width(600).height(400).auto('format').quality(80).url() ?? '',
    imageAlt: podcast.bannerPhoto?.alt ?? podcast.title ?? '',
    date: formatDate(podcast.date),
    category: 'Podcast',
    author: 'Watch on YouTube',
    authorLink: youtube,
    blogLink,
    categoryLink: '/podcasts',
  }
}

function PodcastsSkeleton() {
  return (
    <div className='mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='space-y-4'>
        <Skeleton className='h-6 w-24' />
        <Skeleton className='h-10 w-48' />
        <Skeleton className='h-6 w-96' />
      </div>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({length: 3}).map((_, i) => (
          <div key={i} className='flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10'>
            <Skeleton className='h-59.5 w-full rounded-lg' />
            <Skeleton className='h-5 w-1/2' />
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Podcasts() {
  const {data: podcasts, loading, error} = useFetch('podcasts', fetchPodcasts)

  if (loading) {
    return (
      <Container className='px-0 py-0'>
        <PodcastsSkeleton />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <p className='text-muted-foreground'>Unable to load podcasts.</p>
      </Container>
    )
  }

  if (!podcasts || podcasts.length === 0) {
    return (
      <Container>
        <p className='text-muted-foreground'>No podcasts yet.</p>
      </Container>
    )
  }

  return (
    <Blog
      blogPosts={podcasts.map(podcastToPost)}
      heading='Podcast'
      subtitle='Tune in to conversations and stories from our community.'
    />
  )
}
