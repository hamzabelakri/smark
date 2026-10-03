import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogEnum, ModalMode } from '@/models/alert-model'
import { Role } from '@/models/role-model'
import { User } from '@/models/user-model'
import { IconEdit, IconPlus } from '@tabler/icons-react'
import {
  CheckCircle2,
  XCircle,
  Pencil,
  Eye,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePermissions } from '@/hooks/use-permissions'
import { useCreateUser, useUpdateUser } from '@/hooks/use-users'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
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
import { Spinner } from '@/components/ui/shadcn-io/spinner'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'

// ── Schema Factory ───────────────────────────────────────────────

const getSchemas = (t: any) => {
  const base = z.object({
    first_name: z
      .string()
      .nonempty({ message: t('first_name_req') })
      .min(3, { message: t('first_name_min') }),
    last_name: z
      .string()
      .nonempty({ message: t('last_name_req') })
      .min(3, { message: t('last_name_min') }),
    email: z
      .string()
      .nonempty({ message: t('email_req') })
      .email({ message: t('email_invalid') }),
    role_id: z.string().nonempty({ message: t('role_req') }),
    password: z
      .string()
      .nonempty({ message: t('password_req') })
      .min(6, { message: t('password_min_6') }),
  })

  const edit = base.extend({
    password: z
      .string()
      .min(6, { message: t('password_min_6') })
      .optional()
      .or(z.literal('')),
  })

  return { base, edit }
}

// Define a concrete type for the form to satisfy RHF's Control types
type UserFormValues = {
  first_name: string
  last_name: string
  email: string
  role_id: string
  password?: string
}

// ── Props ────────────────────────────────────────────────────────

interface Props {
  user?: User
  roles?: Role[]
  open: boolean
  onClose: () => void
  mode?: ModalMode
  switchToEdit?: () => void
}

// ── Component ────────────────────────────────────────────────────

export function UsersActionModal({
  user,
  roles,
  open,
  onClose,
  mode,
  switchToEdit,
}: Props) {
  const { t } = useTranslation()

  const isEdit = mode === DialogEnum.EDIT
  const isView = mode === DialogEnum.VIEW
  const isAdd = mode === DialogEnum.ADD

  const { modulePermissions } = usePermissions()
  const canUpdateUser = modulePermissions.users?.canUpdate
  const isSuperAdmin = user?.role_id === 1

  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()

  // Create the schema based on current translation function
  const { base, edit } = useMemo(() => getSchemas(t), [t])
  const schema = isEdit ? edit : base

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role_id: '',
      password: '',
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        role_id: String(user.role_id) || '',
        password: '',
      })
    } else if (open) {
      form.reset({
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
        password: '',
      })
    }
  }, [user, form, open])

  const onSubmit = (values: UserFormValues) => {
    const payload = { ...values, role_id: parseInt(values.role_id) }
    if (isEdit && user) {
      updateUser(
        { id: user.user_id, data: payload as any },
        { onSuccess: handleClose }
      )
    } else if (isAdd) {
      createUser(payload as any, { onSuccess: handleClose })
    }
  }

  const ModeIcon = isEdit ? IconEdit : isView ? Eye : IconPlus
  const modeLabel = isEdit
    ? t('edit_user')
    : isView
      ? t('view_user')
      : t('add_new_user')

  const badgeVariant = user?.status ? 'success' : 'destructive'
  const statusText = user?.status ? t('active') : t('inactive')

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) handleClose()
      }}
    >
      <DialogContent className=''>
        {/* ── Header ── */}
        <DialogHeader className='pt-5 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-lg'>
              <ModeIcon className='text-primary size-5' />
            </div>
            <div>
              <DialogTitle>{modeLabel}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ── */}
        <DialogBody>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <div className='grid grid-cols-2 gap-3'>
                <FormField
                  control={form.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-muted-foreground text-xs'>
                        {t('first_name')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('placeholder_first_name')}
                          autoComplete='off'
                          disabled={isView}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='last_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-muted-foreground text-xs'>
                        {t('last_name')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('placeholder_last_name')}
                          disabled={isView}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground text-xs'>
                      {t('email')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('placeholder_email')}
                        disabled={isView}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground text-xs'>
                      {t('role')}
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={t('placeholder_select_role')}
                      disabled={isView}
                      className='w-full'
                      items={
                        roles?.map((role) => ({
                          value: String(role.role_id),
                          label: role.role_name,
                        })) || []
                      }
                    />
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              {!isView && (
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-muted-foreground text-xs'>
                        {t('password')}
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="********"
                          disabled={isView}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-xs' />
                    </FormItem>
                  )}
                />
              )}
            </form>

            {isView && user && (
              <div className='mt-5 flex items-center justify-between border-t pt-4'>
                <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium'>
                  {user.status ? (
                    <CheckCircle2 className='size-3.5 text-emerald-500' />
                  ) : (
                    <XCircle className='text-destructive size-3.5' />
                  )}
                  {t('status')}
                </div>
                <Badge variant={badgeVariant} className='text-xs capitalize'>
                  {statusText}
                </Badge>
              </div>
            )}
          </Form>
        </DialogBody>

        {/* ── Footer ── */}
        <DialogFooter>
          <Button
            variant='ghost'
            type='button'
            onClick={handleClose}
            className='text-muted-foreground'
          >
            {t('cancel')}
          </Button>

          {isView && canUpdateUser && !isSuperAdmin && (
            <Button onClick={() => switchToEdit?.()} className='gap-2'>
              <Pencil className='size-3.5' />
              {t('edit')}
            </Button>
          )}

          {!isView && (
            <Button
              type='submit'
              form='user-form'
              disabled={isCreating || isUpdating}
              className='min-w-24'
            >
              {isCreating || isUpdating ? (
                <>
                  <Spinner variant='circle' className='mr-2' />
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