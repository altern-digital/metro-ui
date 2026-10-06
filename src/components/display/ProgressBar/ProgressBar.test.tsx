import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  test('determinate: values and the fill ratio', () => {
    const { container } = render(<ProgressBar value={40} label="uploading" />)
    const bar = screen.getByRole('progressbar', { name: 'uploading' })
    expect(bar.getAttribute('aria-valuenow')).toBe('40')
    expect(bar.getAttribute('aria-valuemax')).toBe('100')
    const root = container.firstChild as HTMLElement
    expect(root.style.getPropertyValue('--_value')).toBe('0.4')
    expect(root.hasAttribute('data-indeterminate')).toBe(false)
    expect(container.querySelector('.mt-progress-bar-fill')).toBeTruthy()
  })

  test('clamps and takes max and tone', () => {
    const { container } = render(<ProgressBar value={15} max={10} tone="green" />)
    const root = container.firstChild as HTMLElement
    expect(root.style.getPropertyValue('--_value')).toBe('1')
    expect(root.style.getPropertyValue('--_tone')).toBe('var(--mt-tone-green)')
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('10')
  })

  test('indeterminate: five dots, no value, named from the locale', () => {
    const { container } = render(
      <ConfigProvider locale={{ loading: 'memuat…' }}>
        <ProgressBar />
      </ConfigProvider>,
    )
    const bar = screen.getByRole('progressbar', { name: 'memuat…' })
    expect(bar.hasAttribute('aria-valuenow')).toBe(false)
    expect(bar.getAttribute('aria-busy')).toBe('true')
    expect(bar.querySelectorAll('i')).toHaveLength(5)
    expect(container.querySelector('.mt-progress-bar')?.hasAttribute('data-indeterminate')).toBe(true)
  })
})
