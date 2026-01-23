import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/e2e/**',
      '**/.storybook/**',
      '**/packages/**',
      '**/coverage/**',
      '**/.git/**',
    ],
    // Disable watch mode by default to avoid EMFILE errors
    watch: false,
    // Pool options to limit resource usage
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false, // Changed to false to prevent mock pollution between test files
        maxForks: 4, // Limit concurrent forks to avoid resource exhaustion
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        '.storybook/',
        'coverage/',
        '**/*.config.{ts,js}',
        '**/*.d.ts',
        '**/types/**',
        '**/__tests__/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@mimisalon/shared': path.resolve(dirname, './packages/shared/src'),
    },
  },
})
