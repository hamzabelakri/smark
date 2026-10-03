import { ActionType, Audit, ChangeType } from '@/models/audit-model'
import {
  History,
  User,
  Folder,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LongText } from '@/components/long-text'

const getActionBadgeColor = (action?: string) => {
  const normalizedAction = action?.toLowerCase()
  switch (normalizedAction) {
    case ActionType.CREATE.toLowerCase():
      return 'success'
    case ActionType.LOGIN.toLowerCase():
      return 'login'
    case ActionType.UPDATE.toLowerCase():
      return 'update'
    case ActionType.DELETE.toLowerCase():
      return 'destructive'
    case ActionType.LOGOUT.toLowerCase():
      return 'logout'
    default:
      return 'secondary'
  }
}

interface Props {
  audit: Audit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditModal({ audit, open, onOpenChange }: Props) {
  const { t } = useTranslation()
  const changeType = audit?.change?.type ?? ''
  const fields = audit?.change?.fields ?? {}

  const formatFieldValue = (val: any) => {
    if (val === null || val === undefined) return '-'
    if (typeof val === 'object') {
      return (
        <div className='flex flex-wrap gap-1'>
          {Object.entries(val).map(([key, value]) => (
            <Badge
              key={key}
              variant='outline'
              className='h-4 py-0 text-[12px] font-normal capitalize'
            >
              {key}: {String(value)}
            </Badge>
          ))}
        </div>
      )
    }
    return String(val)
  }

  const renderTableHeader = () => {
    if (changeType === ChangeType.UPDATE) {
      return (
        <TableRow className='bg-muted/30 hover:bg-transparent'>
          <TableHead className='h-10 w-[180px]'></TableHead>
          <TableHead className='h-10'>
            <div className='text-muted-foreground flex items-center gap-2'>
              <ArrowLeft className='size-3' />
              {t('before')}
            </div>
          </TableHead>
          <TableHead className='text-foreground h-10'>
            <div className='flex items-center gap-2'>
              <ArrowRight className='size-3' />
              {t('after')}
            </div>
          </TableHead>
        </TableRow>
      )
    }
    return null
  }

  const renderTableRows = () => {
    return Object.entries(fields).map(([key, value]: [string, any]) => {
      const changed = value.changed

      const singleValueMap: Record<string, any> = {
        [ChangeType.CREATE]: value.created_values,
        [ChangeType.LOGIN]: value.logged_in_values,
        [ChangeType.LOGOUT]: value.logged_out_values,
        [ChangeType.DELETE]: value.deleted_values,
      }

      if (changeType in singleValueMap) {
        return (
          <TableRow key={key}>
            <TableCell className='w-[180px] py-3'>
              <Badge
                variant='secondary'
                className='text-xs font-medium capitalize'
              >
                {key}
              </Badge>
            </TableCell>
            <TableCell className='text-muted-foreground py-3'>
              {formatFieldValue(singleValueMap[changeType])}
            </TableCell>
          </TableRow>
        )
      }

      if (changeType === ChangeType.UPDATE) {
        return (
          <TableRow key={key}>
            <TableCell className='w-[180px] py-3'>
              <Badge
                variant='secondary'
                className='text-xs font-medium capitalize'
              >
                {key}
              </Badge>
            </TableCell>
            <TableCell className='py-3'>
              {changed ? (
                <Badge
                  variant='destructive'
                  className='bg-destructive/10 text-destructive border-none font-normal line-through shadow-none'
                >
                  <LongText className='max-w-[250px]'>
                    {formatFieldValue(value.old_values)}
                  </LongText>
                </Badge>
              ) : (
                <LongText className='text-muted-foreground max-w-[250px]'>
                  {formatFieldValue(value.old_values)}
                </LongText>
              )}
            </TableCell>
            <TableCell className='py-3'>
              {changed ? (
                <Badge
                  variant='success'
                  className='border-none bg-green-500/10 font-medium text-green-600 shadow-none'
                >
                  <LongText className='max-w-[250px]'>
                    {formatFieldValue(value.new_values)}
                  </LongText>
                </Badge>
              ) : (
                <LongText className='max-w-[250px]'>
                  {formatFieldValue(value.new_values)}
                </LongText>
              )}
            </TableCell>
          </TableRow>
        )
      }
      return null
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'sm:max-w-3xl',
          changeType === ChangeType.UPDATE && 'sm:max-w-5xl'
        )}
      >
        {/* ── Header ── */}
        <DialogHeader className='pt-5 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg'>
              <History className='text-primary size-5' />
            </div>
            <div>
              <DialogTitle className='flex items-center gap-2'>
                {t('changelog')}
                <Badge
                  variant={getActionBadgeColor(audit?.action)}
                  className='h-5 text-[11px] capitalize'
                >
                  {audit?.action}
                </Badge>
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <DialogBody className='space-y-4'>
          {/* Metadata Bar (Moved inside body, below header border) */}
          <div className='bg-muted/20 border-border/50 grid grid-cols-3 gap-4 rounded-xl border p-3'>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground text-[12px] font-bold tracking-wider uppercase'>
                {t('user')}
              </span>
              <div className='flex items-center gap-1.5 truncate text-sm font-medium'>
                <User className='text-primary size-4' />
                {audit?.actor_name ?? t('unknown')}
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground text-[12px] font-bold tracking-wider uppercase'>
                {t('module')}
              </span>
              <div className='flex items-center gap-1.5 truncate text-sm font-medium'>
                <Folder className='text-primary size-4' />
                {audit?.module ?? t('unknown')}
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-muted-foreground text-[12px] font-bold tracking-wider uppercase'>
                {t('date')}
              </span>
              <div className='flex items-center gap-1.5 truncate text-sm font-medium'>
                <Clock className='text-primary size-4' />
                {audit?.date ?? '-'}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className='overflow-hidden rounded-xl border'>
            <Table>
              <TableHeader>{renderTableHeader()}</TableHeader>
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </div>
        </DialogBody>

        {/* ── Footer ── */}
        <DialogFooter>
          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)}
            className='text-muted-foreground'
          >
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
