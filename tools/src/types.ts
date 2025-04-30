/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3_1 } from 'openapi-types'

export interface OperationSpec extends OpenAPIV3_1.OperationObject {
  'x-operation-group': string
  'x-version-added': string
  'x-version-removed'?: string
  'x-version-deprecated'?: string
  'x-deprecation-message'?: string
  'x-ignorable'?: boolean
  'x-distributions-included'?: string[]
  'x-distributions-excluded'?: string[]

  parameters?: OpenAPIV3_1.ReferenceObject[]
  requestBody?: OpenAPIV3_1.ReferenceObject
  responses: Record<string, OpenAPIV3_1.ReferenceObject>
}

export interface ParameterSpec extends Omit<OpenAPIV3_1.ParameterObject, 'schema'> {
  schema?: OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject
  'x-data-type'?: string
  'x-version-deprecated'?: string
  'x-deprecation-message'?: string
  'x-global'?: boolean
}

export interface ValidationError {
  file: string
  location?: string
  message: string
}
