import { useMemo } from 'react'
import { IconShieldCog, IconShieldUp } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { Main } from '@/components/layout/main'
import { DataTable } from '@/components/shared/data-table'
import { useRoleColumns } from './table/roles-columns'
import { RolesModals } from './role-modal'
import { useRoleToolbarProps } from './table/data'
import { Card } from '@/components/ui/card'
import { useRolesStore } from '@/stores/roles-store'
import { useRoles } from '@/hooks/use-roles'

export function Roles() {
  const { t } = useTranslation()
  const { queryParams, setQueryParams } = useRolesStore()

  const { data: roles, isLoading } = useRoles(queryParams)
  const data = useMemo(() => roles ?? [], [roles])

  const columns = useRoleColumns()
  const toolbarProps = useRoleToolbarProps()
  const totalRoles = data.length

  return (
    <>
      <Main>
        <div className='mb-2 flex flex-wrap items-center space-x-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('role_management')}
          </h2>
        </div>

        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Total Roles */}
          <Card paddingY='py-0' className='rounded-xl border shadow-sm transition-shadow duration-200'>
            <div className='flex items-center gap-4 p-5'>
              <div className='bg-kpi-card-1/10 text-kpi-card-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
                <IconShieldUp className='h-5 w-5' />
              </div>
              <div className='flex min-w-0 flex-col'>
                <p className='text-xs text-muted-foreground'>
                  {t('total_roles')}
                </p>
                <p className='text-xl font-bold'>
                  {totalRoles}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className='-mx-4 mt-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data}
            columns={columns}
            toolbarProps={toolbarProps}
            isLoading={isLoading}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        </div>
      </Main>
      <RolesModals />
    </>
  )
}