import {useFetch} from '@/hooks/useFetch'
import {useSeo} from '@/hooks/useSeo'
import {fetchPage} from '@/sanity/queries'
import HeroPage from '@/components/shadcn-space/blocks/hero-03'

export default function Home() {
  const {data: page} = useFetch('home', () => fetchPage('home'))

  useSeo({
    title: page?.title ?? 'Home',
    description:
      'Good Morning Silicon Valley (GMSV) is a student-led nonprofit hosting events, podcasts, and community programs across the Bay Area.',
  })

  return <HeroPage title={page?.title} body={page?.body} />
}
