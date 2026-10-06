import { useEffect, useRef, type ChangeEvent, type CSSProperties, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { useId, useMergedRef, useUncontrolled } from '@mantine/hooks'
import { useDefaults } from '../../../config/context'
import { cx, flag } from '../../../utils'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'children'> {
  label?: ReactNode
  /** Smaller muted text under the label. */
  description?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void
  /** Neither on nor off: a bar instead of a check. Read as "mixed". */
  indeterminate?: boolean
  /** Goes on the root `<label>`; other props go on the native `<input>`. */
  className?: string
  style?: CSSProperties
  /** The native `<input type="checkbox">`. */
  ref?: Ref<HTMLInputElement>
}

/**
 * A square Metro check box: it fills with the accent and shows a white
 * check. The native input stays in the page (visually hidden) so forms,
 * labels and screen readers work as usual.
 *
 * ```tsx
 * <Checkbox label="remember me" defaultChecked />
 * ```
 */
export function Checkbox(props: CheckboxProps) {
  const { label, description, checked, defaultChecked, onChange, indeterminate, className, style, ref, id: idProp, disabled, 'aria-describedby': describedBy, ...rest } = useDefaults('Checkbox', props)
  const id = useId(idProp)
  const input = useRef<HTMLInputElement>(null)
  const mergedRef = useMergedRef(input, ref)
  const [on, setOn] = useUncontrolled<boolean>({ value: checked, defaultValue: defaultChecked, finalValue: false, onChange })

  useEffect(() => {
    if (input.current) input.current.indeterminate = !!indeterminate
  }, [indeterminate])

  const descriptionId = description != null ? `${id}-description` : undefined
  return (
    <label className={cx('mt-checkbox', className)} style={style} data-checked={flag(on)} data-indeterminate={flag(indeterminate)} data-disabled={flag(disabled)}>
      <input
        {...rest}
        ref={mergedRef}
        id={id}
        type="checkbox"
        className="mt-checkbox-input mt-visually-hidden"
        checked={on}
        disabled={disabled}
        aria-describedby={cx(describedBy, descriptionId) || undefined}
        onChange={(e) => setOn(e.currentTarget.checked, e)}
      />
      <span className="mt-checkbox-box" aria-hidden>
        {indeterminate ? (
          <svg width="1em" height="1em" viewBox="0 0 16 16" aria-hidden>
            <path d="M3.5 8h9" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          on && (
            <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" />
            </svg>
          )
        )}
      </span>
      {(label != null || description != null) && (
        <span className="mt-checkbox-text">
          {label != null && <span className="mt-checkbox-label">{label}</span>}
          {description != null && (
            <span id={descriptionId} className="mt-checkbox-description" aria-hidden>
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  )
}
