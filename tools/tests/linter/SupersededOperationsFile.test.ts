/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import SupersededOperationsFile from 'linter/components/SupersededOperationsFile'

describe('validate()', () => {
  test('invalid schema', () => {
    const validator = new SupersededOperationsFile('./tools/tests/linter/fixtures/superseded_operations/invalid_schema.yaml')
    expect(validator.validate()).toEqual([
      {
        file: 'superseded_operations/invalid_schema.yaml',
        message: "File content does not match JSON schema found in './json_schemas/_superseded_operations.schema.yaml':\n " +
          JSON.stringify([
            {
              "instancePath": "/~1hello~1world/operations/1",
              "schemaPath": "#/patternProperties/%5E~1/properties/operations/items/enum",
              "keyword": "enum",
              "params": {
                "allowedValues": [
                  "GET",
                  "POST",
                  "PUT",
                  "DELETE",
                  "HEAD",
                  "OPTIONS",
                  "PATCH"
                ]
              },
              "message": "must be equal to one of the allowed values"
            }
          ], null, 2),
      },
    ])
  })

  test('incorrect order of operations', () => {
    const validator = new SupersededOperationsFile('./tools/tests/linter/fixtures/superseded_operations/incorrect_order_of_operations.yaml')
    expect(validator.validate()).toEqual([
      {
        file: 'superseded_operations/incorrect_order_of_operations.yaml',
        location: '/world/hello',
        message: "Operations must be sorted. Expected GET, HEAD, POST, PUT, PATCH, DELETE."
      },
    ])
  })
})

