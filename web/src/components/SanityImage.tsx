import {urlFor} from '@/sanity/image'
import type {QueryImage} from '@/sanity/queries'
import {cn} from '@/lib/utils'

type SanityImageProps = {
  image: QueryImage
  alt?: string
  width?: number
  height?: number
  className?: string
  // Optional aspect-ratio class (e.g. "aspect-[4/3]") for layout sizing when
  // exact dimensions aren't known.
  aspect?: string
}

// Renders a Sanity image field via the image URL builder. Falls back to the
// provided alt text, then the image's own alt, then an empty string.
export function SanityImage({
  image,
  alt,
  width,
  height,
  className,
  aspect,
}: SanityImageProps) {
  const builder = urlFor(image)
  const finalAlt = alt ?? image?.alt ?? ''

  if (!builder) {
    // Placeholder when no asset is referenced. Sized via `aspect` + `className`
    // (e.g. `aspect-square w-full`) to match the <img> branch below, so grid
    // layout stays consistent when some items are missing an image.
    return (
      <div
        className={cn(
          'bg-muted flex items-center justify-center text-muted-foreground',
          aspect,
          className,
        )}
        aria-label={finalAlt || undefined}
      />
    )
  }

  let src = builder
  if (width) src = src.width(width)
  if (height) src = src.height(height)
  // Auto format + quality for optimized delivery.
  const url = src.auto('format').quality(80).url()

  return (
    <img
      src={url ?? undefined}
      alt={finalAlt}
      width={width}
      height={height}
      loading="lazy"
      className={cn('object-cover', aspect, className)}
    />
  )
}
