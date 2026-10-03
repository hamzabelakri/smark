import { useMemo } from 'react'
import {
  IconUserCheck,
  IconUsersGroup,
  IconUserX,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUsersStore } from '@/stores/users-store'
import { useUsers } from '@/hooks/use-users'
import { Card } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { DataTable } from '@/components/shared/data-table'
import { useUserToolbarProps } from './table/data'
import { useUserColumns } from './table/users-columns'
import { UsersModals } from './users-modal'

export function Users() {
  const { t } = useTranslation()
  const { queryParams, setQueryParams } = useUsersStore()
  const { data: usersResponse, isLoading } = useUsers(queryParams)
  
  const data = useMemo(() => usersResponse?.data ?? [], [usersResponse?.data])
  
  const columns = useUserColumns()
  const toolbarProps = useUserToolbarProps()
  
  const totalUsers = data.length
  const enabledUsers = useMemo(() => data.filter((u) => u.status === true).length, [data])
  const disabledUsers = useMemo(() => data.filter((u) => u.status === false).length, [data])

  return (
    <>
      <Main>
        <div className='mb-2 flex flex-wrap items-center space-x-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('user_management')}
          </h2>
        </div>

        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Total Users */}
          <Card paddingY='py-0' className='rounded-xl border shadow-sm transition-shadow duration-200'>
            <div className='flex items-center gap-4 p-5'>
              <div className='bg-kpi-card-1/10 text-kpi-card-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
                <IconUsersGroup className='h-5 w-5' />
              </div>
              <div className='flex min-w-0 flex-col'>
                <p className='text-xs text-muted-foreground'>
                  {t('total_users')}
                </p>
                <p className='text-xl font-bold'>
                  {totalUsers}
                </p>
              </div>
            </div>
          </Card>

          {/* Card 2: Enabled Users */}
          <Card paddingY='py-0' className='rounded-xl border shadow-sm transition-shadow duration-200'>
            <div className='flex items-center gap-4 p-5'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-kpi-card-2/10 text-kpi-card-2 dark:bg-emerald-950/50 dark:text-emerald-400'>
                <IconUserCheck className='h-5 w-5' />
              </div>
              <div className='flex min-w-0 flex-col'>
                <p className='text-xs text-muted-foreground'>
                  {t('enabled_users')}
                </p>
                <p className='text-xl font-bold'>
                  {enabledUsers}
                </p>
              </div>
            </div>
          </Card>

          {/* Card 3: Disabled Users */}
          <Card paddingY='py-0' className='rounded-xl border shadow-sm transition-shadow duration-200'>
            <div className='flex items-center gap-4 p-5'>
              <div className='bg-kpi-card-5/10 text-kpi-card-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
                <IconUserX className='h-5 w-5' />
              </div>
              <div className='flex min-w-0 flex-col'>
                <p className='text-xs text-muted-foreground'>
                  {t('disabled_users')}
                </p>
                <p className='text-xl font-bold'>
                  {disabledUsers}
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
      <UsersModals />
    </>
  )
}