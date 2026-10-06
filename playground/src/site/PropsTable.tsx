import type { PropDoc } from '../docs/types'

/** Props as a table on wide screens, as stacked rows on a phone (CSS). */
export function PropsTable({ props }: { props: PropDoc[] }) {
  if (props.length === 0) return <p className="site-muted">No props of its own.</p>
  return (
    <div className="site-props" role="table" aria-label="props">
      <div className="site-props-row site-props-head" role="row">
        <span role="columnheader">prop</span>
        <span role="columnheader">type</span>
        <span role="columnheader">default</span>
        <span role="columnheader">description</span>
      </div>
      {props.map((p) => (
        <div className="site-props-row" role="row" key={p.name}>
          <span role="cell" className="site-props-name">
            <code>{p.name}</code>
            {p.required && <em title="required">required</em>}
          </span>
          <span role="cell" className="site-props-type">
            <code>{p.type}</code>
          </span>
          <span role="cell" className="site-props-default">
            {p.default ? <code>{p.default}</code> : <span className="site-muted">–</span>}
          </span>
          <span role="cell" className="site-props-desc">
            {p.description.split(/(`[^`]+`)/).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))}
          </span>
        </div>
      ))}
    </div>
  )
}
