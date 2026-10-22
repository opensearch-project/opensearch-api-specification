/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import Ajv2020 from 'ajv/dist/2020'
import CompositionNormalizer from 'merger/CompositionNormalizer'

// TermsLookup as written in spec/schemas/_common.query_dsl.yaml: properties next to allOf: [{ oneOf }].
const terms_lookup = (): Record<string, any> => ({
  type: 'object',
  description: 'A terms lookup.',
  properties: {
    index: { type: 'string' },
    id: { type: 'string' },
    path: { type: 'string' },
    query: { type: 'object' },
    store: { type: 'boolean' }
  },
  required: ['index', 'path'],
  allOf: [{
    oneOf: [
      { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
      { type: 'object', properties: { query: { type: 'object' } }, required: ['query'] }
    ]
  }]
})

describe('CompositionNormalizer', () => {
  const normalizer = new CompositionNormalizer()

  describe('normalize_schema()', () => {
    test('moves properties next to allOf into the first allOf member', () => {
      const schema = terms_lookup()
      expect(normalizer.normalize_schema(schema)).toBe(true)
      expect(schema).toEqual({
        type: 'object',
        description: 'A terms lookup.',
        allOf: [
          { type: 'object', properties: terms_lookup().properties, required: ['index', 'path'] },
          terms_lookup().allOf[0]
        ]
      })
    })

    test('is lossless: the original and the normalized schema accept the same documents', () => {
      const normalized = terms_lookup()
      normalizer.normalize_schema(normalized)
      const ajv = new Ajv2020({ strict: false })
      const validate_original = ajv.compile(terms_lookup())
      const validate_normalized = ajv.compile(normalized)
      const documents = [
        { index: 'users', path: 'followers', id: '1' },
        { index: 'users', path: 'followers', query: {} },
        { index: 'users', path: 'followers', id: '1', store: true },
        { index: 'users', path: 'followers' },
        { index: 'users', path: 'followers', id: '1', query: {} },
        { id: '1' },
        { index: 1, path: 'followers', id: '1' },
        { index: 'users', path: 'followers', id: '1', extra: 'allowed' }
      ]
      for (const document of documents) {
        expect([document, validate_normalized(document)]).toEqual([document, validate_original(document)])
      }
      expect(documents.map((document) => validate_original(document))).toEqual([true, true, true, false, false, false, false, true])
    })

    test('moves a sibling oneOf, with its discriminator, into an allOf member', () => {
      const schema: Record<string, any> = {
        properties: { name: { type: 'string' } },
        discriminator: { propertyName: 'type' },
        oneOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }]
      }
      normalizer.normalize_schema(schema)
      expect(schema).toEqual({
        allOf: [
          { type: 'object', properties: { name: { type: 'string' } } },
          { oneOf: [{ $ref: '#/components/schemas/A' }, { $ref: '#/components/schemas/B' }], discriminator: { propertyName: 'type' } }
        ]
      })
    })

    test('moves a sibling anyOf into an allOf member', () => {
      const schema: Record<string, any> = {
        properties: { missing: { type: 'string' } },
        anyOf: [{ properties: { field: { type: 'string' } } }, { properties: { script: { type: 'object' } } }]
      }
      normalizer.normalize_schema(schema)
      expect(schema).toEqual({
        allOf: [
          { type: 'object', properties: { missing: { type: 'string' } } },
          { anyOf: [{ properties: { field: { type: 'string' } } }, { properties: { script: { type: 'object' } } }] }
        ]
      })
    })

    test('keeps additionalProperties and patternProperties with the properties they apply to', () => {
      const schema: Record<string, any> = {
        title: 'Map',
        'x-version-added': '2.0',
        properties: { a: { type: 'string' } },
        patternProperties: { '^x-': { type: 'string' } },
        additionalProperties: false,
        allOf: [{ $ref: '#/components/schemas/Base' }]
      }
      normalizer.normalize_schema(schema)
      expect(schema).toEqual({
        title: 'Map',
        'x-version-added': '2.0',
        allOf: [
          { type: 'object', properties: { a: { type: 'string' } }, patternProperties: { '^x-': { type: 'string' } }, additionalProperties: false },
          { $ref: '#/components/schemas/Base' }
        ]
      })
    })

    test('moves a sibling required list even without properties', () => {
      const schema: Record<string, any> = { required: ['a'], allOf: [{ $ref: '#/components/schemas/Base' }] }
      normalizer.normalize_schema(schema)
      expect(schema).toEqual({ allOf: [{ type: 'object', required: ['a'] }, { $ref: '#/components/schemas/Base' }] })
    })

    test.each([
      ['a plain object', { type: 'object', properties: { a: { type: 'string' } }, required: ['a'] }],
      ['a pure allOf', { allOf: [{ $ref: '#/components/schemas/A' }, { properties: { a: { type: 'string' } } }] }],
      ['a pure oneOf', { oneOf: [{ type: 'string' }, { type: 'number' }] }],
      ['a oneOf with an empty properties object', { properties: {}, oneOf: [{ type: 'string' }] }],
      ['a oneOf with additionalProperties: true', { additionalProperties: true, oneOf: [{ type: 'string' }] }]
    ])('leaves %s unchanged', (_name, original) => {
      const schema = _.cloneDeep(original)
      expect(normalizer.normalize_schema(schema)).toBe(false)
      expect(schema).toEqual(original)
    })

    test('is idempotent', () => {
      const schema = terms_lookup()
      normalizer.normalize_schema(schema)
      const once = _.cloneDeep(schema)
      expect(normalizer.normalize_schema(schema)).toBe(false)
      expect(schema).toEqual(once)
    })
  })

  describe('normalize()', () => {
    test('rewrites schemas anywhere in the spec, including nested ones, and reports where', () => {
      const spec: Record<string, any> = {
        openapi: '3.1.0',
        paths: {
          '/_lookup': {
            post: {
              requestBody: { content: { 'application/json': { schema: terms_lookup() } } },
              responses: {}
            }
          }
        },
        components: {
          schemas: {
            TermsLookup: terms_lookup(),
            Wrapper: { type: 'object', properties: { lookup: terms_lookup() } },
            Untouched: { allOf: [{ $ref: '#/components/schemas/TermsLookup' }] }
          }
        }
      }
      const rewritten = normalizer.normalize(spec)
      expect(rewritten.sort()).toEqual([
        '#/components/schemas/TermsLookup',
        '#/components/schemas/Wrapper/properties/lookup',
        '#/paths/~1_lookup/post/requestBody/content/application~1json/schema'
      ].sort())
      expect(spec.components.schemas.TermsLookup.properties).toBeUndefined()
      expect(spec.components.schemas.Wrapper.properties.lookup.allOf[0].required).toEqual(['index', 'path'])
      expect(spec.components.schemas.Untouched).toEqual({ allOf: [{ $ref: '#/components/schemas/TermsLookup' }] })
    })
  })
})
