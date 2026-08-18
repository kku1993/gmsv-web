import {Link} from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { CalendarDaysIcon, ArrowRightIcon } from "lucide-react"

export type BlogPost = {
  title: string
  description: string
  imageUrl: string
  imageAlt: string
  date: string
  category: string
  author: string
  authorLink: string
  blogLink: string
  categoryLink: string
}

type BlogProps = {
  blogPosts: BlogPost[]
  // Optional header overrides so the same block can back different listing
  // pages (e.g. Events, Podcasts). Defaults match the original block copy.
  // Omit `badgeText` to hide the pill entirely.
  badgeText?: string
  heading?: string
  subtitle?: string
}

const Blog = ({
  blogPosts,
  badgeText,
  heading = 'Related Post',
  subtitle = 'Expand your knowledge with these hand-picked posts.',
}: BlogProps) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <div className='mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='space-y-4'>
          {badgeText ? (
            <Badge variant='outline' className='h-auto text-sm font-normal'>
              {badgeText}
            </Badge>
          ) : null}

          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>{heading}</h2>

          <p className='text-muted-foreground text-lg md:text-xl'>
            {subtitle}
          </p>
        </div>

        {/* Tabs and Search */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {blogPosts.map(post => (
            <Card key={post.title} className='group h-full transition-all duration-300'>
              <CardHeader>
                <Link to={post.blogLink} className='overflow-hidden rounded-lg'>
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.imageAlt}
                      className='h-59.5 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  ) : (
                    <div className='bg-muted flex h-59.5 w-full items-center justify-center text-muted-foreground'>
                      <CalendarDaysIcon className='size-8' />
                    </div>
                  )}
                </Link>
              </CardHeader>
              <CardContent className='space-y-3.5'>
                <div className='flex items-center justify-between gap-1.5'>
                  <div className='text-muted-foreground flex items-center gap-1.5'>
                    <CalendarDaysIcon className='size-6' />
                    <span className='text-base'>{post.date}</span>
                  </div>
                  <Link to={post.categoryLink}>
                    <Badge className='bg-primary/10 text-primary h-auto border-0 text-sm'>{post.category}</Badge>
                  </Link>
                </div>
                <h3 className='line-clamp-2 text-lg font-medium md:text-xl'>
                  <Link to={post.blogLink}>{post.title}</Link>
                </h3>
                <p className='text-muted-foreground line-clamp-2 text-base'>{post.description}</p>
                <div className='flex items-center justify-between'>
                  {post.authorLink.startsWith('/') ? (
                    <Link to={post.authorLink} className='text-sm font-medium'>
                      {post.author}
                    </Link>
                  ) : (
                    <a href={post.authorLink} className='text-sm font-medium'>
                      {post.author}
                    </a>
                  )}
                  <Button
                    size='icon'
                    variant='outline'
                    className='group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:group-hover:bg-primary dark:hover:bg-primary'
                    render={<Link to={post.blogLink} />}
                    nativeButton={false}
                  >
                    <ArrowRightIcon className='size-4 -rotate-45' />
                    <span className='sr-only'>Read more: {post.title}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
