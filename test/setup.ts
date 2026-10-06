import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach } from 'bun:test'

GlobalRegistrator.register()

// Imported after the DOM exists: testing-library reads `document` at load.
const { cleanup } = await import('@testing-library/react')
afterEach(cleanup)
