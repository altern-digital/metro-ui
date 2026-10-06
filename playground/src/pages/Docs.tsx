import { href } from '../router'
import { GUIDES } from './guides'

export function Docs({ slug }: { slug?: string }) {
  const index = Math.max(0, GUIDES.findIndex((g) => g.slug === slug))
  const guide = GUIDES[index]!
  const prev = GUIDES[index - 1]
  const next = GUIDES[index + 1]
  const Body = guide.body
  return (
    <article className="site-article">
      <h1 className="site-h1">{guide.title}</h1>
      <p className="site-lead">{guide.lead}</p>
      <Body />
      <nav className="site-pager" aria-label="pages">
        {prev ? (
          <a href={href(`/docs/${prev.slug}`)}>
            <small>previous</small>
            {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={href(`/docs/${next.slug}`)} data-next>
            <small>next</small>
            {next.title}
          </a>
        ) : (
          <a href={href('/components')} data-next>
            <small>next</small>
            components
          </a>
        )}
      </nav>
    </article>
  )
}
