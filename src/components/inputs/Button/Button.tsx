import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'

export type ButtonVariant = 'default' | 'primary' | 'accent' | 'text' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonOwnProps {
  /**
   * - `default`: a thin outline, for most actions.
   * - `primary`: a soft accent fill for the main action.
   * - `accent`: filled with the accent, for the one thing to do on a screen.
   * - `text`: no outline, for actions in a row or a bar.
   * - `danger`: filled red, for what can't be undone.
   */
  variant?: ButtonVariant
  size?: ButtonSize
  /** Leading icon. */
  icon?: IconSource
  /** Trailing icon. */
  iconEnd?: IconSource
  /** Full width. */
  block?: boolean
  /** Shows the Metro dots and blocks presses; the label stays for layout. */
  loading?: boolean
  /** Keep the label's case. By default chrome labels are lowercased, as in Metro. */
  keepCase?: boolean
  children?: ReactNode
}

export type ButtonProps = ButtonOwnProps &
  (
    | ({ href?: undefined; ref?: Ref<HTMLButtonElement> } & ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string; ref?: Ref<HTMLAnchorElement>; disabled?: boolean } & AnchorHTMLAttributes<HTMLAnchorElement>)
  )

/**
 * A Metro button: flat, square, lowercase. With `href` it renders a link
 * that looks the same.
 *
 * ```tsx
 * <Button variant="accent" icon={VscSave}>save</Button>
 * ```
 */
export function Button(props: ButtonProps) {
  const { variant = 'default', size = 'md', icon, iconEnd, block, loading, keepCase, className, children, ...rest } = useDefaults('Button', props)
  const content = (
    <>
      {icon != null && <span className="mt-button-icon">{renderIcon(icon)}</span>}
      {children != null && <span className="mt-button-label">{children}</span>}
      {iconEnd != null && <span className="mt-button-icon">{renderIcon(iconEnd)}</span>}
      {loading && <span className="mt-button-dots" aria-hidden><i /><i /><i /></span>}
    </>
  )
  const shared = {
    className: cx('mt-button', className),
    'data-variant': variant,
    'data-size': size,
    'data-block': flag(block),
    'data-loading': flag(loading),
    'data-icon-only': flag(children == null && (icon != null || iconEnd != null)),
    'data-keep-case': flag(keepCase),
    'data-mt-press': '',
    'data-mt-hover': '',
    'aria-busy': loading || undefined,
  }

  if (rest.href !== undefined) {
    const { disabled, onClick, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { disabled?: boolean; ref?: Ref<HTMLAnchorElement> }
    return (
      <a
        {...anchor}
        {...shared}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchor.tabIndex}
        onClick={(e) => (disabled || loading ? e.preventDefault() : onClick?.(e))}
      >
        {content}
      </a>
    )
  }
  const { type = 'button', disabled, onClick, ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> }
  return (
    <button {...button} {...shared} type={type} disabled={disabled} onClick={(e) => (loading ? e.preventDefault() : onClick?.(e))}>
      {content}
    </button>
  )
}
