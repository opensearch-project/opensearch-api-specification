/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Ajv2019 } from "ajv/dist/2019";
import AjvErrorsParser from "../../src/_utils/AjvErrorsParser";

describe('AjvErrorsParser', () => {
  const ajv = new Ajv2019({ allErrors: true, strict: false })
  const parser = new AjvErrorsParser(ajv, { separator: '  |  ' , dataVar: 'Obj' })
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: [ 'a_boolean', 'a_number', 'an_array', 'an_enum', 'a_compound_object'],
    properties: {
      a_boolean: { type: 'boolean' },
      a_number: { type: 'number' },
      a_nullable_string: { type: ['string', 'null'] },
      a_non_nullable_string: { type: 'string' },
      an_array: { type: 'array', items: { type: 'string' }, minItems: 1 },
      an_enum: { type: 'string', enum: ['a', 'b', 'c'] },
      a_compound_object: {
        unevaluatedProperties: false,
        allOf: [
          { type: 'object', properties: { a: { type: 'string' } } },
          { type: 'object', properties: { b: { type: 'number' } } },
        ],
      }
    }
  }

  const data = {
    an_array: [],
    an_enum: 'd',
    a_compound_object: { stranger: 'danger', hello: 'world' },
    space_odyssey: 42,
    thirteen_sentinels: 426
  }

  const func = ajv.compile(schema)
  func(data)

  it('can parse multiple errors', () => {
    expect(parser.parse(func.errors)).toEqual(
      'Obj contains unsupported properties: space_odyssey, thirteen_sentinels, stranger, hello  |  ' +
      'Obj MUST contain the missing properties: a_boolean, a_number  |  ' +
      'Obj/an_enum MUST be equal to one of the allowed values: a, b, c  |  ' +
      'Obj/an_array must NOT have fewer than 1 items'
    )
  });

  it('can parse empty errors', () => {
    const empty_func = ajv.compile({ type: 'object' })
    empty_func({})
    expect(parser.parse(empty_func.errors)).toEqual(ajv.errorsText(undefined))
  });
});