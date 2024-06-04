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
import { SchemaVisitor } from './utils/SpecificationVisitor'
import { is_ref, type MaybeRef, SpecificationContext } from './utils'
import { type OpenAPIV3 } from 'openapi-types'

export default class InlineObjectSchemaValidator {
  private readonly _namespaces_folder: NamespacesFolder
  private readonly _schemas_folder: SchemasFolder

  constructor (namespaces_folder: NamespacesFolder, schemas_folder: SchemasFolder) {
    this._namespaces_folder = namespaces_folder
    this._schemas_folder = schemas_folder
  }

  validate (): ValidationError[] {
    const errors: ValidationError[] = []

    const visitor = new SchemaVisitor((ctx, schema) => {
      this.#validate_schema(ctx, schema, errors)
    });

    [
      ...this._namespaces_folder.files,
      ...this._schemas_folder.files
    ].forEach(f => { visitor.visit_specification(new SpecificationContext(f.file), f.spec()) })

    return errors
  }

  #validate_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3.SchemaObject>, errors: ValidationError[]): void {
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
}
