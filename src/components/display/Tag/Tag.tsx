import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { cx } from '../../../utils'
import { renderIcon, type IconSource } from '../../foundation/Icon/Icon'
import { toneColor, type DisplayTone } from '../tone'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** A Metro tone (`teal`), a status (`accent`, `danger`…) or any CSS colour. Without one the tag is a quiet grey. */
  tone?: DisplayTone
  /** `filled` with the tone and white text, or an `outline` in the tone. */
  variant?: 'filled' | 'outline'
  icon?: IconSource
  /** Shows a × button that calls this. */
  onRemove?: () => void
  /** The × button's spoken name. */
  removeLabel?: string
  ref?: Ref<HTMLSpanElement>
  children?: ReactNode
}

/**
 * A small flat label: a category, a state.
 *
 * ```tsx
 * <Tag tone="green">paid</Tag>
 * <Tag variant="outline" onRemove={remove}>design</Tag>
 * ```
 */
export function Tag(props: TagProps) {
  const t = useLocale()
  const { tone, variant = 'filled', icon, onRemove, removeLabel = t.remove, className, style, children, ...rest } = useDefaults('Tag', props)
  const color = toneColor(tone)
  return (
    <span
      {...rest}
      className={cx('mt-tag', className)}
      style={color ? ({ '--_tone': color, ...style } as CSSProperties) : style}
      data-variant={variant}
      data-tone={tone}
    >
      {icon != null && <span className="mt-tag-icon">{renderIcon(icon)}</span>}
      {children != null && <span className="mt-tag-label">{children}</span>}
      {onRemove && (
        <button type="button" className="mt-tag-remove" aria-label={removeLabel} onClick={onRemove} data-mt-press="" data-mt-hover="">
          <svg viewBox="0 0 16 16" width="1em" height="1em" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </button>
      )}
    </span>
  )
}
