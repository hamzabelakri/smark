import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LanguageSwitch } from '../language-switch'
import { ProfileDropdown } from '../profile-dropdown'
import { ThemeSwitch } from '../theme-switch'
import { HeaderNav } from './header-nav'

type HeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () =>
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'bg-background text-foreground z-50 h-17 border-b',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow-md' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div className='flex h-full items-center gap-4 mx-auto w-full max-w-7xl'>
        {/* Left: mobile trigger + logo */}
        <div className='flex items-center gap-3'>
          <SidebarTrigger variant='outline' className='scale-125 md:hidden' />
          <Link to='/' className='flex items-center gap-2.5'>
            <img
              src='/images/astero.ico'
              alt=''
              className='size-9 rounded-full object-contain'
            />
            <span className='hidden text-xl font-semibold tracking-tight sm:inline'>
              Asteroidea
            </span>
          </Link>
        </div>

        {/* Nav sits right after the logo */}
        <HeaderNav />

        {/* Right: actions pushed to the end */}
        <div className='ml-auto flex items-center gap-1 sm:gap-2'>
          <LanguageSwitch />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}