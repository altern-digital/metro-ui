import { useId, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { clamp, cx, flag } from '../../../utils'
import { toneColor, type DisplayTone } from '../tone'

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** How far along. Leave it out for the indeterminate dots. */
  value?: number
  /** Default 100. */
  max?: number
  /** Default `accent`. */
  tone?: DisplayTone
  /** A caption over the bar, also its spoken name. Without one it is named with the locale's `loading`. */
  label?: ReactNode
  ref?: Ref<HTMLDivElement>
}

/**
 * A 4px bar on the border colour, filled with the accent. With no `value`,
 * the Windows Phone dots fly across instead.
 *
 * ```tsx
 * <ProgressBar value={40} label="uploading" />
 * <ProgressBar />
 * ```
 */
export function ProgressBar(props: ProgressBarProps) {
  const { value, max = 100, tone = 'accent', label, className, style, ...rest } = useDefaults('ProgressBar', props)
  const locale = useLocale()
  const id = useId()
  const indeterminate = value == null
  const ratio = indeterminate || max <= 0 ? 0 : clamp(value / max, 0, 1)
  return (
    <div
      {...rest}
      className={cx('mt-progress-bar', className)}
      style={{ '--_tone': toneColor(tone), '--_value': ratio, ...style } as CSSProperties}
      data-indeterminate={flag(indeterminate)}
    >
      {label != null && (
        <div className="mt-progress-bar-label" id={id}>
          {label}
        </div>
      )}
      <div
        className="mt-progress-bar-track"
        role="progressbar"
        aria-labelledby={label != null ? id : undefined}
        aria-label={label == null ? locale.loading : undefined}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : clamp(value, 0, max)}
        aria-busy={indeterminate || undefined}
      >
        {indeterminate ? (
          <>
            <i />
            <i />
            <i />
            <i />
            <i />
          </>
        ) : (
          <span className="mt-progress-bar-fill" />
        )}
      </div>
    </div>
  )
}
