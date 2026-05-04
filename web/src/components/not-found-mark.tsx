import type { ComponentProps } from 'react'
import notFoundAsset from '../../assets/404.svg'

type NotFoundMarkProps = Omit<ComponentProps<'img'>, 'alt' | 'src'> & {
  alt?: string
}

export function NotFoundMark({ alt = '404', ...props }: NotFoundMarkProps) {
  return (
    <img alt={alt} height={56} src={notFoundAsset} width={128} {...props} />
  )
}
