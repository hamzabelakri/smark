import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  title?: string
  ref?: React.Ref<HTMLElement>
}

export function Main({ fixed, className, fluid, title, children, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'px-4 py-6',

        // If layout is fixed, make the main container flex and grow
        fixed && 'flex grow flex-col overflow-hidden',

        // If layout is not fluid, set the max-width
        !fluid && 'mx-auto w-full max-w-7xl',
        className
      )}
      {...props}
    >
      {title && (
        <div className='px-2 pt-2 pb-6 text-white'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div>
                <h1 className='leading-tight font-medium text-xl'>{title}</h1>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </main>
  )
}