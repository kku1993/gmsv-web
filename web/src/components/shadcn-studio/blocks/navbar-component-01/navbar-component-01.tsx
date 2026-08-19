import {Link, useLocation} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'

import Logo from '@/components/shadcn-studio/logo'
import {MenuIcon} from 'lucide-react'

type NavigationItem = {
  title: string
  href: string
}[]

const Navbar = ({navigationData}: {navigationData: NavigationItem}) => {
  const {pathname} = useLocation()
  // On the home route the hero video fills the viewport, so the navbar floats
  // transparently over the video instead of pushing it down (which would force
  // a vertical scroll and reveal the footer).
  const isHome = pathname === '/'

  // Split the navigation items around the centered logo so the layout keeps
  // the original block's symmetry (links on both sides of the logo).
  const midpoint = Math.ceil(navigationData.length / 2)
  const leftLinks = navigationData.slice(0, midpoint)
  const rightLinks = navigationData.slice(midpoint)

  const renderDesktopLink = (item: {title: string; href: string}) => (
    <Link
      key={item.href}
      to={item.href}
      className='hover:text-primary max-md:hidden'
    >
      {item.title}
    </Link>
  )

  return (
    <header
      className={
        isHome
          ? 'absolute inset-x-0 top-0 z-50'
          : 'bg-background sticky top-0 z-50'
      }
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6'>
        <div
          className={
            isHome
              ? 'flex flex-1 items-center gap-8 font-medium text-white md:justify-center lg:gap-16'
              : 'text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16'
          }
        >
          {leftLinks.map(renderDesktopLink)}
          <Link to='/'>
            <Logo className='text-foreground gap-3' />
          </Link>
          {rightLinks.map(renderDesktopLink)}
        </div>

        <div className='flex items-center gap-6'>
          <Sheet>
            <SheetTrigger className='md:hidden' render={<Button variant='outline' size='icon' />}>
              <MenuIcon />
              <span className='sr-only'>Menu</span>
            </SheetTrigger>
            <SheetContent side='right' className='w-72'>
              <SheetClose render={<Link to='/' />}>
                <Logo className='text-foreground gap-3' />
              </SheetClose>
              <nav className='mt-2 flex flex-col gap-1'>
                {navigationData.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        to={item.href}
                        className={
                          pathname === item.href
                            ? 'hover:bg-muted rounded-md px-3 py-2 text-base font-medium text-foreground'
                            : 'hover:bg-muted rounded-md px-3 py-2 text-base font-medium text-muted-foreground'
                        }
                      />
                    }
                  >
                    {item.title}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
