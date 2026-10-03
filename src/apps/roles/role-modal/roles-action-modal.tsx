import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Role} from '@/models/role-model'
import { useCreateRole, useUpdateRole } from '@/hooks/use-roles'
import { DialogEnum, ModalMode } from '@/models/alert-model'
import { usePermissions } from '@/hooks/use-permissions'

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import * as LucideIcons from 'lucide-react'
import { Shield, Eye, Pencil, Plus, Lock, UserCog } from 'lucide-react'
import { IconEdit, IconEye, IconPlus } from '@tabler/icons-react'
import { Module } from '@/models/module-model'

// ── Schema ───────────────────────────────────────────────────────

const getFormSchema = (t: any) =>
  z.object({
    role_name: z
      .string()
      .nonempty({ message: t('role_name_required') })
      .min(3, { message: t('role_name_min') }),
    role_permissions: z.record(z.string(), z.string()),
  })

type FormData = z.infer<ReturnType<typeof getFormSchema>>

interface Props {
  role?: Role
  modules: Module[]
  open: boolean
  onClose: () => void
  mode?: ModalMode
  switchToEdit?: () => void
}

export function RolesActionModal({ role, modules, open, onClose, mode, switchToEdit }: Props) {
  const { t } = useTranslation()
  const isEdit = mode === DialogEnum.EDIT
  const isView = mode === DialogEnum.VIEW
  const isAdd = mode === DialogEnum.ADD

  const { modulePermissions } = usePermissions()
  const isSuperAdmin = role?.role_id === 1
  const canUpdateRole = modulePermissions.roles.canUpdate

  const { mutate: createRole, isPending: isCreating } = useCreateRole()
  const { mutate: updateRole, isPending: isUpdating } = useUpdateRole()

  const actions = ['view', 'create', 'edit', 'delete']

  const schema = useMemo(() => getFormSchema(t), [t])
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role_name: '',
      role_permissions: {},
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  useEffect(() => {
    if (role) {
      form.reset({
        role_name: role.role_name || '',
        role_permissions: role.role_permissions || {},
      })
    } else {
      form.reset({ role_name: '', role_permissions: {} })
    }
  }, [role, form])

  // ── Permission Logic ────────────────────────────────────────────

  const getModulePermissions = (moduleName: string): string => {
    return form.watch('role_permissions')[moduleName] || '0000'
  }

  const setModulePermissions = (moduleName: string, permissions: string) => {
    form.setValue('role_permissions', {
      ...form.getValues('role_permissions'),
      [moduleName]: permissions,
    })
  }

  const buildPermissionString = (module: Module, shouldEnable: boolean): string => {
    let permissionString = '0000'
    if (shouldEnable) {
      actions.forEach((action, index) => {
        if (module.enabled_permissions.includes(action)) {
          permissionString =
            permissionString.substring(0, index) + '1' + permissionString.substring(index + 1)
        }
      })
    }
    return permissionString
  }

  const isPermissionChecked = (moduleName: string, action: string): boolean => {
    if (moduleName === 'tableau de bord' && action === 'view') return true
    const perms = getModulePermissions(moduleName)
    const index = actions.indexOf(action)
    return perms[index] === '1'
  }

  const areAllPermissionsChecked = (moduleName: string): boolean => {
    const module = modules.find((m) => m.module_name === moduleName)
    if (!module) return false
    const perms = getModulePermissions(moduleName)
    return actions.every((action, index) => {
      if (module.enabled_permissions.includes(action)) return perms[index] === '1'
      return true
    })
  }

  const handlePermissionChange = (moduleName: string, action: string, checked: boolean) => {
    if (isView) return
    const current = getModulePermissions(moduleName)
    const index = actions.indexOf(action)
    let updatedArray = current.split('')
    updatedArray[index] = checked ? '1' : '0'

    if (checked && action !== 'view') updatedArray[0] = '1'
    if (!checked && action === 'view') updatedArray = ['0', '0', '0', '0']

    setModulePermissions(moduleName, updatedArray.join(''))
  }

  const handleToggleAllPermissions = (moduleName: string, checked: boolean) => {
    if (isView) return
    const module = modules.find((m) => m.module_name === moduleName)
    if (!module) return
    setModulePermissions(moduleName, buildPermissionString(module, checked))
  }

  const handleToggleAllModules = (checked: boolean) => {
    if (isView) return
    const allPermissions: Record<string, string> = {}
    modules.forEach((module) => {
      allPermissions[module.module_name] = buildPermissionString(module, checked)
    })
    form.setValue('role_permissions', allPermissions)
  }

  const areAllModulesFullyChecked = (): boolean => {
    return modules.every((module) => {
      const perms = form.watch('role_permissions')[module.module_name] || '0000'
      return actions.every((action, index) => {
        if (module.enabled_permissions.includes(action)) return perms[index] === '1'
        return true
      })
    })
  }

  const onSubmit = (data: FormData) => {
    const allPermissions = modules.reduce(
      (acc, mod) => {
        let permission = data.role_permissions?.[mod.module_name] || '0000'
        if (mod.module_name === 'tableau de bord') permission = '1' + permission.substring(1)
        acc[mod.module_name] = permission
        return acc
      },
      {} as Record<string, string>
    )

    const payload = { ...data, role_permissions: allPermissions }

    if (isEdit && role) {
      updateRole({ id: role.role_id, data: payload }, { onSuccess: handleClose })
    } else if (isAdd) {
      createRole(payload, { onSuccess: handleClose })
    }
  }

  const ModeIcon = isEdit ? IconEdit : isView ? Eye : IconPlus;
  const modeLabel = isEdit ? t('edit_role') : isView ? t('view_role') : t('add_new_role')


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-3xl'>
        {/* ── Header ── */}
        <DialogHeader className="pt-5 pb-4">
          <div className='flex items-center gap-3'>
            <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
              <ModeIcon className='size-4 text-primary' />
            </div>
            <div>
              <DialogTitle>{modeLabel}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <DialogBody className='space-y-6'>
          <Form {...form}>
            <form id='role-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Role Name */}
              <FormField
                control={form.control}
                name='role_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs text-muted-foreground flex items-center gap-1.5'>
                      <Shield className='size-3' />
                      {t('role_name')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholder_role_name')}
                        autoComplete='off'
                        disabled={isView}
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(val.charAt(0).toUpperCase() + val.slice(1))
                        }}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />

              {/* Permissions Table */}
              <div className='space-y-3'>
                <div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                  <Lock className='size-3' />
                  {t('permissions')}
                </div>
                <div className='border rounded-xl overflow-hidden'>
                  <Table>
                    <TableHeader className='bg-muted/30'>
                      <TableRow className='hover:bg-transparent'>
                        <TableHead className='h-10'>{t('module')}</TableHead>
                        {actions.map((action) => (
                          <TableHead key={action} className='text-center h-10'>
                            {t(action)}
                          </TableHead>
                        ))}
                        <TableHead className='text-center h-10'>{t('all')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => (
                        <TableRow key={module.module_name} className='group'>
                          <TableCell className='font-medium capitalize py-3'>
                            <div className='flex items-center gap-2'>
                              {(() => {
                                const IconName = module.module_icon.replace(/^Icon/, '') as keyof typeof LucideIcons
                                const Icon = LucideIcons[IconName] as React.ElementType
                                return Icon ? <Icon className='size-3.5 text-muted-foreground' /> : <Shield className='size-3.5 text-muted-foreground' />
                              })()}
                              {module.module_name}
                            </div>
                          </TableCell>

                          {actions.map((action) => (
                            <TableCell key={action} className='text-center py-3'>
                              {module.enabled_permissions.includes(action) ? (
                                <Checkbox
                                  checked={isPermissionChecked(module.module_name, action)}
                                  disabled={isView || (module.module_name === 'tableau de bord' && action === 'view')}
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(module.module_name, action, checked as boolean)
                                  }
                                />
                              ) : (
                                <span className='text-muted-foreground/30'>—</span>
                              )}
                            </TableCell>
                          ))}

                          <TableCell className='text-center py-3'>
                            {module.module_name !== 'tableau de bord' && (
                              <Switch
                                checked={areAllPermissionsChecked(module.module_name)}
                                disabled={isView}
                                onCheckedChange={(checked) => handleToggleAllPermissions(module.module_name, checked)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Select All Row */}
                      {!isView && (
                        <TableRow className='bg-muted/10 hover:bg-muted/20 border-t-2'>
                          <TableCell className='font-semibold py-3'>{t('select_all')}</TableCell>
                          <TableCell colSpan={actions.length} />
                          <TableCell className='text-center py-3'>
                            <Switch
                              checked={areAllModulesFullyChecked()}
                              onCheckedChange={handleToggleAllModules}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </form>
          </Form>
        </DialogBody>

        {/* ── Footer ── */}
        <DialogFooter>
          <Button variant='ghost' type='button' onClick={handleClose} className='text-muted-foreground'>
            {t('cancel')}
          </Button>

          {isView && canUpdateRole && !isSuperAdmin && (
            <Button onClick={() => switchToEdit?.()} className='gap-2'>
              <Pencil className='size-3.5' />
              {t('edit')}
            </Button>
          )}

          {!isView && (
            <Button
              type='submit'
              form='role-form'
              disabled={isCreating || isUpdating}
              className='min-w-24'
            >
              {isCreating || isUpdating ? (
                <>
                  <Spinner variant='circle' />
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}