/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OperationSpec, type ValidationError } from 'types'
import _ from 'lodash'
import ValidatorBase from './base/ValidatorBase'

const GROUP_REGEX = /^([a-z]+[a-z_]*[a-z]+\.)?([a-z]+[a-z_]*[a-z]+)$/
const DESCRIPTION_REGEX = /^\p{Lu}[\s\S]*\.$/u

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
      this.validate_operation_id(),
      this.validate_description(),
      this.validate_request(),
      this.validate_parameters(),
      this.validate_path_parameters(),
      this.validate_order_of_parameters(),
      ...this.validate_responses()
    ].filter((e) => e) as ValidationError[]
  }

  validate_group (): ValidationError | undefined {
    if (!this.group || this.group === '') { return this.error('Missing x-operation-group property') }
    if (!GROUP_REGEX.test(this.group)) { return this.error(`Invalid x-operation-group '${this.group}'. Must match regex: /${GROUP_REGEX.source}/.`) }
  }

  validate_namespace (): ValidationError | undefined {
    const expected_namespace = this.file.match(/\/(.*)\.yaml/)?.[1]

    if (expected_namespace === '_core' && this.namespace === undefined) return
    if (expected_namespace === '_core' && this.namespace === '_core') { return this.error(`Invalid x-operation-group '${this.group}'. '_core' namespace must be omitted in x-operation-group.`) }

    if (this.namespace === expected_namespace) return
    return this.error(`Invalid x-operation-group '${this.group}'. '${this.namespace}' namespace detected. ` +
      `Only '${expected_namespace}' namespace is allowed in this file.`)
  }

  validate_description (): ValidationError | undefined {
    const description = this.spec.description ?? ''
    if (description === '') { return this.error('Missing description property.') }
    if (!DESCRIPTION_REGEX.test(description)) return this.error('Description must start with a capital letter and end with a period.')
  }

  validate_operation_id (): ValidationError | undefined {
    const id = this.spec.operationId ?? ''
    if (id === '') { return this.error('Missing operationId property.') }
    const regex = new RegExp(`^${this.group_regex}\\.[0-9]+$`)
    if (!regex.test(id)) { return this.error(`Invalid operationId '${id}'. Must be in {x-operation-group}.{number} format.`) }
  }

  validate_request (): ValidationError | undefined {
    const body = this.spec.requestBody
    if (!body) return
    const expected = `#/components/requestBodies/${this.group}`
    if (body.$ref !== expected) { return this.error(`The requestBody must be a reference object to '${expected}'.`) }
  }

  validate_responses (): ValidationError[] {
    const responses = this.spec.responses ?? {}
    if (_.keys(responses).length === 0) return [this.error('Missing responses property.')]
    return _.entries(responses).map(([code, response]) => {
      const expected = `#/components/responses/${this.group}@${code}`
      if (response.$ref !== expected) { return this.error(`The ${code} response must be a reference object to '${expected}'.`) }
    }).filter((error) => error) as ValidationError[]
  }

  validate_parameters (): ValidationError | undefined {
    const parameters = this.spec.parameters
    if (!parameters) return
    const regex = new RegExp(`^#/components/parameters/${this.group_regex}::((path)|(query))\\.[a-zA-Z0-9_.]+$`)
    for (const parameter of parameters) {
      if (!regex.test(parameter.$ref)) { return this.error('Every parameter must be a reference object to \'#/components/parameters/{x-operation-group}::{path|query}.{parameter_name}\'.') }
    }
  }

  validate_order_of_parameters(): ValidationError | undefined {
    const parameters = this.spec.parameters
    const unsorted_refs = _.map(parameters, (parameter) => parameter.$ref)
    const sorted_refs = _.sortBy(_.map(parameters, (parameter) => parameter.$ref))
    if (!_.isEqual(sorted_refs, unsorted_refs)) {
      return this.error(
        `Parameters in ${this.path} must be sorted. Expected ${_.join(sorted_refs, ', ')}.`,
        this.path)
    }
  }

  validate_path_parameters (): ValidationError | undefined {
    const path_params = this.path_params()
    const expected = this.path.match(/{[a-z0-9_]+}/g)?.map(p => p.slice(1, -1)) ?? []
    if (path_params.sort().join(', ') !== expected.sort().join(', ')) { return this.error(`Path parameters must match the parameters in the path: {${expected.join('}, {')}}.`) }
  }

  path_params (): string[] {
    return this.spec.parameters?.map(p => p.$ref?.match(/::path\.(.+)/)?.[1])
      .filter((p): p is string => p !== undefined) ?? []
  }

  query_params (): string[] {
    return this.spec.parameters?.map(p => p.$ref?.match(/::query\.(.+)/)?.[1])
      .filter((p): p is string => p !== undefined) ?? []
  }
}
