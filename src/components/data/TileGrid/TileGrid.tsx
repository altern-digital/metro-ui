import { m } from 'motion/react'
import type { CSSProperties, HTMLAttributes, Key, ReactNode, Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { stagger } from '../../../motion/variants'
import { cx } from '../../../utils'

export interface TileGroup {
  /** A lowercase heading above the group. */
  title?: ReactNode
  /** Its tiles. */
  tiles: ReactNode
  key?: Key
}

export type TileGridLayout = 'auto' | 'horizontal' | 'vertical'

/** The DOM animation and drag handlers clash with motion's own; the root is a motion element. */
type MotionClash = 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragOver' | 'onDragEnter' | 'onDragLeave' | 'onDrop'

export interface TileGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | MotionClash> {
  /** Named groups of tiles. Without them, `children` are one group. */
  groups?: TileGroup[]
  children?: ReactNode
  /**
   * - `horizontal`: groups side by side, scrolling sideways, as on the Windows 8 Start screen.
   * - `vertical`: groups stacked, as on a phone.
   * - `auto` (default): vertical on mobile, horizontal on desktop.
   */
  layout?: TileGridLayout
  /** Cell size in pixels (or any CSS length). Default `--mt-tile-size` (150px), shrunk to fit two cells across a narrow container. */
  tileSize?: number | string
  /** Space between tiles. Default `--mt-tile-gap` (8px). */
  gap?: number | string
  /** In the horizontal layout, how many medium tiles fit across one group. Default 4. */
  groupColumns?: number
  /** Slide the tiles in one after another. Default true; reduced motion skips it. */
  animate?: boolean
  ref?: Ref<HTMLDivElement>
}

const px = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v)

/**
 * The Start screen: tiles of mixed sizes packed into a grid of half cells,
 * so small, wide and large tiles fill the gaps. Groups sit side by side on
 * the desktop and stack on a phone.
 *
 * ```tsx
 * <TileGrid groups={[{ title: 'life at a glance', tiles: <>…</> }]} />
 * ```
 */
export function TileGrid(props: TileGridProps) {
  const { groups, children, layout = 'auto', tileSize, gap, groupColumns = 4, animate = true, className, style, ...rest } = useDefaults('TileGrid', props)
  const { platform, reducedMotion } = useConfig()
  const resolved = layout === 'auto' ? (platform === 'mobile' ? 'vertical' : 'horizontal') : layout
  const vars = {
    '--_base': px(tileSize),
    '--mt-tile-gap': px(gap),
    '--_cols': groupColumns * 2,
  } as CSSProperties
  const motion = animate && !reducedMotion ? { initial: 'initial', animate: 'animate' } : { initial: false as const, animate: 'animate' }
  const list = groups ?? [{ tiles: children }]

  return (
    <m.div
      {...rest}
      {...motion}
      variants={stagger}
      className={cx('mt-tile-grid', className)}
      style={{ ...vars, ...style }}
      data-layout={resolved}
    >
      {list.map((group, i) => (
        <m.section
          key={group.key ?? i}
          className="mt-tile-grid-group"
          variants={stagger}
          aria-label={typeof group.title === 'string' ? group.title : undefined}
        >
          {group.title != null && <h2 className="mt-tile-grid-title">{group.title}</h2>}
          <div className="mt-tile-grid-cells">{group.tiles}</div>
        </m.section>
      ))}
    </m.div>
  )
}
