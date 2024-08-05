/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import { type ValidationError } from 'types'
import ValidatorBase from './base/ValidatorBase'

export default class Info extends ValidatorBase {
  path: string
  spec: OpenAPIV3.InfoObject

  constructor (file: string, path: string, spec: OpenAPIV3.InfoObject) {
    super(file, 'Info')
    this.path = path
    this.spec = spec
  }

  validate (): ValidationError[] {
    return [
      this.validate_title(),
      this.validate_description()
    ].filter((e) => e) as ValidationError[]
  }

  validate_description (): ValidationError | undefined {
    return this.validate_description_field(this.spec?.description, true)
  }

  validate_title (): ValidationError | undefined {
    return this.validate_title_field(this.spec?.title)
  }
}
