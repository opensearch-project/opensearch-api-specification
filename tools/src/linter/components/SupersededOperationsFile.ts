/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import { sort_array_by_keys } from '../../helpers'
import FileValidator from './base/FileValidator'
import { type ValidationError } from 'types'
import { type OpenAPIV3 } from 'openapi-types'

const HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE']

export default class SupersededOperationsFile extends FileValidator {
  has_json_schema = true
  protected _superseded_ops: OpenAPIV3.Document | undefined

  validate (): ValidationError[] {
    const schema_validations = super.validate()
    if (schema_validations.length > 0) return schema_validations
    return this.validate_order_of_operations()
  }

  superseded_ops (): OpenAPIV3.Document {
    if (this._superseded_ops) return this._superseded_ops
    this._superseded_ops = this.spec()
    delete (this._superseded_ops as any).$schema
    return this._superseded_ops
  }

  validate_order_of_operations (): ValidationError[] {
    return _.entries(this.superseded_ops()).map(([path, p]) => {
      const current_keys = p.operations
      const sorted_keys = sort_array_by_keys(p.operations as string[], HTTP_METHODS)
      if(!_.isEqual(current_keys, sorted_keys)) {
        return this.error(
          `Operations must be sorted. Expected ${_.join(sorted_keys, ', ')}.`,
          path)
      }
    }).filter((e) => e) as ValidationError[]
  }
}
