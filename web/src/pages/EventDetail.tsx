import {Link, useParams} from 'react-router-dom'
import {useFetch} from '@/hooks/useFetch'
import {fetchEvent} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Markdown} from '@/components/Markdown'
import {Container} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'
import {Button} from '@/components/ui/button'
import {Separator} from '@/components/ui/separator'
import {formatDate, formatTimeRange} from '@/lib/format'

function MetaItem({label, value}: {label: string; value?: string | null}) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm whitespace-pre-line">{value}</dd>
    </div>
  )
}

export default function EventDetail() {
  const {slug} = useParams<{slug: string}>()
  const {data: event, loading, error} = useFetch(`event-${slug}`, () =>
    fetchEvent(slug ?? ''),
  )

  if (loading) {
    return (
      <Container>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <Skeleton className="mt-6 aspect-[2/1] w-full rounded-lg" />
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </Container>
    )
  }

  if (error || !event) {
    return (
      <Container className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Event not found</h1>
        <Button render={<Link to="/events" />} className="mt-6">
          Back to events
        </Button>
      </Container>
    )
  }

  const date = formatDate(event.date)
  const time = formatTimeRange(event.startTime, event.endTime)

  return (
    <>
      {event.bannerPhoto ? (
        <SanityImage
          image={event.bannerPhoto}
          alt={event.title ?? ''}
          width={1600}
          className="mx-auto max-h-[30vh] w-auto object-contain"
        />
      ) : null}

      <Container>
        <div className="mb-6">
          <Button render={<Link to="/events" />} variant="ghost" size="sm">
            ← All events
          </Button>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight">{event.title}</h1>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {/* Metadata column (left on desktop, first on mobile) */}
          <aside className="md:order-1">
            <dl className="flex flex-col gap-5">
              <MetaItem label="Date" value={date} />
              <MetaItem label="Time" value={time} />
              <MetaItem label="Location" value={event.locationName} />
              <MetaItem label="Address" value={event.locationAddress} />
            </dl>
            <Separator className="my-6 md:hidden" />
          </aside>

          {/* Markdown body (right on desktop) */}
          <div className="md:col-span-2 md:order-2">
            <Markdown content={event.description} />
          </div>
        </div>
      </Container>
    </>
  )
}
