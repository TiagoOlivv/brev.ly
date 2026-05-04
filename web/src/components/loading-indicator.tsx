import { cn } from '@/utils/cn'

type LoadingIndicatorProps = {
  className?: string
  label?: string
}

export function LoadingIndicator({
  className,
  label = 'Carregando...',
}: LoadingIndicatorProps) {
  return (
    <div
      aria-label={label}
      className={cn('flex items-center gap-2 text-sm text-gray-500', className)}
      role="status"
    >
      <span className="size-4 animate-spin rounded-full border-2 border-blue-base border-t-transparent" />
      <span>{label}</span>
    </div>
  )
}
