// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig } from 'eslint/config'
import storybook from 'eslint-plugin-storybook'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import typedNextjsRoutes from './eslint-rules/typed-nextjs-routes.js'

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next-build/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'tailwind.config.ts',
      'packages/shared/dist/**',
    ],
  },
  {
    // Custom rules plugin
    plugins: {
      custom: {
        rules: {
          'typed-nextjs-routes': typedNextjsRoutes,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'error',
      // React Compiler handles optimization - disable manual optimization rules
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off',
      // Custom rule: Enforce typed Next.js API routes
      'custom/typed-nextjs-routes': 'warn',

      // Code complexity rules
      complexity: ['warn', { max: 30 }], // Cyclomatic complexity
      'max-depth': ['warn', { max: 4 }], // Max nested blocks
      'max-lines-per-function': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-nested-callbacks': ['warn', { max: 10 }],
    },
  },
  ...storybook.configs['flat/recommended'],
  ...tanstackQuery.configs['flat/recommended'],
  // Temporary: Ignore files with React Compiler errors pending architectural refactor
])
