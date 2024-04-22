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
    ignores: [
      '**/eslint.config.mjs'
    ],
    rules: {
      '@typescript-eslint/array-type': 'warn',
      '@typescript-eslint/block-spacing': 'warn',
      '@typescript-eslint/comma-dangle': 'warn',
      '@typescript-eslint/comma-spacing': 'warn',
      '@typescript-eslint/consistent-indexed-object-style': 'warn',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/dot-notation': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/indent': 'warn',
      '@typescript-eslint/keyword-spacing': 'warn',
      '@typescript-eslint/lines-between-class-members': 'warn',
      '@typescript-eslint/member-delimiter-style': 'warn',
      '@typescript-eslint/naming-convention': 'warn',
      '@typescript-eslint/no-confusing-void-expression': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/object-curly-spacing': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/quotes': 'warn',
      '@typescript-eslint/require-array-sort-compare': 'warn',
      '@typescript-eslint/semi': 'warn',
      '@typescript-eslint/space-before-blocks': 'warn',
      '@typescript-eslint/space-before-function-paren': 'warn',
      '@typescript-eslint/space-infix-ops': 'warn',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/type-annotation-spacing': 'warn',
      'array-bracket-spacing': 'warn',
      'array-callback-return': 'warn',
      curly: 'warn',
      'eol-last': 'warn',
      eqeqeq: 'warn',
      'new-cap': 'warn',
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': 'warn',
      'no-return-assign': 'warn',
      'no-useless-return': 'warn',
      'object-curly-newline': 'warn',
      'object-property-newline': 'warn',
      'object-shorthand': 'warn',
      'quote-props': 'warn',
      'space-in-parens': 'warn'
    }
  }
]
