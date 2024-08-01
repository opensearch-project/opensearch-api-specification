/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'

export type ParsedOperation = OpenAPIV3.OperationObject & {
  parameters: Record<string, ParsedParameter>
  requestBody: ParsedRequest
  responses: Record<string, ParsedResponse>
}

export type ParsedRequest = OpenAPIV3.RequestBodyObject & {
  content: Record<string, ParsedMediaType>
}

export type ParsedResponse = OpenAPIV3.ResponseObject & {
  content: Record<string, ParsedMediaType>
}

export type ParsedMediaType = OpenAPIV3.MediaTypeObject & {
  schema: OpenAPIV3.SchemaObject
}

export interface ParsedParameter {
  name: string
  in: string
  required: boolean
  schema: OpenAPIV3.SchemaObject
}
