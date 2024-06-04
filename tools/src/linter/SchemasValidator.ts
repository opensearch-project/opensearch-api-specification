/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import AJV from 'ajv'
import addFormats from 'ajv-formats'
import OpenApiMerger from '../merger/OpenApiMerger'
import { type ValidationError } from '../types'
import { LogLevel } from '../Logger'

const IGNORED_ERROR_PREFIXES = [
  'can\'t resolve reference', // errors in referenced schemas will also cause reference errors
  'discriminator: oneOf subschemas' // known bug in ajv: https://github.com/ajv-validator/ajv/issues/2281
]

const ADDITIONAL_KEYWORDS = [
  'x-version-added',
  'x-version-deprecated',
  'x-version-removed',
  'x-deprecation-message'
]

export default class SchemasValidator {
  root_folder: string
  spec: Record<string, any> = {}
  ajv: AJV

  constructor (root_folder: string) {
    this.root_folder = root_folder
    this.ajv = new AJV({ strict: true, discriminator: true })
    addFormats(this.ajv)
    for (const keyword of ADDITIONAL_KEYWORDS) this.ajv.addKeyword(keyword)
  }

  validate (): ValidationError[] {
    this.spec = new OpenApiMerger(this.root_folder, LogLevel.error).merge().components as Record<string, any>
    const named_schemas_errors = this.validate_named_schemas()
    if (named_schemas_errors.length > 0) return named_schemas_errors
    return [
      ...this.validate_parameter_schemas(),
      ...this.validate_request_body_schemas(),
      ...this.validate_response_schemas()
    ]
  }

  validate_named_schemas (): ValidationError[] {
    return Object.entries(this.spec.schemas as Record<string, any>).map(([key, _schema]) => {
      const schema = _schema as Record<string, any>
      const error = this.validate_schema(schema, `#/components/schemas/${key}`)
      if (error == null) return

      const file = `schemas/${key.split(':')[0]}.yaml`
      const location = `#/components/schemas/${key.split(':')[1]}`
      return this.error(file, location, error)
    }).filter((error) => error != null) as ValidationError[]
  }

  validate_parameter_schemas (): ValidationError[] {
    return Object.entries(this.spec.parameters as Record<string, any>).map(([key, param]) => {
      const error = this.validate_schema(param.schema as Record<string, any>)
      if (error == null) return

      const namespace = this.group_to_namespace(key.split('::')[0])
      const file = namespace === '_global' ? '_global_parameters.yaml' : `namespaces/${namespace}.yaml`
      const location = namespace === '_global' ? param.name as string : `#/components/parameters/${key}`
      return this.error(file, location, error)
    }).filter((error) => error != null) as ValidationError[]
  }

  validate_request_body_schemas (): ValidationError[] {
    return Object.entries(this.spec.requestBodies as Record<string, any>).flatMap(([namespace, body]) => {
      const file = `namespaces/${namespace}.yaml`
      const location = `#/components/requestBodies/${namespace}`
      return this.validate_content_schemas(file, location, body.content as Record<string, any>)
    })
  }

  validate_response_schemas (): ValidationError[] {
    return Object.entries(this.spec.responses as Record<string, any>).flatMap(([key, response]) => {
      const namespace = this.group_to_namespace(key.split('@')[0])
      const file = `namespaces/${namespace}.yaml`
      const location = `#/components/responses/${key}`
      const content = response.content as Record<string, any>
      return this.validate_content_schemas(file, location, content)
    })
  }

  validate_content_schemas (file: string, location: string, content: Record<string, any> | undefined): ValidationError[] {
    return Object.entries(content ?? {}).map(([media_type, value]) => {
      const schema = value.schema as Record<string, any>
      const error = this.validate_schema(schema)
      if (error != null) return this.error(file, `${location}/content/${media_type}`, error)
    }).filter(e => e != null) as ValidationError[]
  }

  validate_schema (schema: Record<string, any>, key: string | undefined = undefined): Error | undefined {
    if (schema == null || schema.$ref != null) return
    try {
      if (key != null) this.ajv.addSchema(schema, key)
      this.ajv.compile(schema)
    } catch (_e: any) {
      const error = _e as Error
      for (const prefix of IGNORED_ERROR_PREFIXES) if (error.message.startsWith(prefix)) return
      return error
    }
  }

  group_to_namespace (group: string): string {
    if (group === '_global') return '_global'
    const [, namespace] = group.split('.').reverse()
    return namespace ?? '_core'
  }

  error (file: string, location: string, error: Error): ValidationError {
    return { file, location, message: error.message }
  }
}
