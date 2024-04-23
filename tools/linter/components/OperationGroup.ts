import Operation from './Operation'
import { ValidationError } from '../../types'
import ValidatorBase from './base/ValidatorBase'

export default class OperationGroup extends ValidatorBase {
  readonly OP_PRIORITY = ['operationId', 'x-operation-group', 'x-ignorable', 'deprecated',
    'x-deprecation-message', 'x-version-added', 'x-version-deprecated', 'x-version-removed',
    'description', 'externalDocs', 'parameters', 'requestBody', 'responses']

  name: string
  operations: Operation[]

  constructor (file: string, name: string, operations: Operation[]) {
    super(file, `Operation Group: ${name}`)
    this.name = name
    this.operations = operations
  }

  validate (): ValidationError[] {
    const location = `Operation Group: ${this.name}`
    const ops_errors = this.operations.flatMap((op) => op.validate())
    if (ops_errors.length > 0) return ops_errors
    if (this.operations.length == 1) return []
    return [
      this.validate_description(),
      this.validate_externalDocs(),
      this.validate_requestBody(),
      this.validate_responses(),
      this.validate_query_parameters()
    ].filter((e) => e) as ValidationError[]
  }

  validate_description (): ValidationError | void {
    const uniq_descriptions = new Set(this.operations.map((op) => op.spec.description))
    if (uniq_descriptions.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have identical description property.`) }
  }

  validate_externalDocs (): ValidationError | void {
    const uniq_externalDocs = new Set(this.operations.map((op) => op.spec.externalDocs?.url))
    if (uniq_externalDocs.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have identical externalDocs property.`) }
  }

  validate_requestBody (): ValidationError | void {
    const uniq_requestBodies = new Set(this.operations.map((op) => op.spec.requestBody?.$ref))
    if (uniq_requestBodies.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have identical requestBody property.`) }
  }

  validate_responses (): ValidationError | void {
    const key_signatures = this.operations.map((op) => Object.keys(op.spec.responses).sort().join('#$@'))
    const uniq_signatures = new Set(key_signatures)
    if (uniq_signatures.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have an identical set of responses.`) }
  }

  validate_query_parameters (): ValidationError | void {
    const query_signatures = this.operations.map((op) => op.query_params().sort().join('#$@'))
    const uniq_signatures = new Set(query_signatures)
    if (uniq_signatures.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have an identical set of query parameters.`) }
  }
}
