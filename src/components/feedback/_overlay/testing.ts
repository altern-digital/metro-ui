// Test-only helpers for the overlay tests.
import { act } from '@testing-library/react'

/** Lets enter/exit animations finish on real timers (waitFor doesn't advance them under bun). */
export const settle = (ms = 350) => act(() => new Promise<void>((resolve) => setTimeout(resolve, ms)))

// happy-dom rejects `animation.finished` when motion cancels a running
// animation (an overlay closed or unmounted mid-enter), and motion never
// awaits it. A browser treats that as handled; bun fails whichever test is
// running when the frame loop gets to it. Mark the promise handled.
const KEY = Symbol.for('metro-ui.handledAnimationFinish')
const proto = globalThis.Element?.prototype as (Element & Record<symbol, unknown>) | undefined
if (proto && !proto[KEY]) {
  proto[KEY] = true
  const animate = proto.animate
  proto.animate = function (this: Element, ...args: Parameters<Element['animate']>) {
    const animation = animate.apply(this, args)
    animation.finished.catch(() => {})
    return animation
  }
}
