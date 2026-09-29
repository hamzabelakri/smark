import { cn } from '@/lib/utils'

type HeroCanvasProps = {
  /** Tailwind height class for the top hero band. Defaults to h-105 (~420px). */
  height?: string
  className?: string
}

/**
 * Fixed canvas hero band pinned to the top of the viewport with an overlay.
 * Dashboard workspace content should render above it (z-10+) so it appears as a colored
 * hero strip behind the header/sidebar.
 */
export function HeroCanvas({
  height = 'h-105',
  className,
}: HeroCanvasProps) {
  return (
    <div
      className={cn(
        'after:bg-hero-canvas fixed inset-x-0 top-0 z-1 block bg-[url(/images/background.jpg)] bg-cover bg-center bg-no-repeat after:block after:size-full',
        height,
        className
      )}
    />
  )
}