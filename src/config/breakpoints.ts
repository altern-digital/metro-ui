/**
 * Windows 10's adaptive breakpoints: a phone under 641px, a tablet or small
 * window under 1008px, and a full window from there.
 */
export const BREAKPOINTS = { medium: 641, expanded: 1008 } as const

export type Breakpoint = 'compact' | 'medium' | 'expanded'

export const MEDIA = {
  compact: `(max-width: ${BREAKPOINTS.medium - 1}px)`,
  medium: `(min-width: ${BREAKPOINTS.medium}px) and (max-width: ${BREAKPOINTS.expanded - 1}px)`,
  expanded: `(min-width: ${BREAKPOINTS.expanded}px)`,
  coarse: '(pointer: coarse)',
  hover: '(hover: hover)',
} as const

export function breakpointOf(width: number): Breakpoint {
  if (width < BREAKPOINTS.medium) return 'compact'
  if (width < BREAKPOINTS.expanded) return 'medium'
  return 'expanded'
}
