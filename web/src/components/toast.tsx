import { WarningIcon } from '@/components/icons'
import { cn } from '@/utils/cn'

type ToastVariant = 'success' | 'error'

export type ToastMessage = {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

type ToastProps = {
  toast: ToastMessage | null
}

export function Toast({ toast }: ToastProps) {
  if (!toast) {
    return null
  }

  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-[360px]"
      role="status"
    >
      <div
        className={cn(
          'rounded-lg border bg-white p-4 shadow-lg',
          toast.variant === 'error' ? 'border-danger' : 'border-blue-base',
        )}
      >
        <div className="flex items-start gap-3">
          <WarningIcon
            aria-hidden="true"
            className={cn(
              'mt-0.5 size-4 shrink-0',
              toast.variant === 'error' ? 'text-danger' : 'text-blue-base',
            )}
          />
          <div className="min-w-0">
            <p className="text-md font-bold text-gray-600">{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-sm text-gray-500">{toast.description}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
