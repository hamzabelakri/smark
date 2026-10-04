import { ReactNode } from 'react'
import { Row } from '@tanstack/react-table'
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconLockOpen,
  IconLock,
  IconHistory,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  isBlocked?: boolean
  onView?: (data: TData) => void
  onBlock?: (data: TData) => void
  onEdit?: (data: TData) => void
  onCompare?: (data: TData) => void
  onDelete?: (data: TData) => void
  canView?: boolean
  canEdit?: boolean
  canDelete?: boolean
  className?: string
  tooltipMessage?: string
}

// Same look as the header's right-side buttons (LanguageSwitch / ConfigDrawer):
// size='icon' + variant='ghost' + border, with dimmed icons (opacity-70).
const BUTTON_CLASS = 'border [&_svg]:opacity-70'
const TOOLTIP_CLASS = 'bg-primary text-primary-foreground'
const ARROW_CLASS = 'bg-primary fill-primary'

function ActionButton({
  label,
  icon,
  onClick,
}: {
  label?: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          onClick={onClick}
          className={BUTTON_CLASS}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent colorClass={TOOLTIP_CLASS} arrowClass={ARROW_CLASS}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export function DataTableRowActions<TData>({
  row,
  isBlocked,
  onView,
  onBlock,
  onEdit,
  onDelete,
  onCompare,
  canView = true,
  canEdit = true,
  canDelete = true,
  className,
  tooltipMessage,
}: DataTableRowActionsProps<TData>) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onBlock && canEdit && (
        <ActionButton
          label={tooltipMessage}
          icon={isBlocked ? <IconLockOpen size={16} /> : <IconLock size={16} />}
          onClick={() => onBlock(row.original)}
        />
      )}

      {onView && canView && (
        <ActionButton
          label={t('view')}
          icon={<IconEye size={16} />}
          onClick={() => onView(row.original)}
        />
      )}

      {onEdit && canEdit && (
        <ActionButton
          label={t('edit')}
          icon={<IconEdit size={16} />}
          onClick={() => onEdit(row.original)}
        />
      )}

      {onCompare && canView && (
        <ActionButton
          label={t('audit')}
          icon={<IconHistory size={16} />}
          onClick={() => onCompare(row.original)}
        />
      )}

      {onDelete && canDelete && (
        <ActionButton
          label={t('delete')}
          icon={<IconTrash size={16} />}
          onClick={() => onDelete(row.original)}
        />
      )}
    </div>
  )
}