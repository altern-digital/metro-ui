import { useEffect, useRef, useState } from 'react'
import * as easings from 'easing-utils'
import { useConfig } from '../config/context'

export type EasingName = Exclude<keyof typeof easings, 'default'>
export type Easing = EasingName | ((t: number) => number)

export interface TweenOptions {
  /** Milliseconds. Default 600. */
  duration?: number
  /** An easing-utils curve by name, or your own `t → t`. Default `easeOutExpo`, Metro's "arrive fast, settle". */
  easing?: Easing
  /** Value to start from on first render. Default: `target` itself (no animation on mount). */
  from?: number
}

const resolve = (easing: Easing): ((t: number) => number) =>
  typeof easing === 'function' ? easing : ((easings as Record<string, (t: number) => number>)[easing] ?? easings.easeOutExpo)

/**
 * Animate one number with requestAnimationFrame: counters on a live tile, a
 * progress value, a scroll offset. Each new `target` tweens from wherever the
 * value is now, so changing it mid-flight doesn't jump. Reduced motion snaps.
 */
export function useTween(target: number, { duration = 600, easing = 'easeOutExpo', from }: TweenOptions = {}): number {
  const { reducedMotion } = useConfig()
  const [value, setValue] = useState(from ?? target)
  const current = useRef(value)
  current.current = value

  useEffect(() => {
    const start = current.current
    if (reducedMotion || duration <= 0 || start === target) {
      setValue(target)
      return
    }
    const ease = resolve(easing)
    const t0 = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - t0) / duration)
      setValue(start + (target - start) * ease(t))
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
    // easing as a function would restart every render; only its name or identity matters.
  }, [target, duration, easing, reducedMotion])

  return value
}

/** One-shot tween outside React (e.g. smooth scroll). Returns a cancel function. */
export function tween(from: number, to: number, onUpdate: (value: number) => void, { duration = 400, easing = 'easeOutExpo' }: Omit<TweenOptions, 'from'> = {}): () => void {
  const ease = resolve(easing)
  const t0 = performance.now()
  let frame = requestAnimationFrame(function step(now) {
    const t = Math.min(1, (now - t0) / duration)
    onUpdate(from + (to - from) * ease(t))
    if (t < 1) frame = requestAnimationFrame(step)
  })
  return () => cancelAnimationFrame(frame)
}

export { easings }
