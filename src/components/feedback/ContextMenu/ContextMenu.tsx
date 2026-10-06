import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { cloneElement, useEffect, useRef, type MouseEvent, type PointerEvent, type ReactElement } from 'react'
import { useDefaults } from '../../../config/context'
import { useAdaptive } from '../../../hooks/useAdaptive'
import { MenuLevel, MenuSheet, type MenuFocus, type MenuItem } from '../MenuFlyout/MenuFlyout'
import { pointRect, type Rect } from '../_overlay/position'
import { chain, type TriggerElement } from '../_overlay/trigger'

export interface ContextMenuProps {
  items: MenuItem[]
  /** The area that takes the right-click or long-press: one element that takes a ref. */
  children: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** `auto` (default) follows the provider: a menu at the pointer on the desktop, a bottom sheet on mobile. */
  platform?: 'auto' | 'mobile' | 'desktop'
  /** Turns the menu off and lets the browser's own through. */
  disabled?: boolean
  'aria-label'?: string
  className?: string
}

/** How long a finger rests before the menu opens, and how far it may wander. */
export const LONG_PRESS_MS = 500
export const LONG_PRESS_SLOP = 10

/**
 * A menu on right-click, or on a long press with a finger, opening where the
 * pointer is. On mobile it is a bottom sheet.
 *
 * ```tsx
 * <ContextMenu items={[{ key: 'pin', label: 'pin to start', onSelect: pin }]}>
 *   <Tile … />
 * </ContextMenu>
 * ```
 */
export function ContextMenu(props: ContextMenuProps) {
  const { items, children, open, defaultOpen, onOpenChange, platform = 'auto', disabled, className, 'aria-label': ariaLabel } = useDefaults('ContextMenu', props)
  const [isOpen, setOpen] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  const sheet = useAdaptive({ mobile: true, desktop: false }, platform)
  const menuId = useId()
  const targetRef = useRef<HTMLElement>(null)
  const at = useRef<Rect>(pointRect(0, 0))
  const [focusRef, returnTo] = [useRef<MenuFocus>('menu'), useRef<HTMLElement | null>(null)]
  const press = useRef<{ timer?: ReturnType<typeof setTimeout>; x: number; y: number; fired: boolean }>({ x: 0, y: 0, fired: false })
  const child = children as TriggerElement
  const ref = useMergedRef(child.props.ref, targetRef)

  useEffect(() => () => clearTimeout(press.current.timer), [])

  const openAt = (x: number, y: number, how: MenuFocus) => {
    // A keyboard menu key (no coordinates) opens at the element's corner.
    if (x === 0 && y === 0 && targetRef.current) {
      const r = targetRef.current.getBoundingClientRect()
      x = r.left
      y = r.top + r.height
    }
    at.current = pointRect(x, y)
    focusRef.current = how
    returnTo.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }
  const close = (restore: boolean) => {
    setOpen(false)
    if (restore) (returnTo.current ?? targetRef.current)?.focus({ preventScroll: true })
  }
  const cancelPress = () => clearTimeout(press.current.timer)

  const p = child.props
  const handlers = disabled
    ? {}
    : {
        onContextMenu: chain(p.onContextMenu, (e: MouseEvent) => {
          e.preventDefault()
          // A long press already opened it; the browser's own contextmenu follows on some devices.
          if (press.current.fired) return
          openAt(e.clientX, e.clientY, e.clientX === 0 && e.clientY === 0 ? 'first' : 'menu')
        }),
        onPointerDown: chain(p.onPointerDown, (e: PointerEvent) => {
          press.current.fired = false
          if (e.pointerType !== 'touch') return
          cancelPress()
          press.current.x = e.clientX
          press.current.y = e.clientY
          const { clientX, clientY } = e
          press.current.timer = setTimeout(() => {
            press.current.fired = true
            openAt(clientX, clientY, 'menu')
          }, LONG_PRESS_MS)
        }),
        onPointerMove: chain(p.onPointerMove, (e: PointerEvent) => {
          if (Math.hypot(e.clientX - press.current.x, e.clientY - press.current.y) > LONG_PRESS_SLOP) cancelPress()
        }),
        onPointerUp: chain(p.onPointerUp, cancelPress),
        onPointerCancel: chain(p.onPointerCancel, cancelPress),
        // The tap that ended a long press is not a click on what is underneath.
        onClickCapture: chain(p.onClickCapture, (e: MouseEvent) => {
          if (!press.current.fired) return
          press.current.fired = false
          e.preventDefault()
          e.stopPropagation()
        }),
      }

  return (
    <>
      {cloneElement(child, { ref, ...handlers })}
      {sheet ? (
        <MenuSheet open={isOpen} items={items} onClose={close} id={menuId} className={className} aria-label={ariaLabel} />
      ) : (
        <MenuLevel
          open={isOpen}
          items={items}
          anchor={() => at.current}
          placement="bottom-start"
          offset={0}
          focus={focusRef.current}
          closeAll={close}
          id={menuId}
          className={className}
          aria-label={ariaLabel}
        />
      )}
    </>
  )
}
