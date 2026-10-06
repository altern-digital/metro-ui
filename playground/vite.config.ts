import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const src = (path: string) => fileURLToPath(new URL(`../src/${path}`, import.meta.url))

/**
 * The docs site. It imports the library from source, the way the examples
 * are written (`from '@altern-digital/metro-ui'`), so what it shows is what
 * ships. `BASE` is the GitHub Pages path (`/metro-ui/`) when building there.
 */
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@altern-digital\/metro-ui$/, replacement: src('index.ts') },
      { find: /^@altern-digital\/metro-ui\/motion$/, replacement: src('motion/index.ts') },
      { find: /^@altern-digital\/metro-ui\/hooks$/, replacement: src('hooks/index.ts') },
      { find: /^@altern-digital\/metro-ui\/styles\.css$/, replacement: src('styles/index.css') },
    ],
  },
  server: { port: 5199 },
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 1500 },
})
