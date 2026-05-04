import type { ComponentProps } from 'react'
import logoAsset from '../../assets/Logo.svg'

type LogoProps = Omit<ComponentProps<'img'>, 'alt' | 'src'> & {
  alt?: string
}

export function Logo({ alt = 'brev.ly', ...props }: LogoProps) {
  return <img alt={alt} height={44} src={logoAsset} width={162} {...props} />
}
