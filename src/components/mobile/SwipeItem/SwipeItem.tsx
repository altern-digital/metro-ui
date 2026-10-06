import { animate, m, useDragControls, useMotionValue, type PanInfo } from 'motion/react'
import { useRef, useState, type CSSProperties, type HTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { toneVar, type Tone } from '../../../config/theme'
import { SPRING } from '../../../motion/curves'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'

export interface SwipeAction {
  key: string
  label: string
  icon?: IconSource
  /** Its fill: `danger`, `warning`, `success`, `info`, `accent` (default), a Metro tone or any CSS colour. */
  tone?: 'danger' | 'warning' | 'success' | 'info' | 'accent' | Tone
  onClick: () => void
}

export interface SwipeItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Revealed on the left by swiping right. */
  leftActions?: SwipeAction[]
  /** Revealed on the right by swiping left. */
  rightActions?: SwipeAction[]
  /** Swiping most of the way across runs the first action on that side. */
  fullSwipe?: boolean
  /** Width of each revealed action, px. Default 72. */
  actionWidth?: number
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

/** Past this share of the row's width a full swipe runs its action. */
const FULL = 0.6
/** A flick this fast (px/s) opens the side it heads to. */
const FLICK = 500

const STATUS = new Set(['danger', 'warning', 'success', 'info', 'accent'])
const toneColor = (tone: SwipeAction['tone']) => (tone && STATUS.has(tone) ? `var(--mt-${tone})` : (toneVar(tone) ?? 'var(--mt-accent)'))

/**
 * A list row that slides aside under a finger to reveal actions, and snaps
 * back with a spring. With a mouse the same actions show at the row's end
 * on hover; with a keyboard they are buttons in the tab order.
 */
export function SwipeItem(props: SwipeItemProps) {
  const { leftActions = [], rightActions = [], fullSwipe, actionWidth = 72, className, children, ...rest } = useDefaults('SwipeItem', props)
  const { reducedMotion } = useConfig()
  const x = useMotionValue(0)
  const drag = useDragControls()
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<'left' | 'right' | null>(null)
  const leftW = leftActions.length * actionWidth
  const rightW = rightActions.length * actionWidth

  const settle = (to: number, side: 'left' | 'right' | null) => {
    setOpen(side)
    if (reducedMotion) x.set(to)
    else animate(x, to, SPRING)
  }

  const run = (action: SwipeAction) => {
    action.onClick()
    settle(0, null)
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const at = x.get()
    const width = root.current?.offsetWidth ?? 0
    const v = info.velocity.x
    if (fullSwipe && width) {
      if (leftActions[0] && at > width * FULL) return run(leftActions[0])
      if (rightActions[0] && at < -width * FULL) return run(rightActions[0])
    }
    if (leftW && (at > leftW / 2 || (v > FLICK && at > 0))) return settle(leftW, 'left')
    if (rightW && (at < -rightW / 2 || (v < -FLICK && at < 0))) return settle(-rightW, 'right')
    settle(0, null)
  }

  // A tap on the row while it's open just closes it.
  const onClickCapture = (e: MouseEvent) => {
    if (!open) return
    e.preventDefault()
    e.stopPropagation()
    settle(0, null)
  }

  const side = (actions: SwipeAction[], at: 'left' | 'right') =>
    actions.length > 0 && (
      <div className="mt-swipe-item-actions" data-side={at} inert={open !== at} aria-hidden={open !== at}>
        {actions.map((a) => (
          <button
            key={a.key}
            type="button"
            className="mt-swipe-item-action"
            style={{ '--_tone': toneColor(a.tone), width: actionWidth } as CSSProperties}
            onClick={() => run(a)}
            data-mt-press=""
          >
            {a.icon != null && <span className="mt-swipe-item-action-icon">{renderIcon(a.icon)}</span>}
            <span className="mt-swipe-item-action-label">{a.label}</span>
          </button>
        ))}
      </div>
    )

  const all = [...leftActions, ...rightActions]
  const reach = fullSwipe ? 4000 : 0

  return (
    <div {...rest} ref={root} className={cx('mt-swipe-item', className)} data-open={open ?? undefined}>
      {side(leftActions, 'left')}
      {side(rightActions, 'right')}
      <m.div
        className="mt-swipe-item-content"
        style={{ x }}
        drag={all.length ? 'x' : false}
        dragListener={false}
        dragControls={drag}
        dragDirectionLock
        dragMomentum={false}
        dragElastic={0.12}
        dragConstraints={{ left: rightW ? -(rightW + reach) : 0, right: leftW ? leftW + reach : 0 }}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' && all.length) drag.start(e)
        }}
        onDragEnd={onDragEnd}
        onClickCapture={onClickCapture}
      >
        {children}
        {all.length > 0 && (
          <div className="mt-swipe-item-tray" data-has-open={flag(!!open)}>
            {all.map((a) => (
              <button
                key={a.key}
                type="button"
                className="mt-swipe-item-tray-button"
                aria-label={a.label}
                title={a.label}
                style={{ '--_tone': toneColor(a.tone) } as CSSProperties}
                onClick={(e) => {
                  e.stopPropagation()
                  run(a)
                }}
                data-mt-press=""
                data-mt-hover=""
              >
                {a.icon != null ? renderIcon(a.icon) : a.label}
              </button>
            ))}
          </div>
        )}
      </m.div>
    </div>
  )
}
