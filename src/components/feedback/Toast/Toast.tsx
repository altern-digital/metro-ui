import { AnimatePresence, m, type PanInfo, type TargetAndTransition, type Variants } from 'motion/react'
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { useConfig, useLocale } from '../../../config/context'
import { useLayers, type Layers } from '../../../config/layers'
import { presence, sheet, slideFromRight } from '../../../motion/variants'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { Button } from '../../inputs/Button/Button'
import { CloseGlyph, SEVERITY_GLYPH } from '../_overlay/glyphs'

export type ToastTone = 'neutral' | 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  /** Reuse an id to replace a toast in place (e.g. "uploading…" then "uploaded"). */
  id?: string
  title?: ReactNode
  description?: ReactNode
  /** Default `neutral`. A tone adds a coloured bar and glyph. */
  tone?: ToastTone
  /** Replaces the tone's glyph; `false` hides it. */
  icon?: IconSource | false
  /** One button; pressing it also dismisses the toast. */
  action?: { label: ReactNode; onClick: () => void }
  /** ms before it goes; 0 keeps it until dismissed. Default 5000. Paused while hovered or focused. */
  duration?: number
}

/** A toast by its options, or just its title. */
export type ToastInput = ToastOptions | string

export interface ToastApi {
  /** Shows a toast and returns its id. */
  show(options: ToastInput): string
  success(options: ToastInput): string
  error(options: ToastInput): string
  info(options: ToastInput): string
  warning(options: ToastInput): string
  dismiss(id: string): void
  dismissAll(): void
}

type Entry = ToastOptions & { id: string; version: number }

// ── A tiny external store, one per ConfigProvider ─────────────────────────

class ToastStore {
  entries: Entry[] = []
  mounted = false
  private listeners = new Set<() => void>()
  private seq = 0
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  get = () => this.entries
  private emit(next: Entry[]) {
    this.entries = next
    for (const l of this.listeners) l()
  }
  add(options: ToastOptions): string {
    const id = options.id ?? `metro-toast-${++this.seq}`
    const entry = { ...options, id, version: ++this.seq }
    const at = this.entries.findIndex((e) => e.id === id)
    this.emit(at < 0 ? [...this.entries, entry] : this.entries.map((e, i) => (i === at ? entry : e)))
    return id
  }
  remove(id: string) {
    if (this.entries.some((e) => e.id === id)) this.emit(this.entries.filter((e) => e.id !== id))
  }
  clear() {
    if (this.entries.length) this.emit([])
  }
}

const stores = new WeakMap<Layers, ToastStore>()
const HOST_KEY = 'metro-toasts'

/**
 * Toasts: short messages that come and go on their own. On the desktop they
 * stack at the bottom right, sliding in from the edge; on mobile they are
 * full-width banners above the tab bar that a sideways swipe dismisses.
 * Needs a ConfigProvider above it.
 *
 * ```ts
 * const toast = useToast()
 * toast.success({ title: 'saved', action: { label: 'undo', onClick: undo } })
 * ```
 */
export function useToast(): ToastApi {
  const layers = useLayers()
  return useMemo(() => {
    let store = stores.get(layers)
    if (!store) stores.set(layers, (store = new ToastStore()))
    const s = store
    const show = (input: ToastInput, tone?: ToastTone) => {
      const options = typeof input === 'string' ? { title: input } : input
      if (!s.mounted) {
        s.mounted = true
        layers.set(HOST_KEY, <ToastHost key={HOST_KEY} store={s} />)
      }
      return s.add(tone ? { tone, ...options } : options)
    }
    return {
      show: (o) => show(o),
      success: (o) => show(o, 'success'),
      error: (o) => show(o, 'error'),
      info: (o) => show(o, 'info'),
      warning: (o) => show(o, 'warning'),
      dismiss: (id) => s.remove(id),
      dismissAll: () => s.clear(),
    }
  }, [layers])
}

// ── The host: one live region, rendered once into the provider's layers ───

const MAX = { desktop: 5, mobile: 3 }

function ToastHost({ store }: { store: ToastStore }) {
  const entries = useSyncExternalStore(store.subscribe, store.get, store.get)
  const { platform, locale } = useConfig()
  const visible = entries.slice(-MAX[platform])
  return (
    <section className="mt-toasts" role="region" aria-live="polite" aria-label={locale.notifications} data-platform={platform}>
      <AnimatePresence initial={false}>
        {visible.map((entry) => (
          <ToastItem key={entry.id} entry={entry} mobile={platform === 'mobile'} onDismiss={() => store.remove(entry.id)} />
        ))}
      </AnimatePresence>
    </section>
  )
}

/** Mobile: a banner rises; a swipe sends it off the side it was flung to. */
const banner: Variants = {
  initial: sheet.initial!,
  animate: sheet.animate!,
  exit: (dir: number) => (dir ? { x: `${dir * 100}%`, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } } : (sheet.exit as TargetAndTransition)),
}

const SWIPE_PX = 80
const SWIPE_V = 500

function ToastItem({ entry, mobile, onDismiss }: { entry: Entry; mobile: boolean; onDismiss: () => void }) {
  const locale = useLocale()
  const { title, description, tone = 'neutral', icon, action, duration = 5000 } = entry
  const [swipe, setSwipe] = useState(0)
  const [paused, setPaused] = useState(false)
  const remaining = useRef(duration)
  const dismiss = useRef(onDismiss)
  dismiss.current = onDismiss

  // A replaced toast starts its time again.
  useEffect(() => {
    remaining.current = duration
  }, [entry.version, duration])

  useEffect(() => {
    if (paused || duration <= 0) return
    const started = performance.now()
    const timer = setTimeout(() => dismiss.current(), remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current = Math.max(0, remaining.current - (performance.now() - started))
    }
  }, [paused, duration, entry.version])

  const Glyph = tone === 'neutral' ? null : SEVERITY_GLYPH[tone]
  const glyph = icon === false ? null : icon != null ? renderIcon(icon) : Glyph ? <Glyph /> : null

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < SWIPE_PX && Math.abs(info.velocity.x) < SWIPE_V) return
    setSwipe(Math.sign(info.offset.x || info.velocity.x))
    onDismiss()
  }

  return (
    <m.div
      className="mt-toast"
      data-tone={tone}
      variants={mobile ? banner : slideFromRight}
      custom={swipe}
      {...presence}
      drag={mobile ? 'x' : false}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={mobile ? onDragEnd : undefined}
      onPointerEnter={(e) => e.pointerType !== 'touch' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType !== 'touch' && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setPaused(false)}
    >
      {glyph && (
        <span className="mt-toast-icon" aria-hidden>
          {glyph}
        </span>
      )}
      <div className="mt-toast-text">
        {title != null && <div className="mt-toast-title">{title}</div>}
        {description != null && <div className="mt-toast-description">{description}</div>}
      </div>
      {action && (
        <Button
          variant="text"
          size="sm"
          className="mt-toast-action"
          onClick={() => {
            action.onClick()
            onDismiss()
          }}
        >
          {action.label}
        </Button>
      )}
      <button type="button" className="mt-toast-close" aria-label={locale.close} onClick={onDismiss} data-mt-press="" data-mt-hover="">
        <CloseGlyph />
      </button>
    </m.div>
  )
}
