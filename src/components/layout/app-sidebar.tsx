import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useFilteredSidebarData } from '@/hooks/use-sidebar'

export function AppSidebar() {
  const { collapsible } = useLayout()
  const filteredSidebarData = useFilteredSidebarData(sidebarData)

  return (
    <Sidebar collapsible={collapsible}>
      
      <SidebarContent>
        {filteredSidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={filteredSidebarData.user} />
      </SidebarFooter>
    
    </Sidebar>
  )
}