/** Joins class names, skipping falsy ones. */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ')
}

/** A data attribute that is present when true and absent otherwise. */
export const flag = (on: boolean | undefined): '' | undefined => (on ? '' : undefined)

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'
