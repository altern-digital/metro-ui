import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Tile } from './Tile'

describe('Tile', () => {
  test('renders a static tile with size, tone and title', () => {
    const { container } = render(<Tile size="wide" tone="teal" title="mail" badge={3} />)
    const face = container.querySelector('.mt-tile') as HTMLElement
    expect(face.tagName).toBe('DIV')
    expect(face.dataset.size).toBe('wide')
    expect(face.dataset.tone).toBe('teal')
    expect(face.hasAttribute('data-mt-press')).toBe(false)
    expect(face.style.getPropertyValue('--_fill')).toBe('var(--mt-tone-teal)')
    expect(screen.getByText('mail')).toBeTruthy()
    expect(screen.getByText('3')).toBeTruthy()
    expect((container.querySelector('.mt-tile-cell') as HTMLElement).dataset.size).toBe('wide')
  })

  test('hides the title on a small tile', () => {
    render(<Tile size="small" title="clock" />)
    expect(screen.queryByText('clock')).toBeNull()
  })

  test('is a button with onClick and a link with href', () => {
    const onClick = mock()
    const { rerender } = render(<Tile title="photos" onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'photos' })
    expect(button.hasAttribute('data-mt-press')).toBe(true)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(<Tile title="photos" href="/photos" />)
    expect(screen.getByRole('link', { name: 'photos' }).getAttribute('href')).toBe('/photos')
  })

  test('does not click while disabled', () => {
    const onClick = mock()
    render(<Tile title="store" onClick={onClick} disabled />)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  test('leans on press and settles on release', () => {
    render(<Tile title="maps" onClick={() => {}} />)
    const button = screen.getByRole('button')
    button.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON() {} })
    fireEvent.pointerDown(button, { clientX: 100, clientY: 0, button: 0 })
    expect(button.hasAttribute('data-tilt')).toBe(true)
    expect(button.style.getPropertyValue('--_ry')).toBe('4.00deg')
    fireEvent.pointerUp(button)
    expect(button.hasAttribute('data-tilt')).toBe(false)
  })

  test('draws an image with an overlay', () => {
    const { container } = render(<Tile image="/a.jpg" imageOverlay title="people" />)
    expect(container.querySelector('img.mt-tile-image')?.getAttribute('src')).toBe('/a.jpg')
    expect(container.querySelector('.mt-tile-overlay')).toBeTruthy()
  })
})
