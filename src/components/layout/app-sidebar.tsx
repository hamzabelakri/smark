import {
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar'
import { useLayout } from '@/context/layout-provider'
import { useFilteredSidebarData } from '@/hooks/use-sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  // `variant` from the layout context is intentionally ignored:
  // this layout always renders the sidebar as a floating card below the header.
  const { collapsible } = useLayout()
  const filteredSidebarData = useFilteredSidebarData(sidebarData)

  return (
    <Sidebar collapsible={collapsible} variant='floating'>
      <SidebarContent>
        {filteredSidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}