import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'h-12 w-full rounded-lg bg-blue-base px-5 text-md font-semibold text-white transition-colors hover:bg-blue-dark disabled:bg-blue-base disabled:opacity-50',
  secondary:
    'h-8 rounded px-3 text-sm font-semibold text-gray-500 transition-colors bg-gray-200 hover:outline hover:outline-1 hover:outline-blue-base disabled:opacity-50',
}

export function Button({
  className,
  variant = 'primary',
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:pointer-events-none',
        variants[variant],
        className,
      )}
      type="button"
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
