import { toneVar, type Tone } from '../../config/theme'

/** A Metro tone, a status colour (`accent`, `danger`, `warning`, `success`, `info`), or any CSS colour. */
export type DisplayTone = 'accent' | 'danger' | 'warning' | 'success' | 'info' | Tone

const STATUS = new Set(['accent', 'danger', 'warning', 'success', 'info'])

/** A DisplayTone as a CSS colour: status names become their token, the rest go through toneVar. */
export function toneColor(tone: DisplayTone | undefined): string | undefined {
  if (!tone) return undefined
  return STATUS.has(tone) ? `var(--mt-${tone})` : toneVar(tone)
}
