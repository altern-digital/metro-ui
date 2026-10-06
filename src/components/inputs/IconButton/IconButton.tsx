import type { ButtonHTMLAttributes, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx } from '../../../utils'
import type { IconSource } from '../../foundation/Icon/Icon'
import { Button, type ButtonSize } from '../Button/Button'

export type IconButtonVariant = 'default' | 'text' | 'accent'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The glyph: a component (`VscAdd`) or an element. */
  icon: IconSource
  /** What it does. Becomes the spoken name (`aria-label`) and the tooltip (`title`). */
  label: string
  /** Default `text`: no outline until hovered. */
  variant?: IconButtonVariant
  size?: ButtonSize
  loading?: boolean
  ref?: Ref<HTMLButtonElement>
}

/**
 * A square button with only an icon. Its side is the control height, so it
 * lines up with fields and buttons at every density.
 *
 * ```tsx
 * <IconButton icon={VscRefresh} label="refresh" />
 * ```
 */
export function IconButton(props: IconButtonProps) {
  const { icon, label, variant = 'text', className, title, ...rest } = useDefaults('IconButton', props)
  return <Button {...rest} className={cx('mt-icon-button', className)} variant={variant} icon={icon} aria-label={label} title={title ?? label} />
}
