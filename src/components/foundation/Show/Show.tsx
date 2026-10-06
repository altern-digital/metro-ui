import type { ReactNode } from 'react'
import { useConfig } from '../../../config/context'
import type { Platform } from '../../../config/theme'

export interface ShowProps {
  /** Show from this breakpoint up. */
  from?: 'medium' | 'expanded'
  /** Show below this breakpoint. */
  below?: 'medium' | 'expanded'
  /** Show only under a finger, or only with a mouse. */
  pointer?: 'coarse' | 'fine'
  children?: ReactNode
}

/**
 * Shows its children at some widths only, in CSS: right on the server's
 * first render, with no flash. Both forms are in the page, so for heavy
 * subtrees prefer `<Adaptive>`.
 */
export function Show({ from, below, pointer, children }: ShowProps) {
  return (
    <div className="mt-show" data-from={from} data-below={below} data-pointer={pointer}>
      {children}
    </div>
  )
}

export interface AdaptiveProps {
  mobile?: ReactNode
  desktop?: ReactNode
  /** Override the provider's platform here. */
  platform?: Platform
}

/**
 * Renders one form or the other, by the provider's platform (mobile under
 * 641px unless forced). Only the chosen form mounts.
 */
export function Adaptive({ mobile, desktop, platform }: AdaptiveProps) {
  const config = useConfig()
  return <>{(platform ?? config.platform) === 'mobile' ? mobile : desktop}</>
}
