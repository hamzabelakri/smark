import { Outlet } from '@tanstack/react-router'
import { SearchProvider } from '@/context/search-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'
import { Header } from './header'

export function AuthenticatedLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SearchProvider>
      <div className='bg-muted relative z-1 flex min-h-dvh w-full'>
        {/* Dark band, painted behind header and content */}
        <div
          aria-hidden
          className='absolute inset-x-0 top-0 h-[488px] bg-neutral-900'
        />

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