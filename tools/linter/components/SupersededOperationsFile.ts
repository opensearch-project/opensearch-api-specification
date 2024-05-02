import FileValidator from './base/FileValidator'
import ajv from 'ajv'
import { type ValidationError } from '../../types'
import { read_yaml } from '../../helpers'

export default class SupersededOperationsFile extends FileValidator {
  readonly JSON_SCHEMA_PATH = '../json_schemas/_superseded_operations.yaml'

  validate (): ValidationError[] {
    return [
      this.validate_json_schema()
    ].filter(e => e) as ValidationError[]
  }

  validate_json_schema (): ValidationError | undefined {
    const schema = read_yaml(this.JSON_SCHEMA_PATH)
    const validator = (new ajv()).compile(schema)
    if (!validator(this.spec())) {
      return this.error(`File content does not match JSON schema found in '${this.JSON_SCHEMA_PATH}':\n ${JSON.stringify(validator.errors, null, 2)}`)
    }
  }
}
