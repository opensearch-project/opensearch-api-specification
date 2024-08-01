/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { is_array_schema, is_ref, type KeysMatching, type MaybeRef, type SpecificationContext } from './index'
import { OpenAPIV3 } from 'openapi-types'

type VisitorCallback<T> = (ctx: SpecificationContext, o: NonNullable<T>) => void
type SchemaVisitorCallback = VisitorCallback<MaybeRef<OpenAPIV3.SchemaObject>>

function visit<Parent, Key extends keyof Parent> (
  ctx: SpecificationContext,
  parent: Parent,
  key: Key,
  visitor: VisitorCallback<Parent[Key]>
): void {
  const child = parent[key]
  if (child == null) return
  visitor(ctx.child(key as string), child)
}

type EnumerableKeys<T extends object> = KeysMatching<T, Record<string, unknown> | undefined> | KeysMatching<T, ArrayLike<unknown> | undefined>
type ElementOf<T> = T extends Record<string, infer V> ? V : T extends ArrayLike<infer V> ? V : never

function visit_each<Parent extends object, Key extends EnumerableKeys<Parent>> (
  ctx: SpecificationContext,
  parent: Parent,
  key: Key,
  visitor: VisitorCallback<ElementOf<Parent[Key]>>
): void {
  const children = parent[key]
  if (children == null) return
  ctx = ctx.child(key as string)
  Object.entries<ElementOf<Parent[Key]>>(children).forEach(([key, child]) => {
    if (child == null) return
    visitor(ctx.child(key), child)
  })
}

export class SpecificationVisitor {
  visit_specification (ctx: SpecificationContext, specification: OpenAPIV3.Document): void {
    visit_each(ctx, specification, 'paths', this.visit_path.bind(this))
    visit(ctx, specification, 'components', this.visit_components.bind(this))
  }

  visit_path (ctx: SpecificationContext, path: OpenAPIV3.PathItemObject): void {
    visit_each(ctx, path, 'parameters', this.visit_parameter.bind(this))

    for (const method of Object.values(OpenAPIV3.HttpMethods)) {
      visit(ctx, path, method, this.visit_operation.bind(this))
    }
  }

  visit_operation (ctx: SpecificationContext, operation: OpenAPIV3.OperationObject): void {
    visit_each(ctx, operation, 'parameters', this.visit_parameter.bind(this))
    visit(ctx, operation, 'requestBody', this.visit_request.bind(this))
    visit_each(ctx, operation, 'responses', this.visit_response.bind(this))
  }

  visit_components (ctx: SpecificationContext, components: OpenAPIV3.ComponentsObject): void {
    visit_each(ctx, components, 'parameters', this.visit_parameter.bind(this))
    visit_each(ctx, components, 'requestBodies', this.visit_request.bind(this))
    visit_each(ctx, components, 'responses', this.visit_response.bind(this))
    visit_each(ctx, components, 'schemas', this.visit_schema.bind(this))
  }

  visit_parameter (ctx: SpecificationContext, parameter: MaybeRef<OpenAPIV3.ParameterObject>): void {
    if (is_ref(parameter)) return

    visit(ctx, parameter, 'schema', this.visit_schema.bind(this))
  }

  visit_request (ctx: SpecificationContext, request: MaybeRef<OpenAPIV3.RequestBodyObject>): void {
    if (is_ref(request)) return

    visit_each(ctx, request, 'content', this.visit_media_type.bind(this))
  }

  visit_response (ctx: SpecificationContext, response: MaybeRef<OpenAPIV3.ResponseObject>): void {
    if (is_ref(response)) return

    visit_each(ctx, response, 'content', this.visit_media_type.bind(this))
  }

  visit_media_type (ctx: SpecificationContext, media_type: OpenAPIV3.MediaTypeObject): void {
    visit(ctx, media_type, 'schema', this.visit_schema.bind(this))
  }

  visit_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3.SchemaObject>): void {
    if (is_ref(schema)) return

    if (is_array_schema(schema)) {
      visit(ctx, schema, 'items', this.visit_schema.bind(this))
    }

    visit(ctx, schema, 'additionalProperties', (ctx, v) => {
      if (typeof v !== 'object') return
      this.visit_schema(ctx, v)
    })

    visit_each(ctx, schema, 'properties', this.visit_schema.bind(this))
    visit_each(ctx, schema, 'allOf', this.visit_schema.bind(this))
    visit_each(ctx, schema, 'anyOf', this.visit_schema.bind(this))
    visit_each(ctx, schema, 'oneOf', this.visit_schema.bind(this))
    visit(ctx, schema, 'not', this.visit_schema.bind(this))
  }
}

export class SchemaVisitor extends SpecificationVisitor {
  private readonly _callback: SchemaVisitorCallback

  constructor (callback: SchemaVisitorCallback) {
    super()
    this._callback = callback
  }

  visit_schema (ctx: SpecificationContext, schema: MaybeRef<OpenAPIV3.SchemaObject>): void {
    super.visit_schema(ctx, schema)
    this._callback(ctx, schema)
  }
}
