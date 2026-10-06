import { useClickOutside, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { useConfig, useDefaults } from '../../../config/context'
import type { Platform } from '../../../config/theme'
import { bar, folding, presence } from '../../../motion/variants'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { MenuFlyout, type MenuItem } from '../../feedback/MenuFlyout'

export interface CommandItem {
  key: string
  /** Shown with the icon, and its spoken name when the label is hidden. */
  label: string
  icon?: IconSource
  onClick?: () => void
  disabled?: boolean
  /** A toggle command: pressed (`aria-pressed`) and filled when true. */
  toggled?: boolean
}

export interface CommandBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Commands shown as app bar buttons. */
  primary?: CommandItem[]
  /** Commands behind the "…" button. */
  secondary?: CommandItem[]
  /** On the desktop: anything on the left of the bar (a title, a search box). */
  content?: ReactNode
  /** Where button labels sit on the desktop. Default `right`. */
  labels?: 'bottom' | 'right' | 'collapsed'
  /** Force a form. Default: the provider's platform. */
  platform?: Platform | 'auto'
  /** On a phone, where the bar sits: `fixed` (default) to the viewport's bottom, `absolute` to its positioned box's bottom, `static` in the flow. */
  position?: 'fixed' | 'absolute' | 'static'
  /** On a phone: whether the bar is expanded (labels and the secondary commands showing). */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  ref?: Ref<HTMLDivElement>
}

const Dots = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" aria-hidden fill="currentColor">
    <rect x="2" y="7" width="2" height="2" />
    <rect x="7" y="7" width="2" height="2" />
    <rect x="12" y="7" width="2" height="2" />
  </svg>
)

/**
 * Windows 10's CommandBar on the desktop: a bar of square icon buttons with
 * labels, the rest behind "…". On a phone, the Windows Phone app bar: round
 * icons along the bottom edge; "…" lifts it to show the labels and the rest.
 */
export function CommandBar(props: CommandBarProps) {
  const { primary = [], secondary = [], content, labels = 'right', platform, position = 'fixed', open, defaultOpen, onOpenChange, className, ref, ...rest } = useDefaults('CommandBar', props)
  const config = useConfig()
  const { locale } = config
  const form = platform && platform !== 'auto' ? platform : config.platform
  const [expanded, setExpanded] = useUncontrolled({ value: open, defaultValue: defaultOpen, finalValue: false, onChange: onOpenChange })
  const mobile = form === 'mobile'
  const outside = useClickOutside<HTMLDivElement>(() => setExpanded(false), null, [], mobile && expanded)
  const rootRef = useMergedRef(outside, ref)

  useEffect(() => {
    if (!mobile || !expanded) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setExpanded(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobile, expanded, setExpanded])

  const button = (item: CommandItem) => (
    <button
      key={item.key}
      type="button"
      className="mt-command-bar-button"
      disabled={item.disabled}
      aria-pressed={item.toggled === undefined ? undefined : item.toggled}
      aria-label={mobile ? (expanded ? undefined : item.label) : labels === 'collapsed' ? item.label : undefined}
      title={!mobile && labels === 'collapsed' ? item.label : undefined}
      data-toggled={flag(item.toggled)}
      data-mt-press=""
      data-mt-hover=""
      onClick={() => {
        item.onClick?.()
        if (mobile) setExpanded(false)
      }}
    >
      <span className="mt-command-bar-icon">{renderIcon(item.icon)}</span>
      <span className="mt-command-bar-label">{item.label}</span>
    </button>
  )

  if (mobile)
    return (
      <m.div
        {...(rest as object)}
        ref={rootRef}
        role="toolbar"
        className={cx('mt-command-bar', className)}
        data-platform="mobile"
        data-position={position}
        data-open={flag(expanded)}
        variants={bar}
        {...presence}
      >
        <div className="mt-command-bar-row">
          <div className="mt-command-bar-primary">{primary.map(button)}</div>
          <button
            type="button"
            className="mt-command-bar-more"
            aria-label={locale.more}
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            data-mt-press=""
          >
            <Dots />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {expanded && secondary.length > 0 && (
            <m.div key="menu" className="mt-command-bar-menu" variants={folding} {...presence}>
              {secondary.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="mt-command-bar-menu-item"
                  disabled={item.disabled}
                  aria-pressed={item.toggled === undefined ? undefined : item.toggled}
                  data-toggled={flag(item.toggled)}
                  data-mt-press=""
                  onClick={() => {
                    item.onClick?.()
                    setExpanded(false)
                  }}
                >
                  {item.label}
                </button>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    )

  const menu: MenuItem[] = secondary.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    onSelect: item.onClick,
    disabled: item.disabled,
    checked: item.toggled,
  }))

  return (
    <div {...rest} ref={rootRef} role="toolbar" className={cx('mt-command-bar', className)} data-platform="desktop" data-labels={labels}>
      {content != null && <div className="mt-command-bar-content">{content}</div>}
      <div className="mt-command-bar-primary">
        {primary.map(button)}
        {secondary.length > 0 && (
          <MenuFlyout items={menu} placement="bottom-end">
            <button type="button" className="mt-command-bar-button" data-more="" aria-label={locale.more} title={locale.more} data-mt-press="" data-mt-hover="">
              <span className="mt-command-bar-icon">
                <Dots />
              </span>
            </button>
          </MenuFlyout>
        )}
      </div>
    </div>
  )
}
