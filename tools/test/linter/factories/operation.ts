import Operation from "../../../linter/components/Operation";
import {OperationSpec} from "../../../types";

export function operation(spec: Record<string, any>, file_name = 'indices.yaml') {
  return new Operation(`namespaces/${file_name}`, '/{index}/something/{abc_xyz}', 'post', spec as OperationSpec);
}

interface MockedReturnedValues {
  validate?: string[];
  validate_group?: string | void;
  validate_namespace?: string | void;
  validate_operationId?: string | void;
  validate_description?: string | void;
  validate_requestBody?: string | void;
  validate_responses?: string[];
  validate_parameters?: string | void;
  validate_path_parameters?: string | void;
}

export function mocked_operation(returned_values: MockedReturnedValues) {
  const op = new Operation('', '', '', {} as OperationSpec);

  if(returned_values.validate) {
    op.validate = jest.fn();
    (op.validate as jest.Mock).mockReturnValue(returned_values.validate)
    return op;
  }

  op.validate_group = jest.fn();
  op.validate_namespace = jest.fn();
  op.validate_operationId = jest.fn();
  op.validate_description = jest.fn();
  op.validate_requestBody = jest.fn();
  op.validate_responses = jest.fn();
  op.validate_parameters = jest.fn();
  op.validate_path_parameters = jest.fn();

  if(returned_values.validate_group) (op.validate_group as jest.Mock).mockReturnValue(returned_values.validate_group);
  if(returned_values.validate_namespace) (op.validate_namespace as jest.Mock).mockReturnValue(returned_values.validate_namespace);
  if(returned_values.validate_operationId) (op.validate_operationId as jest.Mock).mockReturnValue(returned_values.validate_operationId);
  if(returned_values.validate_description) (op.validate_description as jest.Mock).mockReturnValue(returned_values.validate_description);
  if(returned_values.validate_requestBody) (op.validate_requestBody as jest.Mock).mockReturnValue(returned_values.validate_requestBody);
  if(returned_values.validate_responses) (op.validate_responses as jest.Mock).mockReturnValue(returned_values.validate_responses);
  if(returned_values.validate_parameters) (op.validate_parameters as jest.Mock).mockReturnValue(returned_values.validate_parameters);
  if(returned_values.validate_path_parameters) (op.validate_path_parameters as jest.Mock).mockReturnValue(returned_values.validate_path_parameters);

  return op;
}
