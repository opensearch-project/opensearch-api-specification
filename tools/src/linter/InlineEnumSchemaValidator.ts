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
import {SchemaVisitor, SpecificationVisitor} from '../_utils/SpecificationVisitor'
import {
  is_enum_schema,
  is_ref, is_string_const_schema,
  type MaybeRef,
  SCHEMA_INTEGER_FORMATS,
  SCHEMA_NUMBER_FORMATS,
  SCHEMA_NUMERIC_TYPES,
  SpecificationContext
} from '../_utils'
import { type OpenAPIV3_1 } from 'openapi-types'

export default class InlineEnumSchemaValidator {
  private readonly _namespaces_folder: NamespacesFolder
  private readonly _schemas_folder: SchemasFolder

  constructor (namespaces_folder: NamespacesFolder, schemas_folder: SchemasFolder) {
    this._namespaces_folder = namespaces_folder
    this._schemas_folder = schemas_folder
  }

  validate (): ValidationError[] {
    const visitor = new InlineEnumSchemaValidatorVisitor();

    [
      ...this._namespaces_folder.files,
      ...this._schemas_folder.files
    ].forEach(f => {
      visitor.visit_specification(new SpecificationContext(f.file), f.spec())
    })

    return visitor.errors
  }
}

class InlineEnumSchemaValidatorVisitor extends SpecificationVisitor {
  readonly errors: ValidationError[] = []

  visit_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3_1.SchemaObject>): void {
    if (is_ref(schema)) return

    if (is_enum_schema(schema) && !is_string_const_schema(schema)) {
      const ancestry = ctx.keys.reverse()

      if (ancestry[1] === 'schemas' && ancestry[2] === 'components') {
        // Enums should be defined in components.schemas
        return
      } else if (ancestry[0] === 'not') {
        return
      }

      this.errors.push(ctx.error('enum schemas should be defined out-of-line via a $ref'))
    } else {
      super.visit_schema(ctx, schema)
    }
  }
}
