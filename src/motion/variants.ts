import type { Variants } from 'motion/react'
import { enter, exit } from './curves'

/*
 * Variants all use the labels initial/animate/exit, so a child given its own
 * variants follows its parent's AnimatePresence. Spread `presence` on the
 * motion element to play them.
 */

/** How far the drill-down zoom scales an overlay short of full size. */
const DRILL = 0.08

/** The Metro drill-down: an overlay (dialog band, full-screen panel) grows up to full size, and shrinks away as it closes. */
export const drill: Variants = {
  initial: { opacity: 0, scale: 1 - DRILL },
  animate: { opacity: 1, scale: 1, transition: enter(0.3) },
  exit: { opacity: 0, scale: 1 - DRILL, transition: exit(0.15) },
}

/** Scrims. */
export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

/** Popup menus drop in. */
export const menu: Variants = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0, transition: enter(0.12) },
  exit: { opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } },
}

/** A popup that opens above its anchor rises a little. */
export const menuUp: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: enter(0.12) },
  exit: { opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } },
}

/** Touch menus and sheets rise from the bottom edge. */
export const sheet: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: enter(0.25) },
  exit: { y: '100%', transition: exit(0.18) },
}

/** A side drawer: full-screen from the edge when `custom` is true (compact), a column beside the content otherwise. */
export const drawer: Variants = {
  initial: (compact: boolean) => (compact ? { x: '100%' } : { opacity: 0, x: 24 }),
  animate: { opacity: 1, x: 0, transition: enter(0.3) },
  exit: (compact: boolean) => (compact ? { x: '100%', transition: exit(0.2) } : { opacity: 0, x: 24, transition: exit(0.15) }),
}

/** Small floating things grow out of their corner. */
export const pop: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: enter(0.2) },
  exit: { opacity: 0, scale: 0.9, transition: exit(0.12) },
}

/** A tile grid: its tiles arrive one after another. */
export const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.03 } },
}

/** A folding group of tiles: they arrive in turn, and the group folds away as they leave. */
export const tileGroup: Variants = {
  animate: { transition: { staggerChildren: 0.03 } },
  exit: { height: 0, opacity: 0, overflow: 'hidden', transition: exit(0.15) },
}

export const tile: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: enter(0.35) },
  exit: { opacity: 0, x: -24, transition: exit(0.15) },
}

/** Opens in place by height, so what's below slides rather than jumps. Its element needs overflow hidden. */
export const folding: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1, transition: enter(0.2) },
  exit: { height: 0, opacity: 0, transition: exit(0.15) },
}

/** Views side by side: the new one slides in from its side (`custom`: 1 from the right, -1 from the left). */
export const pivot: Variants = {
  initial: (direction: number) => ({ x: direction * 48, opacity: 0 }),
  animate: { x: 0, opacity: 1, pointerEvents: 'auto', transition: enter(0.22) },
  // A view on its way out sits over or under the new one; a tap is the new one's.
  exit: (direction: number) => ({ x: direction * -48, opacity: 0, pointerEvents: 'none', transition: exit(0.15) }),
}

/** Bars along the bottom: they rise in and drop away. */
export const bar: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: enter(0.25) },
  exit: { opacity: 0, y: 16, transition: exit(0.12) },
}

/** Flyouts rising from a bar at the bottom. */
export const rise: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: enter(0.25) },
  exit: { opacity: 0, y: 24, transition: exit(0.12) },
}

/** Toasts on the desktop, as the action center: in from the right edge, and back out. */
export const slideFromRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: enter(0.3) },
  exit: { x: '100%', opacity: 0, transition: exit(0.15) },
}

/** Drops in from the top. */
export const dropIn: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: enter(0.3) },
  exit: { opacity: 0, y: -16, transition: exit(0.12) },
}

/** Spread on a motion element to play its variants in and out of an AnimatePresence. */
export const presence = { initial: 'initial', animate: 'animate', exit: 'exit' } as const
