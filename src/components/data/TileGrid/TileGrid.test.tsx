import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Tile } from '../Tile/Tile'
import { TileGrid } from './TileGrid'

describe('TileGrid', () => {
  test('renders titled groups of tiles', () => {
    const { container } = render(
      <TileGrid
        layout="horizontal"
        tileSize={120}
        groups={[
          { title: 'life at a glance', tiles: <Tile title="mail" /> },
          { title: 'play and explore', tiles: <Tile title="music" /> },
        ]}
      />,
    )
    const root = container.querySelector('.mt-tile-grid') as HTMLElement
    expect(root.dataset.layout).toBe('horizontal')
    expect(root.style.getPropertyValue('--_base')).toBe('120px')
    expect(screen.getByRole('region', { name: 'life at a glance' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)
    expect(screen.getByText('music')).toBeTruthy()
  })

  test('puts children in one group and stacks on mobile', () => {
    const { container } = render(
      <ConfigProvider platform="mobile" motion="none">
        <TileGrid>
          <Tile title="phone" />
        </TileGrid>
      </ConfigProvider>,
    )
    expect((container.querySelector('.mt-tile-grid') as HTMLElement).dataset.layout).toBe('vertical')
    expect(container.querySelectorAll('.mt-tile-grid-group')).toHaveLength(1)
    expect(container.querySelector('.mt-tile-grid-title')).toBeNull()
  })
})
