import type { ComponentDoc } from '../../types'

export default {
  name: 'PullToRefresh',
  category: 'mobile',
  summary: 'Pull down at the top of a list to refresh it, with the Metro dots while it loads.',
  platform: 'mobile',
  description:
    'The content follows the finger down with growing resistance. Past `threshold` the arrow turns over and the label changes. Let go there and `onRefresh` runs while the five Metro dots stream across, until its promise settles.\n\nWith `target="self"` (default) the component is the scroller, so give it a height. With `target="window"` the page scrolls and the component only wraps the content.\n\nIt responds to touch only. Give mouse and keyboard users a refresh button as well.',
  examples: ['Basic', 'Labels'],
  props: [
    { name: 'onRefresh', type: '() => Promise<unknown> | void', required: true, description: 'Runs on release past the threshold. The dots show until it settles.' },
    { name: 'threshold', type: 'number', default: '72', description: 'How far the pull has to go, in px after resistance.' },
    { name: 'target', type: "'self' | 'window'", default: "'self'", description: 'Which element scrolls: this one, or the page.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Ignore pulls.' },
    { name: 'pullLabel', type: 'ReactNode', default: "locale 'pullToRefresh'", description: 'Shown while pulling.' },
    { name: 'releaseLabel', type: 'ReactNode', default: "locale 'releaseToRefresh'", description: 'Shown past the threshold.' },
    { name: 'children', type: 'ReactNode', description: 'The list.' },
  ],
  accessibility: [
    'While refreshing it sets `aria-busy` and announces the locale `loading` through a `status` region.',
    'The pull indicator is decorative and hidden from screen readers.',
    'Touch only: pair it with a refresh button for other inputs.',
  ],
} satisfies ComponentDoc
