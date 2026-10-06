import { describe, expect, mock, test } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Page } from './Page'

describe('Page', () => {
  test('title, subtitle, actions and body', () => {
    const { container } = render(
      <Page title="settings" subtitle="this device" actions={<button type="button">save</button>}>
        content
      </Page>,
    )
    expect(screen.getByRole('heading', { level: 1, name: 'settings' })).toBeTruthy()
    expect(screen.getByText('this device').className).toBe('mt-subtitle')
    expect(screen.getByRole('button', { name: 'save' }).parentElement?.className).toBe('mt-page-actions')
    expect(container.querySelector('.mt-page-body')?.textContent).toBe('content')
    expect(screen.queryByRole('button', { name: 'back' })).toBeNull()
  })

  test('onBack shows a back button named from the locale', () => {
    const onBack = mock()
    render(
      <ConfigProvider locale={{ back: 'kembali' }}>
        <Page title="x" onBack={onBack} />
      </ConfigProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'kembali' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  test('back replaces the arrow; pivot and bleed', () => {
    const { container } = render(
      <Page title="x" back={<a href="/">up</a>} pivot={<nav>tabs</nav>} bleed>
        body
      </Page>,
    )
    expect(screen.getByRole('link', { name: 'up' })).toBeTruthy()
    expect(container.querySelector('.mt-page-pivot')?.textContent).toBe('tabs')
    expect((container.firstChild as HTMLElement).hasAttribute('data-bleed')).toBe(true)
  })

  test('no header without any of its parts', () => {
    const { container } = render(<Page>body</Page>)
    expect(container.querySelector('.mt-page-header')).toBeNull()
  })
})
