/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import UnionClassifier from 'merger/UnionClassifier'
import UnionLabeler from 'merger/UnionLabeler'

const ref = (name: string): Record<string, string> => ({ $ref: `#/components/schemas/${name}` })

// Shapes taken from the bundled spec, reduced to what classification looks at.
const schemas = (): Record<string, any> => ({
  Field: { type: 'string' },
  Id: { type: 'string' },
  Script: { type: 'object', properties: { source: { type: 'string' } } },
  QueryContainer: { type: 'object', properties: { match_all: { type: 'object' } } },
  FieldValue: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] },
  Aggregation: { type: 'object', properties: { meta: { type: 'object' } } },
  AverageAggregation: { type: 'object', properties: { field: ref('Field') } },
  BucketAggregationBase: { type: 'object', properties: { aggregations: { type: 'object' } } },
  HistogramAggregation: {
    allOf: [ref('BucketAggregationBase'), { type: 'object', properties: { histogram: { type: 'object' } }, required: ['histogram'] }]
  },
  AggregationContainer: {
    allOf: [ref('Aggregation'), {
      type: 'object',
      oneOf: [
        { properties: { avg: ref('AverageAggregation') }, required: ['avg'] },
        ref('HistogramAggregation')
      ]
    }]
  },
  TermsLookup: {
    type: 'object',
    allOf: [
      { type: 'object', properties: { index: ref('Field'), id: ref('Id'), path: ref('Field'), query: ref('QueryContainer') }, required: ['index', 'path'] },
      { oneOf: [{ properties: { id: ref('Id') }, required: ['id'] }, { properties: { query: ref('QueryContainer') }, required: ['query'] }] }
    ]
  },
  MetricAggregationBase: {
    allOf: [
      { type: 'object', properties: { missing: ref('FieldValue') } },
      { anyOf: [{ type: 'object', properties: { field: ref('Field') } }, { type: 'object', properties: { script: ref('Script') } }] }
    ]
  },
  Property: { discriminator: { propertyName: 'type' }, oneOf: [ref('Script'), ref('QueryContainer')] },
  TermsQueryField: { oneOf: [{ title: 'value', type: 'array', items: ref('FieldValue') }, { title: 'lookup', ...ref('TermsLookup') }] },
  Fields: { oneOf: [ref('Field'), { type: 'array', items: ref('Field') }] },
  Queries: { oneOf: [ref('QueryContainer'), { type: 'array', items: ref('QueryContainer') }] },
  Buckets: { oneOf: [{ type: 'object', additionalProperties: ref('Script') }, { type: 'array', items: ref('Script') }] },
  TermQuery: { oneOf: [ref('FieldValue'), { type: 'object', properties: { value: ref('FieldValue') }, required: ['value'] }] },
  RangeQuery: { oneOf: [ref('Script'), ref('QueryContainer')] }
})

describe('UnionClassifier', () => {
  const classifier = new UnionClassifier(schemas())
  const classify = (name: string, member?: number): any => {
    const schema = schemas()[name]
    if (member === undefined) return classifier.classify(schema as Record<string, any>)
    const siblings: any[] = schema.allOf
    return classifier.classify(siblings[member] as Record<string, any>, {
      properties: Object.assign({}, ...siblings.filter((_s, index) => index !== member).map((s) => classifier.resolve(s).properties))
    })
  }

  test('a discriminator makes a tagged union', () => { expect(classify('Property')).toEqual({ kind: 'tagged' }) })

  test('one distinct required object key per resolved branch makes a container, with its variant keys', () => {
    expect(classify('AggregationContainer', 1)).toEqual({ kind: 'container', variant_keys: ['avg', 'histogram'] })
  })

  test('branches that only require properties of the object part make a presence constraint', () => {
    expect(classify('TermsLookup', 1)).toEqual({ kind: 'presence' })
    expect(classify('MetricAggregationBase', 1)).toEqual({ kind: 'presence' })
  })

  test('a union outside an allOf is never a presence constraint', () => {
    expect(classifier.classify({ oneOf: [{ type: 'object', properties: { a: { type: 'string' } } }, { type: 'object' }] }).kind).not.toBe('presence')
  })

  test('titles on every branch make a titled union', () => { expect(classify('TermsQueryField')).toEqual({ kind: 'titled' }) })
  test('scalar branches, including unions of scalars, make a scalar union', () => { expect(classify('Fields')).toEqual({ kind: 'scalar' }) })
  test('T | T[] makes one-or-many', () => { expect(classify('Queries')).toEqual({ kind: 'one-or-many' }) })
  test('Record<string, T> | T[] makes keyed-or-list', () => { expect(classify('Buckets')).toEqual({ kind: 'keyed-or-list' }) })
  test('a scalar short form next to one object form makes shorthand', () => { expect(classify('TermQuery')).toEqual({ kind: 'shorthand' }) })
  test('untitled, untagged object branches stay unclassified', () => { expect(classify('RangeQuery')).toEqual({ kind: undefined }) })

  test('fails on an unresolved $ref', () => {
    expect(() => classifier.classify({ oneOf: [ref('Missing'), ref('Field')] })).toThrow('Unresolved $ref: #/components/schemas/Missing')
  })
})

describe('UnionLabeler', () => {
  test('writes x-union-kind and x-variant-keys, and reports unclassified unions', () => {
    const spec: Record<string, any> = { paths: {}, components: { schemas: schemas() } }
    const { counts, unclassified } = new UnionLabeler().label(spec)
    const labeled = spec.components.schemas
    expect(labeled.AggregationContainer.allOf[1]['x-union-kind']).toBe('container')
    expect(labeled.AggregationContainer.allOf[1]['x-variant-keys']).toEqual(['avg', 'histogram'])
    expect(labeled.TermsLookup.allOf[1]['x-union-kind']).toBe('presence')
    expect(labeled.Property['x-union-kind']).toBe('tagged')
    expect(labeled.RangeQuery['x-union-kind']).toBeUndefined()
    expect(unclassified).toEqual(['#/components/schemas/RangeQuery'])
    expect(counts.container).toBe(1)
  })

  test('replaces stale labels when run again', () => {
    const spec: Record<string, any> = { paths: {}, components: { schemas: schemas() } }
    const labeler = new UnionLabeler()
    labeler.label(spec)
    // As if the version extractor removed the histogram branch.
    const container = spec.components.schemas.AggregationContainer.allOf[1]
    container.oneOf = [container.oneOf[0]]
    spec.components.schemas.RangeQuery['x-union-kind'] = 'container'
    labeler.label(spec)
    expect(container['x-variant-keys']).toEqual(['avg'])
    expect(spec.components.schemas.RangeQuery['x-union-kind']).toBeUndefined()
  })
})
