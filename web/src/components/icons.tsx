import {
  Copy,
  DownloadSimple,
  Link,
  Trash,
  Warning,
} from '@phosphor-icons/react'
import type { ComponentProps } from 'react'

type IconProps = ComponentProps<typeof Copy>

export function CopyIcon(props: IconProps) {
  return <Copy size={16} weight="bold" {...props} />
}

export function TrashIcon(props: IconProps) {
  return <Trash size={16} weight="bold" {...props} />
}

export function WarningIcon(props: IconProps) {
  return <Warning size={16} weight="fill" {...props} />
}

export function DownloadSimpleIcon(props: IconProps) {
  return <DownloadSimple size={16} weight="bold" {...props} />
}

export function LinkIcon(props: IconProps) {
  return <Link size={16} weight="bold" {...props} />
}
