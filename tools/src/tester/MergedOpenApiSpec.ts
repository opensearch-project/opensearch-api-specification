/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { OpenAPIV3_1 } from 'openapi-types'
import { Logger } from '../Logger'
import { determine_possible_schema_types, HTTP_METHODS, SpecificationContext } from '../_utils';
import { SchemaVisitor } from '../_utils/SpecificationVisitor';
import OpenApiMerger from '../merger/OpenApiMerger';
import _ from 'lodash';
import OpenApiVersionExtractor from '../merger/OpenApiVersionExtractor';

// An augmented spec with additionalProperties: false.
export default class MergedOpenApiSpec {
  logger: Logger
  file_path: string
  target_version?: string
  target_distribution?: string

  protected _spec: OpenAPIV3_1.Document | undefined

  constructor (spec_path: string, target_version?: string, target_distribution?: string, logger: Logger = new Logger()) {
    this.logger = logger
    this.file_path = spec_path
    this.target_version = target_version
    this.target_distribution = target_distribution
  }

  spec (): OpenAPIV3_1.Document {
    if (this._spec) return this._spec
    const merger = new OpenApiMerger(this.file_path, this.logger)
    var spec = merger.spec()
    if (this.target_version !== undefined || this.target_distribution !== undefined) {
      const version_extractor = new OpenApiVersionExtractor(spec, this.target_version, this.target_distribution)
      spec = version_extractor.extract()
    }
    const ctx = new SpecificationContext(this.file_path)
    this.inject_additional_properties(ctx, spec)
    this._spec = spec
    return this._spec
  }

  api_version(): string {
    return (this.spec().info as any)['x-api-version']
  }

  paths(): Record<string, string[]> {
    var obj: Record<string, string[]> = {}
    _.entries(this.spec().paths).forEach(([path, ops]) => {
      obj[path] = _.entries(_.pick(ops, HTTP_METHODS)).map(([verb, _]) => {
        return verb
      })
    })
    return obj
  }

  private inject_additional_properties(ctx: SpecificationContext, spec: OpenAPIV3_1.Document): void {
    const visitor = new SchemaVisitor((ctx, schema) => {
      // If already has unevaluatedProperties then don't set
      if ((schema as any).unevaluatedProperties !== undefined) return;

      // Don't apply `unevaluatedProperties` to component schemas as we will apply it at usage points (i.e. $ref's)
      // Also don't apply to sub-schemas of an allOf as it will conflict with other sub-schemas as we'll apply it to the upper level
      if (ctx.parent().location === '#/components/schemas' || ctx.parent().keys.includes('allOf')) return;

      const types = determine_possible_schema_types(spec, schema)

      // Don't apply to multi-type or non-object schemas
      if (types.size > 1 || !types.has('object')) return;

      // Don't apply to basic { type: object } schemas
      if (Object.keys(schema).filter(k => k !== 'type' && k !== 'description').length === 0) return;

      (schema as any).type = 'object';
      // causes any undeclared field in the response to produce an error
      (schema as any).unevaluatedProperties = {
        not: true,
        errorMessage: "property is not defined in the spec"
      }
    })

    visitor.visit_specification(ctx, spec)
  }
}
