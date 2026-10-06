import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { Tag } from './Tag'

describe('Tag', () => {
  test('neutral by default', () => {
    render(<Tag>draft</Tag>)
    const tag = screen.getByText('draft').parentElement!
    expect(tag.className).toBe('mt-tag')
    expect(tag.dataset.variant).toBe('filled')
    expect(tag.dataset.tone).toBeUndefined()
    expect(tag.style.getPropertyValue('--_tone')).toBe('')
  })

  test('tones: Metro names, statuses and raw colours', () => {
    render(
      <>
        <Tag tone="teal">a</Tag>
        <Tag tone="danger">b</Tag>
        <Tag tone="#123456" variant="outline">
          c
        </Tag>
      </>,
    )
    expect(screen.getByText('a').parentElement!.style.getPropertyValue('--_tone')).toBe('var(--mt-tone-teal)')
    expect(screen.getByText('b').parentElement!.style.getPropertyValue('--_tone')).toBe('var(--mt-danger)')
    const c = screen.getByText('c').parentElement!
    expect(c.style.getPropertyValue('--_tone')).toBe('#123456')
    expect(c.dataset.variant).toBe('outline')
  })

  test('onRemove shows a named remove button', () => {
    const onRemove = mock()
    render(
      <Tag onRemove={onRemove} removeLabel="remove design">
        design
      </Tag>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'remove design' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
