import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { LiveTile } from './LiveTile'

describe('LiveTile', () => {
  test('shows the first face and its effect', () => {
    const { container } = render(<LiveTile title="news" faces={['first headline', 'second headline']} effect="flip" />)
    const face = container.querySelector('.mt-tile') as HTMLElement
    expect(face.dataset.effect).toBe('flip')
    expect(face.dataset.face).toBe('0')
    expect(screen.getByText('first headline')).toBeTruthy()
    expect(screen.queryByText('second headline')).toBeNull()
  })

  test('stays on the first face under reduced motion', async () => {
    render(
      <ConfigProvider motion="none">
        <LiveTile title="photos" interval={1} faces={['one', 'two']} />
      </ConfigProvider>,
    )
    await new Promise((r) => setTimeout(r, 1300))
    expect(screen.getByText('one')).toBeTruthy()
    expect(screen.queryByText('two')).toBeNull()
  })

  test('accepts image faces and a counter', () => {
    const { container } = render(<LiveTile title="people" counter={7} effect="peek" faces={[{ image: '/a.jpg', content: 'ana' }]} />)
    expect(container.querySelector('img.mt-live-tile-image')).toBeTruthy()
    expect(screen.getByText('ana')).toBeTruthy()
    expect(container.querySelector('.mt-tile-count')).toBeTruthy()
  })
})
