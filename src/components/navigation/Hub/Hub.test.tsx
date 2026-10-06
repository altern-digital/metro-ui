import { describe, expect, test } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { ConfigProvider } from '../../../config/ConfigProvider'
import { Hub } from './Hub'

const sections = [
  { key: 'a', title: 'featured', content: <p>one</p>, width: 520 },
  { key: 'b', title: 'recent', content: <p>two</p> },
]

describe('Hub', () => {
  test('renders the title and sections as headings', () => {
    const { container } = render(<Hub title="music" sections={sections} background="/bg.jpg" />)
    expect(screen.getByRole('heading', { level: 1, name: 'music' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['featured', 'recent'])
    expect(screen.getByRole('region', { name: 'featured' })).toBeTruthy()
    expect(container.querySelector<HTMLElement>('.mt-hub-bg')?.style.backgroundImage).toContain('/bg.jpg')
  })

  test('desktop sections take their width', () => {
    render(<Hub title="music" sections={sections} />)
    expect(screen.getByRole('region', { name: 'featured' }).style.getPropertyValue('--_w')).toBe('520px')
  })

  test('on a phone it is a panorama of full-width panels', () => {
    const { container } = render(
      <ConfigProvider platform="mobile">
        <Hub title="music" sections={sections} headingLevel={2} />
      </ConfigProvider>,
    )
    expect(container.querySelector<HTMLElement>('.mt-hub')?.dataset.platform).toBe('mobile')
    expect(screen.getByRole('region', { name: 'featured' }).style.getPropertyValue('--_w')).toBe('')
    expect(screen.getByRole('heading', { level: 2, name: 'music' })).toBeTruthy()
  })

  test('the platform prop forces a form', () => {
    const { container } = render(<Hub sections={sections} platform="mobile" />)
    expect(container.querySelector<HTMLElement>('.mt-hub')?.dataset.platform).toBe('mobile')
  })
})
