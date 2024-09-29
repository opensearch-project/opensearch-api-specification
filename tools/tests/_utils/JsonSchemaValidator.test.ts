/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import JsonSchemaValidator from "../../src/_utils/JsonSchemaValidator";
import _ from 'lodash';

describe('JsonSchemaValidator', () => {
  const options = {
    ajv_opts: { discriminator: true },
    ajv_errors_opts: { singleError: true },
    errors_text_opts: { separator: ' <*> ' },
    additional_keywords: ['x-extension'],
    reference_schemas: { '#/definitions/name': { type: 'string' } }
  }

  const schema = {
    type: 'object',
    properties: {
      name: { $ref: '#/definitions/name' },
      age: { type: 'number' },
      occupation: { type: 'string', enum: ['student', 'teacher', 'engineer'] },
      parents: {
        type: 'object',
        properties: {
          mother: { $ref: '#/definitions/name' },
          father: { $ref: '#/definitions/name' }
        },
        additionalProperties: {
          not: true,
          errorMessage: "property is not defined in the spec"
        }
      }
    },
    required: ['name', 'age']
  };

  const validator = new JsonSchemaValidator(schema, options);

  test('validate_data()', () => {
    const valid_data = {
      name: 'John Doe',
      age: 25,
      occupation: 'student'
    }
    expect(validator.validate_data(valid_data)).toBeUndefined();

    const invalid_data = {
      name: 'John Doe',
      age: '25',
      occupation: 'doctor',
      parents: {
        mom: 'Jane Doe',
        dad: 'Jack Doe'
      }
    }
    expect(validator.validate_data(invalid_data)).toEqual(
      'data/occupation MUST be equal to one of the allowed values: student, teacher, engineer <*> ' +
      'data/age must be number <*> ' +
      'data/parents/mom property is not defined in the spec <*> ' +
      'data/parents/dad property is not defined in the spec');

    const override_schema = _.cloneDeep(schema)
    _.set(override_schema, 'properties.occupation.enum', ['student', 'teacher', 'engineer', 'doctor']);
    _.set(override_schema, 'properties.parents.additionalProperties', false)
    expect(validator.validate_data(invalid_data, override_schema)).toEqual(
      'data/parents contains unsupported properties: mom, dad <*> ' +
      'data/age must be number');

    const no_schema_validator = new JsonSchemaValidator(undefined, options);
    expect(() => no_schema_validator.validate_data(valid_data)).toThrow('No schema provided');
  });

  test('validate_schema()', () => {
    expect(validator.validate_schema(schema)).toBeUndefined()

    const invalid_schema = _.set(_.cloneDeep(schema), 'required', true);

    expect(validator.validate_schema(invalid_schema)).toEqual('data/required must be array');
  });

  test('constructing with invalid reference schema throws descriptive error', () => {
    const invalid_options = {
      reference_schemas: {
        '#/components/schemas/Invalid': {
          type: 'string',
          required: true, // required must be an array
        }
      }
    }
    expect(() => new JsonSchemaValidator(schema, invalid_options))
      .toThrow('Failed to add schema #/components/schemas/Invalid ({"type":"string","required":true}):\n\tschema is invalid: data/required must be array');
  });
});