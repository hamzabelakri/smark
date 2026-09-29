import { Outlet } from '@tanstack/react-router'
import { SearchProvider } from '@/context/search-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { ConfigDrawer } from '../config-drawer'
import { HeroCanvas } from '../hero-canva'
import { LanguageSwitch } from '../language-switch'
import { ProfileDropdown } from '../profile-dropdown'
import { Search } from '../search'
import { ThemeSwitch } from '../theme-switch'
import { Header } from './header'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <SearchProvider>
      <div className='bg-muted relative z-1 flex min-h-dvh w-full'>

        {/* Raised above the fixed band so header and content paint on top of it */}
        <div className='relative z-10 flex min-h-svh w-full'>
          <SidebarProvider defaultOpen={false}>
            <SkipToMain />
            <AppSidebar />
            <div className='@container/content relative flex w-full flex-1 flex-col bg-transparent has-data-[layout=fixed]:h-svh'>
              <Header fixed />
              {children ?? <Outlet />}
            </div>
          </SidebarProvider>
        </div>
      </div>
    </SearchProvider>
  )
}
