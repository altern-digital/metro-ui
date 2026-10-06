import { useId, useUncontrolled } from '@mantine/hooks'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { pivot, presence } from '../../../motion/variants'
import { cx, flag } from '../../../utils'

export interface PivotItem {
  key: string
  /** The header. Shown lowercase, big and light. */
  label: ReactNode
  /** The view under the header. Not needed with `headerOnly`. */
  content?: ReactNode
  disabled?: boolean
}

export interface PivotProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'content'> {
  items: PivotItem[]
  /** The selected item's key. */
  value?: string
  defaultValue?: string
  onChange?: (key: string) => void
  /** Render only the header strip, e.g. when the router renders the view. */
  headerOnly?: boolean
  /** Swipe the content sideways to move to the next or previous view (touch only). Default true. */
  swipe?: boolean
  /** Header size. Default `lg`. */
  size?: 'md' | 'lg'
  ref?: Ref<HTMLDivElement>
}

/** How far a finger has to travel sideways before a swipe changes the view. */
const SWIPE_PX = 56
/** How far it may travel before the gesture is locked to one axis. */
const LOCK_PX = 10

/**
 * The Windows Phone pivot: big, light, lowercase headers in a row that
 * scrolls sideways, and the selected view under them. A new view slides in
 * from the side it lies on; under a finger the view swipes.
 */
export function Pivot(props: PivotProps) {
  const { items, value, defaultValue, onChange, headerOnly, swipe = true, size = 'lg', className, id, ...rest } = useDefaults('Pivot', props)
  const firstEnabled = items.find((i) => !i.disabled)?.key ?? ''
  const [selected, setSelected] = useUncontrolled({ value, defaultValue, finalValue: firstEnabled, onChange })
  const baseId = useId(id)
  const index = Math.max(0, items.findIndex((i) => i.key === selected))
  const current = items[index]

  // The direction the new view comes from, worked out when the index changes.
  const [track, setTrack] = useState({ index, direction: 1 })
  if (track.index !== index) setTrack({ index, direction: index > track.index ? 1 : -1 })

  const strip = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const tab = strip.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    tab?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }, [index])

  const enabledFrom = (start: number, step: 1 | -1, wrap: boolean): PivotItem | undefined => {
    for (let n = 1; n <= items.length; n++) {
      let i = start + step * n
      if (wrap) i = (i + items.length) % items.length
      else if (i < 0 || i >= items.length) return undefined
      const item = items[i]
      if (item && !item.disabled) return item
    }
    return undefined
  }

  const go = (item: PivotItem | undefined, focus: boolean) => {
    if (!item) return
    setSelected(item.key)
    if (focus) [...(strip.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])].find((el) => el.dataset.key === item.key)?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => PivotItem | undefined> = {
      ArrowRight: () => enabledFrom(index, 1, true),
      ArrowLeft: () => enabledFrom(index, -1, true),
      Home: () => enabledFrom(-1, 1, false),
      End: () => enabledFrom(items.length, -1, false),
    }
    const pick = keys[e.key]
    if (!pick) return
    e.preventDefault()
    go(pick(), true)
  }

  // A touch swipe on the view: locked to an axis once it moves, so vertical scrolls pass.
  const gesture = useRef<{ id: number; x: number; y: number; axis: 'x' | 'y' | null } | null>(null)
  const onPointerDown = (e: PointerEvent) => {
    if (!swipe || e.pointerType !== 'touch' || !e.isPrimary) return
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: null }
  }
  const onPointerMove = (e: PointerEvent) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId || g.axis) return
    const dx = Math.abs(e.clientX - g.x)
    const dy = Math.abs(e.clientY - g.y)
    if (Math.max(dx, dy) > LOCK_PX) g.axis = dx > dy ? 'x' : 'y'
  }
  const onPointerUp = (e: PointerEvent) => {
    const g = gesture.current
    gesture.current = null
    if (!g || g.id !== e.pointerId || g.axis !== 'x') return
    const dx = e.clientX - g.x
    if (Math.abs(dx) < SWIPE_PX) return
    go(enabledFrom(index, dx < 0 ? 1 : -1, false), false)
  }

  return (
    <div {...rest} id={baseId} className={cx('mt-pivot', className)} data-size={size} data-header-only={flag(headerOnly)}>
      <div ref={strip} className="mt-pivot-headers" role="tablist" aria-orientation="horizontal" onKeyDown={onKeyDown}>
        {items.map((item) => {
          const active = item.key === current?.key
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.key}`}
              aria-selected={active}
              aria-controls={headerOnly ? undefined : `${baseId}-panel-${item.key}`}
              tabIndex={active ? 0 : -1}
              disabled={item.disabled}
              data-key={item.key}
              data-selected={flag(active)}
              data-mt-press=""
              className="mt-pivot-header"
              onClick={() => setSelected(item.key)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {!headerOnly && current && (
        <div className="mt-pivot-views" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={() => (gesture.current = null)}>
          <AnimatePresence initial={false} custom={track.direction}>
            <m.div
              key={current.key}
              className="mt-pivot-panel"
              role="tabpanel"
              id={`${baseId}-panel-${current.key}`}
              aria-labelledby={`${baseId}-tab-${current.key}`}
              tabIndex={0}
              custom={track.direction}
              variants={pivot}
              {...presence}
            >
              {current.content}
            </m.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
