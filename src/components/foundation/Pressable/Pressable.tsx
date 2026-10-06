import type { ElementType, HTMLAttributes, KeyboardEvent, Ref } from 'react'
import { cx } from '../../../utils'

export interface PressableProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Default `button`. */
  as?: ElementType
  disabled?: boolean
  /** Show the hover wash under a mouse. Default true. */
  hover?: boolean
  ref?: Ref<HTMLElement>
  /** Anything else the element takes (`href`, `type`, …). */
  [prop: string]: unknown
}

/**
 * Anything you can press: the Metro press tint the moment a finger lands,
 * the hover wash under a mouse, and, for an element that isn't a button,
 * the role and keyboard (Enter, Space) of one.
 */
export function Pressable({ as: As = 'button', disabled, hover = true, className, onKeyDown, onClick, ref, ...rest }: PressableProps) {
  const native = As === 'button'
  const link = As === 'a'
  const fake = !native && !link

  const keyDown = (e: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e)
    if (!fake || disabled || e.defaultPrevented || e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.currentTarget.click()
    }
  }

  return (
    <As
      ref={ref}
      type={native ? 'button' : undefined}
      role={fake ? 'button' : undefined}
      tabIndex={fake && !disabled ? 0 : undefined}
      {...rest}
      className={cx('mt-pressable', className)}
      disabled={native ? disabled : undefined}
      aria-disabled={!native && disabled ? true : undefined}
      onClick={disabled && !native ? undefined : onClick}
      onKeyDown={keyDown}
      data-mt-press=""
      data-mt-hover={hover ? '' : undefined}
    />
  )
}
