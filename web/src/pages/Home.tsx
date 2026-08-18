import {useFetch} from '@/hooks/useFetch'
import {fetchPage} from '@/sanity/queries'
import HeroPage from '@/components/shadcn-space/blocks/hero-03'

export default function Home() {
  const {data: page} = useFetch('home', () => fetchPage('home'))

  return <HeroPage title={page?.title} body={page?.body} />
}
