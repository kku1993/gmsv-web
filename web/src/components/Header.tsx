import {Link, NavLink} from 'react-router-dom'
import {cn} from '@/lib/utils'

const NAV_LINKS = [
  {label: 'Home', to: '/'},
  {label: 'About', to: '/about'},
  {label: 'Mission', to: '/mission'},
  {label: 'Events', to: '/events'},
  {label: 'Podcast', to: '/podcasts'},
  {label: 'Sponsors', to: '/sponsors'},
  {label: 'Contact', to: '/contact'},
] as const

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="GMSV home">
          <img src="/GMSVnewlogo.webp" alt="GMSV" className="h-9 w-auto" />
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({isActive}) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
