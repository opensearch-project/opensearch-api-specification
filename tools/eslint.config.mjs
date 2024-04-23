import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'

// mimic CommonJS variables -- not needed if using CommonJS
const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const compat = new FlatCompat({ baseDirectory: _dirname, recommendedConfig: pluginJs.configs.recommended })

export default [
  pluginJs.configs.recommended,
  ...compat.extends('standard-with-typescript'),
  {
    files: ['**/*.{js,ts}'],
    // to auto-fix disable all rules except the one you want to fix with '@rule': 'warn', then run `npm run lint -- --fix`
    rules: {
      '@typescript-eslint/array-type': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/dot-notation': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/naming-convention': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/require-array-sort-compare': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      'array-callback-return': 'warn',
      'new-cap': 'warn',
      'no-return-assign': 'warn',
      'no-useless-return': 'warn',
      'object-shorthand': 'warn'
    }
  }
]
