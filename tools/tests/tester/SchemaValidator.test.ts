/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3_1 } from 'openapi-types'
import OpenApiMerger from 'merger/OpenApiMerger'
import SchemaValidator from 'tester/SchemaValidator'
import { Result } from 'tester/types/eval.types'
import { Logger, LogLevel } from 'Logger'

// The spec tester validates responses against the merged spec, whose unions carry x-union-kind and x-variant-keys.
describe('SchemaValidator on the labeled spec', () => {
  const spec = new OpenApiMerger('./spec', new Logger(LogLevel.error)).spec()
  const validator = new SchemaValidator(spec, new Logger(LogLevel.error))
  const ref = (name: string): OpenAPIV3_1.SchemaObject => ({ $ref: `#/components/schemas/${name}` }) as any

  test('the merged spec has the labels', () => {
    const lookup = spec.components?.schemas?.['_common.query_dsl___TermsLookup'] as any
    expect(lookup.allOf[1]['x-union-kind']).toBe('presence')
    const container = spec.components?.schemas?.['_common.aggregations___AggregationContainer'] as any
    expect(container.allOf[1]['x-variant-keys']).toContain('avg')
  })

  test('validates a payload against a presence union', () => {
    const schema = ref('_common.query_dsl___TermsLookup')
    expect(validator.validate(schema, { index: 'i', path: 'p', id: '1' }).result).toBe(Result.PASSED)
    expect(validator.validate(schema, { index: 'i', path: 'p', id: '1', query: { match_all: {} } }).result).toBe(Result.FAILED)
  })

  test('validates a payload against a container union', () => {
    const schema = ref('_common.aggregations___AggregationContainer')
    expect(validator.validate(schema, { avg: { field: 'price' } }).result).toBe(Result.PASSED)
  })
})
