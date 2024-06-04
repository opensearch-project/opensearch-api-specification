/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import FileValidator from './base/FileValidator'
import { type ValidationError } from 'types'
import Schema from './Schema'
import { type OpenAPIV3 } from 'openapi-types'

const CATEGORY_REGEX = /^[a-z_]+\.[a-z_]+$/
const NAME_REGEX = /^[a-z]+[a-z_]*[a-z]+$/

export default class SchemaFile extends FileValidator {
  category: string
  private _schemas: Schema[] | undefined

  constructor (file_path: string) {
    super(file_path)
    this.category = file_path.split('/').slice(-1)[0].replace('.yaml', '')
  }

  validate_file (): ValidationError[] {
    const category_error = this.validate_category()
    if (category_error) return [category_error]

    return [
      ...this.schemas().flatMap(s => s.validate())
    ]
  }

  schemas (): Schema[] {
    if (this._schemas) return this._schemas
    this._schemas = Object.entries(this.spec().components?.schemas ?? {}).map(([name, spec]) => {
      return new Schema(this.file, name, spec as OpenAPIV3.SchemaObject)
    })
    return this._schemas
  }

  validate_category (category = this.category): ValidationError | undefined {
    if (category === '_common') return
    if (!CATEGORY_REGEX.test(category)) { return this.error(`Invalid category name '${category}'. Must match regex: /${CATEGORY_REGEX.source}/.`, 'File Name') }
    const name = category.split('.')[1]
    if (name !== '_common' && !NAME_REGEX.test(name)) { return this.error(`Invalid category name '${category}'. '${name}' does not match regex: /${NAME_REGEX.source}/.`, 'File Name') }
  }
}
