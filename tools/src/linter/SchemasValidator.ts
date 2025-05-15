/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import OpenApiMerger from '../merger/OpenApiMerger'
import { type ValidationError } from '../types'
import { Logger, LogLevel } from '../Logger'
import JsonSchemaValidator from "../_utils/JsonSchemaValidator";

const ADDITIONAL_KEYWORDS = [
  'x-version-added',
  'x-version-deprecated',
  'x-version-removed',
  'x-deprecation-message',
  'x-distributions-included',
  'x-distributions-excluded',
  'x-supports-typed-keys',
  'x-is-generic-type-parameter'
]

export default class SchemasValidator {
  logger: Logger
  root_folder: string
  spec: Record<string, any> = {}
  json_validator: JsonSchemaValidator

  constructor (root_folder: string, logger: Logger) {
    this.logger = logger
    this.root_folder = root_folder
    this.json_validator = new JsonSchemaValidator(undefined, { additional_keywords: ADDITIONAL_KEYWORDS })
  }

  validate (): ValidationError[] {
    const merger = new OpenApiMerger(this.root_folder, new Logger(LogLevel.error))
    this.spec = merger.spec().components as Record<string, any>
    const named_schemas_errors = this.validate_named_schemas()
    if (named_schemas_errors.length > 0) return named_schemas_errors
    return [
      ...this.validate_parameter_schemas(),
      ...this.validate_request_schemas(),
      ...this.validate_response_schemas()
    ]
  }

  validate_named_schemas (): ValidationError[] {
    return Object.entries(this.spec.schemas as Record<string, any>).map(([key, _schema]) => {
      const message = this.json_validator.validate_schema(_schema)
      if (message == null) return

      const file = `schemas/${key.split('___')[0]}.yaml`
      const location = `#/components/schemas/${key.split('___')[1]}`
      return this.error(file, location, message)
    }).filter((error) => error != null) as ValidationError[]
  }

  validate_parameter_schemas (): ValidationError[] {
    return Object.entries(this.spec.parameters as Record<string, any>).map(([key, param]) => {
      const message = this.json_validator.validate_schema(param.schema)
      if (message == null) return

      const namespace = this.group_to_namespace(key.split('___')[0])
      const file = namespace === '_global' ? '_global_parameters.yaml' : `namespaces/${namespace}.yaml`
      const location = namespace === '_global' ? param.name as string : `#/components/parameters/${key}`.replace('___', '::')
      return this.error(file, location, message)
    }).filter((error) => error != null) as ValidationError[]
  }

  validate_request_schemas (): ValidationError[] {
    return Object.entries(this.spec.requestBodies as Record<string, any>).flatMap(([namespace, body]) => {
      const file = `namespaces/${namespace}.yaml`
      const location = `#/components/requestBodies/${namespace}`
      return this.validate_content_schemas(file, location, body.content as Record<string, any>)
    })
  }

  validate_response_schemas (): ValidationError[] {
    return Object.entries(this.spec.responses as Record<string, any>).flatMap(([key, response]) => {
      const namespace = this.group_to_namespace(key.split('___')[0])
      const file = `namespaces/${namespace}.yaml`
      const location = `#/components/responses/${key}`.replace('___', '@')
      const content = response.content as Record<string, any>
      return this.validate_content_schemas(file, location, content)
    })
  }

  validate_content_schemas (file: string, location: string, content: Record<string, any> | undefined): ValidationError[] {
    return Object.entries(content ?? {}).map(([media_type, value]) => {
      const message = this.json_validator.validate_schema(value.schema)
      if (message != null) return this.error(file, `${location}/content/${media_type}`, message)
    }).filter(e => e != null) as ValidationError[]
  }

  group_to_namespace (group: string): string {
    if (group === '_global') return '_global'
    const [, namespace] = group.split('.').reverse()
    return namespace ?? '_core'
  }

  error (file: string, location: string, message: string): ValidationError {
    return { file, location, message }
  }
}
