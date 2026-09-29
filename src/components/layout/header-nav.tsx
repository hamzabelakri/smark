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
  navigationMenuTriggerStyle,
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
      className='hidden md:flex md:ml-4'
    >
      <NavigationMenuList className='gap-1'>
        {navGroups.map((group) => {
          const links = group.items.flatMap((item) => item.items ?? [item])
          const groupActive = links.some((link) => checkIsActive(href, link))
          const GroupIcon = links[0]?.icon // or add an `icon` field to your group type

          // Single destination: plain link, no chevron
          if (links.length === 1) {
            const link = links[0]
            return (
              <NavigationMenuItem key={group.title}>
                <NavigationMenuLink
                  asChild
                  data-active={groupActive}
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to={link.url} className='flex-row items-center gap-2'>
                    {GroupIcon && <GroupIcon className='size-4' />}
                    {t(link.title)}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          }

          return (
            <NavigationMenuItem key={group.title}>
              <NavigationMenuTrigger
                data-active={groupActive}
                className='gap-2 bg-transparent data-[active=true]:bg-accent'
              >
                {GroupIcon && <GroupIcon className='size-4' />}
                {t(group.title)}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-56 gap-1 p-1'>
                  {links.map((link) => (
                    <li key={link.url}>
                      <NavigationMenuLink asChild data-active={checkIsActive(href, link)}>
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