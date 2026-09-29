import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Hexagon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LanguageSwitch } from '../language-switch'
import { ProfileDropdown } from '../profile-dropdown'
import { Search } from '../search'
import { ThemeSwitch } from '../theme-switch'
import { HeaderNav } from './header-nav'

type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed
          ? 'shadow after:absolute after:inset-0 after:-z-10 after:bg-black/20 after:backdrop-blur-lg'
          : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'flex h-full items-center justify-between gap-3 p-4 text-foreground md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 mx-auto w-full max-w-7xl',
          
        )}
      >
        {/* Left: mobile trigger + logo */}
        <div className='flex items-center gap-3'>
          <SidebarTrigger variant='outline' className='scale-125 md:hidden' />
          <Separator orientation='vertical' className='h-6 md:hidden' />
           <img
                src="/images/astero.ico"
                alt="Asteroidea"
                width={40}
                height={10}
                className="rounded-lg object-contain"
              />
            <span className='hidden sm:inline'>Asteroidea</span>
        </div>

        {/* Center: navigation (desktop only) */}
        <HeaderNav />

        {/* Right: actions */}
        <div className='flex items-center justify-end gap-2 sm:gap-4'>
         
          <LanguageSwitch />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}