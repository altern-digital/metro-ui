import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { cloneElement, useEffect, useRef, type HTMLAttributes, type ReactElement, type ReactNode, type Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx } from '../../../utils'
import { Floating, type MotionSafe } from '../_overlay/Floating'
import { useReturnFocus } from '../_overlay/dismiss'
import type { Placement } from '../_overlay/position'
import { chain, firstFocusable, type TriggerElement } from '../_overlay/trigger'

export type { Placement } from '../_overlay/position'
export type PopoverTrigger = 'click' | 'hover' | 'manual'

export interface PopoverProps extends MotionSafe<Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'>> {
  /** What the panel shows. */
  content: ReactNode
  /** The trigger: one element that takes a ref, such as a Button. */
  children: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Default `bottom-start`. It flips to the other side when there is no room. */
  placement?: Placement
  /** What opens it. `manual`: only `open`. Default `click`. */
  trigger?: PopoverTrigger
  /** Gap to the trigger in px. Default 4. */
  offset?: number
  /** At least as wide as the trigger. */
  matchWidth?: boolean
  /** Move focus into the panel when it opens. Default true for `click`. */
  autoFocus?: boolean
  /** Default true. */
  closeOnEscape?: boolean
  /** Default true. */
  closeOnOutsideClick?: boolean
  /** The panel element. */
  ref?: Ref<HTMLDivElement>
}

const HOVER_CLOSE_MS = 120

/**
 * A Windows flyout: a flat panel beside its trigger, filled, with no
 * shadow. It flips and stays on screen, closes on Escape or a click outside,
 * and gives focus back to the trigger.
 *
 * ```tsx
 * <Popover content={<p>Saved to your drafts.</p>}>
 *   <Button>details</Button>
 * </Popover>
 * ```
 */
export function Popover(props: PopoverProps) {
  const {
    content,
    children,
    open,
    defaultOpen,
    onOpenChange,
    placement = 'bottom-start',
    trigger = 'click',
    offset = 4,
    matchWidth,
    autoFocus = trigger === 'click',
    closeOnEscape = true,
    closeOnOutsideClick = true,
    className,
    id,
    role = 'dialog',
    ref,
    onPointerEnter,
    onPointerLeave,
    ...rest
  } = useDefaults('Popover', props)
  const [isOpen, setOpen] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  const autoId = useId()
  const panelId = id ?? autoId
  const triggerRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const child = children as TriggerElement
  const triggerMerged = useMergedRef(child.props.ref, triggerRef)
  const panelMerged = useMergedRef(panelRef, ref)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Focus goes back only if opening took it: a hover popover never had it.
  useReturnFocus(isOpen, () => triggerRef.current, () => panelRef.current, autoFocus)
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const hoverOpen = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hoverClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_MS)
  }

  const p = child.props
  const triggerProps: Record<string, unknown> = {
    ref: triggerMerged,
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? panelId : undefined,
    'aria-haspopup': role === 'dialog' || role === 'menu' || role === 'listbox' ? role : undefined,
  }
  if (trigger === 'click') triggerProps.onClick = chain(p.onClick, () => setOpen(!isOpen))
  if (trigger === 'hover') {
    triggerProps.onPointerEnter = chain(p.onPointerEnter, (e: { pointerType?: string; defaultPrevented: boolean }) => {
      if (e.pointerType !== 'touch') hoverOpen()
    })
    triggerProps.onPointerLeave = chain(p.onPointerLeave, hoverClose)
    triggerProps.onFocus = chain(p.onFocus, hoverOpen)
    triggerProps.onBlur = chain(p.onBlur, hoverClose)
    // A finger has no hover: a tap toggles.
    triggerProps.onClick = chain(p.onClick, () => setOpen(!isOpen))
  }

  return (
    <>
      {cloneElement(child, triggerProps)}
      <Floating
        {...rest}
        ref={panelMerged}
        id={panelId}
        role={role}
        tabIndex={-1}
        className={cx('mt-popover', className)}
        open={isOpen}
        anchor={() => triggerRef.current?.getBoundingClientRect() ?? null}
        placement={placement}
        offset={offset}
        matchWidth={matchWidth}
        closeOnEscape={closeOnEscape}
        closeOnOutside={closeOnOutsideClick}
        ignore={() => [triggerRef.current]}
        onClose={() => setOpen(false)}
        onPlaced={(panel) => autoFocus && (firstFocusable(panel) ?? panel).focus({ preventScroll: true })}
        onPointerEnter={trigger === 'hover' ? chain(onPointerEnter, hoverOpen) : onPointerEnter}
        onPointerLeave={trigger === 'hover' ? chain(onPointerLeave, hoverClose) : onPointerLeave}
      >
        {content}
      </Floating>
    </>
  )
}

/** The Windows name for a Popover. */
export const Flyout = Popover
export type FlyoutProps = PopoverProps
