import {useFetch} from '@/hooks/useFetch'
import {fetchEvents, type EventSummary} from '@/sanity/queries'
import {urlFor} from '@/sanity/image'
import {formatDate, formatTimeRange} from '@/lib/format'
import {Skeleton} from '@/components/ui/skeleton'
import {Container} from '@/components/Page'
import Blog, {type BlogPost} from '@/components/shadcn-studio/blocks/blog-component-17/blog-component-17'

// Map a Sanity event summary to the BlogPost shape expected by the block.
// Image URLs are built up-front via the Sanity image URL builder so the block
// can render them with a plain <img> tag.
function eventToPost(event: EventSummary): BlogPost {
  const slug = event.slug?.current
  const blogLink = slug ? `/events/${slug}` : '/events'
  const time = formatTimeRange(event.startTime, event.endTime)
  const place = event.locationName ?? ''
  const description = [time, place].filter(Boolean).join(' · ')

  return {
    title: event.title ?? 'Untitled event',
    description,
    imageUrl: urlFor(event.bannerPhoto)?.width(600).height(400).auto('format').quality(80).url() ?? '',
    imageAlt: event.bannerPhoto?.alt ?? event.title ?? '',
    date: formatDate(event.date),
    category: 'Event',
    author: place || 'GMSV',
    authorLink: blogLink,
    blogLink,
    categoryLink: '/events',
  }
}

function EventsSkeleton() {
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

export default function Events() {
  const {data: events, loading, error} = useFetch('events', fetchEvents)

  if (loading) {
    return (
      <Container className='px-0 py-0'>
        <EventsSkeleton />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <p className='text-muted-foreground'>Unable to load events.</p>
      </Container>
    )
  }

  if (!events || events.length === 0) {
    return (
      <Container>
        <p className='text-muted-foreground'>No events yet.</p>
      </Container>
    )
  }

  return (
    <Blog
      blogPosts={events.map(eventToPost)}
      heading='Events'
      subtitle='Join us at our upcoming community events and gatherings.'
    />
  )
}
