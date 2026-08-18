import {cn} from '@/lib/utils'

// Centered max-width container used by all pages for consistent horizontal
// rhythm.
export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto max-w-6xl px-4 py-12', className)}>{children}</div>
}

// Standard page heading with optional subtitle.
export function PageHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
      {subtitle ? <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}
