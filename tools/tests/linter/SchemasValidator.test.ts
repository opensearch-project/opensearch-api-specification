/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger } from 'Logger'
import SchemasValidator from 'linter/SchemasValidator'

test('validate() - named_schemas', () => {
  const validator = new SchemasValidator('./tools/tests/linter/fixtures/schemas_validator/named_schemas', new Logger())
  expect(validator.validate()).toEqual([
    {
      file: 'schemas/actions.yaml',
      location: '#/components/schemas/Bark',
      message: 'data/type MUST be equal to one of the allowed values: array, boolean, integer, null, number, object, string --- data/type must be array --- data/type must match a schema in anyOf'
    },
    {
      file: 'schemas/animals.yaml',
      location: '#/components/schemas/Dog',
      message: 'data/type MUST be equal to one of the allowed values: array, boolean, integer, null, number, object, string --- data/type must be array --- data/type must match a schema in anyOf'
    }
  ])
})

test('validate() - anonymous_schemas', () => {
  const validator = new SchemasValidator('./tools/tests/linter/fixtures/schemas_validator/anonymous_schemas', new Logger())
  expect(validator.validate()).toEqual([
    {
      file: '_global_parameters.yaml',
      location: 'human',
      message: 'data/type MUST be equal to one of the allowed values: array, boolean, integer, null, number, object, string --- data/type must be array --- data/type must match a schema in anyOf'
    },
    {
      file: 'namespaces/_core.yaml',
      location: '#/components/parameters/adopt::path.docket',
      message: 'data/type MUST be equal to one of the allowed values: array, boolean, integer, null, number, object, string --- data/type must be array --- data/type must match a schema in anyOf'
    },
    {
      file: 'namespaces/adopt.yaml',
      location: '#/components/requestBodies/adopt/content/application/json',
      message: 'data/type MUST be equal to one of the allowed values: array, boolean, integer, null, number, object, string --- data/type must be array --- data/type must match a schema in anyOf'
    },
    {
      file: 'namespaces/_core.yaml',
      location: '#/components/responses/adopt@200/content/application/json',
      message: 'data/type MUST be equal to one of the allowed values: array, boolean, integer, null, number, object, string --- data/type must be array --- data/type must match a schema in anyOf'
    }
  ])
})
