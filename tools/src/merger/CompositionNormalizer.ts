/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3_1 } from 'openapi-types'
import _ from 'lodash'
import { is_ref, SpecificationContext } from '../_utils'
import { SchemaVisitor } from '../_utils/SpecificationVisitor'

// Keywords that describe an object's own properties. They must move together:
// additionalProperties and patternProperties only apply to properties declared next to them.
const OBJECT_KEYWORDS = ['properties', 'patternProperties', 'additionalProperties', 'required'] as const

// Rewrites schemas that declare properties next to allOf/oneOf/anyOf into the canonical form
// allOf: [{ the properties }, ...the composition], as described in CLIENT_GENERATOR_GUIDE.md (rule N1).
// The rewrite is lossless: both forms accept exactly the same documents. It spares every client generator
// from having to handle properties next to a composition keyword, which several of them dropped.
export default class CompositionNormalizer {
  // Normalizes the spec in place and returns the locations of the rewritten schemas.
  normalize (spec: Record<string, any>): string[] {
    const rewritten: string[] = []
    const visitor = new SchemaVisitor((ctx, schema) => {
      if (is_ref(schema)) return
      if (this.normalize_schema(schema)) rewritten.push(ctx.location)
    })
    visitor.visit_specification(new SpecificationContext('opensearch-openapi.yaml'), spec as OpenAPIV3_1.Document)
    return rewritten
  }

  // Rewrites one schema in place. Returns whether it was changed.
  normalize_schema (schema: Record<string, any>): boolean {
    if (!this.has_object_part(schema) || !this.has_composition(schema)) return false

    const object_part: Record<string, any> = { type: 'object' }
    for (const keyword of OBJECT_KEYWORDS) {
      if (schema[keyword] === undefined) continue
      object_part[keyword] = schema[keyword]
      delete schema[keyword]
    }

    const members: any[] = [object_part, ...(schema.allOf ?? [])]
    if (schema.oneOf !== undefined) {
      // A discriminator selects among the oneOf branches, so it moves with them.
      members.push(_.omitBy({ oneOf: schema.oneOf, discriminator: schema.discriminator }, (value) => value === undefined))
      delete schema.oneOf
      delete schema.discriminator
    }
    if (schema.anyOf !== undefined) {
      members.push({ anyOf: schema.anyOf })
      delete schema.anyOf
    }
    schema.allOf = members
    return true
  }

  has_object_part (schema: Record<string, any>): boolean {
    return !_.isEmpty(schema.properties) || !_.isEmpty(schema.patternProperties) || _.isPlainObject(schema.additionalProperties) || !_.isEmpty(schema.required)
  }

  has_composition (schema: Record<string, any>): boolean {
    return schema.allOf !== undefined || schema.oneOf !== undefined || schema.anyOf !== undefined
  }
}
