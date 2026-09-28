import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DialogEnum } from '@/models/alert-model'
import { Audit } from '@/models/audit-model'
import * as TablerIcons from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useAuditStore } from '@/stores/audit-store'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { LongText } from '@/components/long-text'
import {
  DataTableColumnHeader,
  DataTableRowActions,
} from '@/components/shared/data-table'
import { auditActionTypes } from './data'

export function useAuditColumns(): ColumnDef<Audit>[] {
  const { t } = useTranslation()
  const { setOpenAudit, setCurrentAuditId } = useAuditStore()

  return useMemo<ColumnDef<Audit>[]>(
    () => [
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('date')} />
        ),
        meta: { label: t('date') },
        cell: ({ row }) => (
          <Badge variant='secondary' className='max-w-38 text-xs'>
            <LongText>{row.original.date}</LongText>
          </Badge>
        ),
      },
      {
        accessorKey: 'actor_name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('user')} />
        ),
        meta: { label: t('user') },
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <div className='font-medium'>{row.getValue('actor_name')}</div>
          </div>
        ),
      },
      {
        accessorKey: 'action',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('action')} />
        ),
        meta: { label: t('action') },

        cell: ({ row }) => {
          const actionType = row.getValue('action') as string
          const variant =
            auditActionTypes[actionType as keyof typeof auditActionTypes]
              ?.variant ?? 'default'

          return (
            <div className='flex items-center gap-2'>
              <Badge variant={variant} className=''>
                {actionType}
              </Badge>
            </div>
          )
        },

        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
        enableSorting: true,
      },
      {
        accessorKey: 'module',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('module')} />
        ),
        meta: { label: t('module') },

        cell: ({ row }) => {
          const module = row.getValue('module') as string
          type IconName = keyof typeof TablerIcons

          const iconName = row.original.icon as IconName

          // Type-safe icon retrieval
          const Icon = TablerIcons[iconName] as
            | React.ComponentType<{
                size?: number
                className?: string
              }>
            | undefined

          return (
            <div className='flex items-center gap-2'>
              {Icon && <Icon size={16} className='text-muted-foreground' />}
              <span className='text-sm capitalize'>{module}</span>
            </div>
          )
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
        enableSorting: true,
      },

      {
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('actions')}
            className='flex justify-end'
          />
        ),
        meta: { label: t('actions') },
        cell: ({ row }) => {
          return (
            <DataTableRowActions
              row={row}
              className='justify-end'
              onCompare={(data) => {
                setCurrentAuditId(data.audit_id)
                setOpenAudit(DialogEnum.COMPARE)
              }}
            />
          )
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, setOpenAudit, setCurrentAuditId]
  )
}
