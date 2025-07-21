/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import type NamespacesFolder from './components/NamespacesFolder'
import type SchemasFolder from './components/SchemasFolder'
import { type ValidationError } from 'types'
import { SchemaVisitor } from '../_utils/SpecificationVisitor'
import {
  is_ref,
  type MaybeRef,
  SCHEMA_INTEGER_FORMATS,
  SCHEMA_NUMBER_FORMATS,
  SCHEMA_NUMERIC_TYPES,
  SpecificationContext
} from '../_utils'
import { type OpenAPIV3_1 } from 'openapi-types'

export default class SchemaVisitingValidator {
  private readonly _namespaces_folder: NamespacesFolder
  private readonly _schemas_folder: SchemasFolder

  constructor (namespaces_folder: NamespacesFolder, schemas_folder: SchemasFolder) {
    this._namespaces_folder = namespaces_folder
    this._schemas_folder = schemas_folder
  }

  validate (): ValidationError[] {
    const errors: ValidationError[] = []

    const validating_functions = [
      this.#validate_inline_object_schema.bind(this),
      this.#validate_numeric_schema.bind(this)
    ]

    const visitor = new SchemaVisitor((ctx, schema) => {
      for (const f of validating_functions) {
        f(ctx, schema, errors)
      }
    });

    [
      ...this._namespaces_folder.files,
      ...this._schemas_folder.files
    ].forEach(f => { visitor.visit_specification(new SpecificationContext(f.file), f.spec()) })

    return errors
  }

  #validate_inline_object_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3_1.SchemaObject>, errors: ValidationError[]): void {
    if (is_ref(schema) || schema.type !== 'object' || schema.properties === undefined) {
      return
    }

    const ancestry = ctx.keys.reverse()

    if (ancestry.includes('allOf')) {
      return
    }

    if (ancestry[1] === 'properties' ||
        ancestry[0] === 'additionalProperties' ||
        ancestry[0] === 'items' ||
        (ancestry[0] === 'schema' && ancestry[2] === 'parameters' && ancestry[3] !== 'components')) {
      errors.push(ctx.error('object schemas should be defined out-of-line via a $ref'))
    }
  }

  #validate_numeric_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3_1.SchemaObject>, errors: ValidationError[]): void {
    if (is_ref(schema) || typeof schema.type !== 'string' || !SCHEMA_NUMERIC_TYPES.has(schema.type)) {
      return
    }

    if (schema.type === 'number') {
      if (schema.format === undefined || SCHEMA_NUMBER_FORMATS.has(schema.format)) {
        return
      }

      if (SCHEMA_INTEGER_FORMATS.has(schema.format)) {
        errors.push(ctx.error(`schema of type 'number' with format '${schema.format}' should instead be of type 'integer'`))
      } else {
        errors.push(ctx.error(`schema of type 'number' with format '${schema.format}' is invalid, expected one of: ${[...SCHEMA_NUMBER_FORMATS].join(', ')}`))
      }
    }

    if (schema.type === 'integer') {
      if (schema.format === undefined || SCHEMA_INTEGER_FORMATS.has(schema.format)) {
        return
      }

      if (SCHEMA_NUMBER_FORMATS.has(schema.format)) {
        errors.push(ctx.error(`schema of type 'integer' with format '${schema.format}' should instead be of type 'number'`))
      } else {
        errors.push(ctx.error(`schema of type 'integer' with format '${schema.format}' is invalid, expected one of: ${[...SCHEMA_INTEGER_FORMATS].join(', ')}`))
      }
    }
  }
}
