import { useState, type KeyboardEvent } from 'react'
import { useDefaults, useLocale } from '../../../config/context'
import { cx, flag } from '../../../utils'
import { TextField, type TextFieldProps } from '../TextField/TextField'

export type PasswordRevealMode = 'toggle' | 'peek'

export interface PasswordBoxProps extends Omit<TextFieldProps, 'type' | 'multiline' | 'autoResize' | 'rows' | 'suffix'> {
  /**
   * - `toggle`: the eye button shows the password until pressed again.
   * - `peek`: shows it only while the button is held down, as Windows did.
   */
  revealMode?: PasswordRevealMode
  /** Hide the reveal button altogether. */
  noReveal?: boolean
  /** Spoken name of the reveal button. Default `locale.showPassword`. */
  showLabel?: string
  /** Spoken name while revealed (toggle mode). Default `locale.hidePassword`. */
  hideLabel?: string
}

const PEEK_KEYS = new Set(['Enter', ' '])

/**
 * A TextField for passwords, with an eye button that reveals what was typed.
 *
 * ```tsx
 * <PasswordBox label="password" revealMode="peek" />
 * ```
 */
export function PasswordBox(props: PasswordBoxProps) {
  const { revealMode = 'toggle', noReveal, showLabel, hideLabel, className, autoComplete = 'current-password', ...rest } = useDefaults('PasswordBox', props)
  const locale = useLocale()
  const [revealed, setRevealed] = useState(false)
  const peek = revealMode === 'peek'
  const name = revealed && !peek ? (hideLabel ?? locale.hidePassword) : (showLabel ?? locale.showPassword)

  const reveal = noReveal ? null : (
    <button
      type="button"
      className="mt-text-field-button mt-password-box-reveal"
      aria-label={name}
      title={name}
      aria-pressed={revealed}
      disabled={rest.disabled}
      data-active={flag(peek && revealed)}
      data-mt-press=""
      data-mt-hover=""
      // Keep the caret in the field.
      onMouseDown={(e) => e.preventDefault()}
      onClick={peek ? undefined : () => setRevealed((r) => !r)}
      onPointerDown={peek ? () => setRevealed(true) : undefined}
      onPointerUp={peek ? () => setRevealed(false) : undefined}
      onPointerLeave={peek ? () => setRevealed(false) : undefined}
      onPointerCancel={peek ? () => setRevealed(false) : undefined}
      onKeyDown={peek ? (e: KeyboardEvent) => PEEK_KEYS.has(e.key) && (e.preventDefault(), setRevealed(true)) : undefined}
      onKeyUp={peek ? (e: KeyboardEvent) => PEEK_KEYS.has(e.key) && setRevealed(false) : undefined}
      onBlur={peek ? () => setRevealed(false) : undefined}
    >
      <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
        <path d="M1 8s2.6-4.5 7-4.5S15 8 15 8s-2.6 4.5-7 4.5S1 8 1 8z" />
        <circle cx="8" cy="8" r="2.2" />
        {revealed && !peek && <path d="M2.5 13.5l11-11" />}
      </svg>
    </button>
  )

  return (
    <TextField
      {...rest}
      className={cx('mt-password-box', className)}
      type={revealed ? 'text' : 'password'}
      autoComplete={autoComplete}
      spellCheck={false}
      suffix={reveal}
    />
  )
}
