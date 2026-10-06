import { useEffect } from 'react'
import { CATEGORIES, DOC_BY_SLUG, DOCS } from '../registry'
import { href } from '../router'
import { Code, Prose } from '../site/Code'
import { Example } from '../site/Example'
import { PropsTable } from '../site/PropsTable'

const PLATFORM_NOTE = {
  all: 'Works the same everywhere.',
  adaptive: 'Adaptive: changes form between mobile and desktop by itself.',
  mobile: 'Made for phones; works with a mouse too.',
  desktop: 'Made for wide screens and a mouse.',
}

export function ComponentPage({ slug }: { slug: string }) {
  const doc = DOC_BY_SLUG.get(slug.toLowerCase())
  useEffect(() => {
    document.title = doc ? `${doc.name} · metro-ui` : 'metro-ui'
    return () => void (document.title = 'metro-ui')
  }, [doc])

  if (!doc) {
    return (
      <div className="site-article">
        <h1 className="site-h1">not found</h1>
        <p>
          No component called “{slug}”. See <a href={href('/components')}>all components</a>.
        </p>
      </div>
    )
  }

  const names = [doc.name, ...(doc.related ?? [])].filter((n) => /^[A-Z]/.test(n) || n.startsWith('use'))
  const index = DOCS.indexOf(doc)
  const category = CATEGORIES.find((c) => c.key === doc.category)

  return (
    <article className="site-article site-component">
      <p className="site-crumb">
        <a href={href('/components')}>components</a> / {category?.label}
      </p>
      <h1 className="site-h1">{doc.name}</h1>
      <p className="site-lead">{doc.summary}</p>
      <p className="site-platform">
        <span className="site-tag" data-platform={doc.platform}>
          {doc.platform}
        </span>{' '}
        {PLATFORM_NOTE[doc.platform]}
      </p>
      <Code code={`import { ${names.join(', ')} } from '@altern-digital/metro-ui'`} />
      {doc.description && (
        <div className="site-prose">
          <Prose text={doc.description} />
        </div>
      )}

      <nav className="site-toc" aria-label="on this page">
        {doc.demos.map((e) => (
          <a key={e.id} href={`#ex-${e.id}`} onClick={(ev) => (ev.preventDefault(), document.getElementById(`ex-${e.id}`)?.scrollIntoView({ behavior: 'smooth' }))}>
            {e.title}
          </a>
        ))}
        <a href="#props" onClick={(ev) => (ev.preventDefault(), document.getElementById('props')?.scrollIntoView({ behavior: 'smooth' }))}>
          props
        </a>
      </nav>

      <h2 className="site-h2">examples</h2>
      {doc.demos.map((e) => (
        <Example key={e.id} example={e} anchor={`ex-${e.id}`} />
      ))}

      <h2 className="site-h2" id="props">
        props
      </h2>
      <PropsTable props={doc.props} />
      {Object.entries(doc.extraProps ?? {}).map(([name, props]) => (
        <div key={name}>
          <h3 className="site-h3">{name}</h3>
          <PropsTable props={props} />
        </div>
      ))}

      {doc.accessibility && doc.accessibility.length > 0 && (
        <>
          <h2 className="site-h2">accessibility</h2>
          <ul className="site-list">
            {doc.accessibility.map((a, i) => (
              <li key={i}>
                {a.split(/(`[^`]+`)/).map((part, j) => (part.startsWith('`') ? <code key={j}>{part.slice(1, -1)}</code> : part))}
              </li>
            ))}
          </ul>
        </>
      )}

      <nav className="site-pager" aria-label="components">
        {index > 0 ? (
          <a href={href(`/components/${DOCS[index - 1]!.slug}`)}>
            <small>previous</small>
            {DOCS[index - 1]!.name}
          </a>
        ) : (
          <span />
        )}
        {index < DOCS.length - 1 && (
          <a href={href(`/components/${DOCS[index + 1]!.slug}`)} data-next>
            <small>next</small>
            {DOCS[index + 1]!.name}
          </a>
        )}
      </nav>
    </article>
  )
}
