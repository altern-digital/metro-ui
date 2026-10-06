import type { CSSProperties, HTMLAttributes, Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { clamp, cx } from '../../../utils'
import { toneColor, type DisplayTone } from '../tone'

export type ProgressRingSize = 'sm' | 'md' | 'lg'

export interface ProgressRingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** `sm` 16, `md` 32, `lg` 64, or px. */
  size?: ProgressRingSize | number
  /** Default `accent`. */
  tone?: DisplayTone
  /** The spoken name. Default: the locale's `loading`. */
  label?: string
  /** How far along: draws an arc instead of the orbiting dots. */
  value?: number
  /** Default 100. */
  max?: number
  ref?: Ref<HTMLSpanElement>
}

const SIZES: Record<ProgressRingSize, number> = { sm: 16, md: 32, lg: 64 }

/**
 * The Windows 8 progress ring: five dots chasing round a circle, speeding
 * up and slowing down. With a `value` it is an arc that fills instead.
 *
 * ```tsx
 * <ProgressRing />
 * <ProgressRing size="lg" value={60} />
 * ```
 */
export function ProgressRing(props: ProgressRingProps) {
  const { size = 'md', tone = 'accent', label, value, max = 100, className, style, ...rest } = useDefaults('ProgressRing', props)
  const locale = useLocale()
  const px = typeof size === 'number' ? size : SIZES[size]
  const determinate = value != null
  const ratio = determinate && max > 0 ? clamp(value / max, 0, 1) : 0
  return (
    <span
      role="progressbar"
      aria-label={label ?? locale.loading}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? max : undefined}
      aria-valuenow={determinate ? clamp(value, 0, max) : undefined}
      aria-busy={!determinate || undefined}
      {...rest}
      className={cx('mt-progress-ring', className)}
      style={{ '--_size': `${px}px`, '--_tone': toneColor(tone), ...style } as CSSProperties}
      data-size={typeof size === 'number' ? undefined : size}
      data-determinate={determinate ? '' : undefined}
    >
      {determinate ? (
        <svg viewBox="0 0 36 36" width="100%" height="100%" aria-hidden>
          <circle className="mt-progress-ring-track" cx="18" cy="18" r="16" fill="none" strokeWidth="3" />
          <circle
            className="mt-progress-ring-arc"
            cx="18"
            cy="18"
            r="16"
            fill="none"
            strokeWidth="3"
            pathLength={100}
            strokeDasharray={`${ratio * 100} 100`}
          />
        </svg>
      ) : (
        <>
          <i />
          <i />
          <i />
          <i />
          <i />
        </>
      )}
    </span>
  )
}
