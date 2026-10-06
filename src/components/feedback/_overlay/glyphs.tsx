/* Tiny glyphs drawn inline, 1em and currentColor, so the library ships no icon set. */

export const CheckGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M2.5 8.5l3.5 3.5 7.5-8" />
  </svg>
)

export const ChevronRightGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M6 3l5 5-5 5" />
  </svg>
)

export const ChevronDownGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M3 6l5 5 5-5" />
  </svg>
)

export const CloseGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M3.5 3.5l9 9m0-9l-9 9" />
  </svg>
)

/** Severity glyphs, Segoe MDL2-like: a ring with a mark. */
export const InfoGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <circle cx="8" cy="8" r="6.75" />
    <path d="M8 7v4.5M8 4.5v1.2" />
  </svg>
)

export const SuccessGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <circle cx="8" cy="8" r="6.75" />
    <path d="M5 8.2l2 2 4-4.2" />
  </svg>
)

export const WarningGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <path d="M8 1.75l6.75 12.5H1.25z" strokeLinejoin="miter" />
    <path d="M8 6v4M8 11.3v1.2" />
  </svg>
)

export const ErrorGlyph = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
    <circle cx="8" cy="8" r="6.75" />
    <path d="M5.75 5.75l4.5 4.5m0-4.5l-4.5 4.5" />
  </svg>
)

export type Severity = 'info' | 'success' | 'warning' | 'error'

export const SEVERITY_GLYPH = { info: InfoGlyph, success: SuccessGlyph, warning: WarningGlyph, error: ErrorGlyph } as const
