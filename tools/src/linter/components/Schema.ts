import ValidatorBase from './base/ValidatorBase'
import { type OpenAPIV3 } from 'openapi-types'
import { type ValidationError } from 'types'

const NAME_REGEX = /^[A-Za-z0-9]+$/

export default class Schema extends ValidatorBase {
  name: string
  spec: OpenAPIV3.SchemaObject

  constructor (error_file: string, name: string, spec: OpenAPIV3.SchemaObject) {
    super(error_file, `#/components/schemas/${name}`)
    this.name = name
    this.spec = spec
  }

  validate (): ValidationError[] {
    return [this.validate_name()].filter(e => e) as ValidationError[]
  }

  validate_name (): ValidationError | undefined {
    if (!NAME_REGEX.test(this.name)) { return this.error(`Invalid schema name '${this.name}'. Only alphanumeric characters are allowed.`) }
  }
}
