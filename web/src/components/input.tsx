import type { InputHTMLAttributes } from 'react'
import { WarningIcon } from '@/components/icons'
import { cn } from '@/utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  prefix?: string
}

export function Input({
  className,
  error,
  id,
  label,
  prefix,
  ...props
}: InputProps) {
  const inputId = id ?? props.name ?? label

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        className={cn(
          'text-xs text-gray-500',
          error && 'font-bold text-danger',
        )}
        htmlFor={inputId}
      >
        {label}
      </label>

      {prefix ? (
        <div
          className={cn(
            'flex h-12 items-center rounded-lg border border-gray-300 bg-transparent px-4 text-md outline-none transition-colors focus-within:border-blue-base',
            error && 'border-danger focus-within:border-danger',
            props.disabled && 'opacity-50',
            className,
          )}
        >
          <span className="shrink-0 text-gray-400">{prefix}</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-gray-600 outline-none disabled:opacity-50"
            id={inputId}
            {...props}
          />
        </div>
      ) : (
        <input
          className={cn(
            'h-12 rounded-lg border border-gray-300 bg-transparent px-4 text-md text-gray-600 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-base focus:text-blue-base disabled:opacity-50',
            error && 'border-danger focus:border-danger focus:text-gray-600',
            className,
          )}
          id={inputId}
          {...props}
        />
      )}

      {error ? (
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <WarningIcon className="size-4 shrink-0 text-danger" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
