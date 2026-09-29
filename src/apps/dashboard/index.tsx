import { IconLayoutDashboard } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { ChartBarInteractive } from './components/chart-bar-interactive'
import { ChartBarMultiple } from './components/chart-bar-multiple'
import { ChartRadarLinesOnly } from './components/chart-radar-lines'
import { ChartPieDonutText } from './components/chart-radial-shape'
import { SectionCards } from './components/section-cards'

export function Dashboard() {
  const { t } = useTranslation()

  return (
    <Main title={t('dashboard')}>
      <div className='bg-background space-y-6 rounded-3xl p-6'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <SectionCards />
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-6'>
          <ChartBarInteractive />
          <ChartPieDonutText />
        </div>

        <div className='grid grid-cols-6 gap-5 lg:grid-cols-12'>
          <ChartRadarLinesOnly />
          <ChartBarMultiple />
        </div>
      </div>
    </Main>
  )
}