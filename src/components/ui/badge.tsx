import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow,background-color] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        outline:
          'border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',

        // Soft / tinted pills (replaced styles, same names)
        destructive:
          'rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400 [a&]:hover:bg-red-500/20',
        destructive1:
          'rounded-full bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400 [a&]:hover:bg-red-500/20',
        success:
          'rounded-full bg-green-500/10 text-green-600 dark:bg-green-500/15 dark:text-green-400 [a&]:hover:bg-green-500/20',
        update:
          'rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 [a&]:hover:bg-blue-500/20',
        warning:
          'rounded-full bg-orange-500/10 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400 [a&]:hover:bg-orange-500/20',
        info: 'rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400 [a&]:hover:bg-fuchsia-500/20',
        auth: 'rounded-full bg-slate-500/10 text-slate-600 dark:bg-slate-400/15 dark:text-slate-300 [a&]:hover:bg-slate-500/20',
        login:
          'rounded-full bg-slate-500/10 text-slate-600 dark:bg-slate-400/15 dark:text-slate-300 [a&]:hover:bg-slate-500/20',
        logout:
          'rounded-full bg-slate-500/10 text-slate-600 dark:bg-slate-400/15 dark:text-slate-300 [a&]:hover:bg-slate-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
