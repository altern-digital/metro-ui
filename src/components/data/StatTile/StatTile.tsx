import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import type { Tone } from '../../../config/theme'
import { useTween } from '../../../motion/tween'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { useToneVars } from '../tone'

export interface StatTileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What is counted, small and lowercase above the number. */
  label: ReactNode
  /** The number (or any content). */
  value: ReactNode
  /** Change since last time: positive is green with an up arrow, negative red with a down one. A node shows as given. */
  delta?: number | ReactNode
  /** Formats a numeric `delta`, without its sign. Default `format`. */
  formatDelta?: (delta: number) => ReactNode
  /** Flip the colours, for numbers where down is good (costs, errors). */
  invertDelta?: boolean
  /** A muted line under the number. */
  caption?: ReactNode
  /** A small icon beside the label. */
  icon?: IconSource
  /** Fill the tile with a tone. Without one it is a panel. */
  tone?: Tone
  /** Count up to a numeric `value`, and from each value to the next. */
  animate?: boolean
  /** Formats a numeric `value`. Default the locale's number format. */
  format?: (value: number) => ReactNode
  ref?: Ref<HTMLDivElement>
}

const defaultFormat = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 })

function Arrow({ up }: { up: boolean }) {
  return (
    <svg className="mt-stat-tile-arrow" viewBox="0 0 16 16" width="1em" height="1em" aria-hidden>
      <path d={up ? 'M8 3 13 10H3z' : 'M8 13 3 6h10z'} fill="currentColor" />
    </svg>
  )
}

/**
 * A big number on a tile, from DS Mutasi: a small label, the number in
 * light weight and tabular figures, and how it moved.
 *
 * ```tsx
 * <StatTile label="balance" value={1250000} delta={3.2} formatDelta={(d) => `${d}%`} animate />
 * ```
 */
export function StatTile(props: StatTileProps) {
  const { label, value, delta, formatDelta, invertDelta, caption, icon, tone, animate, format = defaultFormat, className, style, ...rest } = useDefaults(
    'StatTile',
    props,
  )
  const toneVars = useToneVars(tone)
  const numeric = typeof value === 'number'
  const tweened = useTween(numeric ? value : 0, { from: animate && numeric ? 0 : undefined, duration: animate ? 900 : 0 })
  const shown = numeric ? format(animate ? tweened : value) : value

  let trend: 'up' | 'down' | 'flat' | undefined
  let deltaText: ReactNode = delta as ReactNode
  if (typeof delta === 'number') {
    trend = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat'
    const body = (formatDelta ?? format)(Math.abs(delta))
    deltaText = (
      <>
        {trend !== 'flat' && <Arrow up={trend === 'up'} />}
        <span>
          {trend === 'up' ? '+' : trend === 'down' ? '−' : ''}
          {body}
        </span>
      </>
    )
  }
  const good = trend === 'flat' || trend === undefined ? undefined : (trend === 'up') !== !!invertDelta

  return (
    <div {...rest} className={cx('mt-stat-tile', className)} style={{ ...toneVars, ...style }} data-filled={flag(!!tone)}>
      <div className="mt-stat-tile-label">
        {icon != null && <span className="mt-stat-tile-icon">{renderIcon(icon)}</span>}
        <span>{label}</span>
      </div>
      <div className="mt-stat-tile-value">{shown}</div>
      {(delta != null || caption != null) && (
        <div className="mt-stat-tile-foot">
          {delta != null && (
            <span className="mt-stat-tile-delta" data-trend={trend} data-good={good === undefined ? undefined : String(good)}>
              {deltaText}
            </span>
          )}
          {caption != null && <span className="mt-stat-tile-caption">{caption}</span>}
        </div>
      )}
    </div>
  )
}
