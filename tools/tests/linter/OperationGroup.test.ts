/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { mocked_operation_group, operation_group } from './factories/operation_group'

test('validate_description()', () => {
  const invalid_descriptions = operation_group([
    { description: 'This is a description' },
    { description: 'This is a different description' }])
  expect(invalid_descriptions.validate_description()).toEqual({
    file: 'namespaces/indices.yaml',
    location: 'Operation Group: indices.create',
    message: '2 \'indices.create\' operations must have identical description property.'
  })

  const valid_descriptions = operation_group([
    { description: 'This is a description' },
    { description: 'This is a description' }])
  expect(valid_descriptions.validate_description())
    .toBeUndefined()
})

test('validate_externalDocs()', () => {
  const valid_external_docs = operation_group([
    { externalDocs: { url: 'https://example.com' } },
    { externalDocs: { url: 'https://example.com' } }])
  expect(valid_external_docs.validate_external_docs())
    .toBeUndefined()

  const invalid_external_docs = operation_group([
    { externalDocs: { url: 'https://example.com' } },
    { externalDocs: { url: 'https://example.com' } },
    {}])
  expect(invalid_external_docs.validate_external_docs())
    .toEqual(invalid_external_docs.error('3 \'indices.create\' operations must have identical externalDocs property.'))
})

test('validate_requestBody()', () => {
  const valid_request_bodies = operation_group([
    { requestBody: { $ref: '#/components/requestBodies/indices.create' } },
    { requestBody: { $ref: '#/components/requestBodies/indices.create' } }])
  expect(valid_request_bodies.validate_request())
    .toBeUndefined()

  const invalid_request_bodies = operation_group([
    { requestBody: { $ref: '#/components/requestBodies/indices.create' } },
    {}])
  expect(invalid_request_bodies.validate_request())
    .toEqual(invalid_request_bodies.error('2 \'indices.create\' operations must have identical requestBody property.'))
})

test('validate_responses()', () => {
  const valid_responses = operation_group([
    { responses: { 200: { $ref: '#/components/responses/indices.create@200' }, 400: { $ref: '#/components/responses/indices.create@400' } } },
    { responses: { 400: { $ref: '#/components/responses/indices.create@400' }, 200: { $ref: '#/components/responses/indices.create@200' } } }])
  expect(valid_responses.validate_responses())
    .toBeUndefined()

  const invalid_responses = operation_group([
    { responses: { 200: { $ref: '#/components/responses/indices.create@200' } } },
    {
      responses: {
        200: { $ref: '#/components/responses/indices.create@200' },
        400: { $ref: '#/components/responses/indices.create@400' }
      }
    }])
  expect(invalid_responses.validate_responses())
    .toEqual(invalid_responses.error('2 \'indices.create\' operations must have an identical set of responses.'))
})

test('validate_query_parameters()', () => {
  const valid_query_parameters = operation_group([
    { parameters: [{ $ref: '#/components/parameters/indices.create::query.param1' }, { $ref: '#/components/parameters/indices.create::path.param2' }] },
    { parameters: [{ $ref: '#/components/parameters/indices.create::query.param1' }] }])
  expect(valid_query_parameters.validate_query_parameters())
    .toBeUndefined()

  const invalid_query_parameters = operation_group([
    { parameters: [{ $ref: '#/components/parameters/indices.create::query.param1' }] },
    { parameters: [{ $ref: '#/components/parameters/indices.create::query.param1' }, { $ref: '#/components/parameters/indices.create::query.param2' }] }])
  expect(invalid_query_parameters.validate_query_parameters())
    .toEqual(invalid_query_parameters.error('2 \'indices.create\' operations must have an identical set of query parameters.'))
})

test('validate()', () => {
  const ops_errors = mocked_operation_group({ validate_description: 'Invalid description' }, [['Invalid operation 1A'], ['Invalid operation 2A', 'Invalid operation 2B']])
  expect(ops_errors.validate())
    .toEqual(['Invalid operation 1A', 'Invalid operation 2A', 'Invalid operation 2B'])

  const other_errors = mocked_operation_group({ validate_description: 'Invalid description', validate_externalDocs: 'Invalid externalDocs', validate_requestBody: 'Invalid requestBody', validate_responses: 'Invalid responses', validate_query_parameters: 'Invalid query parameters' })
  expect(other_errors.validate())
    .toEqual(['Invalid description', 'Invalid externalDocs', 'Invalid requestBody', 'Invalid responses', 'Invalid query parameters'])

  const no_errors = mocked_operation_group({})
  expect(no_errors.validate())
    .toEqual([])
})
