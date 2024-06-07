/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import Operation from 'linter/components/Operation'
import { type OperationSpec } from 'types'

export function operation (spec: Record<string, any>, file_name = 'indices.yaml'): Operation {
  return new Operation(`namespaces/${file_name}`, '/{index}/something/{abc_xyz}', 'post', spec as OperationSpec)
}

interface MockedReturnedValues {
  validate?: string[]
  validate_group?: string | undefined
  validate_namespace?: string | undefined
  validate_operationId?: string | undefined
  validate_description?: string | undefined
  validate_requestBody?: string | undefined
  validate_responses?: string[]
  validate_parameters?: string | undefined
  validate_path_parameters?: string | undefined
}

export function mocked_operation (returned_values: MockedReturnedValues): Operation {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const op: Operation = new Operation('', '', '', {} as OperationSpec)

  if (returned_values.validate) {
    op.validate = jest.fn();
    (op.validate as jest.Mock).mockReturnValue(returned_values.validate)
    return op
  }

  op.validate_group = jest.fn()
  op.validate_namespace = jest.fn()
  op.validate_operation_id = jest.fn()
  op.validate_description = jest.fn()
  op.validate_request_body = jest.fn()
  op.validate_responses = jest.fn()
  op.validate_parameters = jest.fn()
  op.validate_path_parameters = jest.fn()

  if (returned_values.validate_group != null) (op.validate_group as jest.Mock).mockReturnValue(returned_values.validate_group)
  if (returned_values.validate_namespace != null) (op.validate_namespace as jest.Mock).mockReturnValue(returned_values.validate_namespace)
  if (returned_values.validate_operationId != null) (op.validate_operation_id as jest.Mock).mockReturnValue(returned_values.validate_operationId)
  if (returned_values.validate_description != null) (op.validate_description as jest.Mock).mockReturnValue(returned_values.validate_description)
  if (returned_values.validate_requestBody != null) (op.validate_request_body as jest.Mock).mockReturnValue(returned_values.validate_requestBody)
  if (returned_values.validate_responses != null) (op.validate_responses as jest.Mock).mockReturnValue(returned_values.validate_responses)
  if (returned_values.validate_parameters != null) (op.validate_parameters as jest.Mock).mockReturnValue(returned_values.validate_parameters)
  if (returned_values.validate_path_parameters != null) (op.validate_path_parameters as jest.Mock).mockReturnValue(returned_values.validate_path_parameters)

  return op
}
