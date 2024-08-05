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
import { toLaxTitleCase } from 'titlecase'

const DESCRIPTION_REGEX = /^\p{Lu}[\s\S]*\.$/u

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
    const description = this.spec?.description ?? ''
    if (description === '') { return this.error('Missing description property.') }
    if (!DESCRIPTION_REGEX.test(description)) { return this.error('Description must start with a capital letter and end with a period.') }
  }

  validate_title (): ValidationError | undefined {
    const title = this.spec?.title ?? ''
    if (title === '') { return this.error('Missing title property.') }
    const expected_title = toLaxTitleCase(title)
    if (title.endsWith('.')) { return this.error('Title must not end with a period.') }
    if (title !== expected_title) return this.error(`Title must be capitalized, expected '${expected_title}'.`)
  }
}
