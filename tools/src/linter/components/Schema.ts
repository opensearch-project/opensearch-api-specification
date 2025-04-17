/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import ValidatorBase from './base/ValidatorBase'
import { type OpenAPIV3_1 } from 'openapi-types'
import { type ValidationError } from 'types'

const NAME_REGEX = /^[A-Za-z0-9]+$/

export default class Schema extends ValidatorBase {
  name: string
  spec: OpenAPIV3_1.SchemaObject

  constructor (error_file: string, name: string, spec: OpenAPIV3_1.SchemaObject) {
    super(error_file, `#/components/schemas/${name}`)
    this.name = name
    this.spec = spec
  }

  validate (): ValidationError[] {
    return [
      this.validate_name(),
      this.validate_description()
    ].filter(e => e) as ValidationError[]
  }

  validate_name (): ValidationError | undefined {
    if (!NAME_REGEX.test(this.name)) { return this.error(`Invalid schema name '${this.name}'. Only alphanumeric characters are allowed.`) }
  }

  validate_description (): ValidationError | undefined {
    return this.validate_description_field(this.spec.description)
  }
}
