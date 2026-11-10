/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import ClientModelBuilder from 'model/ClientModelBuilder'
import OpenApiMerger from 'merger/OpenApiMerger'
import { Logger, LogLevel } from 'Logger'
import type { ContainerConstraint, ObjectEntry, UnionEntry } from 'model/types'

const ref = (name: string): Record<string, string> => ({ $ref: `#/components/schemas/${name}` })
const build = (schemas: Record<string, any>): ReturnType<ClientModelBuilder['build']> =>
  new ClientModelBuilder({ components: { schemas } }).build()

// Shapes from the bundled spec, normalized and labeled, reduced to what the model looks at.
const schemas = (): Record<string, any> => ({
  Field: { type: 'string' },
  Id: { type: 'string' },
  QueryContainer: { type: 'object', properties: { match_all: { type: 'object' } } },
  FieldValue: { oneOf: [{ type: 'string' }, { type: 'number' }], 'x-union-kind': 'scalar' },
  TermsLookup: {
    type: 'object',
    allOf: [
      { type: 'object', properties: { index: ref('Field'), id: ref('Id'), path: ref('Field'), query: ref('QueryContainer') }, required: ['index', 'path'] },
      { oneOf: [{ properties: { id: ref('Id') }, required: ['id'] }, { properties: { query: ref('QueryContainer') }, required: ['query'] }], 'x-union-kind': 'presence' }
    ]
  },
  MetricAggregationBase: {
    allOf: [
      { type: 'object', properties: { missing: ref('FieldValue') } },
      { anyOf: [{ type: 'object', properties: { field: ref('Field') } }, { type: 'object', properties: { script: { type: 'string' } } }], 'x-union-kind': 'presence' }
    ]
  },
  TermsQueryField: { oneOf: [{ title: 'value', type: 'array', items: ref('FieldValue') }, { title: 'lookup', ...ref('TermsLookup') }], 'x-union-kind': 'titled' },
  TermsQuery: { type: 'object', properties: { boost: { type: 'number', format: 'float' } }, additionalProperties: ref('TermsQueryField'), minProperties: 1 },
  TextProperty: { type: 'object', properties: { type: { type: 'string', enum: ['text'] } }, required: ['type'] },
  ObjectProperty: { type: 'object', properties: { type: { type: 'string', enum: ['object'] } } },
  Property: { type: 'object', discriminator: { propertyName: 'type', 'x-default': 'object' }, oneOf: [ref('TextProperty'), ref('ObjectProperty')], 'x-union-kind': 'tagged' },
  Aggregation: { type: 'object', properties: { meta: { type: 'object', additionalProperties: true } } },
  AverageAggregation: { type: 'object', properties: { field: ref('Field') } },
  BucketAggregationBase: {
    type: 'object',
    properties: { aggregations: { type: 'object', additionalProperties: ref('AggregationContainer') }, aggs: { type: 'object', additionalProperties: ref('AggregationContainer') } },
    not: { type: 'object', required: ['aggregations', 'aggs'] }
  },
  TermsAggregation: { allOf: [ref('BucketAggregationBase'), { type: 'object', properties: { terms: { type: 'object', properties: { field: ref('Field') } } }, required: ['terms'] }] },
  AggregationContainer: {
    allOf: [ref('Aggregation'), {
      type: 'object',
      oneOf: [{ properties: { avg: ref('AverageAggregation') }, required: ['avg'], unevaluatedProperties: true }, ref('TermsAggregation')],
      'x-union-kind': 'container',
      'x-variant-keys': ['avg', 'terms']
    }]
  },
  Base: { type: 'object', properties: { buckets: { type: 'object', additionalProperties: true } }, required: ['buckets'] },
  Specialized: { allOf: [ref('Base'), { type: 'object', properties: { buckets: { type: 'array', items: ref('Id') } } }] },
  Conflicting: { allOf: [{ type: 'object', properties: { a: { type: 'string' } } }, { type: 'object', properties: { a: { type: 'integer' } } }] },
  Names: { type: 'array', items: ref('Field') },
  Labels: { type: 'object', additionalProperties: { type: 'string' } },
  Unlabeled: { oneOf: [ref('Field'), ref('QueryContainer')] },
  TDocument: { 'x-is-generic-type-parameter': true },
  GenericBuckets: { oneOf: [{ title: 'keyed', type: 'object', additionalProperties: ref('Id') }, { title: 'list', type: 'array', items: ref('Id') }], 'x-union-kind': 'keyed-or-list' },
  RefinedBuckets: { allOf: [ref('GenericBuckets'), { oneOf: [{ type: 'object', additionalProperties: ref('Field') }, { type: 'array', items: ref('Field') }], 'x-union-kind': 'keyed-or-list' }] },
  HitsMetadata: { type: 'object', properties: { total: { type: 'integer' }, hits: { type: 'array', items: ref('Id') } } },
  SearchResult: { type: 'object', properties: { hits: ref('HitsMetadata') } },
  SearchResultOfValue: { allOf: [ref('SearchResult'), { type: 'object', properties: { hits: { type: 'object', properties: { hits: { type: 'array', items: ref('Field') } } } } }] }
})

describe('ClientModelBuilder', () => {
  const model = build(schemas())
  const types = model.types

  test('an allOf with a presence union becomes merged fields plus an exactly-one constraint', () => {
    expect(types.TermsLookup).toEqual({
      type_kind: 'object',
      fields: {
        index: { type: { ref: 'Field' }, required: true },
        id: { type: { ref: 'Id' }, required: false },
        path: { type: { ref: 'Field' }, required: true },
        query: { type: { ref: 'QueryContainer' }, required: false }
      },
      constraints: [{ union_kind: 'presence', one_of: [['id'], ['query']] }]
    })
  })

  test('presence branches that require nothing only add optional fields', () => {
    const entry = types.MetricAggregationBase as ObjectEntry
    expect(Object.keys(entry.fields)).toEqual(['missing', 'field', 'script'])
    expect(entry.constraints).toEqual([])
  })

  test('a titled union names its variants by title', () => {
    expect(types.TermsQueryField).toEqual({
      type_kind: 'union',
      union_kind: 'titled',
      exclusive: true,
      variants: { value: { array: { ref: 'FieldValue' } }, lookup: { ref: 'TermsLookup' } },
      titles: ['value', 'lookup']
    })
  })

  test('a field-name map becomes additional_fields', () => {
    expect((types.TermsQuery as ObjectEntry).additional_fields).toEqual({ ref: 'TermsQueryField' })
  })

  test('a tagged union names its variants by tag value and keeps the default variant', () => {
    const entry = types.Property as UnionEntry
    expect(entry).toMatchObject({ union_kind: 'tagged', discriminator: 'type', default_variant: 'object' })
    expect(entry.variants).toEqual({ text: { ref: 'TextProperty' }, object: { ref: 'ObjectProperty' } })
  })

  test('a container resolves each variant, with fields and constraints only that variant allows', () => {
    const entry = types.AggregationContainer as ObjectEntry
    expect(Object.keys(entry.fields)).toEqual(['meta'])
    const { variants } = entry.constraints[0] as ContainerConstraint
    expect(variants.avg).toEqual({ value: { ref: 'AverageAggregation' }, extra_fields: {}, extra_constraints: [] })
    expect(Object.keys(variants.terms.extra_fields)).toEqual(['aggregations', 'aggs'])
    expect(variants.terms.extra_fields.aggs.type).toEqual({ map: { ref: 'AggregationContainer' } })
    expect(variants.terms.extra_constraints).toEqual([{ union_kind: 'not_all', keys: ['aggregations', 'aggs'] }])
  })

  test('a later allOf member refines a field of an earlier one', () => {
    expect((types.Specialized as ObjectEntry).fields.buckets).toEqual({ type: { array: { ref: 'Id' } }, required: true })
  })

  test('two scalar types for one field are reported', () => {
    expect(model.diagnostics).toContainEqual({ type: 'Conflicting', message: 'field `a` is declared as both string and number' })
  })

  test('a type array is a union of one type per entry', () => {
    const model = build({ Names: { type: ['array', 'null'], description: 'Names.', items: { type: 'string' } } })
    expect(model.types.Names).toEqual({ type_kind: 'alias', description: 'Names.', type: { union: [{ array: { scalar: 'string' } }, { scalar: 'null' }], union_kind: 'scalar', exclusive: true } })
  })

  test('version metadata and the bases that fields are inherited from', () => {
    const model = build({
      Base: { type: 'object', properties: { a: { type: 'string', 'x-version-added': '2.1' } } },
      Derived: {
        'x-version-deprecated': '3.0',
        'x-deprecation-message': 'Use Other.',
        allOf: [ref('Base'), { type: 'object', properties: { b: { type: 'string' } } }]
      },
      Choice: { oneOf: [{ type: 'string', 'x-version-removed': '3.0' }, { type: 'number' }], 'x-union-kind': 'scalar' }
    })
    expect(model.types.Derived).toEqual({
      type_kind: 'object',
      bases: ['Base'],
      fields: {
        a: { type: { scalar: 'string' }, required: false, versions: { added: '2.1' }, declared_in: 'Base' },
        b: { type: { scalar: 'string' }, required: false }
      },
      constraints: [],
      versions: { deprecated: '3.0', deprecation_message: 'Use Other.' }
    })
    expect((model.types.Choice as UnionEntry).branch_versions).toEqual([{ removed: '3.0' }, null])
  })

  test('a bare `type: object` is an object without declared fields, not a map', () => {
    expect(build({ Empty: { type: 'object' } }).types.Empty).toEqual({ type_kind: 'object', fields: {}, constraints: [] })
  })

  test('arrays, maps and unlabeled unions', () => {
    expect(types.Names).toEqual({ type_kind: 'alias', type: { array: { ref: 'Field' } } })
    expect(types.Labels).toEqual({ type_kind: 'alias', type: { map: { scalar: 'string' } } })
    expect(types.Unlabeled).toMatchObject({ type_kind: 'union', union_kind: 'unclassified', members: [{ ref: 'Field' }, { ref: 'QueryContainer' }] })
    expect(model.diagnostics).toContainEqual({ type: 'Unlabeled', message: 'unclassified union (no x-union-kind); modeled as `members` only' })
  })
})

describe('ClientModelBuilder: specializations, generics and bodies', () => {
  const types = build(schemas()).types

  test('a generic type parameter is an `any` alias marked as such', () => {
    expect(types.TDocument).toEqual({ type_kind: 'alias', type: { any: true }, generic_parameter: true })
  })

  test('an allOf of unions is the later union, which inherits the earlier titles', () => {
    expect(types.RefinedBuckets).toEqual({
      type_kind: 'union',
      union_kind: 'keyed-or-list',
      exclusive: true,
      members: [{ map: { ref: 'Field' } }, { array: { ref: 'Field' } }],
      titles: ['keyed', 'list']
    })
  })

  test('a partial object redeclaration adds fields instead of replacing the object', () => {
    const hits = (types.SearchResultOfValue as ObjectEntry).fields.hits.type
    expect(hits).toEqual({ object: { fields: {
      total: { type: { scalar: 'integer' }, required: false },
      hits: { type: { array: { ref: 'Field' } }, required: false }
    }, constraints: [] } })
  })

  test('response and request bodies are modeled, inline or by reference', () => {
    const model = new ClientModelBuilder({
      components: {
        schemas: schemas(),
        responses: {
          get___200: { content: { 'application/json': { schema: ref('TermsLookup') } } },
          create___200: { content: { 'application/json': { schema: { type: 'object', description: 'Created.', properties: { id: ref('Id') }, required: ['id'] } } } },
          head___200: { description: 'no body' }
        },
        requestBodies: { bulk: { content: { 'application/x-ndjson': { schema: { type: 'array', items: { type: 'object' } } } } } }
      }
    }).build()
    expect(model.responses).toEqual({
      create___200: { media_type: 'application/json', description: 'Created.', type: { object: { fields: { id: { type: { ref: 'Id' }, required: true } }, constraints: [] }, description: 'Created.' } },
      get___200: { media_type: 'application/json', type: { ref: 'TermsLookup' } }
    })
    expect(model.request_bodies.bulk).toEqual({ media_type: 'application/x-ndjson', type: { array: { object: { fields: {}, constraints: [] } } } })
  })
})

describe('ClientModelBuilder on the bundled spec', () => {
  const spec = new OpenApiMerger('./spec', new Logger(LogLevel.error)).spec() as Record<string, any>
  const model = new ClientModelBuilder(spec).build()
  const types = model.types

  test('models every schema; the only diagnostics are unclassified unions', () => {
    expect(Object.keys(types)).toHaveLength(Object.keys(spec.components.schemas as object).length)
    expect(model.diagnostics.filter((d) => !d.message.startsWith('unclassified '))).toEqual([])
  })

  test('TermsLookup keeps all six fields and its exactly-one constraint', () => {
    const entry = types['_common.query_dsl___TermsLookup'] as ObjectEntry
    expect(Object.keys(entry.fields).sort()).toEqual(['id', 'index', 'path', 'query', 'routing', 'store'])
    expect(entry.constraints).toEqual([{ union_kind: 'presence', one_of: [['id'], ['query']] }])
  })

  test('SemanticProperty keeps its 11 fields, its tag and the at-least-one constraint', () => {
    const entry = types['_common.mapping___SemanticProperty'] as ObjectEntry
    expect(Object.keys(entry.fields)).toHaveLength(11)
    expect(entry.fields.type).toEqual({ type: { enum: ['semantic'] }, required: true })
    expect(entry.constraints).toEqual([{ union_kind: 'presence', any_of: [['model_id'], ['model_selection']] }])
    const property = types['_common.mapping___Property'] as UnionEntry
    expect(property.variants?.semantic).toEqual({ ref: '_common.mapping___SemanticProperty' })
  })

  test('AggregationContainer: shared meta, one container, sub-aggregations only on bucket variants', () => {
    const entry = types['_common.aggregations___AggregationContainer'] as ObjectEntry
    expect(Object.keys(entry.fields)).toEqual(['meta'])
    const { variants } = entry.constraints[0] as ContainerConstraint
    const keys = (entry.constraints[0] as ContainerConstraint).variants
    expect(Object.keys(keys).length).toBeGreaterThanOrEqual(65)
    expect(variants.avg.extra_fields).toEqual({})
    expect(Object.keys(variants.terms.extra_fields).sort()).toEqual(['aggregations', 'aggs'])
  })
})
