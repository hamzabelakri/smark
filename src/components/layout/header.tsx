import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitch } from '@/components/language-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
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
        'bg-background z-50 h-(--header-height) w-full shrink-0 p-2',
        fixed && 'header-fixed peer/header sticky top-0',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'bg-sidebar relative flex h-full items-center gap-3 overflow-hidden rounded-xl border px-4 shadow-sm transition-shadow sm:gap-4',
          offset > 10 && fixed && 'shadow-md'
        )}
      >
        <SidebarTrigger
          variant='outline'
          className='max-md:scale-125 md:hidden'
        />

        <div
          className={cn(
            'bg-primary text-primary-foreground hidden h-full items-center md:flex',
            'md:-ms-4',
            'ps-4 pe-8',
            '[clip-path:polygon(0_0,100%_0,calc(100%_-_28px)_100%,0_100%)]'
          )}
        >
          <img
            src='/images/logo.svg'
            alt='Smark Logo'
            className='h-full max-h-10 w-auto object-contain'
          />
        </div>

        {children}

        <div className='ms-auto flex items-center space-x-4'>
          <LanguageSwitch />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}
