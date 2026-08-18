import {PortableText as PortableTextComponent} from '@portabletext/react'
import type {PortableTextBlock} from '@/sanity/queries'

const components = {
  block: {
    h1: ({children}: {children?: React.ReactNode}) => (
      <h1 className="text-3xl font-semibold tracking-tight mt-8 mb-4">{children}</h1>
    ),
    h2: ({children}: {children?: React.ReactNode}) => (
      <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-3">{children}</h2>
    ),
    h3: ({children}: {children?: React.ReactNode}) => (
      <h3 className="text-xl font-semibold tracking-tight mt-6 mb-2">{children}</h3>
    ),
    h4: ({children}: {children?: React.ReactNode}) => (
      <h4 className="text-lg font-semibold tracking-tight mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({children}: {children?: React.ReactNode}) => (
      <blockquote className="border-l-2 border-border pl-4 italic text-muted-foreground my-4">
        {children}
      </blockquote>
    ),
    normal: ({children}: {children?: React.ReactNode}) => (
      <p className="leading-7 mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({children}: {children?: React.ReactNode}) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    number: ({children}: {children?: React.ReactNode}) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
  },
  marks: {
    link: ({children, value}: {children?: React.ReactNode; value?: {href?: string}}) => {
      const href = value?.href
      if (!href) return <>{children}</>
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-4"
          {...(external ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        >
          {children}
        </a>
      )
    },
  },
}

export function PortableText({value}: {value: PortableTextBlock[] | null | undefined}) {
  if (!value || value.length === 0) return null
  return (
    <div className="text-foreground">
      <PortableTextComponent value={value as never} components={components as never} />
    </div>
  )
}
