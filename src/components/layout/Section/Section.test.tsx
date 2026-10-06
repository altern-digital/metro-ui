import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  test('is a region named by its title', () => {
    render(
      <Section title="accounts" description="who can sign in" actions={<button type="button">add</button>}>
        rows
      </Section>,
    )
    const region = screen.getByRole('region', { name: 'accounts' })
    expect(region.className).toBe('mt-section')
    expect(screen.getByRole('heading', { level: 2, name: 'accounts' })).toBeTruthy()
    expect(screen.getByText('who can sign in').className).toBe('mt-section-description')
    expect(screen.getByRole('button', { name: 'add' })).toBeTruthy()
  })

  test('titleAs and keepCase', () => {
    render(
      <Section title="Mail" titleAs="h3" keepCase>
        x
      </Section>,
    )
    const h = screen.getByRole('heading', { level: 3, name: 'Mail' })
    expect(h.hasAttribute('data-keep-case')).toBe(true)
  })

  test('without a title it has no header', () => {
    const { container } = render(<Section>x</Section>)
    expect(container.querySelector('.mt-section-header')).toBeNull()
    expect(container.querySelector('section')?.hasAttribute('aria-labelledby')).toBe(false)
  })
})
