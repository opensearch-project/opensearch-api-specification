/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import type Operation from './Operation'
import { type ValidationError } from 'types'
import ValidatorBase from './base/ValidatorBase'

export default class OperationGroup extends ValidatorBase {
  static readonly OP_PRIORITY = ['operationId', 'x-operation-group', 'x-ignorable', 'deprecated',
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
    const ops_errors = this.operations.flatMap((op) => op.validate())
    if (ops_errors.length > 0) return ops_errors
    if (this.operations.length === 1) return []
    return [
      this.validate_description(),
      this.validate_external_docs(),
      this.validate_request(),
      this.validate_responses(),
      this.validate_query_parameters()
    ].filter((e) => e) as ValidationError[]
  }

  validate_description (): ValidationError | undefined {
    const uniq_descriptions = new Set(this.operations.map((op) => op.spec.description))
    if (uniq_descriptions.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have identical description property.`) }
  }

  validate_external_docs (): ValidationError | undefined {
    const uniq_external_docs = new Set(this.operations.map((op) => op.spec.externalDocs?.url))
    if (uniq_external_docs.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have identical externalDocs property.`) }
  }

  validate_request (): ValidationError | undefined {
    const uniq_request_bodies = new Set(this.operations.map((op) => op.spec.requestBody?.$ref))
    if (uniq_request_bodies.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have identical requestBody property.`) }
  }

  validate_responses (): ValidationError | undefined {
    const key_signatures = this.operations.map((op) => Object.keys(op.spec.responses).sort().join('#$@'))
    const uniq_signatures = new Set(key_signatures)
    if (uniq_signatures.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have an identical set of responses.`) }
  }

  validate_query_parameters (): ValidationError | undefined {
    const query_signatures = this.operations.map((op) => op.query_params().sort().join('#$@'))
    const uniq_signatures = new Set(query_signatures)
    if (uniq_signatures.size > 1) { return this.error(`${this.operations.length} '${this.name}' operations must have an identical set of query parameters.`) }
  }
}
