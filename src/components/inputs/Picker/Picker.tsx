import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from 'react'
import { useUncontrolled } from '@mantine/hooks'
import { useConfig, useDefaults, useLocale } from '../../../config/context'
import { clamp, cx, flag } from '../../../utils'

export type PickerItemValue = string | number
export type PickerValue = Record<string, PickerItemValue>

export interface PickerOption {
  value: PickerItemValue
  label: ReactNode
}

export interface PickerColumn {
  key: string
  options: PickerOption[]
  /** Spoken name of the column (`hour`). Default: its key. */
  label?: string
  /** Override the picker's `loop` for this column. */
  loop?: boolean
  /** CSS width. Default: fits its widest row, at least 64px. */
  width?: number | string
}

export interface PickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  columns: PickerColumn[]
  /** The picked value of each column, by key. A missing key shows the column's first option. */
  value?: PickerValue
  defaultValue?: PickerValue
  /** The whole value (every column) and the key of the column that changed. */
  onChange?: (value: PickerValue, key: string) => void
  /** Wrap around: the list repeats endlessly, as the Windows Phone looping selector did. */
  loop?: boolean
  /** Rows on show, the picked one in the middle. Odd. Default 5. */
  rows?: number
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
}

/** Scroll quiet for this long and the column has settled on a row. */
const SETTLE_MS = 120
const FALLBACK_ROW = 44

/**
 * The Windows Phone looping picker: one or more columns that scroll and snap
 * (CSS scroll snap, no JS physics), the row in the middle picked and filled
 * with the accent, rows above and below fading away. Swipe on touch; wheel,
 * drag or arrow keys on a desktop. Each column is a spin button to
 * assistive tech.
 *
 * ```tsx
 * <Picker loop columns={[{ key: 'size', options: [{ value: 's', label: 'small' }, { value: 'l', label: 'large' }] }]} />
 * ```
 */
export function Picker(props: PickerProps) {
  const { columns, value, defaultValue, onChange, loop, rows = 5, disabled, className, style, ...rest } = useDefaults('Picker', props)
  const [current, setCurrent] = useUncontrolled<PickerValue>({ value, defaultValue, finalValue: {} })
  const { reducedMotion } = useConfig()

  const indexOf = (column: PickerColumn) => Math.max(0, column.options.findIndex((o) => o.value === current[column.key]))

  const pick = (column: PickerColumn, index: number) => {
    const option = column.options[index]
    if (!option || option.value === current[column.key]) return
    const next: PickerValue = {}
    for (const c of columns) {
      const v = c.key === column.key ? option.value : (c.options[indexOf(c)]?.value ?? current[c.key])
      if (v !== undefined) next[c.key] = v
    }
    setCurrent(next)
    onChange?.(next, column.key)
  }

  return (
    <div {...rest} className={cx('mt-picker', className)} style={{ ...style, '--_rows': rows } as CSSProperties} data-disabled={flag(disabled)}>
      {columns.map((column) => (
        <Column
          key={column.key}
          column={column}
          index={indexOf(column)}
          loop={column.loop ?? !!loop}
          disabled={disabled}
          smooth={!reducedMotion}
          onPick={(i) => pick(column, i)}
        />
      ))}
    </div>
  )
}

interface ColumnProps {
  column: PickerColumn
  index: number
  loop: boolean
  disabled?: boolean
  smooth: boolean
  onPick: (index: number) => void
}

function Column({ column, index, loop, disabled, smooth, onPick }: ColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const n = column.options.length
  // Looping renders the list three times and keeps the scroll in the middle copy.
  const copies = loop && n > 1 ? 3 : 1
  const base = copies === 3 ? n : 0
  const total = n * copies
  const [activeRaw, setActiveRaw] = useState(base + index)
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined)
  const drag = useRef<{ y: number; top: number; moved: number } | null>(null)
  const dragged = useRef(false)
  const latest = useRef({ index, onPick })
  latest.current = { index, onPick }

  const mod = (i: number) => ((i % n) + n) % n
  const rowHeight = () => ref.current?.querySelector<HTMLElement>('.mt-picker-row')?.offsetHeight || FALLBACK_ROW
  const rawAt = () => clamp(Math.round((ref.current?.scrollTop ?? 0) / rowHeight()), 0, Math.max(0, total - 1))
  const scrollToRaw = (raw: number, animate: boolean) => {
    const el = ref.current
    if (!el) return
    const top = raw * rowHeight()
    if (animate && typeof el.scrollTo === 'function') el.scrollTo({ top, behavior: 'smooth' })
    else el.scrollTop = top
  }

  // Place the column on its value, without animation, when it mounts or its length changes.
  useLayoutEffect(() => {
    const raw = base + latest.current.index
    setActiveRaw(raw)
    scrollToRaw(raw, false)
    // Deliberate deps: only on mount and when the list changes length.
  }, [n, copies])

  // Follow a value set from outside (keys, a click, the parent): scroll to it the short way round.
  useEffect(() => {
    if (n === 0) return
    const raw = rawAt()
    let target = index
    if (copies === 3) {
      let d = index - mod(raw)
      if (d > n / 2) d -= n
      if (d < -n / 2) d += n
      target = raw + d
    }
    setActiveRaw(target)
    if (target !== raw) scrollToRaw(target, smooth)
    // Deliberate deps: reacts to the value only.
  }, [index])

  useEffect(() => () => clearTimeout(settle.current), [])

  const commit = () => {
    const el = ref.current
    if (!el || n === 0) return
    const raw = rawAt()
    const i = mod(raw)
    // Drifted into the first or last copy: jump back to the middle one, which looks the same.
    if (copies === 3 && (raw < n || raw >= 2 * n)) {
      el.scrollTop = (n + i) * rowHeight()
      setActiveRaw(n + i)
    }
    if (i !== latest.current.index) latest.current.onPick(i)
  }

  const onScroll = () => {
    const raw = rawAt()
    if (raw !== activeRaw) setActiveRaw(raw)
    clearTimeout(settle.current)
    if (!drag.current) settle.current = setTimeout(commit, SETTLE_MS)
  }

  const move = (by: number, to?: number) => {
    if (n === 0) return
    const next = to ?? (copies === 3 ? mod(index + by) : clamp(index + by, 0, n - 1))
    if (next !== index) onPick(next)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === 'ArrowDown') move(1)
    else if (e.key === 'ArrowUp') move(-1)
    else if (e.key === 'PageDown') move(5)
    else if (e.key === 'PageUp') move(-5)
    else if (e.key === 'Home') move(0, 0)
    else if (e.key === 'End') move(0, n - 1)
    else return
    e.preventDefault()
  }

  // A mouse drags the column like a finger would (touch scrolls natively).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragged.current = false
    const el = ref.current
    if (disabled || e.pointerType !== 'mouse' || e.button !== 0 || !el) return
    drag.current = { y: e.clientY, top: el.scrollTop, moved: 0 }
    el.dataset.dragging = ''
    el.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    const dy = e.clientY - d.y
    d.moved = Math.max(d.moved, Math.abs(dy))
    el.scrollTop = d.top - dy
  }
  const onPointerUp = () => {
    const d = drag.current
    const el = ref.current
    if (!d || !el) return
    drag.current = null
    delete el.dataset.dragging
    if (d.moved > 4) {
      dragged.current = true
      scrollToRaw(rawAt(), smooth)
      clearTimeout(settle.current)
      settle.current = setTimeout(commit, SETTLE_MS * 3)
    }
  }

  const picked = column.options[index]
  const valueText = typeof picked?.label === 'string' || typeof picked?.label === 'number' ? String(picked.label) : picked != null ? String(picked.value) : undefined

  const items: ReactNode[] = []
  for (let raw = 0; raw < total; raw++) {
    const option = column.options[raw % n]
    if (!option) continue
    items.push(
      <div
        key={raw}
        className="mt-picker-row"
        data-selected={flag(raw === activeRaw)}
        data-offset={Math.min(3, Math.abs(raw - activeRaw))}
        onClick={() => !disabled && !dragged.current && move(0, raw % n)}
      >
        <span className="mt-picker-cell">{option.label}</span>
      </div>,
    )
  }

  return (
    <div
      ref={ref}
      className="mt-picker-column"
      style={column.width != null ? { width: column.width } : undefined}
      role="spinbutton"
      tabIndex={disabled ? -1 : 0}
      aria-label={column.label ?? column.key}
      aria-valuenow={index}
      aria-valuemin={0}
      aria-valuemax={Math.max(0, n - 1)}
      aria-valuetext={valueText}
      aria-disabled={disabled || undefined}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="mt-picker-rows" aria-hidden>
        {items}
      </div>
    </div>
  )
}

/* ---------- DatePicker ---------- */

export type DatePart = 'day' | 'month' | 'year'

export interface DatePickerProps extends Omit<PickerProps, 'columns' | 'value' | 'defaultValue' | 'onChange'> {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date) => void
  /** Default: 100 years before this one. */
  minYear?: number
  /** Default: 20 years after this one. */
  maxYear?: number
  /** Column order. Default `['day', 'month', 'year']`. */
  order?: DatePart[]
  /** BCP 47 locale for the month names. Default `en-US`. */
  locale?: string
  /** How months are written. Default `long`. */
  monthFormat?: 'long' | 'short' | 'numeric' | '2-digit'
  /** Spoken names of the columns. Default `day`, `month`, `year`. */
  labels?: Partial<Record<DatePart, string>>
}

const daysIn = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * A Picker for a date: day, month and year columns. Day and month loop by
 * default (set `loop={false}` to stop them); the year never does. Keeps the
 * time of day of the value it was given.
 *
 * ```tsx
 * <DatePicker defaultValue={new Date()} onChange={setDate} />
 * ```
 */
export function DatePicker(props: DatePickerProps) {
  const t = useLocale()
  const { value, defaultValue, onChange, minYear, maxYear, order = ['day', 'month', 'year'], locale = 'en-US', monthFormat = 'long', labels, loop = true, className, ...rest } = useDefaults('DatePicker', props)
  const [date, setDate] = useUncontrolled<Date>({ value, defaultValue, finalValue: new Date(), onChange })
  const thisYear = useMemo(() => new Date().getFullYear(), [])
  const from = Math.min(minYear ?? thisYear - 100, date.getFullYear())
  const to = Math.max(maxYear ?? thisYear + 20, date.getFullYear())
  const year = date.getFullYear()
  const month = date.getMonth()

  const months = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { month: monthFormat, timeZone: 'UTC' })
    return Array.from({ length: 12 }, (_, m) => ({ value: m, label: format.format(Date.UTC(2000, m, 1)) }))
  }, [locale, monthFormat])
  const years = useMemo(() => Array.from({ length: to - from + 1 }, (_, i) => ({ value: from + i, label: String(from + i) })), [from, to])
  const days = useMemo(() => Array.from({ length: daysIn(year, month) }, (_, i) => ({ value: i + 1, label: pad(i + 1) })), [year, month])

  const all: Record<DatePart, PickerColumn> = {
    day: { key: 'day', label: labels?.day ?? t.day, options: days },
    month: { key: 'month', label: labels?.month ?? t.month, options: months },
    year: { key: 'year', label: labels?.year ?? t.year, options: years, loop: false },
  }

  return (
    <Picker
      {...rest}
      className={cx('mt-date-picker', className)}
      loop={loop}
      columns={order.map((part) => all[part])}
      value={{ day: date.getDate(), month, year }}
      onChange={(v) => {
        const y = Number(v.year)
        const m = Number(v.month)
        const next = new Date(date)
        next.setFullYear(y, m, Math.min(Number(v.day), daysIn(y, m)))
        setDate(next)
      }}
    />
  )
}

/* ---------- TimePicker ---------- */

export interface TimePickerProps extends Omit<PickerProps, 'columns' | 'value' | 'defaultValue' | 'onChange'> {
  /** 24-hour `HH:mm`, whatever the display. */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Hours 1–12 and an am/pm column. */
  use12Hours?: boolean
  /** Minutes in steps of this. Default 1. */
  minuteStep?: number
  /** Default `am`. */
  amLabel?: string
  /** Default `pm`. */
  pmLabel?: string
  /** Spoken names of the columns. Default `hour`, `minute`, `am/pm`. */
  labels?: { hour?: string; minute?: string; period?: string }
}

/**
 * A Picker for a time of day: hour and minute columns, plus am/pm with
 * `use12Hours`. The value is always 24-hour `HH:mm`. Hours and minutes loop
 * by default.
 *
 * ```tsx
 * <TimePicker defaultValue="07:30" minuteStep={5} />
 * ```
 */
export function TimePicker(props: TimePickerProps) {
  const t = useLocale()
  const { value, defaultValue, onChange, use12Hours, minuteStep = 1, amLabel = t.am, pmLabel = t.pm, labels, loop = true, className, ...rest } = useDefaults('TimePicker', props)
  const [time, setTime] = useUncontrolled<string>({ value, defaultValue, finalValue: '00:00', onChange })
  const [h = 0, m = 0] = time.split(':').map((s) => Number.parseInt(s, 10) || 0)
  const step = Math.max(1, Math.floor(minuteStep))

  const hours = useMemo(
    () => (use12Hours ? Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) })) : Array.from({ length: 24 }, (_, i) => ({ value: i, label: pad(i) }))),
    [use12Hours],
  )
  const minutes = useMemo(() => Array.from({ length: Math.ceil(60 / step) }, (_, i) => ({ value: i * step, label: pad(i * step) })), [step])

  const columns: PickerColumn[] = [
    { key: 'hour', label: labels?.hour ?? t.hour, options: hours },
    { key: 'minute', label: labels?.minute ?? t.minute, options: minutes },
  ]
  if (use12Hours)
    columns.push({
      key: 'period',
      label: labels?.period ?? 'am/pm',
      loop: false,
      options: [
        { value: 'am', label: amLabel },
        { value: 'pm', label: pmLabel },
      ],
    })

  return (
    <Picker
      {...rest}
      className={cx('mt-time-picker', className)}
      loop={loop}
      columns={columns}
      value={{ hour: use12Hours ? h % 12 || 12 : h, minute: Math.floor(m / step) * step, period: h >= 12 ? 'pm' : 'am' }}
      onChange={(v) => {
        let hour = Number(v.hour)
        if (use12Hours) hour = (hour % 12) + (v.period === 'pm' ? 12 : 0)
        setTime(`${pad(hour)}:${pad(Number(v.minute))}`)
      }}
    />
  )
}
