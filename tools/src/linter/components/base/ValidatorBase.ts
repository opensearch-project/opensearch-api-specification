/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { toLaxTitleCase } from 'titlecase'
import { type ValidationError } from 'types'

const DESCRIPTION_REGEX = /^\p{Lu}[\s\S]*\.$/u

export default class ValidatorBase {
  file: string
  location: string | undefined

  constructor (file: string, location?: string) {
    this.file = file
    this.location = location
  }

  error (message: string, location = this.location, file = this.file): ValidationError {
    return { file, location, message }
  }

  validate (): ValidationError[] {
    throw new Error('Method not implemented.')
  }

  validate_description_field (value?: string, required: boolean = false, key: string = 'description'): ValidationError | undefined {
    if (value === undefined) { return required ? this.error(`Missing ${key} property.`) : undefined }
    if (value === '') { return this.error(`Empty ${key} property.`) }
    if (!DESCRIPTION_REGEX.test(value)) { return this.error(`The ${key} must start with a capital letter and end with a period, got "${value}".`) }
  }

  validate_title_field (value?: string, required: boolean = false, key: string = 'title'): ValidationError | undefined {
    if (value === undefined) { return required ? this.error(`Missing ${key} property.`) : undefined }
    if (value === '') { return this.error(`Empty ${key} property.`) }
    const expected = toLaxTitleCase(value)
    if (value.endsWith('.')) { return this.error(`The ${key} must not end with a period.`) }
    if (value !== expected) return this.error(`The ${key} must be capitalized, expected "${expected}", not "${value}".`)
  }
}
