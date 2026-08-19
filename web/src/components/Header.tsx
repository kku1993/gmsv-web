import Navbar from '@/components/shadcn-studio/blocks/navbar-component-01/navbar-component-01'

// Existing site navigation — preserved so all routes keep working with the
// new navbar block.
const NAV_LINKS = [
  {title: 'Home', href: '/'},
  {title: 'People', href: '/people'},
  {title: 'Mission', href: '/mission'},
  {title: 'Events', href: '/events'},
  {title: 'Podcast', href: '/podcasts'},
  {title: 'Sponsors', href: '/sponsors'},
  {title: 'Contact', href: '/contact'},
] as const

export function Header() {
  return <Navbar navigationData={[...NAV_LINKS]} />
}
