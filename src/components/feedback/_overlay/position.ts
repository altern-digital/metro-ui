/*
 * Anchored positioning, small enough to own: place a box beside an anchor,
 * flip to the other side when it doesn't fit, then clamp it into the
 * viewport. Pure, so it is tested without layout.
 */

export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'end'
/** Where a floating panel sits against its anchor. Without `-start`/`-end` it is centred on it. */
export type Placement = Side | `${Side}-${Align}`

export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export interface Position {
  top: number
  left: number
  /** The placement used, after any flip. */
  placement: Placement
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

export function splitPlacement(placement: Placement): [Side, Align | undefined] {
  const [side, align] = placement.split('-') as [Side, Align | undefined]
  return [side, align]
}

/**
 * Where to put a box of `size` against `anchor`, in viewport coordinates.
 * `offset` is the gap to the anchor, `margin` the room kept from the
 * viewport's edges.
 */
export function computePosition(anchor: Rect, size: Size, viewport: Size, placement: Placement, offset = 4, margin = 4): Position {
  let [side, align] = splitPlacement(placement)
  const vertical = side === 'top' || side === 'bottom'
  const right = anchor.left + anchor.width
  const bottom = anchor.top + anchor.height

  // Room on each side, between the anchor (plus the gap) and the margin.
  const room: Record<Side, number> = {
    top: anchor.top - offset - margin,
    bottom: viewport.height - bottom - offset - margin,
    left: anchor.left - offset - margin,
    right: viewport.width - right - offset - margin,
  }
  const need = vertical ? size.height : size.width
  if (room[side] < need && room[OPPOSITE[side]] > room[side]) side = OPPOSITE[side]

  let top: number
  let left: number
  if (vertical) {
    top = side === 'bottom' ? bottom + offset : anchor.top - offset - size.height
    left = align === 'start' ? anchor.left : align === 'end' ? right - size.width : anchor.left + anchor.width / 2 - size.width / 2
  } else {
    left = side === 'right' ? right + offset : anchor.left - offset - size.width
    top = align === 'start' ? anchor.top : align === 'end' ? bottom - size.height : anchor.top + anchor.height / 2 - size.height / 2
  }

  return {
    top: clampInto(top, size.height, viewport.height, margin),
    left: clampInto(left, size.width, viewport.width, margin),
    placement: align ? `${side}-${align}` : side,
  }
}

// Keeps [start, start + length] inside [margin, total - margin]; the start edge wins when it can't fit.
function clampInto(start: number, length: number, total: number, margin: number) {
  return Math.max(margin, Math.min(start, total - length - margin))
}

/** A zero-size rect at a point, for menus opened where the pointer is. */
export const pointRect = (x: number, y: number): Rect => ({ top: y, left: x, width: 0, height: 0 })
