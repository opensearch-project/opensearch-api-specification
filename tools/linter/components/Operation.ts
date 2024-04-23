import { OperationSpec, ValidationError } from '../../types'
import _ from 'lodash'
import ValidatorBase from './base/ValidatorBase'

const GROUP_REGEX = /^([a-z]+[a-z_]*[a-z]+\.)?([a-z]+[a-z_]*[a-z]+)$/
export default class Operation extends ValidatorBase {
  path: string
  verb: string
  group: string
  group_regex: string
  namespace: string | undefined
  spec: OperationSpec

  constructor (file: string, path: string, verb: string, spec: OperationSpec) {
    super(file, `Operation: ${verb.toUpperCase()} ${path}`)
    this.path = path
    this.verb = verb
    this.spec = spec
    this.group = spec['x-operation-group']
    this.group_regex = this.group?.replace('.', '\\.')
    if (this.group?.indexOf('.') > 0) this.namespace = this.group.split('.')[0]
  }

  validate (): ValidationError[] {
    const group_error = this.validate_group()
    if (group_error) return [group_error]
    const namespace_error = this.validate_namespace()
    if (namespace_error) return [namespace_error]
    return [
      this.validate_operationId(),
      this.validate_description(),
      this.validate_requestBody(),
      this.validate_parameters(),
      this.validate_path_parameters(),
      ...this.validate_responses()
    ].filter((e) => e) as ValidationError[]
  }

  validate_group (): ValidationError | void {
    if (!this.group || this.group === '') { return this.error('Missing x-operation-group property') }
    if (!this.group.match(GROUP_REGEX)) { return this.error(`Invalid x-operation-group '${this.group}'. Must match regex: /${GROUP_REGEX.source}/.`) }
  }

  validate_namespace (): ValidationError | void {
    const expected_namespace = this.file.match(/namespaces\/(.*)\.yaml/)![1]

    if (expected_namespace === '_core' && this.namespace === undefined) return
    if (expected_namespace === '_core' && this.namespace === '_core') { return this.error(`Invalid x-operation-group '${this.group}'. '_core' namespace must be omitted in x-operation-group.`) }

    if (this.namespace === expected_namespace) return
    return this.error(`Invalid x-operation-group '${this.group}'. '${this.namespace}' namespace detected. ` +
      `Only '${expected_namespace}' namespace is allowed in this file.`)
  }

  validate_description (): ValidationError | void {
    const description = this.spec.description
    if (!description || description === '') { return this.error('Missing description property.') }
    if (!description.endsWith('.')) { return this.error('Description must end with a period.') }
  }

  validate_operationId (): ValidationError | void {
    const id = this.spec.operationId
    if (!id || id === '') { return this.error('Missing operationId property.') }
    if (!id.match(new RegExp(`^${this.group_regex}\\.[0-9]+$`))) { return this.error(`Invalid operationId '${id}'. Must be in {x-operation-group}.{number} format.`) }
  }

  validate_requestBody (): ValidationError | void {
    const body = this.spec.requestBody
    if (!body) return
    const expected = `#/components/requestBodies/${this.group}`
    if (body.$ref !== expected) { return this.error(`The requestBody must be a reference object to '${expected}'.`) }
  }

  validate_responses (): ValidationError[] {
    const responses = this.spec.responses
    if (!responses || _.keys(responses).length === 0) return [this.error('Missing responses property.')]
    return _.entries(responses).map(([code, response]) => {
      const expected = `#/components/responses/${this.group}@${code}`
      if (response.$ref && response.$ref !== expected) { return this.error(`The ${code} response must be a reference object to '${expected}'.`) }
      return
    }).filter((error) => error) as ValidationError[]
  }

  validate_parameters (): ValidationError | void {
    const parameters = this.spec.parameters
    if (!parameters) return
    const regex = new RegExp(`^#/components/parameters/${this.group_regex}::((path)|(query))\\.[a-z0-9_.]+$`)
    for (const parameter of parameters) {
      if (!parameter.$ref.match(regex)) { return this.error('Every parameter must be a reference object to \'#/components/parameters/{x-operation-group}::{path|query}.{parameter_name}\'.') }
    }
  }

  validate_path_parameters (): ValidationError | void {
    const path_params = this.path_params()
    const expected = this.path.match(/{[a-z0-9_]+}/g)?.map(p => p.slice(1, -1)) || []
    if (path_params.sort().join(', ') !== expected.sort().join(', ')) { return this.error(`Path parameters must match the parameters in the path: {${expected.join('}, {')}}.`) }
  }

  path_params (): string[] {
    return this.spec.parameters?.map(p => p.$ref?.match(/::path\.(.+)/)?.[1])
      .filter((p): p is string => p !== undefined) || []
  }

  query_params (): string[] {
    return this.spec.parameters?.map(p => p.$ref?.match(/::query\.(.+)/)?.[1])
      .filter((p): p is string => p !== undefined) || []
  }
}
