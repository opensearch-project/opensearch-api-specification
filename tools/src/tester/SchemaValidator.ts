import AJV from 'ajv'
import addFormats from 'ajv-formats'
import { type OpenAPIV3 } from 'openapi-types'
import { type Evaluation, Result } from './types/eval.types'

export default class SchemaValidator {
  private readonly ajv: AJV
  constructor (spec: OpenAPIV3.Document) {
    this.ajv = new AJV()
    addFormats(this.ajv)
    this.ajv.addKeyword('discriminator')
    const schemas = spec.components?.schemas ?? {}
    for (const key in schemas) this.ajv.addSchema(schemas[key], `#/components/schemas/${key}`)
  }

  validate (schema: OpenAPIV3.SchemaObject, data: any): Evaluation {
    const validate = this.ajv.compile(schema)
    const valid = validate(data)
    return {
      result: valid ? Result.PASSED : Result.FAILED,
      message: valid ? undefined : this.ajv.errorsText(validate.errors)
    }
  }
}
