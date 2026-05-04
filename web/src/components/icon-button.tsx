import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function IconButton({ className, children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={props['aria-label']}
      className={cn(
        'flex size-8 items-center justify-center rounded bg-gray-200 text-gray-600 transition-colors hover:outline hover:outline-1 hover:outline-blue-base disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
