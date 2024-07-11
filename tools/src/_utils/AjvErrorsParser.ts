/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Ajv2019 as AJV, ErrorsTextOptions, ErrorObject } from 'ajv/dist/2019'
import _ from 'lodash'

interface GroupedErrors {
  required: ErrorObject[]
  prohibited: ErrorObject[]
  enum: ErrorObject[]
  others: ErrorObject[]
}

export default class AjvErrorsParser {
  private readonly ajv: AJV
  private readonly options: ErrorsTextOptions

  constructor(ajv: AJV, options: ErrorsTextOptions = {}) {
    this.ajv = ajv
    this.options = { separator: ' --- ', ...options }
  }

  parse(errors: ErrorObject[] | undefined | null): string {
    const error_groups = this.#group_errors(errors ?? [])
    const parsed_errors = [
      this.#prohibited_property_error(error_groups.prohibited),
      this.#required_property_error(error_groups.required),
      this.#enum_error(error_groups.enum),
      ...error_groups.others
    ].filter(e => e != null) as ErrorObject[]
    return this.ajv.errorsText(parsed_errors, this.options)
  }

  #group_errors(errors: ErrorObject[]): GroupedErrors {
    const categories = {
      required: [] as ErrorObject[],
      prohibited: [] as ErrorObject[],
      enum: [] as ErrorObject[],
      others: [] as ErrorObject[]
    }
    _.values(_.groupBy(errors, 'instancePath')).forEach((path_errors) => {
      for (const error of path_errors) {
        switch (error.keyword) {
          case 'required':
            categories.required.push(error)
            break
          case 'unevaluatedProperties':
          case 'additionalProperties':
            categories.prohibited.push(error)
            break
          case 'enum':
            categories.enum.push(error)
            break
          default:
            categories.others.push(error)
        }
      }
    })
    return categories
  }

  #prohibited_property_error(errors: ErrorObject[]): ErrorObject | undefined {
    if (errors.length === 0) return
    const properties = errors.map((error) => error.params.additionalProperty ?? error.params.unevaluatedProperty).join(', ')
    return {
      keyword: 'prohibited',
      instancePath: errors[0].instancePath,
      schemaPath: errors[0].schemaPath,
      params: {},
      message: `contains unsupported properties: ${properties}`
    }
  }

  #required_property_error(errors: ErrorObject[]): ErrorObject | undefined {
    if (errors.length === 0) return
    const properties = errors.map((error) => error.params.missingProperty).join(', ')
    return {
      keyword: 'required',
      instancePath: errors[0].instancePath,
      schemaPath: errors[0].schemaPath,
      params: {},
      message: `MUST contain the missing properties: ${properties}`
    }
  }

  #enum_error(errors: ErrorObject[]): ErrorObject | undefined {
    if (errors.length === 0) return
    const allowed_values = errors[0].params.allowedValues.join(', ')
    return {
      keyword: 'enum',
      instancePath: errors[0].instancePath,
      schemaPath: errors[0].schemaPath,
      params: {},
      message: `MUST be equal to one of the allowed values: ${allowed_values}`
    }
  }
}
