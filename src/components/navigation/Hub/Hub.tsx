import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import type { Platform } from '../../../config/theme'
import { cx } from '../../../utils'

export interface HubSection {
  key: string
  /** The section's header, lowercase and light. */
  title?: ReactNode
  content: ReactNode
  /** On the desktop: the section's width (px or any CSS length). Default 400px. On a phone every section is full width. */
  width?: number | string
}

export interface HubProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The big title across the top. It may run past the edge, as on Windows Phone. */
  title?: ReactNode
  sections: HubSection[]
  /** A background image URL. It slides slower than the sections (parallax). */
  background?: string
  /** How fast the background moves, as a share of the scroll. Default 0.25; the title moves at twice that. */
  parallax?: number
  /** Force a form: `mobile` is the panorama (full-width panels, one per swipe). Default: the provider's platform. */
  platform?: Platform | 'auto'
  /** The heading level of the title; sections are one below. Default 1. */
  headingLevel?: 1 | 2 | 3 | 4 | 5
  ref?: Ref<HTMLDivElement>
}

/**
 * The Windows 8 hub and the Windows Phone panorama: a big light title over
 * sections that scroll sideways, with the background drifting behind them.
 * On a phone each section is one full-width panel.
 */
export function Hub(props: HubProps) {
  const { title, sections, background, parallax = 0.25, platform, headingLevel = 1, className, style, ...rest } = useDefaults('Hub', props)
  const config = useConfig()
  const form = platform && platform !== 'auto' ? platform : config.platform
  const scroller = useRef<HTMLDivElement>(null)
  const bg = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const still = config.reducedMotion || parallax === 0

  // Parallax: transforms written once a frame, straight to the elements.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    if (still) {
      if (bg.current) bg.current.style.transform = ''
      if (head.current) head.current.style.transform = ''
      return
    }
    let frame = 0
    const paint = () => {
      frame = 0
      const x = el.scrollLeft
      if (bg.current) bg.current.style.transform = `translate3d(${-x * parallax}px, 0, 0)`
      if (head.current) head.current.style.transform = `translate3d(${-x * parallax * 2}px, 0, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    paint()
    return () => {
      el.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [still, parallax])

  // A mouse wheel scrolls the hub sideways, unless what's under it scrolls up and down itself.
  useEffect(() => {
    const el = scroller.current
    if (!el || form === 'mobile') return
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY) || el.scrollWidth <= el.clientWidth) return
      for (let n = e.target instanceof Element ? e.target : null; n && n !== el; n = n.parentElement) {
        if (n.scrollHeight > n.clientHeight && /(auto|scroll)/.test(getComputedStyle(n).overflowY)) return
      }
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [form])

  const Title = `h${headingLevel}` as 'h1'
  const SectionTitle = `h${headingLevel + 1}` as 'h2'

  return (
    <div {...rest} className={cx('mt-hub', className)} style={style} data-platform={form}>
      {background && <div ref={bg} className="mt-hub-bg" style={{ backgroundImage: `url("${background}")` }} aria-hidden />}
      {title != null && (
        <div className="mt-hub-head">
          <div ref={head} className="mt-hub-title-track">
            <Title className="mt-hub-title">{title}</Title>
          </div>
        </div>
      )}
      <div ref={scroller} className="mt-hub-sections">
        {sections.map((s) => (
          <section
            key={s.key}
            className="mt-hub-section"
            aria-label={typeof s.title === 'string' ? s.title : undefined}
            style={form === 'desktop' && s.width != null ? ({ '--_w': typeof s.width === 'number' ? `${s.width}px` : s.width } as CSSProperties) : undefined}
          >
            {s.title != null && <SectionTitle className="mt-hub-section-title">{s.title}</SectionTitle>}
            <div className="mt-hub-section-body">{s.content}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
