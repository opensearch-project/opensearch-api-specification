/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import JsonSchemaValidator from "../_utils/JsonSchemaValidator";
import { type OpenAPIV3 } from 'openapi-types'
import { type Evaluation, Result } from './types/eval.types'
import { Logger } from 'Logger'
import { to_json } from '../helpers'
import _ from 'lodash'

const ADDITIONAL_KEYWORDS = [
  'discriminator',
  'x-version-added',
  'x-version-deprecated',
  'x-version-removed',
  'x-deprecation-message',
  'x-distributions-included',
  'x-distributions-excluded'
]

export default class SchemaValidator {
  private readonly json_validator: JsonSchemaValidator
  private readonly logger: Logger

  constructor (spec: OpenAPIV3.Document, logger: Logger) {
    this.logger = logger
    const component_schemas = spec.components?.schemas ?? {}
    const reference_schemas = _.mapKeys(component_schemas, (_, name) => `#/components/schemas/${name}`)
    this.json_validator = new JsonSchemaValidator(undefined, {
      reference_schemas,
      additional_keywords: ADDITIONAL_KEYWORDS,
      ajv_errors_opts: { singleError: true },
      errors_text_opts: { separator: ', ' }
    })
  }

  validate (schema: OpenAPIV3.SchemaObject, data: any): Evaluation {
    const message = this.json_validator.validate_data(data as Record<any, any>, schema)
    if (message != null) {
      this.logger.info(`# ${to_json(schema)}`)
      this.logger.info(`* ${to_json(data)}`)
      this.logger.info(`& ${to_json(message)}`)
      return { result: Result.FAILED, message }
    }
    return { result: Result.PASSED }
  }
}
