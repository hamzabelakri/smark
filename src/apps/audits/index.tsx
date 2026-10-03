import { useMemo } from 'react'
import { IconClipboardList } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { Main } from '@/components/layout/main'
import { DataTable } from '@/components/shared/data-table'
import { useAuditColumns } from './table/audit-columns'
import { AuditsModals } from './audit-modal'
import { useAudits } from '@/hooks/use-audit'
import { Card } from '@/components/ui/card'
import { useAuditToolbarProps } from './table/data'
import { useAuditStore } from '@/stores/audit-store'

export function Audits() {
  const { t } = useTranslation()
  const { queryParams, setQueryParams } = useAuditStore()
  const { data: auditsResponse, isLoading } = useAudits(queryParams)
  const data = useMemo(() => auditsResponse?.data ?? [], [auditsResponse?.data])
  const pagination = useMemo(() => auditsResponse?.pagination ?? undefined, [auditsResponse?.pagination])
  const columns = useAuditColumns()
  const toolbarProps = useAuditToolbarProps()
  const totalAudits = auditsResponse?.pagination?.totalRows ?? 0

  return (
    <>
      <Main>
        <div className='mb-2 flex flex-wrap items-center space-x-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('audit_log')}
          </h2>
        </div>

        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Card 1: Total Audit Logs */}
          <Card paddingY='py-0' className='rounded-xl border shadow-sm transition-shadow duration-200'>
            <div className='flex items-center gap-4 p-5'>
              <div className='bg-kpi-card-1/10 text-kpi-card-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
                <IconClipboardList className='h-5 w-5' />
              </div>
              <div className='flex min-w-0 flex-col'>
                <p className='text-xs text-muted-foreground'>
                  {t('total_audit_logs')}
                </p>
                <p className='text-xl font-bold'>
                  {totalAudits}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className='-mx-4 mt-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            columns={columns}
            data={data}
            toolbarProps={toolbarProps}
            isLoading={isLoading}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            pagination={pagination}
          />
        </div>
      </Main>
      <AuditsModals />
    </>
  )
}