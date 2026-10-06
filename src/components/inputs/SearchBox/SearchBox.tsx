import type { KeyboardEvent } from 'react'
import { useUncontrolled } from '@mantine/hooks'
import { useDefaults, useLocale } from '../../../config/context'
import { cx } from '../../../utils'
import { TextField, type TextFieldProps } from '../TextField/TextField'

export interface SearchBoxProps extends Omit<TextFieldProps, 'type' | 'multiline' | 'autoResize' | 'rows' | 'suffix'> {
  /** Called with the text on Enter or on the search button. */
  onSearch?: (value: string) => void
  /** Spoken name of the search button. Default `locale.search`. */
  searchLabel?: string
}

/**
 * A text field with a search glyph button at its end, as in Windows 8.
 * Enter or the button calls `onSearch`. Clearable by default.
 *
 * ```tsx
 * <SearchBox placeholder="search" onSearch={run} />
 * ```
 */
export function SearchBox(props: SearchBoxProps) {
  const { onSearch, searchLabel, value, defaultValue, onChange, onKeyDown, clearable = true, className, placeholder, ...rest } = useDefaults('SearchBox', props)
  const locale = useLocale()
  const [text, setText] = useUncontrolled<string>({ value, defaultValue, finalValue: '', onChange })
  const name = searchLabel ?? locale.search

  return (
    <TextField
      {...rest}
      className={cx('mt-search-box', className)}
      type="search"
      enterKeyHint="search"
      placeholder={placeholder}
      clearable={clearable}
      value={text}
      onChange={setText}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement & HTMLTextAreaElement>) => {
        onKeyDown?.(e)
        if (e.key === 'Enter' && !e.defaultPrevented && !e.nativeEvent.isComposing) onSearch?.(text)
      }}
      suffix={
        <button
          type="button"
          className="mt-text-field-button mt-search-box-button"
          aria-label={name}
          title={name}
          disabled={rest.disabled}
          data-mt-press=""
          data-mt-hover=""
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSearch?.(text)}
        >
          <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <circle cx="9.5" cy="6.5" r="4.5" />
            <path d="M6.3 9.7L1.5 14.5" />
          </svg>
        </button>
      }
    />
  )
}
