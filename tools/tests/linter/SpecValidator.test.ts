/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import SpecValidator from 'linter/SpecValidator'

test('validate()', () => {
  const validator = new SpecValidator('./tools/tests/linter/fixtures/empty')
  validator.namespaces_folder.validate = jest.fn().mockReturnValue([{ file: 'namespaces/', message: 'namespace error' }])
  validator.schemas_folder.validate = jest.fn().mockReturnValue([{ file: 'schemas/', message: 'schema error' }])
  validator.schema_refs_validator.validate = jest.fn().mockReturnValue([{ file: 'schema_refs', message: 'schema refs error' }])
  validator.schemas_validator.validate = jest.fn().mockReturnValue([{ file: 'schemas/', message: 'schema error' }])
  validator.inline_object_schema_validator.validate = jest.fn().mockReturnValue([{ file: 'inline_file', message: 'inline_object_schema_validator error' }])

  expect(validator.validate()).toEqual([
    { file: 'namespaces/', message: 'namespace error' },
    { file: 'schemas/', message: 'schema error' }
  ])

  validator.namespaces_folder.validate = jest.fn().mockReturnValue([])
  validator.schemas_folder.validate = jest.fn().mockReturnValue([])

  expect(validator.validate()).toEqual([
    { file: 'schema_refs', message: 'schema refs error' },
    { file: 'inline_file', message: 'inline_object_schema_validator error' },
    { file: 'schemas/', message: 'schema error' }
  ])
})
