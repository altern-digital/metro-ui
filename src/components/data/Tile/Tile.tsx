import { m } from 'motion/react'
import type { AnchorHTMLAttributes, CSSProperties, HTMLAttributes, MouseEvent, PointerEvent, ReactNode, Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { toneVar, type Tone } from '../../../config/theme'
import { tile as tileVariants } from '../../../motion/variants'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { useToneVars } from '../tone'

export type TileSize = 'small' | 'medium' | 'wide' | 'large'

export interface TileOwnProps {
  /** `small` is a quarter cell, `medium` one cell, `wide` two across, `large` two by two. Cells follow `--mt-tile-size`. */
  size?: TileSize
  /** A Metro tone, a tone from the theme, or any CSS colour. Default the accent. */
  tone?: Tone
  /** Bottom-left name. Hidden on small tiles. */
  title?: ReactNode
  /** Centred on small and medium tiles, top-left on wide and large. */
  icon?: IconSource
  /** A Windows 8 badge, bottom-right: a number or a small glyph. */
  badge?: ReactNode
  /** A big light number beside the icon (unread mail, missed calls). */
  count?: ReactNode
  /** A background image, covering the tile. */
  image?: string
  /** A wash over the image so text reads: `true` darkens it, a tone tints it. */
  imageOverlay?: boolean | Tone
  /** Pressable as a link. */
  href?: string
  disabled?: boolean
  /** Custom content, under the title and badge. */
  children?: ReactNode
}

export type TileProps = TileOwnProps &
  Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel' | 'download'> & { ref?: Ref<HTMLElement> }

/** Most a pressed tile leans, in degrees. */
const TILT = 4

/**
 * The Metro tile: a flat square of colour with a name in its corner. With
 * `href` or `onClick` it is pressable, and leans a little toward the finger
 * as Windows 8 tiles did. In a TileGrid it slides in with its neighbours.
 *
 * ```tsx
 * <Tile size="wide" tone="teal" icon={VscMail} title="mail" badge={3} onClick={open} />
 * ```
 */
export function Tile(props: TileProps) {
  const {
    size = 'medium',
    tone,
    title,
    icon,
    badge,
    count,
    image,
    imageOverlay,
    href,
    disabled,
    className,
    style,
    children,
    onClick,
    onPointerDown,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
    ref,
    ...rest
  } = useDefaults('Tile', props)
  const { reducedMotion } = useConfig()
  const toneVars = useToneVars(tone)
  const pressable = !!href || !!onClick
  const As = href !== undefined ? 'a' : pressable ? 'button' : 'div'

  const lean = (e: PointerEvent<HTMLElement>) => {
    onPointerDown?.(e)
    if (!pressable || disabled || reducedMotion || e.button > 0) return
    const el = e.currentTarget
    const box = el.getBoundingClientRect()
    if (!box.width || !box.height) return
    const x = ((e.clientX - box.left) / box.width) * 2 - 1
    const y = ((e.clientY - box.top) / box.height) * 2 - 1
    // The pressed side sinks: a press at the top tips the top away.
    el.style.setProperty('--_rx', `${(-y * TILT).toFixed(2)}deg`)
    el.style.setProperty('--_ry', `${(x * TILT).toFixed(2)}deg`)
    el.setAttribute('data-tilt', '')
  }
  const settle = (e: PointerEvent<HTMLElement>) => e.currentTarget.removeAttribute('data-tilt')

  const overlay =
    imageOverlay === true ? 'color-mix(in srgb, #000 40%, transparent)' : imageOverlay ? `color-mix(in srgb, ${toneVar(imageOverlay)} 70%, transparent)` : undefined

  const face = (
    <As
      {...rest}
      ref={ref as Ref<never>}
      className={cx('mt-tile', className)}
      style={{ ...toneVars, ...style } as CSSProperties}
      data-size={size}
      data-tone={tone}
      data-pressable={flag(pressable)}
      data-image={flag(!!image)}
      data-mt-press={pressable ? '' : undefined}
      href={href}
      type={As === 'button' ? 'button' : undefined}
      disabled={As === 'button' ? disabled : undefined}
      aria-disabled={As === 'a' && disabled ? true : undefined}
      tabIndex={As === 'a' && disabled ? -1 : undefined}
      onClick={(e: MouseEvent<HTMLElement>) => (disabled ? e.preventDefault() : onClick?.(e))}
      onPointerDown={lean}
      onPointerUp={(e: PointerEvent<HTMLElement>) => (settle(e), onPointerUp?.(e))}
      onPointerLeave={(e: PointerEvent<HTMLElement>) => (settle(e), onPointerLeave?.(e))}
      onPointerCancel={(e: PointerEvent<HTMLElement>) => (settle(e), onPointerCancel?.(e))}
    >
      {image && <img className="mt-tile-image" src={image} alt="" loading="lazy" draggable={false} />}
      {overlay && <span className="mt-tile-overlay" style={{ background: overlay }} />}
      {children != null && <span className="mt-tile-content">{children}</span>}
      {(icon != null || count != null) && (
        <span className="mt-tile-glyph">
          {icon != null && <span className="mt-tile-icon">{renderIcon(icon)}</span>}
          {count != null && <span className="mt-tile-count">{count}</span>}
        </span>
      )}
      {(title != null || badge != null) && (
        <span className="mt-tile-foot">
          {title != null && size !== 'small' && <span className="mt-tile-title">{title}</span>}
          {badge != null && <span className="mt-tile-badge">{badge}</span>}
        </span>
      )}
    </As>
  )

  // The cell takes the grid place and the entrance; the face inside leans when pressed.
  return (
    <m.div className="mt-tile-cell" data-size={size} variants={tileVariants}>
      {face}
    </m.div>
  )
}
