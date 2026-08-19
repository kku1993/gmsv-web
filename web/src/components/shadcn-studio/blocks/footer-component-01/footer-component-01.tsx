import {Link} from 'react-router-dom'
import {Separator} from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import Logo from '@/components/shadcn-studio/logo'

import FacebookIcon from '@/assets/svg/facebook-icon'
import InstagramIcon from '@/assets/svg/instagram-icon'
import LinkedinIcon from '@/assets/svg/linkedin-icon'

const SOCIAL_LINKS = [
  {label: 'Instagram', href: 'https://www.instagram.com/goodmorningsiliconvalley/', Icon: InstagramIcon},
  {label: 'Facebook', href: 'https://www.facebook.com/GoodMorningSiliconValleyAssoication', Icon: FacebookIcon},
  {label: 'LinkedIn', href: 'https://www.linkedin.com/company/89702393/', Icon: LinkedinIcon},
] as const

const NAV_LINKS = [
  {title: 'People', href: '/people'},
  {title: 'Mission', href: '/mission'},
  {title: 'Events', href: '/events'},
  {title: 'Podcast', href: '/podcasts'},
  {title: 'Sponsors', href: '/sponsors'},
  {title: 'Contact', href: '/contact'},
] as const

const IMAGE_SOURCES = [
  'https://pixabay.com/photos/golden-gate-bridge-u-s-san-francisco-4541186/',
  'https://pixabay.com/photos/solar-energy-solar-system-2157212/',
  'https://pixabay.com/photos/wind-mills-energy-clouds-power-6928590/',
  'https://pixabay.com/videos/wind-energy-turbine-power-6327/',
] as const

const Footer = () => {
  return (
    <footer>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8'>
        <Link to='/'>
          <div className='flex items-center gap-3'>
            <Logo className='gap-3' />
          </div>
        </Link>

        <div className='flex flex-wrap items-center justify-center gap-x-5 gap-y-2'>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className='opacity-80 transition-opacity duration-300 hover:opacity-100'
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-4'>
          {SOCIAL_LINKS.map(({label, href, Icon}) => (
            <a
              key={label}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={label}
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <Icon className='size-5' />
            </a>
          ))}
        </div>
      </div>

      <Separator />

      <div className='mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 sm:px-6'>
        <p className='text-center font-medium text-balance'>
          {`©${new Date().getFullYear()}`}{' '}
          <Link to='/' className='hover:underline'>
            Good Morning Silicon Valley
          </Link>
          . All rights reserved.
        </p>
        <Dialog>
          <DialogTrigger
            render={
              <button className='text-sm text-muted-foreground underline-offset-3 hover:underline' />
            }
          >
            Image Sources
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Image Sources</DialogTitle>
              <DialogDescription>
                Images used on this site are sourced from the following links:
              </DialogDescription>
            </DialogHeader>
            <ul className='flex flex-col gap-2 text-sm'>
              {IMAGE_SOURCES.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-muted-foreground underline underline-offset-3 hover:text-foreground'
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  )
}

export default Footer
