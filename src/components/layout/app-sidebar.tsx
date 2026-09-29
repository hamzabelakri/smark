import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'
import { useFilteredSidebarData } from '@/hooks/use-sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { isMobile } = useSidebar()
  const filteredSidebarData = useFilteredSidebarData(sidebarData)

  if (!isMobile) return null

  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={filteredSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredSidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={filteredSidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}