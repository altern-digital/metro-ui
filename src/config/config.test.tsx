import { describe, expect, test } from 'bun:test'
import { render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { ConfigProvider, themeVars } from './ConfigProvider'
import { readableOn } from './color'
import { useConfig, useDefaults } from './context'
import { TONES, toneVar } from './theme'

describe('tokens', () => {
  test('TONES matches the --mt-tone-* tokens', () => {
    const css = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8')
    for (const [name, hex] of Object.entries(TONES)) expect(css).toContain(`--mt-tone-${name}: ${hex};`)
  })
})

describe('colour', () => {
  test('white on dark accents, black on pale ones', () => {
    expect(readableOn(TONES.blue)).toBe('#fff')
    expect(readableOn(TONES.red)).toBe('#fff')
    expect(readableOn('#ffff00')).toBe('#000')
    expect(readableOn('rebeccapurple')).toBe('#fff')
  })

  test('toneVar maps names to tokens and passes colours through', () => {
    expect(toneVar('teal')).toBe('var(--mt-tone-teal)')
    expect(toneVar('#ff6600')).toBe('#ff6600')
    expect(toneVar('transparent')).toBe('transparent')
    expect(toneVar(undefined)).toBeUndefined()
  })

  test('themeVars writes the accent, its text colour, tones and tokens', () => {
    expect(themeVars({ accent: 'lime', tones: { brand: '#0d3b34' }, tokens: { '--mt-font': 'Inter' } })).toEqual({
      '--mt-tone-brand': '#0d3b34',
      '--mt-accent': 'var(--mt-tone-lime)',
      '--mt-on-accent': '#000',
      '--mt-font': 'Inter',
    } as never)
  })
})

describe('ConfigProvider', () => {
  test('renders the themed root with its data attributes', () => {
    const { container } = render(
      <ConfigProvider theme={{ mode: 'light', accent: 'orange' }} density="touch">
        hi
      </ConfigProvider>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toBe('mt-root')
    expect(root.dataset.mtMode).toBe('light')
    expect(root.dataset.mtDensity).toBe('touch')
    expect(root.style.getPropertyValue('--mt-accent')).toBe('var(--mt-tone-orange)')
    expect(root.querySelector('.mt-portal')).not.toBeNull()
  })

  test('a nested provider inherits and overrides', () => {
    let inner: ReturnType<typeof useConfig> | undefined
    const Probe = () => {
      inner = useConfig()
      return null
    }
    render(
      <ConfigProvider theme={{ mode: 'light', accent: 'teal' }} locale={{ ok: 'oke' }}>
        <ConfigProvider theme={{ accent: 'red' }}>
          <Probe />
        </ConfigProvider>
      </ConfigProvider>,
    )
    expect(inner?.nested).toBe(true)
    expect(inner?.theme.mode).toBe('light')
    expect(inner?.theme.accent).toBe('red')
    expect(inner?.locale.ok).toBe('oke')
  })

  test('component defaults sit under explicit props', () => {
    let props: { variant?: string; size?: string } = {}
    const Probe = (p: { variant?: string; size?: string }) => {
      props = useDefaults('Button', p)
      return null
    }
    render(
      <ConfigProvider components={{ Button: { variant: 'accent', size: 'lg' } }}>
        <Probe size="sm" variant={undefined} />
      </ConfigProvider>,
    )
    expect(props).toEqual({ variant: 'accent', size: 'sm' })
  })
})
