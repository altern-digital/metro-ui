import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { JUMP_ALPHABET, JumpList, JumpListHeader } from './JumpList'

describe('JumpList', () => {
  test('closed by default', () => {
    render(<JumpList groups={['a']} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  test('a grid of tiles; letters the list lacks are disabled', () => {
    render(<JumpList groups={['A', 'c']} defaultOpen />)
    const grid = screen.getByRole('dialog', { name: 'jump to' })
    expect(grid.getAttribute('aria-modal')).toBe('true')
    expect(screen.getAllByRole('button')).toHaveLength(JUMP_ALPHABET.length)
    expect((screen.getByRole('button', { name: 'a' }) as HTMLButtonElement).disabled).toBe(false)
    expect(screen.getByRole('button', { name: 'c' }).dataset.present).toBe('')
    expect((screen.getByRole('button', { name: 'b' }) as HTMLButtonElement).disabled).toBe(true)
  })

  test('picking a letter jumps and closes', async () => {
    const onJump = mock()
    const onOpenChange = mock()
    const target = document.createElement('div')
    target.id = 'people-group-c'
    const scroll = mock()
    target.scrollIntoView = scroll
    document.body.append(target)
    render(<JumpList groups={['a', 'c']} defaultOpen listId="people" onJump={onJump} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'c' }))
    expect(onJump).toHaveBeenCalledWith('c')
    expect(scroll).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    target.remove()
  })

  test('Escape closes; controlled open stays', () => {
    const onOpenChange = mock()
    render(<JumpList groups={['a']} open onOpenChange={onOpenChange} label="go to" />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('dialog', { name: 'go to' })).toBeTruthy()
  })

  test('the header opens it', () => {
    const onClick = mock()
    render(<JumpListHeader letter="b" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: 'b' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
