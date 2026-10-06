import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { useAdaptive } from '../../../hooks/useAdaptive'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { Button } from '../../inputs/Button/Button'
import { BottomSheet } from '../BottomSheet/BottomSheet'
import { Floating } from '../_overlay/Floating'
import { CheckGlyph, ChevronDownGlyph, CloseGlyph } from '../_overlay/glyphs'
import type { Placement } from '../_overlay/position'

export interface SelectOption {
  value: string
  label: ReactNode
  icon?: IconSource
  disabled?: boolean
  /** Options with the same group are listed together under it, in first-seen order. */
  group?: string
}

interface SelectBaseProps {
  options: SelectOption[]
  /** Shown when nothing is chosen. Default the locale's `select`. */
  placeholder?: ReactNode
  label?: ReactNode
  description?: ReactNode
  /** Turns the edge red and is announced with the field. */
  error?: ReactNode
  /** A filter box at the top of the list. */
  searchable?: boolean
  /** A button that empties the value. */
  clearable?: boolean
  disabled?: boolean
  required?: boolean
  /** Submitted with a form through hidden inputs (one per value when `multiple`). */
  name?: string
  id?: string
  className?: string
  style?: CSSProperties
  /** Full width. */
  block?: boolean
  /** `auto` (default) follows the provider: a dropdown list on the desktop, a bottom sheet on mobile. */
  platform?: 'auto' | 'mobile' | 'desktop'
  /** Default `bottom-start`. */
  placement?: Placement
  /** Placeholder of the filter box. Default the locale's `search`. */
  searchPlaceholder?: string
  /** When nothing matches. Default the locale's `noOptions`. */
  emptyText?: ReactNode
  /** The trigger button. */
  ref?: Ref<HTMLButtonElement>
}

export interface SelectSingleProps extends SelectBaseProps {
  multiple?: false
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string | null) => void
}

export interface SelectMultipleProps extends SelectBaseProps {
  multiple: true
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
}

export type SelectProps = SelectSingleProps | SelectMultipleProps

const text = (o: SelectOption) => (typeof o.label === 'string' || typeof o.label === 'number' ? String(o.label) : o.value)
const TYPEAHEAD_MS = 600

/**
 * A Windows ComboBox: a field-styled button that opens a list. It filters,
 * takes several values, and works from the keyboard (arrows, Home/End,
 * typing, Enter, Escape). On mobile the list is a bottom sheet of big rows.
 *
 * ```tsx
 * <Select label="size" options={[{ value: 's', label: 'small' }, { value: 'l', label: 'large' }]} />
 * ```
 */
export function Select(props: SelectProps) {
  const locale = useLocale()
  const {
    options,
    placeholder = locale.select,
    label,
    description,
    error,
    searchable,
    clearable,
    disabled,
    required,
    name,
    id,
    className,
    style,
    block,
    platform = 'auto',
    placement = 'bottom-start',
    searchPlaceholder = locale.search,
    emptyText = locale.noOptions,
    multiple,
    value,
    defaultValue,
    onChange,
    ref,
  } = useDefaults('Select', props)
  const [raw, setRaw] = useUncontrolled<string | null | string[]>({
    value,
    defaultValue,
    finalValue: multiple ? [] : null,
    onChange: onChange as (v: string | null | string[]) => void,
  })
  const selected = Array.isArray(raw) ? raw : raw == null ? [] : [raw]
  const sheet = useAdaptive({ mobile: true, desktop: false }, platform)

  const autoId = useId()
  const buttonId = id ?? autoId
  const labelId = `${buttonId}-label`
  const listId = `${buttonId}-list`
  const descId = `${buttonId}-desc`
  const errId = `${buttonId}-err`
  const optionId = (i: number) => `${listId}-${i}`

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const merged = useMergedRef(triggerRef, ref)
  const typed = useRef({ text: '', at: 0 })

  const { groups, flat } = arrange(options, query)
  const enabled = (i: number) => i >= 0 && i < flat.length && !flat[i]!.disabled

  const show = (at?: 'first' | 'last') => {
    if (disabled) return
    // The query resets on open, so start from the whole list.
    const list = arrange(options, '').flat
    const firstSelected = list.findIndex((o) => selected.includes(o.value))
    const start = at === 'last' ? list.length - 1 : at === 'first' || firstSelected < 0 ? 0 : firstSelected
    setQuery('')
    setActive(nearest(list, start, at === 'last' ? -1 : 1))
    setOpen(true)
  }
  const hide = (restore = true) => {
    setOpen(false)
    if (restore) triggerRef.current?.focus({ preventScroll: true })
  }

  const choose = (o: SelectOption) => {
    if (o.disabled) return
    if (multiple) {
      setRaw(selected.includes(o.value) ? selected.filter((v) => v !== o.value) : [...selected, o.value])
      return
    }
    setRaw(o.value)
    hide()
  }

  useEffect(() => {
    if (!open || active < 0) return
    document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' })
  })

  const move = (by: number, from = active) => setActive(nearest(flat, from + by, by))

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        show(e.key === 'ArrowUp' ? 'last' : undefined)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        return move(1)
      case 'ArrowUp':
        e.preventDefault()
        return move(-1)
      case 'Home':
        if (searchable) return
        e.preventDefault()
        return setActive(nearest(flat, 0, 1))
      case 'End':
        if (searchable) return
        e.preventDefault()
        return setActive(nearest(flat, flat.length - 1, -1))
      case 'Enter':
        e.preventDefault()
        if (enabled(active)) choose(flat[active]!)
        return
      case 'Tab':
        return hide(false)
      case ' ':
        if (searchable) return
        e.preventDefault()
        if (enabled(active)) choose(flat[active]!)
        return
    }
    // Typeahead on the button; the search box takes letters as a filter instead.
    if (!searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = performance.now()
      typed.current = { text: (now - typed.current.at < TYPEAHEAD_MS ? typed.current.text : '') + e.key.toLowerCase(), at: now }
      const t = typed.current.text
      const skip = t.length === 1 ? 1 : 0
      const order = [...flat.keys()].map((k) => (active + skip + k + flat.length) % flat.length)
      const hit = order.find((i) => enabled(i) && text(flat[i]!).toLowerCase().startsWith(t))
      if (hit !== undefined) setActive(hit)
    }
  }

  // The search box gets focus when the list opens; it hands it back on close.
  useEffect(() => {
    if (open && searchable && !sheet) searchRef.current?.focus({ preventScroll: true })
  }, [open, searchable, sheet])
  const onQuery = (next: string) => {
    setQuery(next)
    setActive(nearest(arrange(options, next).flat, 0, 1))
  }

  const chosen = options.filter((o) => selected.includes(o.value))
  const hasValue = chosen.length > 0
  const describedBy = cx(description != null && descId, error != null && errId) || undefined
  const activeDescendant = open && enabled(active) ? optionId(active) : undefined

  let index = -1
  const list = (
    <div
      ref={listRef}
      id={listId}
      role="listbox"
      aria-labelledby={label != null ? labelId : undefined}
      aria-label={label == null && typeof placeholder === 'string' ? placeholder : undefined}
      aria-multiselectable={multiple || undefined}
      aria-activedescendant={sheet ? activeDescendant : undefined}
      tabIndex={sheet ? 0 : -1}
      className="mt-select-list"
      onKeyDown={sheet ? onKeyDown : undefined}
    >
      {flat.length === 0 && <div className="mt-select-empty">{emptyText}</div>}
      {groups.map((g, gi) => {
        const rows = g.items.map((o) => {
          const i = ++index
          const isSelected = selected.includes(o.value)
          return (
            <div
              key={o.value}
              id={optionId(i)}
              role="option"
              aria-selected={isSelected}
              aria-disabled={o.disabled || undefined}
              data-active={flag(i === active)}
              className="mt-select-option"
              onPointerMove={() => !o.disabled && i !== active && setActive(i)}
              // Keep focus on the trigger or search box.
              onPointerDown={(e) => !sheet && e.preventDefault()}
              onClick={() => choose(o)}
            >
              <span className="mt-select-check" aria-hidden>
                {isSelected && <CheckGlyph />}
              </span>
              {o.icon != null && (
                <span className="mt-select-option-icon" aria-hidden>
                  {renderIcon(o.icon)}
                </span>
              )}
              <span className="mt-select-option-label">{o.label}</span>
            </div>
          )
        })
        if (g.name === undefined) return rows
        return (
          <div key={`g${gi}`} role="group" aria-labelledby={`${listId}-g${gi}`}>
            <div id={`${listId}-g${gi}`} className="mt-select-group" role="presentation">
              {g.name}
            </div>
            {rows}
          </div>
        )
      })}
    </div>
  )

  const search = searchable && (
    <div className="mt-select-search">
      <input
        ref={searchRef}
        type="text"
        value={query}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        aria-controls={listId}
        aria-activedescendant={activeDescendant}
        aria-autocomplete="list"
        autoComplete="off"
        onChange={(e) => onQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  )

  return (
    <div className={cx('mt-select', className)} style={style} data-open={flag(open)} data-disabled={flag(disabled)} data-invalid={flag(error != null)} data-block={flag(block)}>
      {label != null && (
        <label id={labelId} htmlFor={buttonId} className="mt-select-label">
          {label}
        </label>
      )}
      <div className="mt-select-box">
        <button
          ref={merged}
          id={buttonId}
          type="button"
          role="combobox"
          className="mt-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={label != null ? `${labelId} ${buttonId}` : undefined}
          aria-describedby={describedBy}
          aria-invalid={error != null || undefined}
          aria-required={required || undefined}
          aria-activedescendant={!sheet && !searchable ? activeDescendant : undefined}
          disabled={disabled}
          data-mt-press=""
          onClick={() => (open ? hide() : show())}
          onKeyDown={onKeyDown}
        >
          <span className="mt-select-value" data-placeholder={flag(!hasValue)}>
            {hasValue
              ? chosen.map((o, i) => (
                  <span key={o.value} className="mt-select-chip">
                    {o.icon != null && !multiple && <span className="mt-select-option-icon">{renderIcon(o.icon)}</span>}
                    {o.label}
                    {i < chosen.length - 1 && ', '}
                  </span>
                ))
              : placeholder}
          </span>
          <span className="mt-select-chevron" aria-hidden>
            <ChevronDownGlyph />
          </span>
        </button>
        {clearable && hasValue && !disabled && (
          <button type="button" className="mt-select-clear" aria-label={locale.clear} data-mt-press="" data-mt-hover="" onClick={() => setRaw(multiple ? [] : null)}>
            <CloseGlyph />
          </button>
        )}
      </div>
      {description != null && (
        <div id={descId} className="mt-select-description">
          {description}
        </div>
      )}
      {error != null && (
        <div id={errId} className="mt-select-error">
          {error}
        </div>
      )}
      {name != null && (multiple ? selected : selected.slice(0, 1).concat(selected.length ? [] : [''])).map((v, i) => <input key={i} type="hidden" name={name} value={v} />)}

      {sheet ? (
        <BottomSheet
          open={open}
          onOpenChange={(next) => !next && hide(false)}
          title={label}
          fit
          snapPoints={[0.85]}
          className="mt-select-sheet"
          aria-labelledby={label == null ? undefined : labelId}
          footer={
            multiple ? (
              <Button variant="accent" onClick={() => hide(false)}>
                {locale.ok}
              </Button>
            ) : undefined
          }
        >
          {search}
          {list}
        </BottomSheet>
      ) : (
        <Floating
          open={open}
          anchor={() => triggerRef.current?.getBoundingClientRect() ?? null}
          placement={placement}
          matchWidth
          className="mt-select-popup"
          ignore={() => [triggerRef.current]}
          onClose={(reason) => hide(reason === 'escape')}
        >
          {search}
          {list}
        </Floating>
      )}
    </div>
  )
}

/** Filtered by `query`, then grouped: ungrouped options first, groups in first-seen order. */
function arrange(options: SelectOption[], query: string) {
  const q = query.trim().toLowerCase()
  const groups: { name?: string; items: SelectOption[] }[] = []
  for (const o of options) {
    if (q && !text(o).toLowerCase().includes(q)) continue
    let g = groups.find((x) => x.name === o.group)
    if (!g) groups.push((g = { name: o.group, items: [] }))
    g.items.push(o)
  }
  groups.sort((a, b) => Number(a.name !== undefined) - Number(b.name !== undefined))
  return { groups, flat: groups.flatMap((g) => g.items) }
}

/** The nearest enabled option from `start`, stepping by `dir` and wrapping; -1 if none. */
function nearest(list: SelectOption[], start: number, dir: number): number {
  const n = list.length
  if (n === 0) return -1
  const step = dir < 0 ? -1 : 1
  for (let k = 0; k < n; k++) {
    const i = (((start + k * step) % n) + n) % n
    if (!list[i]!.disabled) return i
  }
  return -1
}
