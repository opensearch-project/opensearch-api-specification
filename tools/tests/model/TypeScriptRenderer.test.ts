/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs'
import path from 'path'
import tmp from 'tmp'
import ts from 'typescript'
import ClientModelBuilder from 'model/ClientModelBuilder'
import TypeScriptRenderer from 'model/TypeScriptRenderer'
import OpenApiMerger from 'merger/OpenApiMerger'
import { Logger, LogLevel } from 'Logger'

// Compiles the rendered model with `usage` under --strict and returns the lines of `usage` that have errors.
const error_lines = (declarations: string, usage: string): number[] => {
  const dir = tmp.dirSync({ unsafeCleanup: true })
  try {
    fs.writeFileSync(path.join(dir.name, 'model.ts'), declarations)
    const usage_file = path.join(dir.name, 'usage.ts')
    fs.writeFileSync(usage_file, usage)
    const program = ts.createProgram([usage_file], { strict: true, noEmit: true, target: ts.ScriptTarget.ES2020, skipLibCheck: true })
    const diagnostics = ts.getPreEmitDiagnostics(program)
    const in_model = diagnostics.filter((d) => d.file?.fileName.endsWith('model.ts'))
    if (in_model.length > 0) throw new Error(ts.flattenDiagnosticMessageText(in_model[0].messageText, '\n'))
    return diagnostics.filter((d) => d.file !== undefined && d.start !== undefined)
      .map((d) => (d.file as ts.SourceFile).getLineAndCharacterOfPosition(d.start as number).line + 1)
  } finally {
    dir.removeCallback()
  }
}

// Each case is one line: valid cases must compile, cases marked INVALID must not.
const check = (declarations: string, imports: string, cases: string[]): void => {
  const usage = [imports, ...cases].join('\n')
  const expected = cases.flatMap((line, index) => line.includes('INVALID') ? [index + 2] : [])
  expect(error_lines(declarations, usage)).toEqual(expected)
}

describe('TypeScriptRenderer on the bundled spec', () => {
  const spec = new OpenApiMerger('./spec', new Logger(LogLevel.error)).spec() as Record<string, any>
  const declarations = new TypeScriptRenderer().render(new ClientModelBuilder(spec).build())

  test('AggregationContainer: exactly one variant, bucket-only sub-aggregations, the spec\'s `not`, recursion', () => {
    check(declarations, "import type { _common_aggregations___AggregationContainer as Agg } from './model'", [
      "export const a1: Agg = { meta: { a: 1 }, avg: { field: 'price' } }",
      "export const a2: Agg = { terms: { field: 't' }, aggs: { d: { date_histogram: { field: 'ts' }, aggs: { m: { max: { field: 'p' } } } } } }",
      "export const a3: Agg = { filters: { filters: {} }, aggregations: { n: { value_count: { field: 'id' } } } }",
      'export const e1: Agg = { meta: {} } // INVALID: no variant',
      "export const e2: Agg = { avg: { field: 'a' }, sum: { field: 'b' } } // INVALID: two variants",
      "export const e3: Agg = { avg: { field: 'a' }, aggs: {} } // INVALID: sub-aggregations on a metric",
      "export const e4: Agg = { terms: { field: 't' }, aggs: {}, aggregations: {} } // INVALID: the spec's not",
      "export const e5: Agg = { terms: { field: 't' }, aggs: { x: { not_a_variant: { field: 'p' } } } } // INVALID: unknown variant"
    ])
  })

  test('TermsLookup, TermsQuery and SemanticProperty', () => {
    check(declarations, 'import type { _common_query_dsl___TermsLookup as TL, _common_query_dsl___TermsQuery as TQ, ' +
      "_common_mapping___SemanticProperty as SP, _common_mapping___Property as P } from './model'", [
      "export const t1: TL = { index: 'users', id: '1', path: 'followers', routing: 'r1' }",
      "export const t2: TQ = { boost: 1, user_id: { index: 'users', id: '1', path: 'followers' } }",
      "export const t3: TQ = { user_id: ['1', '2'] }",
      "export const s1: SP = { type: 'semantic', model_id: 'm', chunking: true }",
      "export const s2: P = { type: 'semantic', model_selection: {} }",
      "export const e1: TL = { index: 'u', path: 'p', id: '1', query: { match_all: {} } } // INVALID: id and query",
      "export const e2: TL = { index: 'u', path: 'p' } // INVALID: neither id nor query",
      "export const e3: TL = { path: 'p', id: '1' } // INVALID: index is required",
      "export const e4: SP = { type: 'semantic' } // INVALID: neither model_id nor model_selection",
      "export const e5: SP = { type: 'text', model_id: 'm' } // INVALID: wrong tag"
    ])
  })
})
