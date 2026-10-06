import { useLayoutEffect, useRef, type ChangeEvent, type CSSProperties, type InputHTMLAttributes, type ReactNode, type Ref, type TextareaHTMLAttributes } from 'react'
import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { useDefaults, useLocale } from '../../../config/context'
import { cx, flag } from '../../../utils'

type FieldElement = HTMLInputElement | HTMLTextAreaElement

export interface TextFieldOwnProps {
  /** Shown above the field, muted and lowercase. */
  label?: ReactNode
  /** Help text under the field. */
  description?: ReactNode
  /** `true` paints the field red; a node also shows it as red text under the field. */
  error?: ReactNode
  /** Inside the field, before the text: an icon or a unit. */
  prefix?: ReactNode
  /** Inside the field, after the text. */
  suffix?: ReactNode
  /** An × button that empties the field while it has text. */
  clearable?: boolean
  /** A `<textarea>` instead of an `<input>`. */
  multiline?: boolean
  /** With `multiline`, grow with the text instead of scrolling. */
  autoResize?: boolean
  /** With `multiline`, the starting number of lines. Default 3. */
  rows?: number
  value?: string
  defaultValue?: string
  /** Called with the new text. `event` is `null` when the clear button emptied it. */
  onChange?: (value: string, event: ChangeEvent<FieldElement> | null) => void
  /** Spoken name of the clear button. Default `locale.clear`. */
  clearLabel?: string
  /** Fill the width of its container. Default true. */
  block?: boolean
  /** Goes on the root; everything else goes on the `<input>`/`<textarea>`. */
  className?: string
  style?: CSSProperties
  /** The `<input>` or `<textarea>`. */
  ref?: Ref<FieldElement>
}

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextFieldOwnProps | 'children'>

export type TextFieldProps = TextFieldOwnProps & NativeProps

/**
 * A Metro text box: a filled field whose underline turns accent on
 * focus, its label above in lowercase. Native props (`name`, `placeholder`,
 * `type`, `autoComplete`…) go on the `<input>`.
 *
 * ```tsx
 * <TextField label="email" type="email" clearable />
 * ```
 */
export function TextField(props: TextFieldProps) {
  const {
    label,
    description,
    error,
    prefix,
    suffix,
    clearable,
    multiline,
    autoResize,
    rows = 3,
    value,
    defaultValue,
    onChange,
    clearLabel,
    block = true,
    className,
    style,
    ref,
    id: idProp,
    disabled,
    readOnly,
    'aria-describedby': describedBy,
    ...rest
  } = useDefaults('TextField', props)
  const locale = useLocale()
  const id = useId(idProp)
  const inner = useRef<FieldElement>(null)
  const mergedRef = useMergedRef(inner, ref)
  const [text, setText] = useUncontrolled<string>({ value, defaultValue, finalValue: '', onChange })

  useLayoutEffect(() => {
    const el = inner.current
    if (!multiline || !autoResize || !el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`
  }, [text, multiline, autoResize])

  const invalid = error != null && error !== false
  const descriptionId = description != null ? `${id}-description` : undefined
  const errorId = invalid && error !== true ? `${id}-error` : undefined
  const field = {
    ...rest,
    id,
    className: 'mt-text-field-input',
    value: text,
    disabled,
    readOnly,
    'aria-invalid': invalid || undefined,
    'aria-describedby': cx(describedBy, descriptionId, errorId) || undefined,
    onChange: (e: ChangeEvent<FieldElement>) => setText(e.currentTarget.value, e),
  }
  const showClear = clearable && text !== '' && !disabled && !readOnly

  return (
    <div
      className={cx('mt-text-field', className)}
      style={style}
      data-block={flag(block)}
      data-invalid={flag(invalid)}
      data-disabled={flag(disabled)}
      data-multiline={flag(multiline)}
    >
      {label != null && (
        <label className="mt-text-field-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="mt-text-field-box">
        {prefix != null && <span className="mt-text-field-section">{prefix}</span>}
        {multiline ? (
          <textarea {...(field as TextareaHTMLAttributes<HTMLTextAreaElement>)} ref={mergedRef} rows={rows} data-auto-resize={flag(autoResize)} />
        ) : (
          <input type="text" {...(field as InputHTMLAttributes<HTMLInputElement>)} ref={mergedRef} />
        )}
        {showClear && (
          <button
            type="button"
            className="mt-text-field-button"
            aria-label={clearLabel ?? locale.clear}
            title={clearLabel ?? locale.clear}
            data-mt-press=""
            data-mt-hover=""
            onClick={() => {
              setText('', null)
              inner.current?.focus()
            }}
          >
            <svg width="1em" height="1em" viewBox="0 0 16 16" aria-hidden>
              <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </button>
        )}
        {suffix != null && <span className="mt-text-field-section">{suffix}</span>}
      </div>
      {description != null && (
        <div id={descriptionId} className="mt-text-field-description">
          {description}
        </div>
      )}
      {errorId && (
        <div id={errorId} className="mt-text-field-error">
          {error}
        </div>
      )}
    </div>
  )
}
