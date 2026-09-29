type PageHeaderProps = {
  title?: string
}

export function PageHeader({ title = '' }: PageHeaderProps) {
  return (
    <div className='px-6 pt-2 pb-6 text-white'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div>
            <h1 className='leading-tight font-medium text-xl'>{title}</h1>
          </div>
        </div>
      </div>
    </div>
  )
}