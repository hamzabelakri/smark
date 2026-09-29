import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useFilteredSidebarData } from '@/hooks/use-sidebar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { sidebarData } from './data/sidebar-data'
import { checkIsActive } from '@/lib/utils'

export function HeaderNav() {
  const { t } = useTranslation()
  const href = useLocation({ select: (l) => l.href })
  const { navGroups } = useFilteredSidebarData(sidebarData)

  return (
    <NavigationMenu
      viewport={false}
      aria-label={t('main_navigation')}
      className='hidden md:flex'
    >
      <NavigationMenuList>
        {navGroups.map((group) => {
          // Flatten collapsible items into plain links
          const links = group.items.flatMap((item) => item.items ?? [item])
          const groupActive = links.some((link) => checkIsActive(href, link))

          return (
            <NavigationMenuItem key={group.title}>
              <NavigationMenuTrigger
                data-active={groupActive}
                className='data-[active=true]:bg-accent'
              >
                {t(group.title)}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-56 gap-1 p-1'>
                  {links.map((link) => (
                    <li key={link.url}>
                      <NavigationMenuLink
                        asChild
                        data-active={checkIsActive(href, link)}
                      >
                        <Link to={link.url} className='flex-row items-center gap-2'>
                          {link.icon && <link.icon className='size-4' />}
                          {t(link.title)}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}