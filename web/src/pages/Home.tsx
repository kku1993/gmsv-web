import {useFetch} from '@/hooks/useFetch'
import {useSeo} from '@/hooks/useSeo'
import {fetchPage} from '@/sanity/queries'
import HeroPage from '@/components/shadcn-space/blocks/hero-03'

export default function Home() {
  const {data: page} = useFetch('home', () => fetchPage('home'))

  useSeo({
    title: 'Good Morning Silicon Valley',
    description:
      'Good Morning Silicon Valley (GMSV) is a nonprofit hosting events, podcasts, and community programs across the Bay Area.',
  })

  return <HeroPage title="Good Morning Silicon Valley" body={page?.body} />
}
