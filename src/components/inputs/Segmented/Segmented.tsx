import { useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { useMergedRef, useUncontrolled } from '@mantine/hooks'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'

export interface SegmentedOption {
  value: string
  label?: ReactNode
  icon?: IconSource
  disabled?: boolean
  /** Spoken name, for a segment with only an icon. */
  'aria-label'?: string
}

export interface SegmentedProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: SegmentedOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Fill the width, segments sharing it equally. */
  block?: boolean
  size?: 'sm' | 'md'
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
}

/**
 * A row of joined flat segments, one picked (filled with the accent): a
 * filter bar or a view switch. A radio group to assistive tech; arrow keys
 * move and pick, Home and End jump to the ends.
 *
 * ```tsx
 * <Segmented options={[{ value: 'day', label: 'day' }, { value: 'week', label: 'week' }]} />
 * ```
 */
export function Segmented(props: SegmentedProps) {
  const { options, value, defaultValue, onChange, block, size = 'md', disabled, className, ref, onKeyDown, ...rest } = useDefaults('Segmented', props)
  const [current, setCurrent] = useUncontrolled<string | undefined>({ value, defaultValue, onChange: (v) => v !== undefined && onChange?.(v) })
  const root = useRef<HTMLDivElement>(null)
  const mergedRef = useMergedRef(root, ref)
  const enabled = options.filter((o) => !o.disabled && !disabled)
  const focusable = enabled.find((o) => o.value === current) ?? enabled[0]

  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || enabled.length === 0) return
    const at = enabled.findIndex((o) => o.value === (e.target as HTMLElement).dataset.value)
    let next: number
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (at + 1) % enabled.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (at - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1
    else return
    e.preventDefault()
    const option = enabled[next]
    if (!option) return
    setCurrent(option.value)
    const items = root.current?.querySelectorAll<HTMLElement>('.mt-segmented-item') ?? []
    for (const item of items) if (item.dataset.value === option.value) item.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-disabled={disabled || undefined}
      {...rest}
      ref={mergedRef}
      className={cx('mt-segmented', className)}
      data-size={size}
      data-block={flag(block)}
      onKeyDown={keyDown}
    >
      {options.map((o) => {
        const selected = o.value === current
        const off = disabled || o.disabled
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            className="mt-segmented-item"
            aria-checked={selected}
            aria-label={o['aria-label']}
            data-value={o.value}
            data-selected={flag(selected)}
            disabled={off}
            tabIndex={o === focusable ? 0 : -1}
            data-mt-press=""
            data-mt-hover=""
            onClick={() => setCurrent(o.value)}
          >
            {o.icon != null && <span className="mt-segmented-icon">{renderIcon(o.icon)}</span>}
            {o.label != null && <span className="mt-segmented-label">{o.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
