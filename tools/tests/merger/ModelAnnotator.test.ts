/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import ModelAnnotator from 'merger/ModelAnnotator'
import OpenApiMerger from 'merger/OpenApiMerger'
import OpenApiVersionExtractor from 'merger/OpenApiVersionExtractor'
import UnionLabeler from 'merger/UnionLabeler'
import { Logger, LogLevel } from 'Logger'

const ref = (name: string): Record<string, string> => ({ $ref: `#/components/schemas/${name}` })

const lookup = {
  allOf: [
    { type: 'object', properties: { index: { type: 'string' }, id: { type: 'string' }, query: { type: 'string' } }, required: ['index'] },
    { oneOf: [{ type: 'object', required: ['id'] }, { type: 'object', required: ['query'] }] }
  ]
}

function annotated (schemas: Record<string, any>, extra: Record<string, any> = {}): Record<string, any> {
  const spec: Record<string, any> = { paths: {}, components: { schemas: _.cloneDeep(schemas), ...extra } }
  new UnionLabeler().label(spec)
  new ModelAnnotator().annotate(spec)
  return spec
}

describe('ModelAnnotator', () => {
  test('writes the model entry of every schema next to it, as fields and constraints', () => {
    const spec = annotated({ Lookup: lookup })
    expect(spec.components.schemas.Lookup['x-model']).toEqual({
      type_kind: 'object',
      fields: {
        index: { type: { scalar: 'string' }, required: true },
        id: { type: { scalar: 'string' }, required: false },
        query: { type: { scalar: 'string' }, required: false }
      },
      constraints: [{ union_kind: 'presence', one_of: [['id'], ['query']] }]
    })
    expect(spec.components['x-model']).toEqual({ format: 'opensearch-client-model', version: '0.2.0' })
  })

  test('leaves the JSON Schema as it is', () => {
    const spec = annotated({ Lookup: lookup })
    expect(_.omit(spec.components.schemas.Lookup as object, 'x-model')).toEqual({
      allOf: [lookup.allOf[0], { ...lookup.allOf[1], 'x-union-kind': 'presence' }]
    })
  })

  test('declares the fields a presence constraint adds on the object, and keeps the bases', () => {
    const spec = annotated({
      Metric: { allOf: [{ type: 'object', properties: { missing: { type: 'string' } } }, { anyOf: [{ properties: { field: { type: 'string' } } }, { properties: { script: { type: 'string' } } }] }] },
      Average: { allOf: [ref('Metric'), { type: 'object' }] }
    })
    expect(Object.keys(spec.components.schemas.Metric['x-model'].fields as object)).toEqual(['missing', 'field', 'script'])
    expect(spec.components.schemas.Average['x-model'].bases).toEqual(['Metric'])
    expect(spec.components.schemas.Average['x-model'].fields.field.declared_in).toEqual('Metric')
  })

  test('writes the body of every response and request body', () => {
    const spec = annotated({ Lookup: lookup }, {
      responses: { 'get@200': { description: '', content: { 'application/json': { schema: ref('Lookup') } } } },
      requestBodies: { put: { content: { 'application/json': { schema: { type: 'array', items: ref('Lookup') } } } } }
    })
    expect(spec.components.responses['get@200']['x-model']).toEqual({ media_type: 'application/json', type: { ref: 'Lookup' } })
    expect(spec.components.requestBodies.put['x-model']).toEqual({ media_type: 'application/json', type: { array: { ref: 'Lookup' } } })
  })

  test('replaces a model from an earlier run', () => {
    const spec = annotated({ Lookup: lookup })
    spec.components.schemas.Lookup['x-model'] = { stale: true }
    new ModelAnnotator().annotate(spec)
    expect(spec.components.schemas.Lookup['x-model'].type_kind).toEqual('object')
  })

  test('is part of every merge, and built again for an extracted version', () => {
    const merger = new OpenApiMerger('./tools/tests/merger/fixtures/specs/opensearch', new Logger(LogLevel.error))
    const spec = merger.spec() as Record<string, any>
    const schemas = Object.keys(spec.components.schemas as object)
    expect(schemas.every((name) => spec.components.schemas[name]['x-model'] !== undefined)).toBe(true)
    const extracted = new OpenApiVersionExtractor(merger.spec(), '1.3').extract() as Record<string, any>
    for (const [name, schema] of Object.entries(extracted.components.schemas as Record<string, any>)) {
      const fields = Object.keys((schema['x-model']?.fields ?? {}) as object)
      const properties = Object.keys((schema.properties ?? {}) as object)
      expect([name, properties.every((p) => fields.includes(p))]).toEqual([name, true])
    }
  })
})
