import OperationGroup from '../../../linter/components/OperationGroup'
import { operation, mocked_operation } from './operation'

export function operation_group (operation_specs: Record<string, any>[]): OperationGroup {
  const operations = operation_specs.map((spec) => {
    return operation({ 'x-operation-group': 'indices.create', ...spec })
  })
  return new OperationGroup('namespaces/indices.yaml', 'indices.create', operations)
}

interface MockedReturnedValues {
  validate?: string[]
  validate_description?: string | void
  validate_externalDocs?: string | void
  validate_requestBody?: string | void
  validate_responses?: string | void
  validate_query_parameters?: string | void
}

export function mocked_operation_group (returned_values: MockedReturnedValues, ops_errors: string[][] = []) {
  const ops = ops_errors.map((errors) => mocked_operation({ validate: errors }))
  const op_group = new OperationGroup('', '', ops)

  if (returned_values.validate) {
    op_group.validate = jest.fn();
    (op_group.validate as jest.Mock).mockReturnValue(returned_values.validate)
    return op_group
  }

  op_group.validate_description = jest.fn()
  op_group.validate_externalDocs = jest.fn()
  op_group.validate_requestBody = jest.fn()
  op_group.validate_responses = jest.fn()
  op_group.validate_query_parameters = jest.fn()

  if (returned_values.validate_description) (op_group.validate_description as jest.Mock).mockReturnValue(returned_values.validate_description)
  if (returned_values.validate_externalDocs) (op_group.validate_externalDocs as jest.Mock).mockReturnValue(returned_values.validate_externalDocs)
  if (returned_values.validate_requestBody) (op_group.validate_requestBody as jest.Mock).mockReturnValue(returned_values.validate_requestBody)
  if (returned_values.validate_responses) (op_group.validate_responses as jest.Mock).mockReturnValue(returned_values.validate_responses)
  if (returned_values.validate_query_parameters) (op_group.validate_query_parameters as jest.Mock).mockReturnValue(returned_values.validate_query_parameters)

  return op_group
}
