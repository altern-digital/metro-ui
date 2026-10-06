import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    motion: 'src/motion/index.ts',
    hooks: 'src/hooks/index.ts',
  },
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  dts: true,
  clean: true,
  // Every component uses hooks: the whole library is client code for React
  // Server Components (Next's app router).
  banner: { js: "'use client';" },
  deps: {
    // easing-utils ships CommonJS only; bundling it lets our build tree-shake
    // it, so consumers get just the curves we use and no CJS interop.
    onlyBundle: ['easing-utils'],
  },
})
