import { useUncontrolled } from '@mantine/hooks'
import { useRef, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import type { Platform } from '../../../config/theme'
import { useAdaptive } from '../../../hooks/useAdaptive'
import { clamp, cx, flag } from '../../../utils'

export interface SplitViewProps extends HTMLAttributes<HTMLDivElement> {
  /** The master: a list, a navigation tree. */
  pane: ReactNode
  /** The detail. */
  children?: ReactNode
  /** Pane width in px (controlled). */
  paneWidth?: number
  /** Pane width in px at first (uncontrolled). Default 320. */
  defaultPaneWidth?: number
  onPaneWidthChange?: (width: number) => void
  minPaneWidth?: number
  maxPaneWidth?: number
  panePosition?: 'left' | 'right'
  /** A drag handle between the two, also moved with the arrow keys. */
  resizable?: boolean
  /** Hide the pane (desktop form). */
  collapsed?: boolean
  /** Compact form only: show the detail instead of the pane. */
  showDetail?: boolean
  /** Force a form. `auto` (default) follows the provider: one view at a time on a phone. */
  platform?: Platform | 'auto'
  /** The handle's spoken name. */
  resizeLabel?: string
  ref?: Ref<HTMLDivElement>
}

/** Arrow keys move the handle this far; with Shift, four times as far. */
const KEY_STEP = 16

/**
 * Master and detail side by side. On a phone it shows one at a time: the
 * pane, or the detail while `showDetail` is true.
 *
 * ```tsx
 * <SplitView pane={<List … />} showDetail={!!selected} resizable>{detail}</SplitView>
 * ```
 */
export function SplitView(props: SplitViewProps) {
  const t = useLocale()
  const {
    pane,
    children,
    paneWidth,
    defaultPaneWidth = 320,
    onPaneWidthChange,
    minPaneWidth = 200,
    maxPaneWidth = 600,
    panePosition = 'left',
    resizable,
    collapsed,
    showDetail,
    platform,
    resizeLabel = t.resizePane,
    className,
    style,
    ...rest
  } =useDefaults('SplitView', props)
  const compact = useAdaptive({ mobile: true, desktop: false }, platform)
  const [width, setWidth] = useUncontrolled({ value: paneWidth, defaultValue: defaultPaneWidth, finalValue: 320, onChange: onPaneWidthChange })
  const drag = useRef<{ x: number; width: number } | null>(null)
  // A pane on the right grows as the handle moves left.
  const sign = panePosition === 'right' ? -1 : 1
  const resize = (next: number) => {
    const w = Math.round(clamp(next, minPaneWidth, maxPaneWidth))
    if (w !== width) setWidth(w)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    drag.current = { x: e.clientX, width }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) resize(drag.current.width + sign * (e.clientX - drag.current.x))
  }
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? KEY_STEP * 4 : KEY_STEP
    let next: number | undefined
    if (e.key === 'ArrowLeft') next = width - sign * step
    else if (e.key === 'ArrowRight') next = width + sign * step
    else if (e.key === 'Home') next = minPaneWidth
    else if (e.key === 'End') next = maxPaneWidth
    if (next === undefined) return
    e.preventDefault()
    resize(next)
  }

  if (compact) {
    return (
      <div {...rest} className={cx('mt-split-view', className)} style={style} data-compact="">
        {showDetail ? <div className="mt-split-view-detail">{children}</div> : <div className="mt-split-view-pane">{pane}</div>}
      </div>
    )
  }

  return (
    <div
      {...rest}
      className={cx('mt-split-view', className)}
      style={{ '--_pane-w': `${width}px`, ...style } as CSSProperties}
      data-pane-position={panePosition}
      data-collapsed={flag(collapsed)}
    >
      {!collapsed && <div className="mt-split-view-pane">{pane}</div>}
      {!collapsed && resizable && (
        <div
          className="mt-split-view-handle"
          role="separator"
          aria-orientation="vertical"
          aria-label={resizeLabel}
          aria-valuenow={width}
          aria-valuemin={minPaneWidth}
          aria-valuemax={maxPaneWidth}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onKeyDown={onKeyDown}
        />
      )}
      <div className="mt-split-view-detail">{children}</div>
    </div>
  )
}
