// Util Imports
import { cn } from '@/lib/utils'

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img src='/GMSVnewlogo.webp' alt='GMSV' className='h-9 w-auto' />
    </div>
  )
}

export default Logo
