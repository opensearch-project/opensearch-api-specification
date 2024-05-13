import NamespaceFile from '../../../../tools/linter/components/NamespaceFile'
import { type OpenAPIV3 } from 'openapi-types'
import { mocked_operation_group } from './operation_group'

export function namespace_file (fixture_file: string): NamespaceFile {
  return new NamespaceFile(`./tests/tools/linter/fixtures/file_validators/namespaces/${fixture_file}`)
}

interface MockedReturnedValues {
  validate?: string[]
  validate_name?: string | undefined
  validate_schemas?: string | undefined
  validate_unresolved_refs?: string[]
  validate_unused_refs?: string[]
  validate_parameter_refs?: string[]
}

export function mocked_namespace_file (ops: { returned_values?: MockedReturnedValues, spec?: Record<string, any>, groups_errors?: string[][] }): NamespaceFile {
  const ns_file = namespace_file('empty.yaml')
  ns_file.file = 'namespaces/indices.yaml'
  ns_file.namespace = 'indices'

  // eslint-disable-next-line @typescript-eslint/dot-notation
  if (ops.groups_errors) ns_file['_operation_groups'] = ops.groups_errors.map((errors) => mocked_operation_group({ validate: errors }))
  // eslint-disable-next-line @typescript-eslint/dot-notation,@typescript-eslint/consistent-type-assertions
  if (ops.spec) ns_file['_spec'] = { paths: {}, components: {}, ...ops.spec } as OpenAPIV3.Document

  if (ops.returned_values) {
    if (ops.returned_values.validate) {
      ns_file.validate = jest.fn();
      (ns_file.validate as jest.Mock).mockReturnValue(ops.returned_values.validate)
      return ns_file
    }

    ns_file.validate_name = jest.fn()
    ns_file.validate_schemas = jest.fn()
    ns_file.validate_unresolved_refs = jest.fn()
    ns_file.validate_unused_refs = jest.fn()
    ns_file.validate_parameter_refs = jest.fn()

    if (ops.returned_values.validate_name != null) (ns_file.validate_name as jest.Mock).mockReturnValue(ops.returned_values.validate_name)
    if (ops.returned_values.validate_schemas != null) (ns_file.validate_schemas as jest.Mock).mockReturnValue(ops.returned_values.validate_schemas)
    if (ops.returned_values.validate_unresolved_refs != null) (ns_file.validate_unresolved_refs as jest.Mock).mockReturnValue(ops.returned_values.validate_unresolved_refs)
    if (ops.returned_values.validate_unused_refs != null) (ns_file.validate_unused_refs as jest.Mock).mockReturnValue(ops.returned_values.validate_unused_refs)
    if (ops.returned_values.validate_parameter_refs != null) (ns_file.validate_parameter_refs as jest.Mock).mockReturnValue(ops.returned_values.validate_parameter_refs)
  }

  return ns_file
}
