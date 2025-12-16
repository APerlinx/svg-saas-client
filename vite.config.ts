import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  esbuild: {
    // Remove console.log and debugger statements in production builds
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}))
