import Schema from '../../../linter/components/Schema'
import { type OpenAPIV3 } from 'openapi-types'

export function schema (name: string, spec: Record<string, any> = {}): Schema {
  return new Schema('_common.yaml', name, spec as OpenAPIV3.SchemaObject)
}

interface MockedReturnedValues {
  validate?: string[]
  validate_name?: string | undefined
}

export function mocked_schema (returned_values: MockedReturnedValues): Schema {
  const schema = new Schema('_common.yaml', 'Schema', {})

  if (returned_values.validate) {
    schema.validate = jest.fn();
    (schema.validate as jest.Mock).mockReturnValue(returned_values.validate)
    return schema
  }

  schema.validate_name = jest.fn()

  if (returned_values.validate_name != null) (schema.validate_name as jest.Mock).mockReturnValue(returned_values.validate_name)

  return schema
}
