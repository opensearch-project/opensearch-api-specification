/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger } from 'Logger'
import _ from 'lodash'
import MergedOpenApiSpec from "tester/MergedOpenApiSpec"

describe('merged API spec', () => {
  describe('defaults', () => {
    const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete', undefined, new Logger())

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

    test('has all responses', () => {
      expect(_.keys(spec.spec().paths['/index']?.get?.responses)).toEqual([
        '200', '201', '404', '500', 'added-2.0', 'removed-2.0', 'added-1.3-removed-2.0', 'added-2.1'
      ])
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

  describe('1.3', () => {
    const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete', '1.3', new Logger())

    test('has matching responses', () => {
      expect(_.keys(spec.spec().paths['/index']?.get?.responses)).toEqual([
        '200', '201', '404', '500', 'removed-2.0', 'added-1.3-removed-2.0'
      ])
    })
  })

  describe('2.0', () => {
    const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete', '2.0', new Logger())

    test('has matching responses', () => {
      expect(_.keys(spec.spec().paths['/index']?.get?.responses)).toEqual([
        '200', '201', '404', '500', 'added-2.0'
      ])
    })
  })

  describe('2.1', () => {
    const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete', '2.1', new Logger())

    test('has matching responses', () => {
      expect(_.keys(spec.spec().paths['/index']?.get?.responses)).toEqual([
        '200', '201', '404', '500', 'added-2.0', 'added-2.1'
      ])
    })
  })
})
