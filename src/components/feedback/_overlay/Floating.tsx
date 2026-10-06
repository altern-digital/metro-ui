import { useClickOutside, useId, useMergedRef } from '@mantine/hooks'
import { AnimatePresence, m, useIsPresent } from 'motion/react'
import { useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { fade, menu, menuUp, presence } from '../../../motion/variants'
import { cx } from '../../../utils'
import { Portal } from '../../foundation/Portal/Portal'
import { isInOverlay, OwnerContext, useEscape, useOwnerChain } from './dismiss'
import { computePosition, splitPlacement, type Placement, type Rect } from './position'

/** HTML props that don't clash with motion's own handlers of the same name. */
export type MotionSafe<T> = Omit<T, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragOver' | 'onDragEnter' | 'onDragLeave' | 'onDrop'>

export type CloseReason = 'escape' | 'outside'

export interface FloatingProps extends MotionSafe<Omit<HTMLAttributes<HTMLDivElement>, 'children'>> {
  open: boolean
  /** The anchor's rect, read on every reposition. */
  anchor: () => Rect | null
  placement?: Placement
  offset?: number
  /** At least as wide as the anchor. */
  matchWidth?: boolean
  onClose?: (reason: CloseReason) => void
  closeOnEscape?: boolean
  closeOnOutside?: boolean
  /** Elements whose presses don't count as outside (the trigger, which toggles by itself). */
  ignore?: () => (Element | null | undefined)[]
  /** `menu` drops (or rises, when above) a little; `fade` only fades. */
  motion?: 'menu' | 'fade'
  /** Called once it has a place and can take focus. */
  onPlaced?: (panel: HTMLDivElement) => void
  ref?: Ref<HTMLDivElement>
  children?: ReactNode
}

/**
 * A panel fixed beside an anchor in the provider's overlay layer: measured,
 * placed (flipping and clamping), kept in place on scroll and resize, and
 * closed by Escape or a press outside. Popover, MenuFlyout, ContextMenu,
 * Select and Tooltip are built on it.
 */
export function Floating(props: FloatingProps) {
  return (
    <Portal>
      <AnimatePresence>{props.open && <FloatingPanel key="panel" {...props} />}</AnimatePresence>
    </Portal>
  )
}

function FloatingPanel({
  open: _open,
  anchor,
  placement = 'bottom-start',
  offset = 4,
  matchWidth,
  onClose,
  closeOnEscape = true,
  closeOnOutside = true,
  ignore,
  motion = 'menu',
  onPlaced,
  ref,
  className,
  style,
  children,
  ...rest
}: FloatingProps) {
  const id = useId()
  const chain = useOwnerChain(id)
  const present = useIsPresent()
  const local = useRef<HTMLDivElement>(null)
  const latest = useRef({ anchor, onClose, ignore, onPlaced })
  latest.current = { anchor, onClose, ignore, onPlaced }
  const [pos, setPos] = useState<{ top: number; left: number; placement: Placement; minWidth?: number } | null>(null)

  useLayoutEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = local.current
      const a = latest.current.anchor()
      if (!el || !a) return
      const minWidth = matchWidth ? a.width : undefined
      if (minWidth !== undefined) el.style.minWidth = `${minWidth}px`
      // offset sizes ignore the transform the entrance animation is applying.
      const size = { width: el.offsetWidth, height: el.offsetHeight }
      const next = computePosition(a, size, { width: window.innerWidth, height: window.innerHeight }, placement, offset)
      setPos((prev) => (prev && prev.top === next.top && prev.left === next.left && prev.placement === next.placement && prev.minWidth === minWidth ? prev : { ...next, minWidth }))
    }
    update()
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { capture: true, passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    if (local.current) observer?.observe(local.current)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule, { capture: true })
      window.removeEventListener('resize', schedule)
      observer?.disconnect()
    }
  }, [placement, offset, matchWidth])

  const placed = pos !== null
  useLayoutEffect(() => {
    if (placed && local.current) latest.current.onPlaced?.(local.current)
  }, [placed])

  const outsideRef = useClickOutside<HTMLDivElement>(
    (e) => {
      const target = e.target
      if (isInOverlay(target, id)) return
      if (latest.current.ignore?.().some((node) => node && target instanceof Node && node.contains(target))) return
      latest.current.onClose?.('outside')
    },
    ['pointerdown'],
    undefined,
    present && closeOnOutside,
    true,
  )
  useEscape(present && closeOnEscape, () => latest.current.onClose?.('escape'))
  const merged = useMergedRef(local, outsideRef, ref)

  const [side] = splitPlacement(pos?.placement ?? placement)
  const panelStyle: CSSProperties = {
    ...style,
    top: pos?.top ?? 0,
    left: pos?.left ?? 0,
    minWidth: pos?.minWidth ?? style?.minWidth,
    // Measured first, then shown where it fits.
    visibility: pos ? style?.visibility : 'hidden',
  }

  return (
    <OwnerContext value={chain}>
      <m.div
        {...rest}
        ref={merged}
        className={cx('mt-floating', className)}
        data-mt-owner={chain}
        data-placement={pos?.placement ?? placement}
        style={panelStyle}
        variants={motion === 'fade' ? fade : side === 'top' ? menuUp : menu}
        {...presence}
        // On its way out it's already closed: presses belong to whatever is under it.
        inert={!present}
      >
        {children}
      </m.div>
    </OwnerContext>
  )
}
