/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'
import { type ValidationError } from 'types'
import { to_json } from "../helpers";
import { intersection, union } from "./Sets";

export const HTTP_METHODS: OpenAPIV3_1.HttpMethods[] = Object.values(OpenAPIV3.HttpMethods)
export type SchemaObjectType = OpenAPIV3_1.ArraySchemaObjectType | OpenAPIV3_1.NonArraySchemaObjectType
export const SCHEMA_OBJECT_TYPES: Set<SchemaObjectType> = new Set(['array', 'boolean', 'object', 'number', 'string', 'integer'])
export const SCHEMA_NUMERIC_TYPES: Set<SchemaObjectType> = new Set(['number', 'integer'])
export const SCHEMA_NUMBER_FORMATS: Set<string> = new Set(['float', 'double'])
export const SCHEMA_INTEGER_FORMATS: Set<string> = new Set(['int32', 'int64'])

export function is_ref<O extends object> (o: MaybeRef<O>): o is OpenAPIV3_1.ReferenceObject {
  return o != null && typeof o === 'object' && '$ref' in o
}

export function is_array_schema (schema: OpenAPIV3_1.SchemaObject): schema is OpenAPIV3_1.ArraySchemaObject {
  return schema.type === 'array'
}

export function is_primitive_schema (schema: OpenAPIV3_1.SchemaObject): boolean {
  return schema.type === 'boolean' ||
    schema.type === 'integer' ||
    schema.type === 'number' ||
    schema.type === 'string'
}

export function determine_possible_schema_types (doc: OpenAPIV3_1.Document, schema: MaybeRef<OpenAPIV3_1.SchemaObject>): Set<SchemaObjectType> {
  while (is_ref(schema)) {
    const key = schema.$ref.split('/').pop()
    if (key === undefined) throw new Error(`Invalid $ref: '${schema.$ref}'`)
    const resolved = doc.components?.schemas?.[key]
    if (resolved === undefined) throw new Error(`Invalid $ref: '${schema.$ref}'`)
    schema = resolved
  }

  if (schema?.type !== undefined) return new Set(schema.type instanceof Array ? schema.type : [schema.type])

  if (schema?.allOf !== undefined) return schema.allOf.map(s => determine_possible_schema_types(doc, s)).reduce(intersection)
  if (schema?.anyOf !== undefined) return schema.anyOf.map(s => determine_possible_schema_types(doc, s)).reduce(union)
  if (schema?.oneOf !== undefined) return schema.oneOf.map(s => determine_possible_schema_types(doc, s)).reduce(union)

  if (schema == null || Object.keys(schema).filter(k => k !== 'description' && k !== 'title' && !k.startsWith('x-')).length == 0) return SCHEMA_OBJECT_TYPES

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

export type MaybeRef<O extends object> = O | OpenAPIV3_1.ReferenceObject

export type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T]
