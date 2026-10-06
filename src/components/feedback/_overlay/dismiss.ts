import { createContext, useContext, useEffect, useRef } from 'react'

/*
 * What every overlay shares: Escape closes only the topmost one, clicks in a
 * child overlay (a Select's list inside a Popover) don't count as outside
 * its parent, the page stops scrolling under a modal, and focus goes back
 * where it came from.
 */

// ── Escape: a stack, so it closes the innermost overlay only ─────────────

const escapes: { current: () => void }[] = []

function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented || e.isComposing) return
  const top = escapes.at(-1)
  if (!top) return
  e.preventDefault()
  e.stopPropagation()
  top.current()
}

/** Calls `handler` on Escape while `active`, if this is the most recently opened overlay that listens. */
export function useEscape(active: boolean, handler: () => void) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    if (!active) return
    const entry = { current: () => ref.current() }
    if (escapes.push(entry) === 1) document.addEventListener('keydown', onKeyDown)
    return () => {
      const i = escapes.indexOf(entry)
      if (i >= 0) escapes.splice(i, 1)
      if (escapes.length === 0) document.removeEventListener('keydown', onKeyDown)
    }
  }, [active])
}

// ── Ownership: nested overlays are "inside" their parents ─────────────────

/** Space-separated ids of the overlays this one is nested in, itself included. */
export const OwnerContext = createContext('')

/** This overlay's ownership chain, to put on its root as `data-mt-owner` and pass down in OwnerContext. */
export function useOwnerChain(id: string): string {
  const parent = useContext(OwnerContext)
  return parent ? `${parent} ${id}` : id
}

/** Whether an event target sits in overlay `id` or in any overlay nested in it. */
export function isInOverlay(target: EventTarget | null, id: string): boolean {
  return target instanceof Element && target.closest(`[data-mt-owner~="${id}"]`) !== null
}

// ── Scroll lock, counted so stacked modals share it ───────────────────────

let locks = 0
let saved: { overflow: string; paddingRight: string } | null = null

/** Stops the document scrolling while `active`, keeping the scrollbar's width so nothing shifts. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    if (locks++ === 0) {
      const bar = window.innerWidth - root.clientWidth
      saved = { overflow: root.style.overflow, paddingRight: root.style.paddingRight }
      root.style.overflow = 'hidden'
      if (bar > 0) root.style.paddingRight = `${bar}px`
    }
    return () => {
      if (--locks > 0 || !saved) return
      root.style.overflow = saved.overflow
      root.style.paddingRight = saved.paddingRight
      saved = null
    }
  }, [active])
}

// ── Focus return ──────────────────────────────────────────────────────────

/**
 * Puts focus back on `target()` when `open` turns false, but only if focus is
 * still in the overlay (`within`) or nowhere: a click elsewhere keeps the focus it gave.
 */
export function useReturnFocus(open: boolean, target: () => HTMLElement | null | undefined, within: () => Element | null | undefined, enabled = true) {
  const was = useRef(open)
  const targetRef = useRef(target)
  targetRef.current = target
  const withinRef = useRef(within)
  withinRef.current = within
  useEffect(() => {
    if (was.current && !open && enabled) {
      const active = document.activeElement
      const panel = withinRef.current()
      if (!active || active === document.body || (panel && panel.contains(active))) targetRef.current()?.focus({ preventScroll: true })
    }
    was.current = open
  }, [open])
}
