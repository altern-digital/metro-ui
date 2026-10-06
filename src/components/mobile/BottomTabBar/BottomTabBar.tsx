import { useUncontrolled } from '@mantine/hooks'
import type { ElementType, HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'

export interface BottomTabItem {
  key: string
  label: ReactNode
  icon?: IconSource
  /** A count or dot on the icon's corner. */
  badge?: ReactNode
  /** Render the tab as a link. */
  href?: string
  disabled?: boolean
}

/** Where a bar along the bottom sits: on the viewport (`fixed`), on its nearest positioned box (`absolute`) or in the flow (`static`). */
export type BottomTabBarPosition = 'fixed' | 'absolute' | 'static'

export interface BottomTabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  items: BottomTabItem[]
  /** The selected tab's key. */
  value?: string | null
  defaultValue?: string | null
  onChange?: (key: string) => void
  /** The component links render with, e.g. Next.js `Link`. Receives `href`, `className`, `children`… Default `a`. */
  linkComponent?: ElementType
  /** Default `fixed`: along the bottom of the viewport. `absolute` pins it to the bottom of its nearest positioned box. */
  position?: BottomTabBarPosition
  ref?: Ref<HTMLElement>
}

/**
 * The phone's tab bar: icons over small lowercase labels along the bottom
 * edge, the current one in the accent, above the home-indicator safe area.
 */
export function BottomTabBar(props: BottomTabBarProps) {
  const { items, value, defaultValue, onChange, linkComponent, position = 'fixed', className, ...rest } = useDefaults('BottomTabBar', props)
  const [selected, setSelected] = useUncontrolled<string | null>({ value, defaultValue, finalValue: null, onChange: (key) => key != null && onChange?.(key) })
  const Link = (linkComponent ?? 'a') as ElementType

  return (
    <nav {...rest} className={cx('mt-bottom-tab-bar', className)} data-position={position}>
      {items.map((item) => {
        const current = item.key === selected
        const inner = (
          <>
            <span className="mt-bottom-tab-bar-icon">
              {renderIcon(item.icon)}
              {item.badge != null && item.badge !== false && <span className="mt-bottom-tab-bar-badge">{item.badge}</span>}
            </span>
            <span className="mt-bottom-tab-bar-label">{item.label}</span>
          </>
        )
        const shared = {
          className: 'mt-bottom-tab-bar-item',
          'aria-current': current ? ('page' as const) : undefined,
          'data-selected': flag(current),
          'data-mt-press': '',
        }
        const select = (e: MouseEvent) => {
          if (item.disabled) {
            e.preventDefault()
            return
          }
          setSelected(item.key)
        }
        if (item.href !== undefined)
          return (
            <Link key={item.key} {...shared} href={item.href} onClick={select} aria-disabled={item.disabled || undefined} tabIndex={item.disabled ? -1 : undefined}>
              {inner}
            </Link>
          )
        return (
          <button key={item.key} {...shared} type="button" disabled={item.disabled} onClick={select}>
            {inner}
          </button>
        )
      })}
    </nav>
  )
}
