import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type Key,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { useDefaults } from '../../../config/context'
import type { Tone } from '../../../config/theme'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { useToneVars } from '../tone'

export type ListSelectionMode = 'none' | 'single' | 'multiple'

interface ListContextValue {
  mode: ListSelectionMode
  isSelected: (key: Key) => boolean
  toggle: (key: Key) => void
}

const ListContext = createContext<ListContextValue | null>(null)
/** The key ListView gave the item it is rendering, so `renderItem` needn't pass `value`. */
const ItemKeyContext = createContext<Key | undefined>(undefined)

/* ───────────────────────────── ListItem ───────────────────────────── */

export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The main line. */
  title?: ReactNode
  /** A muted second line. */
  subtitle?: ReactNode
  /** Small and muted on the right: a time, a size, a count. */
  meta?: ReactNode
  /** Anything at the start: an avatar, a checkbox. Overrides `icon`. */
  leading?: ReactNode
  /** An icon in a square at the start. With `tone` the square is filled, like a small tile. */
  icon?: IconSource
  /** Fill for the leading square. A Metro tone, a theme tone or any CSS colour. */
  tone?: Tone
  /** Anything at the end, after `meta`. */
  trailing?: ReactNode
  /** Shown as selected. Inside a selecting ListView, the list decides. */
  selected?: boolean
  disabled?: boolean
  /** Makes it a link. */
  href?: string
  /** Its key in a ListView's selection. Items from `items` get theirs from `itemKey`. */
  value?: Key
  ref?: Ref<HTMLElement>
}

/**
 * A Windows Phone list row: a title in regular weight, a muted line under
 * it, an optional square at the start. Pressable with `onClick` or `href`;
 * inside a selecting ListView it is an option.
 */
export function ListItem(props: ListItemProps) {
  const { title, subtitle, meta, leading, icon, tone, trailing, selected, disabled, href, value, className, style, onClick, onKeyDown, children, ref, ...rest } =
    useDefaults('ListItem', props)
  const list = useContext(ListContext)
  const contextKey = useContext(ItemKeyContext)
  const toneVars = useToneVars(tone)
  const key = value ?? contextKey
  const option = !!list && list.mode !== 'none' && key !== undefined
  const isSelected = option ? list.isSelected(key) : !!selected

  const start = leading ?? (icon != null || tone ? <span className="mt-list-item-square" data-filled={flag(!!tone)} style={toneVars}>{icon != null && renderIcon(icon)}</span> : null)
  const content = (
    <>
      {start != null && <span className="mt-list-item-leading">{start}</span>}
      <span className="mt-list-item-text">
        {title != null && <span className="mt-list-item-title">{title}</span>}
        {subtitle != null && <span className="mt-list-item-subtitle">{subtitle}</span>}
        {children}
      </span>
      {meta != null && <span className="mt-list-item-meta">{meta}</span>}
      {trailing != null && <span className="mt-list-item-trailing">{trailing}</span>}
    </>
  )
  const shared = {
    className: cx('mt-list-item', className),
    style: style as CSSProperties,
    'data-selected': flag(isSelected),
    'data-disabled': flag(disabled),
  }

  if (option) {
    const choose = (e: MouseEvent<HTMLElement>) => {
      if (disabled) return
      list.toggle(key)
      onClick?.(e)
    }
    return (
      <div
        {...rest}
        {...shared}
        ref={ref as Ref<HTMLDivElement>}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        tabIndex={-1}
        data-mt-list-target=""
        data-mt-press=""
        data-mt-hover=""
        onClick={choose}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (e.defaultPrevented || e.target !== e.currentTarget) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            e.currentTarget.click()
          }
        }}
      >
        {content}
      </div>
    )
  }

  const inList = !!list
  if (href !== undefined || onClick) {
    const As = href !== undefined ? 'a' : 'button'
    const target = (
      <As
        {...(inList ? {} : rest)}
        {...(inList ? { className: 'mt-list-item-target' } : shared)}
        ref={(inList ? undefined : ref) as Ref<never>}
        href={href}
        type={As === 'button' ? 'button' : undefined}
        disabled={As === 'button' ? disabled : undefined}
        aria-disabled={As === 'a' && disabled ? true : undefined}
        aria-current={isSelected && As === 'a' ? 'true' : undefined}
        tabIndex={inList ? -1 : undefined}
        data-mt-list-target=""
        data-mt-press=""
        data-mt-hover=""
        data-pressable=""
        onClick={(e: MouseEvent<HTMLElement>) => (disabled ? e.preventDefault() : onClick?.(e))}
        onKeyDown={onKeyDown}
      >
        {content}
      </As>
    )
    if (!inList) return target
    return (
      <div {...rest} {...shared} ref={ref as Ref<HTMLDivElement>} role="listitem" data-wrap="">
        {target}
      </div>
    )
  }

  return (
    <div {...rest} {...shared} ref={ref as Ref<HTMLDivElement>} role={inList ? 'listitem' : undefined} onKeyDown={onKeyDown}>
      {content}
    </div>
  )
}

/* ───────────────────────────── ListView ───────────────────────────── */

interface ListViewBase<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  /** The rows, drawn with `renderItem`. Or pass ListItems as `children`. */
  items?: T[]
  /** Draws one row; usually a `<ListItem>`. */
  renderItem?: (item: T, index: number) => ReactNode
  /** A row's key. Default its `key` or `id` field, else its index. */
  itemKey?: (item: T, index: number) => Key
  children?: ReactNode
  /** A lowercase heading above the list. */
  header?: ReactNode
  /** Thin lines between rows. */
  dividers?: boolean
  /** `single` or `multiple` makes the list a listbox whose rows select. Default `none`. */
  selectionMode?: ListSelectionMode
  /** Selected keys (controlled). */
  selected?: Key[]
  defaultSelected?: Key[]
  onSelectionChange?: (keys: Key[]) => void
  /** Group `items` under letter headers (`(person) => person.name[0]`). Each header gets `id="${id}-group-${key}"` and `data-group`, for a jump list. */
  groupBy?: (item: T) => string
  ref?: Ref<HTMLDivElement>
}

export type ListViewProps<T = unknown> = ListViewBase<T>

const defaultKey = (item: unknown, index: number): Key => {
  if (item && typeof item === 'object') {
    const o = item as Record<string, unknown>
    if (typeof o.key === 'string' || typeof o.key === 'number') return o.key
    if (typeof o.id === 'string' || typeof o.id === 'number') return o.id
  }
  return index
}

const TARGET = '[data-mt-list-target]'

/**
 * A Windows Phone list. Rows from `items` + `renderItem` or as children;
 * optional single or multiple selection, letter groups, and arrow-key
 * movement between rows (one tab stop for the whole list).
 *
 * ```tsx
 * <ListView items={people} groupBy={(p) => p.name[0]} renderItem={(p) => <ListItem title={p.name} />} />
 * ```
 */
export function ListView<T = unknown>(props: ListViewProps<T>) {
  const {
    items,
    renderItem,
    itemKey = defaultKey,
    children,
    header,
    dividers,
    selectionMode = 'none',
    selected,
    defaultSelected,
    onSelectionChange,
    groupBy,
    id,
    className,
    style,
    onKeyDown,
    onFocus,
    ref,
    ...rest
  } = useDefaults('ListView', props)
  const listId = useId(id)
  const root = useRef<HTMLDivElement>(null)
  const active = useRef<HTMLElement | null>(null)
  const merged = useMergedRef(root, ref)
  const [keys, setKeys] = useUncontrolled<Key[]>({ value: selected, defaultValue: defaultSelected, finalValue: [], onChange: onSelectionChange })
  const listbox = selectionMode !== 'none'

  const context: ListContextValue = {
    mode: selectionMode,
    isSelected: (key) => keys.includes(key),
    toggle: (key) => {
      if (selectionMode === 'single') setKeys(keys.length === 1 && keys[0] === key ? keys : [key])
      else if (selectionMode === 'multiple') setKeys(keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key])
    },
  }

  // Roving tab stop: exactly one row is tabbable, the last one focused, else the first selected, else the first.
  useLayoutEffect(() => {
    const targets = [...(root.current?.querySelectorAll<HTMLElement>(TARGET) ?? [])]
    if (!targets.length) return
    const current =
      (active.current && targets.includes(active.current) && active.current) ||
      targets.find((t) => t.getAttribute('aria-selected') === 'true' || t.closest('[data-selected]')) ||
      targets[0]!
    for (const t of targets) t.tabIndex = t === current ? 0 : -1
  })

  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    const from = (e.target as HTMLElement).closest<HTMLElement>(TARGET)
    if (!from || !root.current?.contains(from)) return
    const targets = [...root.current.querySelectorAll<HTMLElement>(TARGET)].filter((t) => t.getAttribute('aria-disabled') !== 'true' && !(t as HTMLButtonElement).disabled)
    const at = targets.indexOf(from)
    let next: HTMLElement | undefined
    if (e.key === 'ArrowDown') next = targets[Math.min(targets.length - 1, at + 1)]
    else if (e.key === 'ArrowUp') next = targets[Math.max(0, at - 1)]
    else if (e.key === 'Home') next = targets[0]
    else if (e.key === 'End') next = targets[targets.length - 1]
    else return
    e.preventDefault()
    if (!next) return
    for (const t of targets) t.tabIndex = t === next ? 0 : -1
    active.current = next
    next.focus()
  }

  const track = (e: FocusEvent<HTMLDivElement>) => {
    onFocus?.(e)
    const t = (e.target as HTMLElement).closest<HTMLElement>(TARGET)
    if (t) active.current = t
  }

  const row = (item: T, index: number) => {
    const key = itemKey(item, index)
    return (
      <ItemKeyContext.Provider key={key} value={key}>
        {renderItem?.(item, index)}
      </ItemKeyContext.Provider>
    )
  }

  let body: ReactNode
  if (items && groupBy) {
    const groups = new Map<string, { item: T; index: number }[]>()
    items.forEach((item, index) => {
      const g = groupBy(item)
      const list = groups.get(g)
      if (list) list.push({ item, index })
      else groups.set(g, [{ item, index }])
    })
    body = [...groups].map(([g, members]) => {
      const headerId = `${listId}-group-${g}`
      return (
        <div key={g} className="mt-list-view-group" role={listbox ? 'group' : 'list'} aria-labelledby={headerId}>
          <div className="mt-list-view-group-header" id={headerId} data-group={g} role="presentation">
            <span className="mt-list-view-letter">{g}</span>
          </div>
          {members.map(({ item, index }) => row(item, index))}
        </div>
      )
    })
  } else if (items) {
    body = items.map(row)
  } else {
    body = children
  }

  const grouped = !!(items && groupBy)
  const headerId = `${listId}-header`
  return (
    <ListContext.Provider value={context}>
      <div className={cx('mt-list-view', className)} style={style} data-dividers={flag(dividers)} data-selection={selectionMode}>
        {header != null && (
          <div className="mt-list-view-header" id={headerId}>
            {header}
          </div>
        )}
        <div
          aria-labelledby={header != null && !rest['aria-label'] ? headerId : undefined}
          {...rest}
          ref={merged}
          id={listId}
          className="mt-list-view-items"
          role={listbox ? 'listbox' : grouped ? undefined : 'list'}
          aria-multiselectable={selectionMode === 'multiple' || undefined}
          onKeyDown={move}
          onFocus={track}
        >
          {body}
        </div>
      </div>
    </ListContext.Provider>
  )
}
