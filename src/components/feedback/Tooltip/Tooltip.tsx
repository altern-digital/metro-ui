import { useId, useMergedRef } from '@mantine/hooks'
import { cloneElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { cx } from '../../../utils'
import { Floating } from '../_overlay/Floating'
import type { Placement } from '../_overlay/position'
import { chain, type TriggerElement } from '../_overlay/trigger'

export interface TooltipProps {
  /** What the tip says. Nothing (null, '') renders the child alone. */
  content: ReactNode
  /** One element that takes a ref and can be focused or hovered. */
  children: ReactElement
  /** Default `bottom`; flips when there is no room. */
  placement?: Placement
  /** ms of hover or focus before it shows. Default 500. */
  delay?: number
  className?: string
}

/**
 * A Windows tooltip: a small flat box on `--mt-raised` with a 1px edge,
 * after a pause on hover or keyboard focus. Escape, a press or leaving hides
 * it. A touch screen has no hover, so there it renders only the child.
 *
 * ```tsx
 * <Tooltip content="refresh"><Button icon={VscRefresh} aria-label="refresh" /></Tooltip>
 * ```
 */
export function Tooltip(props: TooltipProps) {
  const { content, children, placement = 'bottom', delay = 500, className } = useDefaults('Tooltip', props)
  const { coarse } = useConfig()
  const [open, setOpen] = useState(false)
  const id = useId()
  const triggerRef = useRef<HTMLElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const child = children as TriggerElement
  const ref = useMergedRef(child.props.ref, triggerRef)
  const off = coarse || content == null || content === '' || content === false

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (!open) return
    // Not the shared Escape stack: a tooltip over a dialog must not eat the dialog's Escape.
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (off) return children

  const show = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  const p = child.props
  const trigger = cloneElement(child, {
    ref,
    'aria-describedby': open ? cx(p['aria-describedby'] as string | undefined, id) : p['aria-describedby'],
    onPointerEnter: chain(p.onPointerEnter, (e: { pointerType?: string; defaultPrevented: boolean }) => {
      if (e.pointerType !== 'touch') show()
    }),
    onPointerLeave: chain(p.onPointerLeave, hide),
    onPointerDown: chain(p.onPointerDown, hide),
    onFocus: chain(p.onFocus, show),
    onBlur: chain(p.onBlur, hide),
  })

  return (
    <>
      {trigger}
      <Floating
        open={open}
        id={id}
        role="tooltip"
        className={cx('mt-tooltip', className)}
        anchor={() => triggerRef.current?.getBoundingClientRect() ?? null}
        placement={placement}
        offset={6}
        motion="fade"
        closeOnEscape={false}
        closeOnOutside={false}
      >
        {content}
      </Floating>
    </>
  )
}
