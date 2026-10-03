import { useState } from 'react'
import { IconCheck, IconChevronDown, IconLanguage } from '@tabler/icons-react'
import { getCookie, setCookie } from '@/lib/cookies'
import i18n from '@/lib/language/i18n/i18n'
import { cn } from '@/lib/utils'
import { useDirection, type Direction } from '@/context/direction-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const LANGUAGE_COOKIE_NAME = 'lang'
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

const languages = [
  {
    code: 'en',
    label: 'English',
    flag: '/flags/united-states.svg',
    dir: 'ltr' as Direction,
  },
  {
    code: 'ar',
    label: 'العربية',
    flag: '/flags/saudi-arabia.svg',
    dir: 'rtl' as Direction,
  },
]

export function LanguageSwitch() {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return (getCookie(LANGUAGE_COOKIE_NAME) as string) || 'en'
  })
  const { setDir } = useDirection()

  const handleLanguageChange = (langCode: string) => {
    const selectedLang = languages.find((lang) => lang.code === langCode)
    if (selectedLang) {
      setCurrentLanguage(langCode)
      i18n.changeLanguage(langCode)
      setDir(selectedLang.dir)
      setCookie(LANGUAGE_COOKIE_NAME, langCode, LANGUAGE_COOKIE_MAX_AGE)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' className='border'>
          <IconLanguage className='h-4 w-4 opacity-70' />
          <span className='sr-only'>Switch language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <img
              src={lang.flag}
              alt={lang.label}
              className='mr-2 h-3 w-4 rounded-sm'
            />
            <span>{lang.label}</span>

            <IconCheck
              size={14}
              className={cn(
                'ml-auto',
                currentLanguage !== lang.code && 'hidden'
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
