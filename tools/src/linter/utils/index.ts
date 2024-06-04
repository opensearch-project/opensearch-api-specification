/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import { type ValidationError } from 'types'

export function is_ref<O extends object> (o: MaybeRef<O>): o is OpenAPIV3.ReferenceObject {
  return '$ref' in o
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
