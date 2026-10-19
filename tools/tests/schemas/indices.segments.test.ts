/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import { type OpenAPIV3_1 } from 'openapi-types'
import { Logger } from 'Logger'
import MergedOpenApiSpec from 'tester/MergedOpenApiSpec'
import SchemaValidator from 'tester/SchemaValidator'
import { Result } from 'tester/types/eval.types'

describe('indices.segments response schema', () => {
  const spec = new MergedOpenApiSpec('spec').spec()
  const response = spec.components?.responses?.['indices.segments___200'] as OpenAPIV3_1.ResponseObject
  const schema = response.content?.['application/json'].schema as OpenAPIV3_1.SchemaObject
  const validator = new SchemaValidator(spec, new Logger())
  const segment = {
    generation: 0,
    num_docs: 1,
    deleted_docs: 0,
    size_in_bytes: 1024,
    committed: true,
    search: true,
    version: '10.3.0',
    compound: false,
    attributes: { codec: 'test' }
  }

  function payload(segment_data: Record<string, unknown>): Record<string, unknown> {
    return {
      _shards: { total: 1, successful: 1, failed: 0 },
      indices: {
        movies: {
          shards: {
            '0': [{
              routing: { state: 'STARTED', primary: true, node: 'test-node' },
              num_committed_segments: 1,
              num_search_segments: 1,
              segments: { _0: segment_data }
            }]
          }
        }
      }
    }
  }

  test.each(['attributes', 'compound', 'version'])('accepts omitted %s', field => {
    expect(validator.validate(schema, payload(_.omit(segment, field)))).toEqual({ result: Result.PASSED })
  })

  test('accepts all optional segment metadata omitted', () => {
    expect(validator.validate(schema, payload(_.omit(segment, ['attributes', 'compound', 'version']))))
      .toEqual({ result: Result.PASSED })
  })

  test.each([false, true])('accepts present metadata with compound=%s', compound => {
    expect(validator.validate(schema, payload({ ...segment, compound }))).toEqual({ result: Result.PASSED })
  })

  test.each(['committed', 'deleted_docs', 'generation', 'num_docs', 'search', 'size_in_bytes'])(
    'still requires %s',
    field => {
      expect(validator.validate(schema, payload(_.omit(segment, field))).result).toBe(Result.FAILED)
    }
  )

  test.each<[string, unknown]>([
    ['attributes', 'invalid'],
    ['compound', 'false'],
    ['version', 10],
    ['attributes', null],
    ['compound', null],
    ['version', null]
  ])('rejects invalid %s=%s', (field, value) => {
    expect(validator.validate(schema, payload({ ...segment, [field]: value })).result).toBe(Result.FAILED)
  })
})
