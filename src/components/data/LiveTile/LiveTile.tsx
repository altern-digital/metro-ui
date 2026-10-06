import { useIntersection, useMergedRef } from '@mantine/hooks'
import { AnimatePresence, m, type Variants } from 'motion/react'
import { isValidElement, useEffect, useState, type ReactNode } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { enter, exit } from '../../../motion/curves'
import { useTween } from '../../../motion/tween'
import { cx } from '../../../utils'
import { Tile, type TileProps } from '../Tile/Tile'

export type LiveTileEffect = 'slide' | 'flip' | 'peek'

/** A face with a picture: `image` covers it; with `effect="peek"` it slides up to show `content` underneath. */
export interface LiveTileFace {
  content?: ReactNode
  image?: string
}

export interface LiveTileProps extends Omit<TileProps, 'children' | 'count'> {
  /** What the tile cycles through. */
  faces: (ReactNode | LiveTileFace)[]
  /** Milliseconds per face. A small random offset is added so a grid doesn't turn in lockstep. Default 5000. */
  interval?: number
  /**
   * - `slide`: the next face pushes up from the bottom, as on Windows Phone.
   * - `flip`: the tile turns over on its horizontal axis.
   * - `peek`: a face's image slides up to show its content, then the next face comes.
   */
  effect?: LiveTileEffect
  /** A number beside the icon that counts to each new value. */
  counter?: number
  /** Stop cycling. */
  paused?: boolean
}

const isFace = (face: unknown): face is LiveTileFace =>
  typeof face === 'object' && face !== null && !isValidElement(face) && !Array.isArray(face) && ('content' in face || 'image' in face)

const EFFECTS: Record<'slide' | 'flip', Variants> = {
  slide: {
    initial: { y: '100%' },
    animate: { y: '0%', transition: enter(0.6) },
    exit: { y: '-100%', transition: enter(0.6) },
  },
  flip: {
    initial: { rotateX: -90 },
    animate: { rotateX: 0, transition: { ...enter(0.35), delay: 0.2 } },
    exit: { rotateX: 90, transition: exit(0.2) },
  },
}

/**
 * A Tile whose content turns over on its own: news headlines, photos, the
 * next appointment. It stops while the page is hidden, while it's scrolled
 * out of view and under reduced motion (which shows the first face).
 *
 * ```tsx
 * <LiveTile size="wide" tone="orange" title="news" faces={headlines} effect="slide" />
 * ```
 */
export function LiveTile(props: LiveTileProps) {
  const { faces, interval = 5000, effect = 'slide', counter, paused, className, ref, ...rest } = useDefaults('LiveTile', props)
  const { reducedMotion } = useConfig()
  const [step, setStep] = useState(0)
  const [offset] = useState(() => Math.round(Math.random() * 1200))
  const [pageHidden, setPageHidden] = useState(false)
  const { ref: viewRef, entry } = useIntersection<HTMLElement>({ threshold: 0.1 })
  const merged = useMergedRef(ref, viewRef)
  const counted = useTween(counter ?? 0)

  const peek = effect === 'peek'
  const steps = peek ? faces.length * 2 : faces.length
  const running = !paused && !reducedMotion && !pageHidden && (entry ? entry.isIntersecting : true) && steps > 1

  useEffect(() => {
    const update = () => setPageHidden(document.visibilityState === 'hidden')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => setStep((s) => (s + 1) % steps), interval + offset)
    return () => clearTimeout(id)
  }, [running, step, steps, interval, offset])

  const shown = reducedMotion ? 0 : step % Math.max(1, steps)
  const index = peek ? Math.floor(shown / 2) : shown
  const peeked = peek && shown % 2 === 1
  const raw = faces[index]
  const face: LiveTileFace = isFace(raw) ? raw : { content: raw as ReactNode }

  const body = face.content != null && <span className="mt-live-tile-body">{face.content}</span>
  const picture = face.image && <img className="mt-live-tile-image" src={face.image} alt="" draggable={false} />

  return (
    <Tile
      {...rest}
      ref={merged}
      className={cx('mt-live-tile', className)}
      count={counter == null ? undefined : Math.round(counted)}
      data-effect={effect}
      data-face={index}
      data-text-face={face.content != null && !face.image ? '' : undefined}
    >
      <AnimatePresence initial={false}>
        {peek ? (
          <m.span
            key={index}
            className="mt-live-tile-face"
            data-peek={face.image ? '' : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: peeked && face.image ? '-50%' : '0%', transition: enter(0.6) }}
            exit={{ opacity: 0, transition: exit(0.2) }}
          >
            {picture}
            {body}
          </m.span>
        ) : (
          <m.span
            key={index}
            className="mt-live-tile-face"
            variants={EFFECTS[effect]}
            initial="initial"
            animate="animate"
            exit="exit"
            style={effect === 'flip' ? { transformPerspective: 600 } : undefined}
          >
            {picture}
            {body}
          </m.span>
        )}
      </AnimatePresence>
    </Tile>
  )
}
