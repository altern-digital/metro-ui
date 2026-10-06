import type { ButtonHTMLAttributes, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'

export interface AppBarButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconSource
  /** The small lowercase caption under the circle; also the spoken name. */
  label: string
  /** Hide the caption (it stays as the spoken name and the tooltip). */
  compact?: boolean
  /** Makes it a toggle: the circle fills while `true`, and `aria-pressed` follows. */
  pressed?: boolean
  ref?: Ref<HTMLButtonElement>
}

/**
 * The Windows 8 / Windows Phone app bar button: an icon in a filled circle with
 * a small lowercase caption underneath. Pass `pressed` to make it a toggle.
 *
 * ```tsx
 * <AppBarButton icon={VscAdd} label="new" />
 * ```
 */
export function AppBarButton(props: AppBarButtonProps) {
  const { icon, label, compact, pressed, className, type = 'button', title, ...rest } = useDefaults('AppBarButton', props)
  return (
    <button
      {...rest}
      type={type}
      className={cx('mt-app-bar-button', className)}
      title={title ?? (compact ? label : undefined)}
      aria-pressed={pressed}
      data-compact={flag(compact)}
      data-on={flag(pressed)}
      data-mt-press=""
    >
      <span className="mt-app-bar-button-circle" aria-hidden>
        {renderIcon(icon)}
      </span>
      <span className={compact ? 'mt-visually-hidden' : 'mt-app-bar-button-label'}>{label}</span>
    </button>
  )
}
