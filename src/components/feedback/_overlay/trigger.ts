import type { ReactElement, Ref } from 'react'

/** The props a single-child trigger already has, so cloning can chain onto its handlers and ref. */
export type TriggerElement = ReactElement<Record<string, unknown> & { ref?: Ref<HTMLElement> }>

/** Calls the child's own handler first; ours runs unless it prevented the default. */
export function chain<E extends { defaultPrevented: boolean }>(theirs: unknown, ours: (e: E) => void) {
  return (e: E) => {
    if (typeof theirs === 'function') theirs(e)
    if (!e.defaultPrevented) ours(e)
  }
}

/** The first element a panel should focus: one marked `data-autofocus`, else the first tabbable one. */
export function firstFocusable(root: HTMLElement): HTMLElement | null {
  return (
    root.querySelector<HTMLElement>('[data-autofocus]') ??
    root.querySelector<HTMLElement>('input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
  )
}
