import { useMergedRef } from '@mantine/hooks'
import { animate, m, useMotionValue } from 'motion/react'
import { useEffect, useRef, useState, type HTMLAttributes, type PointerEvent, type ReactNode, type Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { SPRING } from '../../../motion/curves'
import { cx, flag } from '../../../utils'

export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  /** Runs when the pull is released past the threshold. The dots show until it settles. */
  onRefresh: () => Promise<unknown> | void
  /** How far (px, after resistance) the pull has to go. Default 72. */
  threshold?: number
  /** `self` (default): this element is the scroller, so give it a height. `window`: the page scrolls, and this element wraps the content. */
  target?: 'self' | 'window'
  disabled?: boolean
  /** Shown while pulling. Default: the locale's `pullToRefresh`. */
  pullLabel?: ReactNode
  /** Shown past the threshold. Default: the locale's `releaseToRefresh`. */
  releaseLabel?: ReactNode
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

type Phase = 'idle' | 'pull' | 'armed' | 'refreshing'

/** Movement past this, downwards, starts a pull. */
const START_PX = 6

/**
 * Pull down at the top of a list to refresh it, as on Windows Phone: the
 * content follows the finger with growing resistance, an arrow turns over
 * past the threshold, and the Metro dots run until `onRefresh` settles.
 * Touch only; give mouse and keyboard users a refresh button as well.
 */
export function PullToRefresh(props: PullToRefreshProps) {
  const { onRefresh, threshold = 72, target = 'self', disabled, pullLabel, releaseLabel, className, children, ref, ...rest } = useDefaults('PullToRefresh', props)
  const { locale, reducedMotion } = useConfig()
  const root = useRef<HTMLDivElement>(null)
  const merged = useMergedRef(root, ref)
  const y = useMotionValue(0)
  const [phase, setPhase] = useState<Phase>('idle')
  const gesture = useRef<{ id: number; startY: number; active: boolean } | null>(null)
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const max = threshold * 2.5

  const atTop = () => (target === 'window' ? window.scrollY <= 0 : (root.current?.scrollTop ?? 0) <= 0)
  const settle = (to: number) => (reducedMotion ? y.set(to) : animate(y, to, SPRING))
  const show = (next: Phase) => phaseRef.current !== next && setPhase(next)

  // The browser must not scroll (or run its own pull to refresh) while we pull.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const onTouchMove = (e: TouchEvent) => {
      const g = gesture.current
      const t = e.touches[0]
      if (g && t && e.cancelable && (g.active || t.clientY - g.startY > 0)) e.preventDefault()
    }
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [])

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' || !e.isPrimary || disabled || phaseRef.current === 'refreshing' || !atTop()) return
    gesture.current = { id: e.pointerId, startY: e.clientY, active: false }
  }

  const onPointerMove = (e: PointerEvent) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return
    const dy = e.clientY - g.startY
    if (!g.active) {
      if (dy < -START_PX) gesture.current = null
      else if (dy > START_PX && atTop()) g.active = true
      if (!g.active) return
    }
    const d = Math.max(0, dy - START_PX)
    const pull = (max * d) / (d + max)
    y.set(pull)
    show(pull >= threshold ? 'armed' : 'pull')
  }

  const refresh = async () => {
    show('refreshing')
    settle(threshold)
    try {
      await onRefresh()
    } finally {
      settle(0)
      setPhase('idle')
    }
  }

  const onPointerEnd = (e: PointerEvent) => {
    const g = gesture.current
    if (!g || g.id !== e.pointerId) return
    gesture.current = null
    if (!g.active) return
    if (y.get() >= threshold && e.type === 'pointerup') void refresh()
    else {
      settle(0)
      show('idle')
    }
  }

  const label = phase === 'armed' ? (releaseLabel ?? locale.releaseToRefresh) : (pullLabel ?? locale.pullToRefresh)

  return (
    <div
      {...rest}
      ref={merged}
      className={cx('mt-pull-to-refresh', className)}
      data-target={target}
      data-phase={phase}
      aria-busy={phase === 'refreshing' || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <m.div className="mt-pull-to-refresh-indicator" style={{ height: y }} aria-hidden>
        {phase === 'refreshing' ? (
          <span className="mt-pull-to-refresh-dots">
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <span className="mt-pull-to-refresh-hint">
            <svg className="mt-pull-to-refresh-arrow" data-armed={flag(phase === 'armed')} width="1em" height="1em" viewBox="0 0 16 16" aria-hidden>
              <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>{label}</span>
          </span>
        )}
      </m.div>
      <span className="mt-visually-hidden" role="status">
        {phase === 'refreshing' ? locale.loading : ''}
      </span>
      <m.div className="mt-pull-to-refresh-content" style={{ y }}>
        {children}
      </m.div>
    </div>
  )
}
