import { mocked_schema, schema } from './schema'
import SchemaFile from '../../../linter/components/SchemaFile'

export function schema_file (fixture: string): SchemaFile {
  return new SchemaFile(`./test/linter/fixtures/file_validators/schemas/${fixture}`)
}

interface MockedReturnedValues {
  validate?: string[]
  validate_category?: string | void
}

export function mocked_schema_file (ops: { returned_values?: MockedReturnedValues, schema_errors?: string[][] }): SchemaFile {
  const validator = schema_file('_common.empty.yaml')
  if (ops.schema_errors) validator._schemas = ops.schema_errors.map((errors) => mocked_schema({ validate: errors }))

  if (ops.returned_values) {
    if (ops.returned_values.validate) {
      validator.validate = jest.fn();
      (validator.validate as jest.Mock).mockReturnValue(ops.returned_values.validate)
      return validator
    }

    validator.validate_category = jest.fn()

    if (ops.returned_values.validate_category) (validator.validate_category as jest.Mock).mockReturnValue(ops.returned_values.validate_category)
  }

  return validator
}
