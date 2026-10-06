import type { CSSProperties, InputHTMLAttributes, KeyboardEvent, ReactNode, Ref } from 'react'
import { useUncontrolled } from '@mantine/hooks'
import { useDefaults } from '../../../config/context'
import { clamp, cx, flag } from '../../../utils'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'children'> {
  min?: number
  max?: number
  step?: number
  value?: number
  defaultValue?: number
  /** Every change while dragging or pressing keys. */
  onChange?: (value: number) => void
  /** When the pointer lets go or a key is released: for saving, not for live preview. */
  onChangeEnd?: (value: number) => void
  /** Show the value in a small box over the thumb while it is dragged or focused. */
  tooltip?: boolean
  /** How the tooltip (and screen readers, if it returns a string) say the value. */
  formatValue?: (value: number) => ReactNode
  /** Goes on the root; other props go on the native `<input type="range">`. */
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLInputElement>
}

const KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'])

/**
 * The Metro slider: a thin track, filled with the accent up to a tall
 * rectangular thumb. A styled native `<input type="range">`, so dragging,
 * arrow keys, Page Up/Down, Home/End and screen readers all work natively.
 *
 * ```tsx
 * <Slider aria-label="volume" defaultValue={40} />
 * ```
 */
export function Slider(props: SliderProps) {
  const { min = 0, max = 100, step = 1, value, defaultValue, onChange, onChangeEnd, tooltip, formatValue, className, style, disabled, onPointerUp, onKeyUp, ...rest } = useDefaults('Slider', props)
  const [current, setCurrent] = useUncontrolled<number>({ value, defaultValue, finalValue: min, onChange })
  const shown = clamp(current, min, max)
  const ratio = max > min ? (shown - min) / (max - min) : 0
  const formatted = formatValue ? formatValue(shown) : shown

  return (
    <div className={cx('mt-slider', className)} style={{ ...style, '--_p': ratio } as CSSProperties} data-disabled={flag(disabled)}>
      <span className="mt-slider-track" aria-hidden>
        <span className="mt-slider-fill" />
      </span>
      <input
        {...rest}
        type="range"
        className="mt-slider-input"
        min={min}
        max={max}
        step={step}
        value={shown}
        disabled={disabled}
        aria-valuetext={typeof formatted === 'string' ? formatted : rest['aria-valuetext']}
        onChange={(e) => setCurrent(Number(e.currentTarget.value))}
        onPointerUp={(e) => {
          onPointerUp?.(e)
          onChangeEnd?.(Number(e.currentTarget.value))
        }}
        onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
          onKeyUp?.(e)
          if (KEYS.has(e.key)) onChangeEnd?.(Number(e.currentTarget.value))
        }}
      />
      {tooltip && (
        <span className="mt-slider-tooltip" aria-hidden>
          {formatted}
        </span>
      )}
    </div>
  )
}
