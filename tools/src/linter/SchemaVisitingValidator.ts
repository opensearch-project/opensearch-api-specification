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
import { type OpenAPIV3 } from 'openapi-types'
import { namespace_file } from '../../tests/linter/factories/namespace_file'

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

  validate_file(file_path: string): ValidationError[] {
    const errors: ValidationError[] = []
    const visitor = this.createVisitor(errors)

    const target_file = [...this._namespaces_folder.files, ...this._schemas_folder.files].find(f => f.file === filePath)

    if (!target_file) {
      return [{ message: `File not found in namespaces/schemas: ${file_path}`, file: file_path }]
    }

    visitor.visit_specification(new SpecificationContext(target_file.file), target_file.spec())

    return errors
  }

  private createVisitor(errors: ValidationError[]): SchemaVisitor {
    const validating_functions = [
      this.#validate_numeric_schema.bind(this)
    ]

    return new SchemaVisitor((ctx, schema) => {
      for (const f of validating_functions) {
        f(ctx, schema, errors)
      }
    })
  }

  #validate_inline_object_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3.SchemaObject>, errors: ValidationError[]): void {
    if (is_ref(schema) || schema.type !== 'object' || schema.properties === undefined) {
      return
    }

    const ancestry = ctx.keys.reverse()

    if (ancestry[1] === 'properties' ||
        ancestry[0] === 'additionalProperties' ||
        ancestry[0] === 'items' ||
        (ancestry[0] === 'schema' && ancestry[2] === 'parameters' && ancestry[3] !== 'components')) {
      errors.push(ctx.error('object schemas should be defined out-of-line via a $ref'))
    }
  }

  #validate_numeric_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3.SchemaObject>, errors: ValidationError[]): void {
    if (is_ref(schema) || schema.type === undefined || !SCHEMA_NUMERIC_TYPES.includes(schema.type)) {
      return
    }

    if (schema.type === 'number') {
      if (schema.format == null || !schema.format) {
        errors.push(ctx.error(`Schema of type 'number' must specify a valid format. Allowed formats: ${SCHEMA_NUMBER_FORMATS.join(', ')}`));
        return;
      }
    }

    if (schema.type === 'integer') {
      if (schema.format == null || !schema.format) {
        errors.push(ctx.error(`Schema of type 'integer' must specify a valid format. Allowed formats: ${SCHEMA_INTEGER_FORMATS.join(', ')}`));
        return;
      }
    }
  }
}
