import OperationGroup from 'linter/components/OperationGroup'
import { operation, mocked_operation } from './operation'

export function operation_group (operation_specs: Array<Record<string, any>>): OperationGroup {
  const operations = operation_specs.map((spec) => {
    return operation({ 'x-operation-group': 'indices.create', ...spec })
  })
  return new OperationGroup('namespaces/indices.yaml', 'indices.create', operations)
}

interface MockedReturnedValues {
  validate?: string[]
  validate_description?: string | undefined
  validate_externalDocs?: string | undefined
  validate_requestBody?: string | undefined
  validate_responses?: string | undefined
  validate_query_parameters?: string | undefined
}

export function mocked_operation_group (returned_values: MockedReturnedValues, ops_errors: string[][] = []): OperationGroup {
  const ops = ops_errors.map((errors) => mocked_operation({ validate: errors }))
  const op_group = new OperationGroup('', '', ops)

  if (returned_values.validate) {
    op_group.validate = jest.fn();
    (op_group.validate as jest.Mock).mockReturnValue(returned_values.validate)
    return op_group
  }

  op_group.validate_description = jest.fn()
  op_group.validate_external_docs = jest.fn()
  op_group.validate_request_body = jest.fn()
  op_group.validate_responses = jest.fn()
  op_group.validate_query_parameters = jest.fn()

  if (returned_values.validate_description != null) (op_group.validate_description as jest.Mock).mockReturnValue(returned_values.validate_description)
  if (returned_values.validate_externalDocs != null) (op_group.validate_external_docs as jest.Mock).mockReturnValue(returned_values.validate_externalDocs)
  if (returned_values.validate_requestBody != null) (op_group.validate_request_body as jest.Mock).mockReturnValue(returned_values.validate_requestBody)
  if (returned_values.validate_responses != null) (op_group.validate_responses as jest.Mock).mockReturnValue(returned_values.validate_responses)
  if (returned_values.validate_query_parameters != null) (op_group.validate_query_parameters as jest.Mock).mockReturnValue(returned_values.validate_query_parameters)

  return op_group
}
