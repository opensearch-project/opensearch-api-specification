/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger } from 'Logger'
import MergedOpenApiSpec from "tester/MergedOpenApiSpec"

describe('merged API spec', () => {
  const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete', new Logger())

  test('has an api version', () => {
    expect(spec.api_version()).toEqual('1.2.3')
  })

  test('paths', () => {
    expect(spec.paths()).toEqual({
      '/_nodes/{id}': ['get', 'post'],
      '/index': ['get'],
      '/nodes': ['get']
    })
  })

  describe('unevaluatedProperties', () => {
    const responses: any = spec.spec().components?.responses

    test('is added with required fields', () => {
      const schema = responses['info@200'].content['application/json'].schema
      expect(schema.unevaluatedProperties).toEqual({ not: true, errorMessage: 'property is not defined in the spec' })
    })

    test('is added when no required fields', () => {
      const schema = responses['info@500'].content['application/json'].schema
      expect(schema.unevaluatedProperties).toEqual({ not: true, errorMessage: 'property is not defined in the spec' })
    })

    test('is not added to empty object schema', () => {
      const schema = responses['info@503'].content['application/json'].schema
      expect(schema.unevaluatedProperties).toBeUndefined()
    })

    test('is not added when true', () => {
      const schema = responses['info@201'].content['application/json'].schema
      expect(schema.unevaluatedProperties).toEqual(true)
    })

    test('is not added when object', () => {
      const schema = responses['info@404'].content['application/json'].schema
      expect(schema.unevaluatedProperties).toEqual({ type: 'object' })
    })
  })
})
