/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import GenericLabeler from 'merger/GenericLabeler'

const ref = (name: string): Record<string, string> => ({ $ref: `#/components/schemas/${name}` })

// Shapes from the bundled spec, reduced to what the labeler looks at.
const spec = (): Record<string, any> => ({
  components: {
    schemas: {
      TDocument: { 'x-is-generic-type-parameter': true },
      TBucket: { 'x-is-generic-type-parameter': true },
      Hit: { type: 'object', properties: { _id: { type: 'string' }, _source: ref('TDocument') } },
      HitsMetadata: {
        type: 'object',
        properties: { hits: { type: 'array', items: { allOf: [ref('Hit'), { type: 'object', properties: { _source: ref('TDocument') } }] } } }
      },
      SearchResult: {
        type: 'object',
        properties: {
          took: { type: 'integer' },
          hits: { allOf: [ref('HitsMetadata'), { type: 'object', properties: { hits: { type: 'array', items: { properties: { _source: ref('TDocument') } } } } }] }
        }
      },
      SearchResponse: { allOf: [ref('SearchResult'), { type: 'object' }] },
      SearchResultJsonValue: {
        allOf: [ref('SearchResult'), { type: 'object', properties: { hits: { type: 'object', properties: { hits: { type: 'array', items: { properties: { _source: {} } } } } } } }]
      },
      Buckets: {
        oneOf: [{ type: 'object', additionalProperties: ref('TBucket') }, { type: 'array', items: ref('TBucket') }],
        'x-union-kind': 'keyed-or-list'
      },
      MultiBucketAggregateBase: {
        type: 'object',
        properties: {
          buckets: { allOf: [ref('Buckets'), { oneOf: [{ type: 'object', additionalProperties: ref('TBucket') }, { type: 'array', items: ref('TBucket') }] }] }
        }
      },
      StringTermsBucket: { type: 'object', properties: { key: { type: 'string' } } },
      StringTermsAggregateBase: { allOf: [ref('MultiBucketAggregateBase'), { type: 'object', properties: { buckets: { type: 'array', items: ref('StringTermsBucket') } } }] },
      StringTermsAggregate: { allOf: [ref('StringTermsAggregateBase'), { type: 'object' }] },
      Plain: { allOf: [ref('StringTermsBucket'), { type: 'object', properties: { doc_count: { type: 'integer' } } }] }
    }
  }
})

describe('GenericLabeler', () => {
  const labeled = spec()
  const result = new GenericLabeler().label(labeled)
  const schemas = labeled.components.schemas

  test('an instantiation that replaces a parameter with a schema names it as the argument', () => {
    expect(schemas.StringTermsAggregateBase['x-type-arguments']).toEqual({ TBucket: ref('StringTermsBucket') })
    expect(schemas.SearchResultJsonValue['x-type-arguments']).toEqual({ TDocument: {} })
  })

  test('an instantiation that passes a parameter on names the parameter', () => {
    expect(schemas.HitsMetadata.properties.hits.items['x-type-arguments']).toEqual({ TDocument: ref('TDocument') })
    expect(schemas.SearchResponse['x-type-arguments']).toEqual({ TDocument: ref('TDocument') })
    expect(schemas.MultiBucketAggregateBase.properties.buckets['x-type-arguments']).toEqual({ TBucket: ref('TBucket') })
  })

  test('a plain $ref to a generic type is not an instantiation', () => {
    const plain = spec()
    plain.components.schemas.Raw = { type: 'object', properties: { hits: ref('HitsMetadata') } }
    new GenericLabeler().label(plain)
    expect(plain.components.schemas.Raw.properties.hits['x-type-arguments']).toBeUndefined()
  })

  test('a fully specialized type is no longer generic, and neither its subtypes nor plain types are labeled', () => {
    expect(schemas.StringTermsAggregate['x-type-arguments']).toBeUndefined()
    expect(schemas.Plain['x-type-arguments']).toBeUndefined()
  })

  test('the label is the only change, and labeling again gives the same labels', () => {
    const strip = (x: any): any => JSON.parse(JSON.stringify(x, (key, value) => key === 'x-type-arguments' ? undefined : value))
    expect(strip(labeled)).toEqual(spec())
    const again = JSON.parse(JSON.stringify(labeled)) as Record<string, any>
    new GenericLabeler().label(again)
    expect(again).toEqual(labeled)
    expect(result.unresolved).toEqual([])
  })

  test('an instantiation giving one parameter two different arguments is reported, not labeled', () => {
    const conflicting = spec()
    conflicting.components.schemas.Mixed = {
      allOf: [ref('Buckets'), { oneOf: [{ type: 'object', additionalProperties: ref('StringTermsBucket') }, { type: 'array', items: { type: 'string' } }] }]
    }
    const report = new GenericLabeler().label(conflicting)
    expect(report.unresolved).toEqual(['#/components/schemas/Mixed'])
    expect(conflicting.components.schemas.Mixed['x-type-arguments']).toBeUndefined()
  })
})
