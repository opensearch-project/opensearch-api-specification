/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import {
  type ClientModel, type Constraint, type ContainerVariant, type Diagnostic, type Field, MODEL_FORMAT, MODEL_VERSION,
  type ObjectShape, type ScalarType, type TypeEntry, type TypeExpr, type UnionEntry
} from './types'

const SCALARS = new Set<string>(['string', 'number', 'integer', 'boolean', 'null'])
const MAX_DEPTH = 32

// Builds the client model from a bundled spec that has been normalized and labeled by OpenApiMerger
// (CompositionNormalizer and UnionLabeler), so every union carries its x-union-kind.
export default class ClientModelBuilder {
  private readonly _schemas: Record<string, any>
  private readonly _diagnostics: Diagnostic[] = []
  private readonly _shapes: Record<string, ObjectShape> = {} // merged object shapes of named schemas
  private _current: string = ''

  constructor (spec: Record<string, any>) {
    this._schemas = (spec.components?.schemas ?? {}) as Record<string, any>
  }

  build (): ClientModel {
    const types: Record<string, TypeEntry> = {}
    for (const name of Object.keys(this._schemas).sort()) {
      this._current = name
      types[name] = this.entry(this._schemas[name])
    }
    return { format: MODEL_FORMAT, version: MODEL_VERSION, types, diagnostics: this._diagnostics }
  }

  entry (schema: any): TypeEntry {
    const description = typeof schema?.description === 'string' ? schema.description as string : undefined
    let entry: TypeEntry
    if (this.is_union(schema) && !this.is_object(schema)) entry = this.union_entry(schema)
    else if (this.is_object(schema) && !this.is_plain_map(schema)) entry = { type_kind: 'object', ...this.shape_of(schema) }
    else entry = { type_kind: 'alias', type: this.type_of(schema) }
    if (description !== undefined) entry.description = description
    return entry
  }

  union_entry (schema: any): UnionEntry {
    const branches: any[] = schema.oneOf ?? schema.anyOf
    const union_kind = this.union_kind(schema)
    const entry: UnionEntry = { type_kind: 'union', union_kind, exclusive: schema.oneOf !== undefined }
    if (union_kind === 'tagged' && schema.discriminator?.propertyName !== undefined) {
      const discriminator: string = schema.discriminator.propertyName
      entry.discriminator = discriminator
      const default_variant = schema.discriminator['x-default'] ?? schema['x-default']
      if (default_variant !== undefined) entry.default_variant = String(default_variant)
      const tags = this.tag_values(schema.discriminator as Record<string, any>, branches)
      if (tags !== undefined) entry.variants = _.zipObject(tags, branches.map((b) => this.type_of(b)))
      else entry.members = branches.map((b) => this.type_of(b))
    } else if (union_kind === 'titled') {
      const titles = branches.map((b) => this.title_of(b))
      if (titles.every((t) => t !== undefined) && _.uniq(titles).length === titles.length) {
        entry.variants = _.zipObject(titles as string[], branches.map((b) => this.type_of(b)))
      } else {
        entry.members = branches.map((b) => this.type_of(b))
      }
    } else {
      entry.members = branches.map((b) => this.type_of(b))
    }
    return entry
  }

  // The discriminator value of each branch: from the mapping, or from the single-value enum of the tag field.
  tag_values (discriminator: Record<string, any>, branches: any[]): string[] | undefined {
    const property: string = discriminator.propertyName
    const by_ref = _.invert((discriminator.mapping ?? {}) as Record<string, string>)
    const tags = branches.map((branch): string | undefined => {
      if (typeof branch.$ref === 'string' && by_ref[branch.$ref] !== undefined) return by_ref[branch.$ref]
      const tag = this.resolved_shape(branch).fields[property]?.type
      if (tag !== undefined && 'enum' in tag && tag.enum.length === 1) return String(tag.enum[0])
      return undefined
    })
    if (tags.some((tag) => tag === undefined) || _.uniq(tags).length !== tags.length) {
      this.diagnose(`tagged union: cannot read a distinct \`${property}\` value for every variant`)
      return undefined
    }
    return tags as string[]
  }

  // The type of a property, map value, array item or union member. Named schemas stay references.
  type_of (schema: any): TypeExpr {
    if (schema === undefined || schema === true || _.isEmpty(schema)) return { any: true }
    if (typeof schema.$ref === 'string') return { ref: this.ref_name(schema.$ref as string) }
    if (schema.const !== undefined) return { enum: [schema.const] }
    if (Array.isArray(schema.enum)) return { enum: schema.enum }
    if (this.is_union(schema) && !this.is_object(schema)) {
      const branches: any[] = schema.oneOf ?? schema.anyOf
      const union: TypeExpr = {
        union: branches.map((b) => this.type_of(b)),
        union_kind: this.union_kind(schema),
        exclusive: schema.oneOf !== undefined
      }
      const titles = branches.map((b) => this.title_of(b))
      if (union.union_kind === 'titled' && titles.every((t) => t !== undefined)) union.titles = titles as string[]
      return union
    }
    if (Array.isArray(schema.allOf) && schema.allOf.length === 1 && !this.has_object_keywords(schema)) {
      return this.type_of(schema.allOf[0])
    }
    if (this.is_object(schema)) {
      if (this.is_plain_map(schema)) return { map: this.type_of(schema.additionalProperties) }
      return { object: this.shape_of(schema) }
    }
    if (schema.type === 'array' || schema.items !== undefined) return { array: this.type_of(schema.items) }
    if (Array.isArray(schema.type)) {
      return { union: (schema.type as string[]).map((t) => this.type_of({ ...schema, type: t })), union_kind: 'scalar', exclusive: true }
    }
    if (SCALARS.has(schema.type as string)) {
      const scalar: TypeExpr = { scalar: schema.type as ScalarType }
      if (typeof schema.format === 'string') scalar.format = schema.format
      return scalar
    }
    return { any: true }
  }

  // The merged object shape of a schema: its own properties, every allOf member's (following $refs), and the
  // constraints of its unions and `not`.
  shape_of (schema: any, depth: number = 0): ObjectShape {
    if (depth > MAX_DEPTH) {
      this.diagnose('allOf/$ref chain is too deep or cyclic')
      return { fields: {}, constraints: [] }
    }
    const shape: ObjectShape = { fields: {}, constraints: [] }
    const required = new Set<string>(schema.required as string[] ?? [])
    for (const [name, property] of Object.entries((schema.properties ?? {}) as Record<string, any>)) {
      shape.fields[name] = this.field(property)
    }
    if (_.isPlainObject(schema.additionalProperties) || schema.additionalProperties === true) {
      shape.additional_fields = this.type_of(schema.additionalProperties)
    }

    const unions: any[] = []
    if (this.is_union(schema)) unions.push(schema) // not normalized: a union next to properties
    for (const member of (schema.allOf ?? []) as any[]) {
      if (this.is_union(member) && !this.is_object(member)) { unions.push(member); continue }
      const part = this.resolved_shape(member, depth + 1)
      for (const [name, field] of Object.entries(part.fields)) {
        if (field.required) required.add(name)
        this.merge_field(shape.fields, name, field)
      }
      if (part.additional_fields !== undefined) shape.additional_fields ??= part.additional_fields
      shape.constraints.push(...part.constraints)
    }
    for (const union of unions) {
      const constraint = this.union_constraint(union, shape, depth)
      if (constraint !== undefined) shape.constraints.push(constraint)
    }
    const not_keys: unknown = schema.not?.required
    if (Array.isArray(not_keys) && not_keys.length > 1) shape.constraints.push({ union_kind: 'not_all', keys: not_keys as string[] })
    else if (schema.not !== undefined) this.diagnose('`not` is only modeled as `not: { required: [a, b, …] }`')

    for (const name of required) {
      if (shape.fields[name] === undefined) shape.fields[name] = { type: { any: true }, required: true }
      else shape.fields[name] = { ...shape.fields[name], required: true }
    }
    for (const [name, field] of Object.entries(shape.fields)) {
      if (!required.has(name) && field.required) shape.fields[name] = { ...field, required: false }
    }
    return shape
  }

  // The shape of an allOf member or union branch: named schemas are resolved once and cached.
  resolved_shape (schema: any, depth: number = 0): ObjectShape {
    if (typeof schema?.$ref !== 'string') return this.shape_of(schema ?? {}, depth)
    const name = this.ref_name(schema.$ref as string)
    if (this._shapes[name] !== undefined) return this._shapes[name]
    const target = this._schemas[name]
    if (target === undefined) {
      this.diagnose(`unresolved $ref ${schema.$ref}`)
      return { fields: {}, constraints: [] }
    }
    const shape = this.shape_of(target, depth + 1)
    this._shapes[name] = shape
    return shape
  }

  // A union that is an allOf member constrains the object it is part of.
  union_constraint (union: any, shape: ObjectShape, depth: number): Constraint | undefined {
    const branches: any[] = union.oneOf ?? union.anyOf
    const kind = this.union_kind(union)
    const exclusive = union.oneOf !== undefined
    if (kind === 'presence') {
      const key_sets: string[][] = []
      for (const branch of branches) {
        const part = this.resolved_shape(branch, depth + 1)
        // Fields a branch adds are optional fields of the object; the branch only decides which must be present.
        for (const [name, field] of Object.entries(part.fields)) this.merge_field(shape.fields, name, { ...field, required: false })
        key_sets.push(Object.keys(part.fields).filter((name) => part.fields[name].required))
      }
      if (key_sets.every((keys) => keys.length === 0)) return undefined // only adds optional fields
      return exclusive ? { union_kind: 'presence', one_of: key_sets } : { union_kind: 'presence', any_of: key_sets }
    }
    if (kind === 'container' && Array.isArray(union['x-variant-keys'])) {
      const keys = union['x-variant-keys'] as string[]
      const variants: Record<string, ContainerVariant> = {}
      branches.forEach((branch, index) => {
        const key = keys[index]
        const part = this.resolved_shape(branch, depth + 1)
        const value = part.fields[key]?.type ?? { any: true }
        const extra_fields = _.omit(part.fields, [key, ...Object.keys(shape.fields)])
        variants[key] = { value, extra_fields, extra_constraints: part.constraints }
      })
      return { union_kind: 'container', variants }
    }
    if (kind === 'unclassified') this.diagnose('an allOf member union is unclassified; modeled as `matches`')
    return { union_kind: kind, matches: exclusive ? 'one_of' : 'any_of', types: branches.map((b) => this.type_of(b)) }
  }

  field (schema: any): Field {
    const field: Field = { type: this.type_of(schema), required: false }
    if (typeof schema?.description === 'string') field.description = schema.description
    return field
  }

  // Merges a field into `fields`. A later allOf member refines a field of an earlier one (a specialization narrows a
  // generic base, e.g. `buckets` of `TermsAggregateBase` to an array of `StringTermsBucket`), so the later type wins.
  // Two different scalar types for one field can't both hold; that is a conflict (rule M3), which is reported.
  merge_field (fields: Record<string, Field>, name: string, field: Field): void {
    const existing = fields[name]
    if (existing === undefined) { fields[name] = field; return }
    const base = this.json_type(existing.type)
    const next = this.json_type(field.type)
    if (base !== undefined && next !== undefined && base !== next) this.diagnose(`field \`${name}\` is declared as both ${base} and ${next}`)
    const type = _.isEqual(field.type, { any: true }) ? existing.type : field.type
    const merged: Field = { type, required: existing.required || field.required }
    const description = field.description ?? existing.description
    if (description !== undefined) merged.description = description
    fields[name] = merged
  }

  // The JSON type of a scalar or enum type, to detect conflicts; undefined for other types.
  json_type (type: TypeExpr): string | undefined {
    if ('scalar' in type) return type.scalar === 'integer' ? 'number' : type.scalar
    if ('enum' in type && type.enum.length > 0) {
      const types = _.uniq(type.enum.map((v) => v === null ? 'null' : typeof v))
      return types.length === 1 ? types[0] : undefined
    }
    return undefined
  }

  union_kind (union: any): string {
    return typeof union['x-union-kind'] === 'string' ? union['x-union-kind'] : 'unclassified'
  }

  title_of (branch: any): string | undefined {
    if (typeof branch?.title === 'string') return branch.title
    if (typeof branch?.$ref === 'string') return this._schemas[this.ref_name(branch.$ref as string)]?.title
    return undefined
  }

  is_union (schema: any): boolean {
    return Array.isArray(schema?.oneOf) || Array.isArray(schema?.anyOf)
  }

  has_object_keywords (schema: any): boolean {
    return !_.isEmpty(schema?.properties) || schema?.additionalProperties !== undefined || schema?.not !== undefined ||
      !_.isEmpty(schema?.required)
  }

  is_object (schema: any): boolean {
    if (SCALARS.has(schema?.type as string) || schema?.type === 'array') return false // e.g. a string with a `not`
    return this.has_object_keywords(schema) || (Array.isArray(schema?.allOf) && schema.allOf.length > 0) ||
      (schema?.type === 'object' && !this.is_union(schema))
  }

  // An object with no named properties: a map from arbitrary names to one type.
  is_plain_map (schema: any): boolean {
    return _.isEmpty(schema?.properties) && schema?.allOf === undefined && !this.is_union(schema) && schema?.not === undefined &&
      _.isEmpty(schema?.required)
  }

  ref_name (ref: string): string {
    return ref.split('/').pop() as string
  }

  diagnose (message: string): void {
    if (!this._diagnostics.some((d) => d.type === this._current && d.message === message)) {
      this._diagnostics.push({ type: this._current, message })
    }
  }
}
