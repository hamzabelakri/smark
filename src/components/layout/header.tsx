import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { LanguageSwitch } from '@/components/language-switch'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'

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
          'bg-sidebar relative flex h-full items-center gap-3 rounded-xl border px-4 shadow-sm transition-shadow sm:gap-4',
          offset > 10 && fixed && 'shadow-md'
        )}
      >
        <SidebarTrigger
          variant='outline'
          className='max-md:scale-125 md:hidden'
        />

        {/* Brand Logo + Name pushed slightly to the right */}
        <div className='flex items-center gap-2.5 ms-6'>
          <img
            src='/images/Smark_logo2.svg'
            alt='Smark Logo'
            className='size-20 rounded-full object-contain'
          />
         
        </div>

        {/* Any extra custom children passed down */}
        {children}

        {/* Right-side actions embedded directly */}
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