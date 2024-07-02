/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import AJV from 'ajv'
import ajv_errors from 'ajv-errors'
import addFormats from 'ajv-formats'
import { type OpenAPIV3 } from 'openapi-types'
import { type Evaluation, Result } from './types/eval.types'
import { Logger } from 'Logger'
import { to_json } from '../helpers'

const ADDITIONAL_KEYWORDS = [
  'discriminator',
  'x-version-added',
  'x-version-deprecated',
  'x-version-removed',
  'x-deprecation-message'
]

export default class SchemaValidator {
  private readonly ajv: AJV
  private readonly logger: Logger

  constructor (spec: OpenAPIV3.Document, logger: Logger) {
    this.logger = logger
    this.ajv = new AJV({ allErrors: true, strict: true })
    addFormats(this.ajv)
    for (const keyword of ADDITIONAL_KEYWORDS) this.ajv.addKeyword(keyword)
    ajv_errors(this.ajv, { singleError: true })
    const schemas = spec.components?.schemas ?? {}
    for (const key in schemas) this.ajv.addSchema(schemas[key], `#/components/schemas/${key}`)
  }

  validate (schema: OpenAPIV3.SchemaObject, data: any): Evaluation {
    const validate = this.ajv.compile(schema)
    const valid = validate(data)
    if (!valid) {
      this.logger.info(`# ${to_json(schema)}`)
      this.logger.info(`* ${to_json(data)}`)
      this.logger.info(`& ${to_json(validate.errors)}`)
    }
    return {
      result: valid ? Result.PASSED : Result.FAILED,
      message: valid ? undefined : this.ajv.errorsText(validate.errors)
    }
  }
}
