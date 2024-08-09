/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'

export interface OperationSpec extends OpenAPIV3.OperationObject {
  'x-operation-group': string
  'x-version-added': string
  'x-version-removed'?: string
  'x-version-deprecated'?: string
  'x-deprecation-message'?: string
  'x-ignorable'?: boolean
  'x-distributions-included'?: string
  'x-distributions-excluded'?: string

  parameters?: OpenAPIV3.ReferenceObject[]
  requestBody?: OpenAPIV3.ReferenceObject
  responses: Record<string, OpenAPIV3.ReferenceObject>
}

export interface ParameterSpec extends OpenAPIV3.ParameterObject {
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
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

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'TRACE'
export type OperationPath = string
export type SupersededOperationMap = Record<OperationPath, { superseded_by: OperationPath, operations: HttpVerb[] }>
