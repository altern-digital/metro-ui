import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { cloneElement, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode } from 'react'
import { useConfig, useDefaults, useLocale } from '../../../config/context'
import { useAdaptive } from '../../../hooks/useAdaptive'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { BottomSheet } from '../BottomSheet/BottomSheet'
import { Floating } from '../_overlay/Floating'
import { CheckGlyph, ChevronRightGlyph } from '../_overlay/glyphs'
import type { Placement, Rect } from '../_overlay/position'
import { chain, type TriggerElement } from '../_overlay/trigger'

export type MenuItem = {
  key: string
  label?: ReactNode
  icon?: IconSource
  /** Shown on the right on the desktop, e.g. `Ctrl+C`. Hidden in the sheet. */
  shortcut?: string
  onSelect?: () => void
  danger?: boolean
  disabled?: boolean
  /** A tick: `true` or `false` makes it a checkable item; leave it out for a plain one. */
  checked?: boolean
  /** A line between groups. Only `key` matters on a divider. */
  divider?: boolean
  /** A submenu. */
  items?: MenuItem[]
}

export interface MenuFlyoutProps {
  items: MenuItem[]
  /** The trigger: one element that takes a ref, such as a Button. */
  children: ReactElement
  /** Default `bottom-start`. */
  placement?: Placement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** `auto` (default) follows the provider: a popup menu on the desktop, a bottom sheet on mobile. */
  platform?: 'auto' | 'mobile' | 'desktop'
  /** Names the menu for screen readers. */
  'aria-label'?: string
  className?: string
}

/**
 * A Windows 10 MenuFlyout: lowercase rows with icons, ticks, shortcuts and
 * submenus, driven by the keyboard. On mobile it is a bottom sheet of big
 * rows, Windows Phone style.
 *
 * ```tsx
 * <MenuFlyout items={[{ key: 'copy', label: 'copy', onSelect: copy }]}>
 *   <Button>edit</Button>
 * </MenuFlyout>
 * ```
 */
export function MenuFlyout(props: MenuFlyoutProps) {
  const { items, children, placement = 'bottom-start', open, defaultOpen, onOpenChange, platform = 'auto', className, 'aria-label': ariaLabel } = useDefaults('MenuFlyout', props)
  const [isOpen, setOpen] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  const sheet = useAdaptive({ mobile: true, desktop: false }, platform)
  const menuId = useId()
  const triggerRef = useRef<HTMLElement>(null)
  const [focus, setFocus] = useState<MenuFocus>('menu')
  const child = children as TriggerElement
  const ref = useMergedRef(child.props.ref, triggerRef)

  const close = (restore: boolean) => {
    setOpen(false)
    if (restore) triggerRef.current?.focus({ preventScroll: true })
  }
  const openWith = (how: MenuFocus) => {
    setFocus(how)
    setOpen(true)
  }

  const p = child.props
  const trigger = cloneElement(child, {
    ref,
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? menuId : undefined,
    // A keyboard click (detail 0) lands on the first item; a pointer only opens.
    onClick: chain(p.onClick, (e: MouseEvent) => (isOpen ? close(false) : openWith(e.detail === 0 ? 'first' : 'menu'))),
    onKeyDown: chain(p.onKeyDown, (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      openWith(e.key === 'ArrowDown' ? 'first' : 'last')
    }),
  })

  return (
    <>
      {trigger}
      {sheet ? (
        <MenuSheet open={isOpen} items={items} onClose={close} id={menuId} className={className} aria-label={ariaLabel} />
      ) : (
        <MenuLevel
          open={isOpen}
          items={items}
          anchor={() => triggerRef.current?.getBoundingClientRect() ?? null}
          placement={placement}
          focus={focus}
          closeAll={close}
          ignore={() => [triggerRef.current]}
          id={menuId}
          className={className}
          aria-label={ariaLabel}
        />
      )}
    </>
  )
}

// ── Shared with ContextMenu ───────────────────────────────────────────────

/** Where focus goes when a menu opens: the first or last item, or the menu itself (a pointer opened it). */
export type MenuFocus = 'first' | 'last' | 'menu' | 'none'

const ITEM = '[role^="menuitem"]:not([aria-disabled="true"])'
const TYPEAHEAD_MS = 600

export interface MenuLevelProps {
  open: boolean
  items: MenuItem[]
  anchor: () => Rect | null
  placement: Placement
  focus: MenuFocus
  /** Closes the whole menu; `restore` puts focus back where it came from. */
  closeAll: (restore: boolean) => void
  /** Closes just this submenu (it has a parent). */
  closeSelf?: () => void
  ignore?: () => (Element | null | undefined)[]
  offset?: number
  id?: string
  className?: string
  'aria-label'?: string
}

/** One popup level of a desktop menu. Submenus are levels nested beside their item. */
export function MenuLevel({ open, items, anchor, placement, focus, closeAll, closeSelf, ignore, offset, id, className, 'aria-label': ariaLabel }: MenuLevelProps) {
  const { coarse } = useConfig()
  const panel = useRef<HTMLDivElement>(null)
  const [sub, setSub] = useState<{ key: string; focus: MenuFocus } | null>(null)
  const typed = useRef({ text: '', at: 0 })
  const nested = closeSelf !== undefined

  const enabled = () => [...(panel.current?.querySelectorAll<HTMLElement>(ITEM) ?? [])]
  const step = (by: number) => {
    const list = enabled()
    if (list.length === 0) return
    const i = list.indexOf(document.activeElement as HTMLElement)
    const next = i < 0 ? (by > 0 ? 0 : list.length - 1) : (i + by + list.length) % list.length
    list[next]!.focus()
  }

  const placeFocus = (el: HTMLElement) => {
    const list = enabled()
    if (focus === 'first') (list[0] ?? el).focus({ preventScroll: true })
    else if (focus === 'last') (list.at(-1) ?? el).focus({ preventScroll: true })
    else if (focus === 'menu') el.focus({ preventScroll: true })
  }

  const choose = (item: MenuItem) => {
    if (item.disabled) return
    if (item.items) return setSub({ key: item.key, focus: 'first' })
    closeAll(true)
    item.onSelect?.()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Keys in a submenu bubble here through the portal; they are its business.
    if (!panel.current?.contains(e.target as Node)) return
    const current = (e.target as HTMLElement).closest<HTMLElement>('[role^="menuitem"]')
    const item = current ? items.find((it) => it.key === current.dataset.key) : undefined
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        return step(1)
      case 'ArrowUp':
        e.preventDefault()
        return step(-1)
      case 'Home':
        e.preventDefault()
        return enabled()[0]?.focus()
      case 'End':
        e.preventDefault()
        return enabled().at(-1)?.focus()
      case 'ArrowRight':
        if (item?.items && !item.disabled) {
          e.preventDefault()
          setSub({ key: item.key, focus: 'first' })
        }
        return
      case 'ArrowLeft':
        if (nested) {
          e.preventDefault()
          closeSelf()
        }
        return
      case 'Tab':
        e.preventDefault()
        return closeAll(true)
    }
    // Typing jumps to the next item starting with what was typed.
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const now = performance.now()
      typed.current = { text: (now - typed.current.at < TYPEAHEAD_MS ? typed.current.text : '') + e.key.toLowerCase(), at: now }
      const list = enabled()
      const from = Math.max(0, list.indexOf(current!))
      const query = typed.current.text
      const order = [...list.slice(from + (query.length === 1 ? 1 : 0)), ...list.slice(0, from + (query.length === 1 ? 1 : 0))]
      const match = order.find((el) => (el.querySelector('.mt-menu-label')?.textContent ?? '').trim().toLowerCase().startsWith(query))
      if (match) {
        e.preventDefault()
        match.focus()
      }
    }
  }

  return (
    <Floating
      open={open}
      anchor={anchor}
      placement={placement}
      offset={offset}
      id={id}
      role="menu"
      aria-label={ariaLabel}
      tabIndex={-1}
      className={cx('mt-menu', className)}
      data-coarse={flag(coarse)}
      ref={panel}
      // Only the outermost level listens for presses outside; submenus count as inside it.
      closeOnOutside={!nested}
      ignore={ignore}
      onClose={(reason) => (nested ? closeSelf() : closeAll(reason === 'escape'))}
      onPlaced={placeFocus}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item) =>
        item.divider ? (
          <div key={item.key} className="mt-menu-divider" role="separator" />
        ) : (
          <MenuRow
            key={item.key}
            item={item}
            expanded={sub?.key === item.key}
            onChoose={choose}
            onHover={(it) => setSub(it.items && !it.disabled ? { key: it.key, focus: 'none' } : null)}
          >
            {item.items && (
              <SubLevel
                item={item}
                open={open && sub?.key === item.key}
                focus={sub?.focus ?? 'none'}
                closeAll={closeAll}
                closeSub={() => setSub(null)}
              />
            )}
          </MenuRow>
        ),
      )}
    </Floating>
  )
}

function MenuRow({ item, expanded, onChoose, onHover, children }: { item: MenuItem; expanded: boolean; onChoose: (item: MenuItem) => void; onHover: (item: MenuItem) => void; children?: ReactNode }) {
  const checkable = item.checked !== undefined
  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        role={checkable ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={checkable ? item.checked : undefined}
        aria-disabled={item.disabled || undefined}
        aria-haspopup={item.items ? 'menu' : undefined}
        aria-expanded={item.items ? expanded : undefined}
        data-key={item.key}
        data-danger={flag(item.danger)}
        data-expanded={flag(expanded)}
        className="mt-menu-item"
        data-mt-press=""
        onClick={() => onChoose(item)}
        // The mouse moves focus, as Windows menus do; a finger shows its press instead.
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse' || item.disabled) return
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.focus({ preventScroll: true })
            onHover(item)
          }
        }}
      >
        <MenuRowContent item={item} desktop />
      </button>
      {children}
    </>
  )
}

function MenuRowContent({ item, desktop }: { item: MenuItem; desktop?: boolean }) {
  return (
    <>
      <span className="mt-menu-icon" aria-hidden>
        {item.checked ? <CheckGlyph /> : item.icon != null ? renderIcon(item.icon) : null}
      </span>
      <span className="mt-menu-label">{item.label}</span>
      {desktop && item.shortcut && !item.items && <span className="mt-menu-shortcut">{item.shortcut}</span>}
      {item.items && (
        <span className="mt-menu-chevron" aria-hidden>
          <ChevronRightGlyph />
        </span>
      )}
    </>
  )
}

function SubLevel({ item, open, focus, closeAll, closeSub }: { item: MenuItem; open: boolean; focus: MenuFocus; closeAll: (restore: boolean) => void; closeSub: () => void }) {
  const row = () => document.querySelector<HTMLElement>(`.mt-menu-item[data-key="${CSS.escape(item.key)}"][aria-expanded="true"]`)
  return (
    <MenuLevel
      open={open}
      items={item.items!}
      anchor={() => row()?.getBoundingClientRect() ?? null}
      placement="right-start"
      offset={-2}
      focus={focus}
      closeAll={closeAll}
      closeSelf={() => {
        const el = row()
        closeSub()
        el?.focus({ preventScroll: true })
      }}
      aria-label={typeof item.label === 'string' ? item.label : undefined}
    />
  )
}

// ── Mobile: a sheet of big rows; submenus drill in ────────────────────────

export interface MenuSheetProps {
  open: boolean
  items: MenuItem[]
  onClose: (restore: boolean) => void
  id?: string
  className?: string
  'aria-label'?: string
}

export function MenuSheet({ open, items, onClose, id, className, 'aria-label': ariaLabel }: MenuSheetProps) {
  const [path, setPath] = useState<MenuItem[]>([])
  const locale = useLocale()
  const parent = path.at(-1)
  const list = parent?.items ?? items

  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => !next && onClose(false)}
      onExitComplete={() => setPath([])}
      title={parent?.label}
      fit
      snapPoints={[0.85]}
      className={cx('mt-menu-sheet', className)}
      role="none"
    >
      <div role="menu" id={id} aria-label={ariaLabel ?? (typeof parent?.label === 'string' ? parent.label : undefined)} className="mt-menu-sheet-list">
        {parent && (
          <button type="button" className="mt-menu-item mt-menu-back" role="menuitem" data-mt-press="" onClick={() => setPath(path.slice(0, -1))}>
            <span className="mt-menu-icon" aria-hidden>
              <span className="mt-menu-back-glyph">
                <ChevronRightGlyph />
              </span>
            </span>
            <span className="mt-menu-label">{path.length > 1 ? path.at(-2)!.label : locale.back}</span>
          </button>
        )}
        {list.map((item) =>
          item.divider ? (
            <div key={item.key} className="mt-menu-divider" role="separator" />
          ) : (
            <button
              key={item.key}
              type="button"
              role={item.checked !== undefined ? 'menuitemcheckbox' : 'menuitem'}
              aria-checked={item.checked}
              aria-disabled={item.disabled || undefined}
              aria-haspopup={item.items ? 'menu' : undefined}
              data-key={item.key}
              data-danger={flag(item.danger)}
              className="mt-menu-item"
              data-mt-press=""
              onClick={() => {
                if (item.disabled) return
                if (item.items) return setPath([...path, item])
                onClose(false)
                item.onSelect?.()
              }}
            >
              <MenuRowContent item={item} />
            </button>
          ),
        )}
      </div>
    </BottomSheet>
  )
}
