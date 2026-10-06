import { useClickOutside, useFocusTrap, useUncontrolled } from '@mantine/hooks'
import { AnimatePresence, m, type Variants } from 'motion/react'
import { Fragment, useEffect, useState, type ElementType, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import { enter, exit } from '../../../motion/curves'
import { fade, presence, sheet } from '../../../motion/variants'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { Portal } from '../../foundation/Portal/Portal'
import { BottomTabBar, type BottomTabItem } from '../../mobile/BottomTabBar/BottomTabBar'

export interface NavItem {
  key: string
  label: ReactNode
  icon?: IconSource
  /** Render the row as a link (through `linkComponent`). */
  href?: string
  /** A count or short text at the row's end. */
  badge?: ReactNode
  /** Children, one level deep. The row then folds them open instead of being selected. */
  items?: NavItem[]
  disabled?: boolean
}

/** `expanded`: a full pane. `compact`: icons only; the menu button lays the full pane over the content. `minimal`: no pane, a menu button in a top bar. `bottom`: a tab bar along the bottom. */
export type NavigationViewMode = 'auto' | 'expanded' | 'compact' | 'minimal' | 'bottom'

export interface NavigationViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  items: NavItem[]
  /** Rows pinned to the bottom of the pane (settings, account). */
  footerItems?: NavItem[]
  /** The selected item's key. */
  value?: string | null
  defaultValue?: string | null
  onChange?: (key: string) => void
  /** The title next to the menu button. */
  header?: ReactNode
  /** The page. */
  children?: ReactNode
  /** Default `auto`: `expanded` from 1008px, `compact` from 641px, `bottom` on a phone. */
  mode?: NavigationViewMode
  /** The component links render with, e.g. Next.js `Link`. Receives `href`, `className`, `children`… Default `a`. */
  linkComponent?: ElementType
  /** Remember whether the expanded pane was collapsed, under this localStorage key. */
  storageKey?: string
  /** Start with the expanded pane collapsed to icons. */
  defaultCollapsed?: boolean
  /** How many items the bottom bar shows before "more". Default 4. */
  bottomItems?: number
  /** Where the bottom bar and its "more" panel sit: on the viewport (`fixed`, default) or on this component's box (`absolute`). */
  position?: 'fixed' | 'absolute'
  ref?: Ref<HTMLDivElement>
}

const MORE = '\u0000more'

const Burger = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" aria-hidden fill="currentColor">
    <rect x="1" y="3" width="14" height="1.25" />
    <rect x="1" y="7.4" width="14" height="1.25" />
    <rect x="1" y="11.75" width="14" height="1.25" />
  </svg>
)
const Chevron = ({ open }: { open: boolean }) => (
  <svg className="mt-navigation-view-chevron" data-open={flag(open)} width="1em" height="1em" viewBox="0 0 16 16" aria-hidden>
    <path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" strokeWidth="1.25" />
  </svg>
)
const Dots = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" aria-hidden fill="currentColor">
    <rect x="2" y="7" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="12" y="7" width="2" height="2" />
  </svg>
)

/** The full pane laid over a compact one: it slides out from the left edge. */
const paneOverlay: Variants = {
  initial: { x: '-30%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: enter(0.25) },
  exit: { x: '-30%', opacity: 0, transition: exit(0.15) },
}

const hasChildren = (item: NavItem) => !!item.items?.length
const contains = (item: NavItem, key: string | null) => key != null && !!item.items?.some((c) => c.key === key)

/** Arrow keys move between the rows of a list. */
function moveFocus(e: KeyboardEvent<HTMLElement>) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
  const rows = [...e.currentTarget.querySelectorAll<HTMLElement>('.mt-navigation-view-item:not(:disabled):not([aria-disabled="true"])')]
  if (!rows.length) return
  e.preventDefault()
  const at = rows.indexOf(document.activeElement as HTMLElement)
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? rows.length - 1 : e.key === 'ArrowDown' ? Math.min(rows.length - 1, at + 1) : Math.max(0, at - 1)
  rows[next]?.focus()
}

/**
 * Windows 10's NavigationView: a left pane of icon-and-label rows beside the
 * page. It folds to an icon strip on a tablet, and on a phone becomes a tab
 * bar along the bottom with the rest under "more".
 */
export function NavigationView(props: NavigationViewProps) {
  const {
    items,
    footerItems = [],
    value,
    defaultValue,
    onChange,
    header,
    children,
    mode = 'auto',
    linkComponent,
    storageKey,
    defaultCollapsed = false,
    bottomItems = 4,
    position = 'fixed',
    className,
    'aria-label': ariaLabel,
    ...rest
  } = useDefaults('NavigationView', props)
  const config = useConfig()
  const { locale } = config
  const [selected, setSelected] = useUncontrolled<string | null>({ value, defaultValue, finalValue: null, onChange: (key) => key != null && onChange?.(key) })
  const resolved: Exclude<NavigationViewMode, 'auto'> =
    mode !== 'auto' ? mode : config.platform === 'mobile' ? 'bottom' : config.breakpoint === 'expanded' ? 'expanded' : 'compact'

  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [overlay, setOverlay] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set([...items, ...footerItems].filter((i) => contains(i, selected)).map((i) => i.key)))
  const Link = (linkComponent ?? 'a') as ElementType

  useEffect(() => {
    if (!storageKey) return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) setCollapsed(stored === '1')
    } catch {
      // Storage may be blocked; the default stands.
    }
  }, [storageKey])

  // The overlay only belongs to the modes that have one.
  useEffect(() => {
    if (resolved !== 'compact' && resolved !== 'minimal') setOverlay(false)
    if (resolved !== 'bottom') setMoreOpen(false)
  }, [resolved])

  useEffect(() => {
    if (!overlay && !moreOpen) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOverlay(false)
      setMoreOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [overlay, moreOpen])

  const overlayRef = useClickOutside<HTMLElement>(() => setOverlay(false), null, [], overlay)
  const trap = useFocusTrap(moreOpen)

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsed(next)
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, next ? '1' : '0')
    } catch {
      // Not remembered, but still toggled.
    }
  }

  const toggleGroup = (key: string, open?: boolean) =>
    setOpenGroups((all) => {
      const next = new Set(all)
      if (open ?? !next.has(key)) next.add(key)
      else next.delete(key)
      return next
    })

  const choose = (key: string) => {
    setSelected(key)
    setOverlay(false)
    setMoreOpen(false)
  }

  /** One row. `wide`: icon and label; otherwise an icon only. */
  const row = (item: NavItem, wide: boolean, depth = 0): ReactNode => {
    const group = hasChildren(item)
    const open = group && openGroups.has(item.key)
    const current = item.key === selected || (group && (!open || !wide) && contains(item, selected))
    const inner = (
      <>
        <span className="mt-navigation-view-icon">{renderIcon(item.icon)}</span>
        <span className={wide ? 'mt-navigation-view-label' : 'mt-visually-hidden'}>{item.label}</span>
        {item.badge != null && item.badge !== false && (
          <span className="mt-navigation-view-badge" data-dot={flag(!wide)}>
            {wide ? item.badge : null}
          </span>
        )}
        {wide && group && <Chevron open={open} />}
      </>
    )
    const shared = {
      className: 'mt-navigation-view-item',
      'data-selected': flag(current),
      'data-depth': depth || undefined,
      'data-mt-press': '',
      'data-mt-hover': '',
      title: !wide && typeof item.label === 'string' ? item.label : undefined,
    }
    let node: ReactNode
    if (group)
      node = (
        <button
          {...shared}
          type="button"
          aria-expanded={wide ? open : false}
          disabled={item.disabled}
          onClick={() => {
            if (wide) return toggleGroup(item.key)
            toggleGroup(item.key, true)
            if (resolved === 'expanded') toggleCollapsed()
            else setOverlay(true)
          }}
        >
          {inner}
        </button>
      )
    else if (item.href !== undefined)
      node = (
        <Link
          {...shared}
          href={item.href}
          aria-current={current ? 'page' : undefined}
          aria-disabled={item.disabled || undefined}
          tabIndex={item.disabled ? -1 : undefined}
          onClick={(e: { preventDefault(): void }) => (item.disabled ? e.preventDefault() : choose(item.key))}
        >
          {inner}
        </Link>
      )
    else
      node = (
        <button {...shared} type="button" aria-current={current ? 'page' : undefined} disabled={item.disabled} onClick={() => choose(item.key)}>
          {inner}
        </button>
      )
    return (
      <Fragment key={item.key}>
        {node}
        {wide && open && (
          <div role="group" className="mt-navigation-view-group">
            {item.items!.map((child) => row(child, true, 1))}
          </div>
        )}
      </Fragment>
    )
  }

  const pane = (wide: boolean, floating: boolean) => (
    <m.nav
      key={floating ? 'overlay' : 'pane'}
      ref={floating ? overlayRef : undefined}
      aria-label={ariaLabel ?? locale.menu}
      className="mt-navigation-view-pane"
      data-wide={flag(wide)}
      data-floating={flag(floating)}
      {...(floating ? { variants: paneOverlay, ...presence } : {})}
    >
      <div className="mt-navigation-view-pane-top">
        {resolved !== 'minimal' || floating ? (
          <button
            type="button"
            className="mt-navigation-view-burger"
            aria-label={locale.menu}
            aria-expanded={wide}
            onClick={() => (resolved === 'expanded' ? toggleCollapsed() : setOverlay(!overlay))}
            data-mt-press=""
            data-mt-hover=""
          >
            <Burger />
          </button>
        ) : null}
        {wide && header != null && <div className="mt-navigation-view-title">{header}</div>}
      </div>
      <div className="mt-navigation-view-items" onKeyDown={moveFocus}>
        {items.map((item) => row(item, wide))}
      </div>
      {footerItems.length > 0 && (
        <div className="mt-navigation-view-items mt-navigation-view-footer" onKeyDown={moveFocus}>
          {footerItems.map((item) => row(item, wide))}
        </div>
      )}
    </m.nav>
  )

  const topBar = (burger: boolean) =>
    burger || header != null ? (
      <div className="mt-navigation-view-top">
        {burger && (
          <button
            type="button"
            className="mt-navigation-view-burger"
            aria-label={locale.menu}
            aria-expanded={overlay}
            onClick={() => setOverlay(!overlay)}
            data-mt-press=""
            data-mt-hover=""
          >
            <Burger />
          </button>
        )}
        {header != null && <div className="mt-navigation-view-title">{header}</div>}
      </div>
    ) : null

  const root = (body: ReactNode) => (
    <div {...rest} className={cx('mt-navigation-view', className)} data-mode={resolved} data-position={position}>
      {body}
    </div>
  )

  if (resolved === 'bottom') {
    const leaves = items.filter((i) => !hasChildren(i))
    const fits = footerItems.length === 0 && leaves.length === items.length && items.length <= bottomItems + 1
    const inBar = fits ? items : leaves.slice(0, bottomItems)
    const overflow = [...items.filter((i) => !inBar.includes(i)), ...footerItems]
    const barItems: BottomTabItem[] = inBar.map(({ key, label, icon, badge, href, disabled }) => ({ key, label, icon, badge, href, disabled }))
    if (overflow.length) barItems.push({ key: MORE, label: locale.more, icon: <Dots /> })
    const barValue = inBar.some((i) => i.key === selected) ? selected : selected != null && overflow.some((i) => i.key === selected || contains(i, selected)) ? MORE : null
    const Layer = position === 'fixed' ? Portal : Fragment

    return root(
      <>
        <div className="mt-navigation-view-main">
          {topBar(false)}
          <div className="mt-navigation-view-content">{children}</div>
        </div>
        <BottomTabBar
          items={barItems}
          value={barValue}
          onChange={(key) => (key === MORE ? setMoreOpen(true) : choose(key))}
          linkComponent={linkComponent}
          position={position}
          aria-label={ariaLabel ?? locale.menu}
        />
        <AnimatePresence>
          {moreOpen && (
            <Layer key="more">
              <div className="mt-navigation-view-sheet-layer" data-position={position}>
                <m.div className="mt-navigation-view-scrim" variants={fade} {...presence} onClick={() => setMoreOpen(false)} />
                <m.div ref={trap} role="dialog" aria-modal="true" aria-label={locale.more} className="mt-navigation-view-sheet" variants={sheet} {...presence}>
                  <div className="mt-navigation-view-items" onKeyDown={moveFocus}>
                    {overflow.map((item) =>
                      hasChildren(item) ? (
                        <div key={item.key} role="group" aria-label={typeof item.label === 'string' ? item.label : undefined}>
                          <div className="mt-navigation-view-heading">{item.label}</div>
                          {item.items!.map((child) => row(child, true))}
                        </div>
                      ) : (
                        row(item, true)
                      ),
                    )}
                  </div>
                </m.div>
              </div>
            </Layer>
          )}
        </AnimatePresence>
      </>,
    )
  }

  const wide = resolved === 'expanded' && !collapsed
  return root(
    <>
      {resolved !== 'minimal' && pane(wide, false)}
      <div className="mt-navigation-view-main">
        {!wide && topBar(resolved === 'minimal')}
        <div className="mt-navigation-view-content">{children}</div>
      </div>
      <AnimatePresence>{overlay && pane(true, true)}</AnimatePresence>
    </>,
  )
}
