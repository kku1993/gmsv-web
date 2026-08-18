import {Link} from 'react-router-dom'
import {useFetch} from '@/hooks/useFetch'
import {fetchEvents, type EventSummary} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Container, PageHeading} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'
import {Badge} from '@/components/ui/badge'
import {formatDate, formatTimeRange} from '@/lib/format'

function EventRow({event}: {event: EventSummary}) {
  const slug = event.slug?.current
  const to = slug ? `/events/${slug}` : '#'
  const date = formatDate(event.date)
  const time = formatTimeRange(event.startTime, event.endTime)
  const place = event.locationName

  return (
    <Link
      to={to}
      className="flex flex-col gap-4 border-b border-border py-6 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
    >
      <SanityImage
        image={event.bannerPhoto}
        alt={event.title ?? ''}
        width={320}
        height={200}
        aspect="aspect-video"
        className="w-full rounded-lg sm:w-64 sm:shrink-0"
      />
      <div className="flex flex-1 flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{event.title}</h2>
        <div className="flex flex-wrap gap-2">
          {date ? <Badge variant="secondary">{date}</Badge> : null}
          {time ? <Badge variant="outline">{time}</Badge> : null}
          {place ? <Badge variant="outline">{place}</Badge> : null}
        </div>
      </div>
    </Link>
  )
}

function EventRowSkeleton() {
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

export default function Events() {
  const {data: events, loading, error} = useFetch('events', fetchEvents)

  return (
    <Container>
      <PageHeading title="Events" />
      {error ? (
        <p className="text-muted-foreground">Unable to load events.</p>
      ) : loading ? (
        <div className="flex flex-col">
          {Array.from({length: 4}).map((_, i) => (
            <EventRowSkeleton key={i} />
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="flex flex-col">
          {events.map((event) => (
            <EventRow key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No events yet.</p>
      )}
    </Container>
  )
}
