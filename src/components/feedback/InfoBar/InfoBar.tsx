import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { cx } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { CloseGlyph, SEVERITY_GLYPH, type Severity } from '../_overlay/glyphs'

export type InfoBarSeverity = Severity

export interface InfoBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Default `info`. Error and warning are announced at once (`role="alert"`). */
  severity?: InfoBarSeverity
  /** Bold lead-in. */
  title?: ReactNode
  /** The message; `children` works too and comes after it. */
  message?: ReactNode
  /** Replaces the severity glyph; `false` hides it. */
  icon?: IconSource | false
  /** Usually a small Button or a link, shown at the end. */
  action?: ReactNode
  /** Shows a close button that calls `onClose`. */
  closable?: boolean
  onClose?: () => void
  /** `bar` (default): a 4px coloured bar on the left. `fill`: a tint of the colour across the whole bar. */
  appearance?: 'bar' | 'fill'
  /** Label of the close button. Default the locale's `close`. */
  closeLabel?: string
  ref?: Ref<HTMLDivElement>
}

/**
 * A Windows InfoBar: an inline message with a severity colour, a glyph,
 * an optional action and close button. It stays in the page's flow.
 *
 * ```tsx
 * <InfoBar severity="warning" title="offline" message="changes will sync later." />
 * ```
 */
export function InfoBar(props: InfoBarProps) {
  const locale = useLocale()
  const { severity = 'info', title, message, icon, action, closable, onClose, appearance = 'bar', closeLabel = locale.close, className, children, role, ...rest } = useDefaults('InfoBar', props)
  const Glyph = SEVERITY_GLYPH[severity]
  const urgent = severity === 'error' || severity === 'warning'
  return (
    <div {...rest} role={role ?? (urgent ? 'alert' : 'status')} className={cx('mt-info-bar', className)} data-severity={severity} data-appearance={appearance}>
      {icon !== false && (
        <span className="mt-info-bar-icon" aria-hidden>
          {icon != null ? renderIcon(icon) : <Glyph />}
        </span>
      )}
      <div className="mt-info-bar-text">
        {title != null && <strong className="mt-info-bar-title">{title}</strong>}
        {message != null && <span className="mt-info-bar-message">{message}</span>}
        {children}
      </div>
      {action != null && <div className="mt-info-bar-action">{action}</div>}
      {closable && (
        <button type="button" className="mt-info-bar-close" aria-label={closeLabel} onClick={onClose} data-mt-press="" data-mt-hover="">
          <CloseGlyph />
        </button>
      )}
    </div>
  )
}
