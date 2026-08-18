import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {cn} from '@/lib/utils'

// Renders a Sanity `markdown` field value with shadcn-aligned typography.
export function Markdown({content, className}: {content: string | null | undefined; className?: string}) {
  if (!content) return null
  return (
    <div className={cn('text-foreground', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({children}) => <h1 className="text-3xl font-semibold tracking-tight mt-8 mb-4">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-3">{children}</h2>,
          h3: ({children}) => <h3 className="text-xl font-semibold tracking-tight mt-6 mb-2">{children}</h3>,
          h4: ({children}) => <h4 className="text-lg font-semibold tracking-tight mt-4 mb-2">{children}</h4>,
          p: ({children}) => <p className="leading-7 mb-4">{children}</p>,
          a: ({children, href}) => {
            const external = href ? /^https?:\/\//.test(href) : false
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
          ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
          blockquote: ({children}) => (
            <blockquote className="border-l-2 border-border pl-4 italic text-muted-foreground my-4">
              {children}
            </blockquote>
          ),
          code: ({children, className: cls}) => {
            const isInline = !cls
            if (isInline) {
              return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
            }
            return (
              <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                {children}
              </code>
            )
          },
          pre: ({children}) => <pre className="mb-4">{children}</pre>,
          img: ({src, alt}) => (
            <img src={typeof src === 'string' ? src : undefined} alt={alt} className="rounded-lg my-4 max-w-full" />
          ),
          hr: () => <hr className="border-border my-6" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
