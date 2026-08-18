import {Link} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import Logo from '@/components/shadcn-studio/logo'
import {MenuIcon} from 'lucide-react'

type NavigationItem = {
  title: string
  href: string
}[]

const Navbar = ({navigationData}: {navigationData: NavigationItem}) => {
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
    <header className='bg-background sticky top-0 z-50'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6'>
        <div className='text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16'>
          {leftLinks.map(renderDesktopLink)}
          <Link to='/'>
            <Logo className='text-foreground gap-3' />
          </Link>
          {rightLinks.map(renderDesktopLink)}
        </div>

        <div className='flex items-center gap-6'>
          <DropdownMenu>
            <DropdownMenuTrigger className='md:hidden' render={<Button variant='outline' size='icon' />}>
              <MenuIcon />
              <span className='sr-only'>Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end'>
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <Link to={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar
