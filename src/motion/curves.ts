import type { Transition } from 'motion/react'

/**
 * The Metro motion language. Things arrive fast and settle (EASE_ENTER), and
 * leave by accelerating away in a little over half the time (EASE_EXIT).
 * Ported from ALTC (apps/web/src/lib/motion.ts).
 */

export const EASE_ENTER = [0.1, 0.9, 0.2, 1] as const
export const EASE_EXIT = [0.7, 0, 0.84, 0] as const

export const enter = (duration: number): Transition => ({ type: 'tween', ease: EASE_ENTER, duration })
export const exit = (duration: number): Transition => ({ type: 'tween', ease: EASE_EXIT, duration })

/** Drag snap-back: sheets, swipe items, pull to refresh. */
export const SPRING: Transition = { type: 'spring', stiffness: 500, damping: 40 }
/** Panes moving between layouts. */
export const LAYOUT_TRANSITION: Transition = enter(0.3)
export const INSTANT: Transition = { duration: 0 }

/** A curve as CSS, for the Web Animations API and inline transitions. */
export const cubic = (ease: readonly number[]) => `cubic-bezier(${ease.join(', ')})`
