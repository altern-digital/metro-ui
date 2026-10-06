import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { toneVar, type Tone } from '../../../config/theme'
import { cx, flag } from '../../../utils'

export interface BarDatum {
  label: string
  value: number
  /** This bar's colour. Default the chart's `tone`, else the accent. */
  tone?: Tone
}

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  data: BarDatum[]
  /** `vertical` (default): columns standing on a baseline. `horizontal`: rows, labels on the left. */
  orientation?: 'vertical' | 'horizontal'
  /** The value a full bar stands for. Default the largest value. */
  max?: number
  /** Formats values, in the labels and for screen readers. */
  format?: (value: number) => string
  /** Print each value on its bar. Default true. */
  showValues?: boolean
  /** Colour for every bar without its own. */
  tone?: Tone
  /** Height of the vertical chart's plot area. Default 200. */
  height?: number | string
  /** What the chart shows, read before the values. */
  label?: string
  ref?: Ref<HTMLDivElement>
}

const defaultFormat = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 })

/**
 * A bar chart in plain HTML and CSS: no SVG, no chart library. Bars grow in
 * from their baseline. Screen readers get one sentence with every value.
 *
 * ```tsx
 * <BarChart data={[{ label: 'jan', value: 12 }, { label: 'feb', value: 18 }]} />
 * ```
 */
export function BarChart(props: BarChartProps) {
  const { data, orientation = 'vertical', max, format = defaultFormat, showValues = true, tone, height = 200, label, className, style, ...rest } =
    useDefaults('BarChart', props)
  const top = max ?? data.reduce((m, d) => Math.max(m, d.value), 0)
  const ratio = (v: number) => (top > 0 ? Math.min(1, Math.max(0, v / top)) : 0)
  const summary = (label ? `${label}: ` : '') + data.map((d) => `${d.label} ${format(d.value)}`).join(', ')

  const vars = {
    '--_height': typeof height === 'number' ? `${height}px` : height,
    '--_bar': toneVar(tone),
    ...(orientation === 'vertical' && { gridTemplateColumns: `repeat(${Math.max(1, data.length)}, minmax(0, 1fr))` }),
  } as CSSProperties

  return (
    <div
      role="img"
      aria-label={summary}
      {...rest}
      className={cx('mt-bar-chart', className)}
      style={{ ...vars, ...style }}
      data-orientation={orientation}
      data-values={flag(showValues)}
    >
      {data.map((d, i) => {
        const bar = {
          '--_i': i,
          '--_ratio': ratio(d.value),
          ...(d.tone && { '--_bar': toneVar(d.tone) }),
        } as CSSProperties
        const value: ReactNode = showValues && <span className="mt-bar-chart-value">{format(d.value)}</span>
        return (
          <div key={`${d.label}-${i}`} className="mt-bar-chart-item" style={bar}>
            {orientation === 'horizontal' && <span className="mt-bar-chart-label">{d.label}</span>}
            <span className="mt-bar-chart-track">
              {orientation === 'vertical' && value}
              <span className="mt-bar-chart-bar" />
            </span>
            {orientation === 'horizontal' && value}
            {orientation === 'vertical' && <span className="mt-bar-chart-label">{d.label}</span>}
          </div>
        )
      })}
    </div>
  )
}
