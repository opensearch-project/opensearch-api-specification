/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import { Logger } from '../Logger'
import { SpecificationContext } from '../linter/utils';
import { SchemaVisitor } from '../linter/utils/SpecificationVisitor';
import OpenApiMerger from '../merger/OpenApiMerger';

// An augmented spec with additionalProperties: false.
export default class MergedOpenApiSpec {
  logger: Logger
  file_path: string
  protected _spec: OpenAPIV3.Document | undefined

  constructor (spec_path: string, logger: Logger = new Logger()) {
    this.logger = logger
    this.file_path = spec_path 
  }

  spec (): OpenAPIV3.Document {
    if (this._spec) return this._spec
    const spec = (new OpenApiMerger(this.file_path, this.logger)).merge()    
    const ctx = new SpecificationContext(this.file_path)
    this.inject_additional_properties(ctx, spec)
    this._spec = spec
    return this._spec
  }

  private inject_additional_properties(ctx: SpecificationContext, spec: OpenAPIV3.Document): void {
    const visitor = new SchemaVisitor((_ctx, schema: any) => {
      if (('required' in schema) && ('properties' in schema) && !('additionalProperties' in schema)) {
        // causes any undeclared field in the response to produce an error
        schema.additionalProperties = {
          not: true,
          errorMessage: "property is not defined in the spec"
        }
      }
    })
    
    visitor.visit_specification(ctx, spec)
  }
}
