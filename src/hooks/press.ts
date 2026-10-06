/*
 * Pressed look (and an optional buzz) the moment a finger lands. Inside a
 * scroller Chrome holds :active back until it's sure the touch isn't a
 * scroll, which reads as lag; setting [data-pressed] ourselves doesn't wait.
 *
 * A press that looked pressed also acts: a finger that lifts close to where
 * it landed, soon enough, clicks the element it pressed. Chrome alone drops
 * some of those taps (a few pixels of drift starting a scroll, the keyboard
 * closing and moving the layout, a row redrawn under the finger), which
 * leaves a buzz and no action. So the click comes from here, and the
 * browser's own click for the same touch is dropped. Scrolls and holds still
 * cancel. Only an attribute changes: no React state, no re-render.
 *
 * Ported from ALTC (apps/web/src/lib/pressFeedback.ts); there it matched a
 * list of class names, here every pressable carries [data-mt-press].
 */

/** Further than this and it's a drag or a scroll, not a tap. */
export const SLOP_PX = 10
/** Longer than this and it's a hold. */
export const TAP_MS = 450
/** A finger that lands this soon after a scroll is stopping a fling, which Chrome doesn't click either. */
export const FLING_MS = 150
/** How long after a swipe its scroll may still be coasting. */
export const COAST_MS = 3000
/** How long the browser's own click for a tap we clicked may still arrive. */
export const SWALLOW_MS = 700

export type Press = { x: number; y: number; at: number; moved: number; held: boolean; flinging: boolean }

/** Whether a press ends as a tap: it stayed put, wasn't held, and didn't stop a fling. */
export const isTap = (p: Press, now: number) => !p.held && !p.flinging && p.moved <= SLOP_PX && now - p.at < TAP_MS

const PRESSABLE = '[data-mt-press]'

let pressed: (Press & { el: HTMLElement; id: number }) | null = null
let lastScroll = 0
let lastSwipe = 0
let swallowUntil = 0
let touchStart: { x: number; y: number } | null = null
let buzz = true
let lastBuzz = 0

const isDisabled = (el: HTMLElement) => (el as HTMLButtonElement).disabled || el.getAttribute('aria-disabled') === 'true'

// Only a scroll a swipe set going is a fling; content scrolling itself isn't.
function flinging() {
  const now = performance.now()
  return now - lastScroll < FLING_MS && now - lastSwipe < COAST_MS
}

function release() {
  pressed?.el.removeAttribute('data-pressed')
  pressed = null
}

function haptic() {
  const now = performance.now()
  // Held keys repeat fast; a buzz each time would just be a rattle.
  if (!buzz || now - lastBuzz < 50) return
  lastBuzz = now
  try {
    navigator.vibrate?.(8)
  } catch {
    // A missing motor must never get in the way of the tap.
  }
}

function onDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' || !e.isPrimary) return
  release()
  // A new finger is its own tap: the last one's late click mustn't eat it.
  swallowUntil = 0
  const el = e.target instanceof Element ? e.target.closest<HTMLElement>(PRESSABLE) : null
  if (!el || isDisabled(el)) return
  el.setAttribute('data-pressed', '')
  pressed = { el, id: e.pointerId, x: e.clientX, y: e.clientY, at: performance.now(), moved: 0, held: false, flinging: flinging() }
  haptic()
}

function moveTo(x: number, y: number) {
  if (!pressed) return
  pressed.moved = Math.max(pressed.moved, Math.hypot(x - pressed.x, y - pressed.y))
  if (pressed.moved > SLOP_PX) release()
}

function onMove(e: PointerEvent) {
  if (pressed && e.pointerId === pressed.id) moveTo(e.clientX, e.clientY)
}

// After Chrome cancels the pointer it still reports the finger as touches.
function onTouchMove(e: TouchEvent) {
  const t = e.touches.length === 1 ? e.touches[0] : null
  if (t) moveTo(t.clientX, t.clientY)
}

/** The finger lifted: click what it pressed if that was a tap. */
function lift() {
  const p = pressed
  if (!p) return
  release()
  if (!isTap(p, performance.now()) || !p.el.isConnected || isDisabled(p.el)) return
  swallowUntil = performance.now() + SWALLOW_MS
  p.el.click()
}

function onUp(e: PointerEvent) {
  if (pressed && e.pointerId === pressed.id) lift()
}

// Chrome gave up on the pointer (it thinks a scroll may start). Keep the
// press: the touch's own end says whether the finger really moved.
function onCancel(e: PointerEvent) {
  if (pressed && e.pointerId === pressed.id && pressed.moved > SLOP_PX) release()
}

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  touchStart = e.touches.length === 1 && t ? { x: t.clientX, y: t.clientY } : null
}

function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches[0]
  if (touchStart && t && Math.hypot(t.clientX - touchStart.x, t.clientY - touchStart.y) > SLOP_PX) lastSwipe = performance.now()
  if (e.touches.length === 0) lift()
}

function onScroll() {
  lastScroll = performance.now()
}

function onContextMenu() {
  if (pressed) pressed.held = true
}

// The browser's click for a touch we already clicked. Keyboard clicks (detail 0) always pass.
function onClick(e: MouseEvent) {
  if (!e.isTrusted || e.detail === 0 || performance.now() > swallowUntil) return
  e.preventDefault()
  e.stopImmediatePropagation()
}

let installs = 0

/**
 * Starts tracking presses on the document; ConfigProvider calls it. Counted,
 * so nested providers share one set of listeners. Returns the uninstaller.
 */
export function installPressTracking(haptics: boolean): () => void {
  buzz = haptics
  if (installs++ === 0) {
    const opts = { capture: true, passive: true }
    document.addEventListener('pointerdown', onDown, opts)
    document.addEventListener('pointermove', onMove, opts)
    document.addEventListener('pointerup', onUp, opts)
    document.addEventListener('pointercancel', onCancel, opts)
    document.addEventListener('touchstart', onTouchStart, opts)
    document.addEventListener('touchmove', onTouchMove, opts)
    document.addEventListener('touchend', onTouchEnd, opts)
    document.addEventListener('touchcancel', release, opts)
    document.addEventListener('scroll', onScroll, opts)
    document.addEventListener('contextmenu', onContextMenu, opts)
    document.addEventListener('click', onClick, { capture: true })
  }
  return () => {
    if (--installs > 0) return
    const opts = { capture: true }
    document.removeEventListener('pointerdown', onDown, opts)
    document.removeEventListener('pointermove', onMove, opts)
    document.removeEventListener('pointerup', onUp, opts)
    document.removeEventListener('pointercancel', onCancel, opts)
    document.removeEventListener('touchstart', onTouchStart, opts)
    document.removeEventListener('touchmove', onTouchMove, opts)
    document.removeEventListener('touchend', onTouchEnd, opts)
    document.removeEventListener('touchcancel', release, opts)
    document.removeEventListener('scroll', onScroll, opts)
    document.removeEventListener('contextmenu', onContextMenu, opts)
    document.removeEventListener('click', onClick, opts)
    release()
  }
}
