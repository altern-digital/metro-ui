import { useFocusTrap, useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { AnimatePresence, m, useDragControls, useIsPresent, type PanInfo, type Variants } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { SPRING } from '../../../motion/curves'
import { fade, presence, sheet } from '../../../motion/variants'
import { cx, flag } from '../../../utils'
import { Portal } from '../../foundation/Portal/Portal'
import type { MotionSafe } from '../_overlay/Floating'
import { OwnerContext, useEscape, useOwnerChain, useReturnFocus, useScrollLock } from '../_overlay/dismiss'

export interface BottomSheetProps extends MotionSafe<Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Heading at the top; it also names the sheet for screen readers. */
  title?: ReactNode
  children?: ReactNode
  /** Heights it rests at, as fractions of the viewport, smallest first. It opens at the first. Default `[0.5, 0.92]`. */
  snapPoints?: number[]
  /** As tall as its content (up to the largest snap point) instead of resting at snap points. */
  fit?: boolean
  /** Scrim, Escape and dragging down close it. Default true. */
  dismissible?: boolean
  /** Pinned under the content, above the safe area. */
  footer?: ReactNode
  /** After the closing animation, when it has left the page. */
  onExitComplete?: () => void
  /** The sheet element. */
  ref?: Ref<HTMLDivElement>
}

const DEFAULT_SNAPS = [0.5, 0.92]
/** A flick faster than this (px/s) carries the sheet on to the next rest. */
const PROJECT_S = 0.2

/**
 * A Windows Phone style sheet: rises from the bottom over a scrim, rests at
 * snap heights, and follows a finger on its grip: up to grow, down to shrink
 * or close. Works on the desktop too, as a centred column up to 640px.
 *
 * ```tsx
 * <BottomSheet open={open} onOpenChange={setOpen} title="share">…</BottomSheet>
 * ```
 */
export function BottomSheet(props: BottomSheetProps) {
  const { open, defaultOpen, onOpenChange, onExitComplete, ...rest } = useDefaults('BottomSheet', props)
  const [isOpen, setOpen] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  return (
    <Portal>
      <AnimatePresence onExitComplete={onExitComplete}>{isOpen && <Sheet key="sheet" {...rest} onClose={() => setOpen(false)} />}</AnimatePresence>
    </Portal>
  )
}

type SheetProps = Omit<BottomSheetProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'onExitComplete'> & { onClose: () => void }

function Sheet({ title, children, snapPoints = DEFAULT_SNAPS, fit, dismissible = true, footer, onClose, ref, className, style, ...rest }: SheetProps) {
  const id = useId()
  const chain = useOwnerChain(id)
  const titleId = `${id}-title`
  const present = useIsPresent()
  const drag = useDragControls()
  const local = useRef<HTMLDivElement>(null)
  const trap = useFocusTrap(present)
  const merged = useMergedRef(local, trap, ref)
  const points = [...snapPoints].filter((p) => p > 0 && p <= 1).sort((a, b) => a - b)
  if (points.length === 0) points.push(...DEFAULT_SNAPS)
  const max = points.at(-1)!

  const [vh, setVh] = useState(() => (typeof window === 'undefined' ? 800 : window.innerHeight))
  const [snap, setSnap] = useState(0)
  // Bumped after a drag, so the sheet animates back even to the rest it left.
  const [settles, setSettles] = useState(0)
  const [fitHeight, setFitHeight] = useState(0)
  const [returnTo] = useState(() => (typeof document === 'undefined' ? null : (document.activeElement as HTMLElement | null)))

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])
  useLayoutEffect(() => {
    if (fit && local.current) setFitHeight(local.current.offsetHeight)
  })

  useScrollLock(present)
  useEscape(present && dismissible, onClose)
  useReturnFocus(present, () => returnTo, () => local.current)

  const height = fit ? fitHeight : max * vh
  const offset = fit ? 0 : (max - points[snap]!) * vh
  const label = `rest${settles}`
  const variants: Variants = {
    initial: sheet.initial!,
    exit: sheet.exit!,
    [label]: { y: offset, transition: settles ? SPRING : (sheet.animate as { transition: object }).transition },
  }

  // Lands on the rest nearest to where the flick was heading; past the last one, closed.
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = offset + info.offset.y + info.velocity.y * PROJECT_S
    const rests = fit ? [0] : points.map((p) => (max - p) * vh)
    if (dismissible) rests.push(height)
    let best = 0
    rests.forEach((r, i) => {
      if (Math.abs(r - projected) < Math.abs(rests[best]! - projected)) best = i
    })
    if (dismissible && best === rests.length - 1) return onClose()
    setSnap(best)
    setSettles((n) => n + 1)
  }

  return (
    <OwnerContext value={chain}>
      <m.div className="mt-bottom-sheet-scrim" variants={fade} {...presence} onClick={dismissible ? onClose : undefined} aria-hidden />
      <m.div
        {...rest}
        ref={merged}
        role={rest.role ?? 'dialog'}
        aria-modal="true"
        aria-labelledby={title != null ? titleId : rest['aria-labelledby']}
        tabIndex={-1}
        className={cx('mt-bottom-sheet', className)}
        data-mt-owner={chain}
        data-fit={flag(fit)}
        style={{ ...style, height: fit ? undefined : height, maxHeight: max * vh, paddingBottom: offset ? `calc(${offset}px + env(safe-area-inset-bottom, 0px))` : undefined }}
        variants={variants}
        initial="initial"
        animate={label}
        exit="exit"
        inert={!present}
        drag="y"
        dragControls={drag}
        dragListener={false}
        dragMomentum={false}
        dragConstraints={{ top: 0, bottom: height }}
        dragElastic={{ top: 0.08, bottom: 0.6 }}
        onDragEnd={onDragEnd}
      >
        <div className="mt-bottom-sheet-grip" onPointerDown={(e) => drag.start(e)} aria-hidden>
          <span className="mt-bottom-sheet-handle" />
        </div>
        {title != null && (
          <h2 id={titleId} className="mt-bottom-sheet-title" onPointerDown={(e) => drag.start(e)}>
            {title}
          </h2>
        )}
        <div className="mt-bottom-sheet-body">{children}</div>
        {footer != null && <div className="mt-bottom-sheet-footer">{footer}</div>}
      </m.div>
    </OwnerContext>
  )
}
