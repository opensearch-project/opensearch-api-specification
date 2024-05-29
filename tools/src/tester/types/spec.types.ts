import { type OpenAPIV3 } from 'openapi-types'

export type ParsedOperation = OpenAPIV3.OperationObject & {
  parameters: Record<string, ParsedParameter>
  requestBody: ParsedRequestBody
  responses: Record<string, ParsedResponse>
}

export type ParsedRequestBody = OpenAPIV3.RequestBodyObject & {
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
