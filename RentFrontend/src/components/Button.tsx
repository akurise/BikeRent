import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import '../App.css'

type Variants = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonAsButton = {
  as?: 'button'
  href?: never
} & ButtonHTMLAttributes<HTMLButtonElement>

type ButtonAsLink = {
  as: 'a'
  href: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

type ButtonProps = (ButtonAsButton | ButtonAsLink) & {
  variant?: Variants
}

export function Button({ variant = 'primary', className = '', as = 'button', ...props }: ButtonProps) {
  const classes = `btn btn-${variant} ${className}`.trim()

  if (as === 'a') {
    const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement>
    return <a className={classes} {...linkProps} />
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>
  return <button className={classes} {...buttonProps} />
}
