import { useUncontrolled } from '@mantine/hooks'
import { useMemo, type CSSProperties, type HTMLAttributes, type Key, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { useConfig, useDefaults, useLocale } from '../../../config/context'
import { cx, flag } from '../../../utils'

export type SortDirection = 'asc' | 'desc'
export interface TableSort {
  key: string
  direction: SortDirection
}

export interface TableColumn<T> {
  /** Which field of a row it shows (and sorts by), unless `render` and `sortValue` say otherwise. */
  key: string
  title: ReactNode
  /** Pixels or any CSS length. */
  width?: number | string
  /** Numbers go `right`, set in tabular figures. */
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  /** The cell's content. Default the row's `key` field. */
  render?: (row: T, index: number) => ReactNode
  /** What to sort by, when the field itself isn't it. */
  sortValue?: (row: T) => string | number | null | undefined
  /** This column's cell in the footer row: a total. */
  footer?: ReactNode
}

export interface TableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: TableColumn<T>[]
  data: T[]
  /** A row's key: a field name or a function. Default `id`, else the index. */
  rowKey?: keyof T | ((row: T, index: number) => Key)
  /** Current sort (controlled). `null` is unsorted. */
  sort?: TableSort | null
  defaultSort?: TableSort | null
  onSortChange?: (sort: TableSort | null) => void
  /** Leave the rows in the order given and only report sort changes, for sorting on a server. */
  manualSort?: boolean
  onRowClick?: (row: T, index: number) => void
  /** Dims the rows and runs a thin bar under the header. */
  loading?: boolean
  /** Shown when there are no rows. Default the locale's `empty`. */
  empty?: ReactNode
  /** Alternate row shading. Off by default: Metro separates rows with lines. */
  striped?: boolean
  /** Scroll inside this height, with the header stuck on top. */
  maxHeight?: number | string
  /** On mobile: `cards` (default) stacks each row as a card of `title: value`; `scroll` keeps the table and scrolls it sideways. */
  mobileLayout?: 'cards' | 'scroll'
  /** A caption for screen readers and, if visible, above the table. */
  caption?: ReactNode
  ref?: Ref<HTMLDivElement>
}

const cellValue = <T,>(row: T, col: TableColumn<T>, index: number): ReactNode =>
  col.render ? col.render(row, index) : ((row as Record<string, unknown>)[col.key] as ReactNode)

const sortValue = <T,>(row: T, col: TableColumn<T>): unknown => (col.sortValue ? col.sortValue(row) : (row as Record<string, unknown>)[col.key])

function compare(a: unknown, b: unknown): number {
  if (a == null) return b == null ? 0 : 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

function Chevron({ up }: { up: boolean }) {
  return (
    <svg className="mt-table-sort-glyph" viewBox="0 0 16 16" width="1em" height="1em" aria-hidden>
      <path d={up ? 'M3 10.5 8 5.5l5 5' : 'M3 5.5l5 5 5-5'} fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/**
 * A flat data table: thin lines between rows, muted header, numbers right
 * aligned in tabular figures, sortable columns and a totals row. On a phone
 * each row becomes a card unless `mobileLayout="scroll"`.
 *
 * ```tsx
 * <Table columns={[{ key: 'name', title: 'name', sortable: true }, { key: 'amount', title: 'amount', align: 'right' }]} data={rows} />
 * ```
 */
export function Table<T>(props: TableProps<T>) {
  const {
    columns,
    data,
    rowKey,
    sort,
    defaultSort,
    onSortChange,
    manualSort,
    onRowClick,
    loading,
    empty,
    striped,
    maxHeight,
    mobileLayout = 'cards',
    caption,
    className,
    style,
    ...rest
  } = useDefaults('Table', props)
  const { platform } = useConfig()
  const locale = useLocale()
  const [current, setSort] = useUncontrolled<TableSort | null>({ value: sort, defaultValue: defaultSort, finalValue: null, onChange: onSortChange })
  const cards = platform === 'mobile' && mobileLayout === 'cards'

  const rows = useMemo(() => {
    const col = current && columns.find((c) => c.key === current.key)
    if (!col || manualSort) return data.map((row, index) => ({ row, index }))
    const sign = current.direction === 'asc' ? 1 : -1
    return data
      .map((row, index) => ({ row, index }))
      .sort((a, b) => sign * compare(sortValue(a.row, col), sortValue(b.row, col)) || a.index - b.index)
  }, [data, columns, current, manualSort])

  const keyOf = (row: T, index: number): Key => {
    if (typeof rowKey === 'function') return rowKey(row, index)
    const v = (row as Record<string, unknown>)[(rowKey as string | undefined) ?? 'id']
    return typeof v === 'string' || typeof v === 'number' ? v : index
  }

  const toggle = (key: string) =>
    setSort(current?.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' })

  const hasFooter = columns.some((c) => c.footer != null)
  const clickable = !!onRowClick
  const rowProps = (row: T, index: number) =>
    clickable
      ? {
          tabIndex: 0,
          'data-mt-press': '',
          'data-mt-hover': '',
          'data-clickable': '',
          onClick: () => onRowClick(row, index),
          onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onRowClick(row, index)
            }
          },
        }
      : {}

  const shared = {
    ...rest,
    className: cx('mt-table', className),
    style: { ...style, ...(maxHeight !== undefined && { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }) } as CSSProperties,
    'data-loading': flag(loading),
    'data-striped': flag(striped),
    'data-layout': cards ? 'cards' : 'table',
    'data-scroll': flag(maxHeight !== undefined),
    'aria-busy': loading || undefined,
  }

  if (cards) {
    return (
      <div {...shared}>
        {caption != null && <div className="mt-table-caption">{caption}</div>}
        {loading && <div className="mt-table-progress" aria-hidden><i /></div>}
        <div className="mt-table-cards" role="list">
          {rows.map(({ row, index }) => (
            <div key={keyOf(row, index)} className="mt-table-card" role="listitem" {...rowProps(row, index)}>
              <dl>
                {columns.map((col) => (
                  <div key={col.key} className="mt-table-card-field" data-align={col.align}>
                    <dt>{col.title}</dt>
                    <dd>{cellValue(row, col, index)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          {hasFooter && rows.length > 0 && (
            <div className="mt-table-card" role="listitem" data-footer="">
              <dl>
                {columns
                  .filter((col) => col.footer != null)
                  .map((col) => (
                    <div key={col.key} className="mt-table-card-field" data-align={col.align}>
                      <dt>{col.title}</dt>
                      <dd>{col.footer}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          )}
        </div>
        {rows.length === 0 && !loading && <div className="mt-table-empty">{empty ?? locale.empty}</div>}
      </div>
    )
  }

  return (
    <div {...shared}>
      <table className="mt-table-table">
        {caption != null && <caption className="mt-table-caption">{caption}</caption>}
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} style={col.width !== undefined ? { width: typeof col.width === 'number' ? `${col.width}px` : col.width } : undefined} />
          ))}
        </colgroup>
        <thead className="mt-table-head">
          <tr>
            {columns.map((col) => {
              const sorted = current?.key === col.key ? current.direction : undefined
              return (
                <th
                  key={col.key}
                  scope="col"
                  data-align={col.align}
                  aria-sort={col.sortable ? (sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none') : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className="mt-table-sort" data-sorted={sorted} data-mt-press="" onClick={() => toggle(col.key)}>
                      <span>{col.title}</span>
                      <Chevron up={sorted !== 'desc'} />
                    </button>
                  ) : (
                    col.title
                  )}
                </th>
              )
            })}
          </tr>
          <tr className="mt-table-rule" aria-hidden>
            <td colSpan={columns.length}>{loading && <i />}</td>
          </tr>
        </thead>
        <tbody className="mt-table-body">
          {rows.map(({ row, index }) => (
            <tr key={keyOf(row, index)} className="mt-table-row" {...rowProps(row, index)}>
              {columns.map((col) => (
                <td key={col.key} data-align={col.align}>
                  {cellValue(row, col, index)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && !loading && (
            <tr>
              <td className="mt-table-empty" colSpan={columns.length}>
                {empty ?? locale.empty}
              </td>
            </tr>
          )}
        </tbody>
        {hasFooter && (
          <tfoot className="mt-table-foot">
            <tr>
              {columns.map((col) => (
                <td key={col.key} data-align={col.align}>
                  {col.footer}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
