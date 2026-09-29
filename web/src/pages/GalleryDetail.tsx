import {useCallback, useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {ChevronLeftIcon, ChevronRightIcon, XIcon} from 'lucide-react'
import {useFetch} from '@/hooks/useFetch'
import {useSeo} from '@/hooks/useSeo'
import {fetchGallery} from '@/sanity/queries'
import {SanityImage} from '@/components/SanityImage'
import {Container} from '@/components/Page'
import {Skeleton} from '@/components/ui/skeleton'
import {Button} from '@/components/ui/button'

export default function GalleryDetail() {
  const {slug} = useParams<{slug: string}>()
  const {data: gallery, loading, error} = useFetch(`gallery-${slug}`, () =>
    fetchGallery(slug ?? ''),
  )
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useSeo({
    title: gallery?.title ?? 'Gallery',
    description: 'A photo gallery from Good Morning Silicon Valley.',
  })

  const photos = gallery?.photos ?? []
  const activePhoto = activeIndex !== null ? photos[activeIndex] : null

  const close = useCallback(() => setActiveIndex(null), [])
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  )
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, close, showPrev, showNext])

  if (loading) {
    return (
      <Container>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-4 h-10 w-2/3" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({length: 8}).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </Container>
    )
  }

  if (error || !gallery) {
    return (
      <Container className="flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Gallery not found</h1>
        <Button render={<Link to="/gallery" />} className="mt-6">
          Back to gallery
        </Button>
      </Container>
    )
  }

  return (
    <>
      <Container>
        <div className="mb-6">
          <Button render={<Link to="/gallery" />} variant="ghost" size="sm">
            ← All galleries
          </Button>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight">{gallery.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {photos.length} photo{photos.length === 1 ? '' : 's'}
        </p>

        {photos.length === 0 ? (
          <p className="mt-8 text-muted-foreground">No photos in this gallery yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, i) => (
              <button
                key={photo._key}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="overflow-hidden rounded-lg transition-opacity hover:opacity-80"
                aria-label={`View photo ${i + 1} full size`}
              >
                <SanityImage
                  image={photo}
                  width={600}
                  height={600}
                  aspect="aspect-square"
                  className="w-full"
                />
              </button>
            ))}
          </div>
        )}
      </Container>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
          role="button"
          tabIndex={-1}
          aria-label="Close full image"
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <XIcon className="size-6" />
          </button>
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  showPrev()
                }}
                className="absolute left-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Previous photo"
              >
                <ChevronLeftIcon className="size-8" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  showNext()
                }}
                className="absolute right-4 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Next photo"
              >
                <ChevronRightIcon className="size-8" />
              </button>
            </>
          ) : null}
          <div onClick={(e) => e.stopPropagation()}>
            <SanityImage
              image={activePhoto}
              width={1600}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
