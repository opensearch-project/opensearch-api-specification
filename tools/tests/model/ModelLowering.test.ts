/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import ClientModelBuilder from 'model/ClientModelBuilder'
import ModelLowering from 'model/ModelLowering'
import UnionLabeler from 'merger/UnionLabeler'

const ref = (name: string): Record<string, string> => ({ $ref: `#/components/schemas/${name}` })

// Labels a spec, builds its model and writes the model back into it, as `npm run merge -- --resolve-types` does.
function resolve (schemas: Record<string, any>): { schemas: Record<string, any>, kept: string[] } {
  const spec: Record<string, any> = { paths: {}, components: { schemas: _.cloneDeep(schemas) } }
  new UnionLabeler().label(spec)
  const lowering = new ModelLowering(new ClientModelBuilder(spec).build())
  lowering.lower(spec)
  return { schemas: spec.components.schemas, kept: lowering.kept }
}

describe('ModelLowering', () => {
  test('declares the fields of a presence constraint on the object, so that dropping the union loses none', () => {
    const { schemas } = resolve({
      Metric: {
        allOf: [
          { type: 'object', properties: { missing: { type: 'string' } } },
          { anyOf: [{ properties: { field: { type: 'string' } } }, { properties: { script: { type: 'string' } } }] }
        ]
      },
      Average: { allOf: [ref('Metric'), { type: 'object' }] }
    })
    expect(schemas.Metric).toEqual({
      type: 'object',
      properties: { missing: { type: 'string' }, field: { type: 'string' }, script: { type: 'string' } }
    })
    expect(schemas.Average).toEqual({ allOf: [ref('Metric')] })
  })

  test('keeps a presence constraint on declared fields, with the properties its branches require', () => {
    const { schemas } = resolve({
      Lookup: {
        allOf: [
          { type: 'object', properties: { index: { type: 'string' }, id: { type: 'string' }, query: { type: 'string' } }, required: ['index'] },
          { oneOf: [{ type: 'object', properties: { id: { type: 'string' } }, required: ['id'] }, { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }] }
        ]
      }
    })
    expect(schemas.Lookup).toEqual({
      allOf: [
        { type: 'object', properties: { index: { type: 'string' }, id: { type: 'string' }, query: { type: 'string' } }, required: ['index'] },
        {
          oneOf: [
            { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
            { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
          ],
          'x-union-kind': 'presence'
        }
      ]
    })
  })

  test('keeps the named variants of a container', () => {
    const { schemas } = resolve({
      Shared: { type: 'object', properties: { meta: { type: 'object' } } },
      Avg: { type: 'object', properties: { field: { type: 'string' } } },
      TermsVariant: { type: 'object', properties: { terms: { type: 'object', properties: { size: { type: 'integer' } } } }, required: ['terms'] },
      Container: {
        allOf: [
          ref('Shared'),
          { type: 'object', oneOf: [ref('TermsVariant'), { type: 'object', properties: { avg: ref('Avg') }, required: ['avg'] }] }
        ]
      }
    })
    expect(schemas.Container.allOf[0]).toEqual(ref('Shared'))
    const container = schemas.Container.allOf[1]
    expect(container['x-union-kind']).toEqual('container')
    expect(container['x-variant-keys']).toEqual(['terms', 'avg'])
    expect(container.oneOf[0]).toEqual(ref('TermsVariant'))
    expect(container.oneOf[1]).toEqual({ type: 'object', properties: { avg: ref('Avg') }, required: ['avg'] })
  })

  test('writes generic types and their instantiations as the spec writes them', () => {
    const generic = {
      TDocument: { type: 'object', 'x-is-generic-type-parameter': true },
      Hit: { type: 'object', properties: { _source: ref('TDocument') } },
      HitJson: { allOf: [ref('Hit'), { type: 'object', properties: { _source: {} } }] },
      Plain: { allOf: [ref('Base'), { type: 'object', properties: { b: { type: 'string' } } }] },
      Base: { type: 'object', properties: { a: { type: 'string' } } }
    }
    const { schemas, kept } = resolve(generic)
    expect(schemas.Hit).toEqual(generic.Hit)
    expect(schemas.HitJson).toEqual(generic.HitJson)
    expect(schemas.TDocument).toEqual(generic.TDocument)
    expect(kept.sort()).toEqual(['Hit', 'HitJson'])
    expect(schemas.Plain).toEqual({ allOf: [ref('Base'), { type: 'object', properties: { b: { type: 'string' } } }] })
  })

  test('keeps annotations, validation keywords and extensions of the original schemas', () => {
    const { schemas } = resolve({
      Duration: { type: 'string', pattern: '^\\d+[smh]$', description: 'A duration.', 'x-data-type': 'time' },
      Thing: { type: 'object', description: 'A thing.', properties: { took: { allOf: [ref('Duration')], description: 'How long.' } } }
    })
    expect(schemas.Duration).toEqual({ type: 'string', pattern: '^\\d+[smh]$', description: 'A duration.', 'x-data-type': 'time' })
    expect(schemas.Thing.description).toEqual('A thing.')
    expect(schemas.Thing.properties.took.description).toEqual('How long.')
  })
})
