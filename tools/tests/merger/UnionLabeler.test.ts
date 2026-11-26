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
  // Two presence unions over properties of the object part; the branch values are empty schemas (`gt: {}`).
  IntervalsRange: {
    type: 'object',
    allOf: [
      { type: 'object', properties: { gt: { type: 'string' }, gte: { type: 'string' }, lt: { type: 'string' }, lte: { type: 'string' } } },
      { oneOf: [{ properties: { gt: {} }, required: ['gt'], unevaluatedProperties: true }, { properties: { gte: {} }, required: ['gte'], unevaluatedProperties: true }] },
      { oneOf: [{ properties: { lt: {} }, required: ['lt'], unevaluatedProperties: true }, { properties: { lte: {} }, required: ['lte'], unevaluatedProperties: true }] }
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

  test('branches requiring a property the object part declares are a presence constraint, not a container', () => {
    expect(classify('IntervalsRange', 1)).toEqual({ kind: 'presence' })
    expect(classify('IntervalsRange', 2)).toEqual({ kind: 'presence' })
  })

  test('a container value must be known to be an object', () => {
    expect(classifier.classify({ oneOf: [{ properties: { a: {} }, required: ['a'] }, { properties: { b: {} }, required: ['b'] }] }).kind).not.toBe('container')
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

describe('UnionLabeler: nested and branch-owned presence constraints', () => {
  const ref = (name: string): Record<string, string> => ({ $ref: `#/components/schemas/${name}` })
  const label = (sort_source: any): any => {
    const spec: Record<string, any> = { components: { schemas: { Script: { type: 'object', properties: { source: { type: 'string' } } }, SortSource: sort_source } } }
    new UnionLabeler().label(spec)
    return spec.components.schemas.SortSource
  }

  test('a union nested in a branch, over properties the branch declares, is presence, and so is the outer union', () => {
    const sort = label({
      allOf: [
        { type: 'object', properties: { order: { type: 'string' } } },
        {
          oneOf: [
            { type: 'object', properties: { field: { type: 'string' } }, required: ['field'] },
            {
              allOf: [
                { type: 'object', properties: { script: ref('Script') }, required: ['script'] },
                { anyOf: [{ properties: { type: { type: 'string' } }, required: ['type'] }, { properties: { lang: { type: 'string' } }, required: ['lang'] }] }
              ]
            }
          ]
        }
      ]
    })
    expect(sort.allOf[1]['x-union-kind']).toBe('presence')
    expect(sort.allOf[1].oneOf[1].allOf[1]['x-union-kind']).toBe('presence')
  })

  test('variants that each require several properties they declare are not a presence constraint', () => {
    // GeoJSON-like variants: each requires its `type` and coordinates, so the union is a set of variants, not a
    // constraint on which fields are set, and stays unclassified (with or without an object part next to it)
    const shapes = (object_part: any[]): Record<string, any> => {
      const variant = (kind: string, field: string): Record<string, any> => ({
        type: 'object',
        properties: { type: { type: 'string', enum: [kind] }, [field]: { type: 'array' } },
        required: ['type', field]
      })
      const spec: Record<string, any> = { components: { schemas: {
        Point: variant('Point', 'coordinates'),
        LineString: variant('LineString', 'coordinates'),
        Circle: variant('Circle', 'radius'),
        Shape: { allOf: [...object_part, { oneOf: [ref('Point'), ref('LineString'), ref('Circle')] }] }
      } } }
      new UnionLabeler().label(spec)
      return spec.components.schemas.Shape
    }
    expect(shapes([]).allOf[0]['x-union-kind']).toBeUndefined()
    expect(shapes([{ type: 'object' }]).allOf[1]['x-union-kind']).toBeUndefined()
  })

  test('branches that each require the same declared property are not a presence constraint', () => {
    const sort = label({
      allOf: [
        { type: 'object' },
        { oneOf: [{ properties: { a: { type: 'string' } }, required: ['a'] }, { properties: { a: { type: 'integer' } }, required: ['a'] }] }
      ]
    })
    expect(sort.allOf[1]['x-union-kind']).not.toBe('presence')
  })

  test('with every property declared on the object, both unions are presence', () => {
    const sort = label({
      allOf: [
        { type: 'object', properties: { order: { type: 'string' }, field: { type: 'string' }, script: ref('Script'), type: { type: 'string' }, lang: { type: 'string' } } },
        { oneOf: [{ required: ['field'] }, { allOf: [{ required: ['script'] }, { anyOf: [{ required: ['type'] }, { required: ['lang'] }] }] }] }
      ]
    })
    expect(sort.allOf[1]['x-union-kind']).toBe('presence')
    expect(sort.allOf[1].oneOf[1].allOf[1]['x-union-kind']).toBe('presence')
  })

  test('a top-level union of objects is not presence: it has no object to constrain', () => {
    const spec: Record<string, any> = { components: { schemas: { U: { oneOf: [{ properties: { a: { type: 'string' } }, required: ['a'] }, { properties: { b: { type: 'number' } }, required: ['b'] }] } } } }
    new UnionLabeler().label(spec)
    expect(spec.components.schemas.U['x-union-kind']).not.toBe('presence')
  })
})
