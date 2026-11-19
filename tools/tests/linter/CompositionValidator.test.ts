/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger, LogLevel } from 'Logger'
import CompositionValidator from 'linter/CompositionValidator'

const FIXTURE = './tools/tests/linter/fixtures/composition_validator'
const GUIDE = 'CLIENT_GENERATOR_GUIDE.md#schema-composition'

describe('CompositionValidator', () => {
  test('reports properties next to a composition keyword, unclassified unions and conflicting allOf properties', () => {
    const validator = new CompositionValidator(FIXTURE, new Logger(LogLevel.error))
    expect(validator.validate()).toEqual([
      {
        file: 'schemas/animals.yaml',
        location: '#/components/schemas/Lookup',
        message: `Properties next to a composition keyword. Write them as an allOf member instead (${GUIDE}).`
      },
      {
        file: 'namespaces/_core.yaml',
        location: '#/components/requestBodies/adopt/content/application~1json/schema',
        message: `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`
      },
      {
        file: 'schemas/animals.yaml',
        location: '#/components/schemas/Pet',
        message: `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`
      },
      {
        file: 'schemas/animals.yaml',
        location: '#/components/schemas/Sized',
        message: `allOf members declare property 'size' as both number and string. Client generators can't satisfy both (${GUIDE}).`
      }
    ])
  })

  test('reports allOfs, unions, generic instantiations and values that are not in the canonical form', () => {
    const validator = new CompositionValidator('./tools/tests/linter/fixtures/composition_shapes', new Logger(LogLevel.error))
    expect(validator.validate()).toEqual([
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/UndeclaredKey/allOf/1',
        message: `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/BaseLast',
        message: `A $ref follows an inline allOf member. List the bases ($ref members) first (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/NestedAllOf',
        message: `An allOf member is itself an allOf. Merge its members into the outer allOf (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/NullableOneOf',
        message: `A nullable scalar is written as a oneOf. Write it as a type array with 'null' (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/SingleConst',
        message: `A single value is written as const. Write it as enum: [value]; const is for the documented values of a oneOf (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/TwoOwn',
        message: `Several allOf members declare their own properties. Declare them in one member (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/TypeArray',
        message: `Several types are written as a type array. Write them as a oneOf of one type each; a type array only adds 'null' (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/UnionInUnion/oneOf/0',
        message: `This union branch is itself a union. Give it a name, or flatten its branches into the outer union (${GUIDE}).`
      },
      {
        file: 'schemas/shapes.yaml',
        location: '#/components/schemas/MixedPair',
        message: `This instantiation of a generic type gives one type parameter two different schemas (${GUIDE}).`
      }
    ])
  })
})
