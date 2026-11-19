/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import UnionDistributor from 'merger/UnionDistributor'

const ref = (name: string): Record<string, string> => ({ $ref: `#/components/schemas/${name}` })
const spec = (schemas: Record<string, any>): Record<string, any> => ({ components: { schemas }, paths: {} })

describe('UnionDistributor', () => {
  test('rewrites an object with a union member into a union of complete objects, titled after the property each adds', () => {
    const s = spec({
      Metric: {
        description: 'A metric.',
        allOf: [
          { type: 'object', properties: { missing: { type: 'string' } } },
          { anyOf: [{ properties: { field: { type: 'string' } } }, { properties: { script: { type: 'string' } } }] }
        ]
      }
    })
    const result = new UnionDistributor().distribute(s)
    expect(s.components.schemas.Metric).toEqual({
      description: 'A metric.',
      anyOf: [
        { allOf: [{ type: 'object', properties: { missing: { type: 'string' } } }, { properties: { field: { type: 'string' } } }], title: 'field' },
        { allOf: [{ type: 'object', properties: { missing: { type: 'string' } } }, { properties: { script: { type: 'string' } } }], title: 'script' }
      ]
    })
    expect(result).toEqual({ rewritten: ['#/components/schemas/Metric'], skipped: [], branches: 2 })
  })

  test('multiplies several union members out, as a oneOf when every member is one', () => {
    const s = spec({
      Range: {
        allOf: [
          { oneOf: [{ required: ['gt'] }, { required: ['gte'] }] },
          { oneOf: [{ required: ['lt'] }, { required: ['lte'] }] }
        ]
      }
    })
    new UnionDistributor().distribute(s)
    expect(s.components.schemas.Range).toEqual({
      oneOf: [
        { allOf: [{ required: ['gt'] }, { required: ['lt'] }] },
        { allOf: [{ required: ['gt'] }, { required: ['lte'] }] },
        { allOf: [{ required: ['gte'] }, { required: ['lt'] }] },
        { allOf: [{ required: ['gte'] }, { required: ['lte'] }] }
      ]
    })
  })

  test('rewrites a schema that extends a rewritten one, and keeps titles and discriminators', () => {
    const s = spec({
      Base: { allOf: [{ properties: { a: { type: 'string' } } }, { oneOf: [{ title: 'x', ...ref('X') }, { title: 'y', ...ref('Y') }], discriminator: { propertyName: 'kind' } }] },
      Child: { allOf: [ref('Base'), { properties: { b: { type: 'string' } } }] },
      X: { type: 'object', properties: { kind: { type: 'string' } } },
      Y: { type: 'object', properties: { kind: { type: 'string' } } }
    })
    const result = new UnionDistributor().distribute(s)
    expect(s.components.schemas.Child).toEqual({
      oneOf: [
        { allOf: [{ properties: { b: { type: 'string' } } }, { properties: { a: { type: 'string' } } }, ref('X')], title: 'x' },
        { allOf: [{ properties: { b: { type: 'string' } } }, { properties: { a: { type: 'string' } } }, ref('Y')], title: 'y' }
      ],
      discriminator: { propertyName: 'kind' }
    })
    expect(result.rewritten).toEqual(['#/components/schemas/Base', '#/components/schemas/Child'])
  })

  test('leaves the specialization of a generic union, and objects without a union member', () => {
    const buckets = { oneOf: [{ type: 'object', additionalProperties: ref('TBucket') }, { type: 'array', items: ref('TBucket') }] }
    const instantiation = { allOf: [ref('Buckets'), { oneOf: [{ type: 'object', additionalProperties: ref('B') }, { type: 'array', items: ref('B') }] }] }
    const plain = { allOf: [ref('B'), { properties: { a: { type: 'string' } } }] }
    const s = spec({ Buckets: buckets, BBuckets: instantiation, Plain: plain, B: { type: 'object' }, TBucket: { type: 'object', 'x-is-generic-type-parameter': true } })
    const result = new UnionDistributor().distribute(s)
    expect(s.components.schemas.BBuckets).toEqual(instantiation)
    expect(s.components.schemas.Plain).toEqual(plain)
    expect(result).toEqual({ rewritten: [], skipped: [{ location: '#/components/schemas/BBuckets', reason: 'specializes a generic union' }], branches: 0 })
  })

  test('drops an empty object member from the branches', () => {
    const s = spec({
      Base: { allOf: [{ properties: { a: { type: 'string' } } }, { anyOf: [{ properties: { f: { type: 'string' } } }, { properties: { g: { type: 'string' } } }] }] },
      Empty: { allOf: [ref('Base'), { type: 'object' }] }
    })
    new UnionDistributor().distribute(s)
    expect(s.components.schemas.Empty).toEqual({
      anyOf: [
        { allOf: [{ properties: { a: { type: 'string' } } }, { properties: { f: { type: 'string' } } }], title: 'f' },
        { allOf: [{ properties: { a: { type: 'string' } } }, { properties: { g: { type: 'string' } } }], title: 'g' }
      ]
    })
  })

  test('leaves a presence constraint on properties the object declares', () => {
    const lookup = {
      allOf: [
        { type: 'object', properties: { id: { type: 'string' }, query: { type: 'object' } } },
        { oneOf: [{ type: 'object', required: ['id'] }, { type: 'object', required: ['query'] }] }
      ]
    }
    const s = spec({ Lookup: _.cloneDeep(lookup) })
    const result = new UnionDistributor().distribute(s)
    expect(s.components.schemas.Lookup).toEqual(lookup)
    expect(result).toEqual({ rewritten: [], skipped: [{ location: '#/components/schemas/Lookup', reason: 'presence constraint' }], branches: 0 })
  })

  test('is idempotent', () => {
    const s = spec({ Metric: { allOf: [{ properties: { m: { type: 'string' } } }, { anyOf: [{ required: ['m'] }, { properties: { s: { type: 'string' } } }] }] } })
    new UnionDistributor().distribute(s)
    const once = JSON.parse(JSON.stringify(s))
    expect(new UnionDistributor().distribute(s).rewritten).toEqual([])
    expect(s).toEqual(once)
  })
})
