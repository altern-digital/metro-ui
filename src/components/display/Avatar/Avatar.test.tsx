import { describe, expect, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Avatar, initialsOf, toneForName } from './Avatar'

describe('Avatar', () => {
  test('initials on a tone from the name, square by default', () => {
    render(<Avatar name="Ada Lovelace" />)
    const avatar = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(avatar.textContent).toBe('AL')
    expect(avatar.dataset.shape).toBe('square')
    expect(avatar.dataset.size).toBe('md')
    expect(avatar.style.getPropertyValue('--_size')).toBe('40px')
    expect(avatar.style.getPropertyValue('--_tone')).toBe(`var(--mt-tone-${toneForName('Ada Lovelace')})`)
  })

  test('the tone is stable and spread', () => {
    expect(toneForName('Ada Lovelace')).toBe(toneForName('Ada Lovelace'))
    const tones = new Set(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map(toneForName))
    expect(tones.size).toBeGreaterThan(3)
  })

  test('initials', () => {
    expect(initialsOf('ada')).toBe('A')
    expect(initialsOf('  Grace  Brewster Hopper ')).toBe('GH')
    expect(initialsOf('')).toBe('')
  })

  test('an image, falling back to initials when it fails', () => {
    const { container } = render(<Avatar name="Alan Turing" src="/a.png" shape="circle" size={56} status="busy" />)
    const avatar = screen.getByRole('img', { name: 'Alan Turing (busy)' })
    expect(avatar.dataset.shape).toBe('circle')
    expect(avatar.dataset.status).toBe('busy')
    expect(avatar.style.getPropertyValue('--_size')).toBe('56px')
    // happy-dom may fail the load on its own; fire it by hand if it has not.
    const img = container.querySelector('img')
    if (img) fireEvent.error(img)
    expect(container.querySelector('img')).toBeNull()
    expect(avatar.textContent).toBe('AT')
  })

  test('an explicit tone wins', () => {
    render(<Avatar name="x" tone="red" />)
    expect(screen.getByRole('img').style.getPropertyValue('--_tone')).toBe('var(--mt-tone-red)')
  })
})
