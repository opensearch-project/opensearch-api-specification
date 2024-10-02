/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { OpenAPIV3 } from 'openapi-types'
import { type ValidationError } from 'types'
import _ from "lodash";
import { to_json } from "../helpers";

export const HTTP_METHODS: OpenAPIV3.HttpMethods[] = Object.values(OpenAPIV3.HttpMethods)
export type SchemaObjectType = OpenAPIV3.ArraySchemaObjectType | OpenAPIV3.NonArraySchemaObjectType
export const SCHEMA_OBJECT_TYPES: SchemaObjectType[] = ['array', 'boolean', 'object', 'number', 'string', 'integer']
export const SCHEMA_NUMERIC_TYPES: SchemaObjectType[] = ['number', 'integer']
export const SCHEMA_NUMBER_FORMATS: string[] = ['float', 'double']
export const SCHEMA_INTEGER_FORMATS: string[] = ['int32', 'int64']

export function is_ref<O extends object> (o: MaybeRef<O>): o is OpenAPIV3.ReferenceObject {
  return o != null && typeof o === 'object' && '$ref' in o
}

export function is_array_schema (schema: OpenAPIV3.SchemaObject): schema is OpenAPIV3.ArraySchemaObject {
  return schema.type === 'array'
}

export function is_primitive_schema (schema: OpenAPIV3.SchemaObject): boolean {
  return schema.type === 'boolean' ||
    schema.type === 'integer' ||
    schema.type === 'number' ||
    schema.type === 'string'
}

export function determine_possible_schema_types (doc: OpenAPIV3.Document, schema: MaybeRef<OpenAPIV3.SchemaObject>): SchemaObjectType[] {
  while (is_ref(schema)) {
    const key = schema.$ref.split('/').pop()
    if (key === undefined) throw new Error(`Invalid $ref: '${schema.$ref}'`)
    const resolved = doc.components?.schemas?.[key]
    if (resolved === undefined) throw new Error(`Invalid $ref: '${schema.$ref}'`)
    schema = resolved
  }

  if (schema?.type !== undefined) return [schema.type]

  const collect_all = (schemas: MaybeRef<OpenAPIV3.SchemaObject>[]): SchemaObjectType[] =>
    _.uniq(schemas.flatMap(s => determine_possible_schema_types(doc, s)))

  if (schema?.allOf !== undefined) {
    const types = collect_all(schema.allOf)
    if (types.length > 1) throw new Error(`allOf schema should resolve to a single type, but was: ${types.join(", ")}`)
    return types
  }
  if (schema?.anyOf !== undefined) return collect_all(schema.anyOf)
  if (schema?.oneOf !== undefined) return collect_all(schema.oneOf)

  if (schema == null || Object.keys(schema).filter(k => k !== 'description' && k !== 'title').length == 0) return SCHEMA_OBJECT_TYPES

  throw new Error(`Unable to determine possible types of schema: ${to_json(schema)}`)
}

export class SpecificationContext {
  private readonly _file: string
  private readonly _location: string[]

  constructor (file: string, location?: string[]) {
    this._file = file
    this._location = location ?? ['#']
  }

  parent (): SpecificationContext {
    if (this._location.length <= 1) return this
    return new SpecificationContext(this._file, this._location.slice(0, -1))
  }

  child (child: string): SpecificationContext {
    return new SpecificationContext(this._file, [...this._location, child])
  }

  error (message: string): ValidationError {
    return { file: this._file, location: this.location, message }
  }

  get file (): string {
    return this._file
  }

  get location (): string {
    return this._location
      .map(k => k
        .replaceAll('~', '~0')
        .replaceAll('/', '~1'))
      .join('/')
  }

  get key (): string {
    return this._location[this._location.length - 1]
  }

  get keys (): string[] {
    return [...this._location]
  }
}

export type MaybeRef<O extends object> = O | OpenAPIV3.ReferenceObject

export type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]
