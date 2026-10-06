import { isValidElement, type ComponentType, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { cx } from '../../../utils'

/** An icon as a component (`VscHome` from react-icons, a Heroicon…) or as an element (`<svg>…</svg>`). */
export type IconSource = ComponentType<{ className?: string; 'aria-hidden'?: boolean }> | ReactNode

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  icon: IconSource
  /** Pixels, or any CSS length. Default `1em`, so it follows the text around it. */
  size?: number | string
  /** Spoken name. Without one the icon is decorative and hidden from screen readers. */
  label?: string
}

/**
 * The library ships no icon set, to stay light: bring any (react-icons'
 * `vsc` set looks most at home). Icons are sized by font-size and coloured
 * by `currentColor`, the way Segoe MDL2 glyphs were.
 */
export function Icon({ icon, size, label, className, style, ...rest }: IconProps) {
  return (
    <span
      {...rest}
      className={cx('mt-icon', className)}
      style={size === undefined ? style : ({ ...style, fontSize: typeof size === 'number' ? `${size}px` : size } as CSSProperties)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {renderIcon(icon)}
    </span>
  )
}

/** An IconSource as a node. Components get rendered; elements and strings pass through. */
export function renderIcon(icon: IconSource): ReactNode {
  if (icon == null || typeof icon === 'boolean') return null
  if (isValidElement(icon) || typeof icon === 'string' || typeof icon === 'number' || Array.isArray(icon)) return icon as ReactNode
  if (typeof icon === 'function' || (typeof icon === 'object' && '$$typeof' in icon)) {
    const C = icon as ComponentType<{ 'aria-hidden'?: boolean }>
    return <C aria-hidden />
  }
  return icon as ReactNode
}
