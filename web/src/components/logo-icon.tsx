import type { ComponentProps } from 'react'
import logoIconAsset from '../../assets/Logo_Icon.svg'

type LogoIconProps = Omit<ComponentProps<'img'>, 'alt' | 'src'> & {
  alt?: string
}

export function LogoIcon({ alt = 'brev.ly', ...props }: LogoIconProps) {
  return <img alt={alt} height={52} src={logoIconAsset} width={52} {...props} />
}
