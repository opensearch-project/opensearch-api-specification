/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type ValidationError } from 'types'
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
}
