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
  type ClientModel, type Constraint, type Field, type ObjectShape, type TypeEntry, type TypeExpr, type Versions
} from './types'

const REF = '#/components/schemas/'
// What the model doesn't carry and the original schemas say: annotations and validation keywords.
const ANNOTATIONS = new Set([
  'description', 'default', 'deprecated', 'title', 'examples', 'externalDocs', 'readOnly', 'writeOnly', 'discriminator',
  'pattern', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf', 'minLength', 'maxLength',
  'minItems', 'maxItems', 'uniqueItems', 'minProperties', 'maxProperties', 'format', 'unevaluatedProperties'
])

// Writes the types of the client model back into the bundled spec, as OpenAPI, so that the one published spec is
// already resolved: every schema is in the form of its model type instead of a free combination of
// $ref/allOf/oneOf/anyOf.
// - An object is `allOf: [ $ref Base…, { type: object, its own properties, required, additionalProperties },
//   { constraint }… ]`, or just its own part when it has no base and no constraint. Fields that the branches of a
//   presence constraint add are the object's own optional fields, so a generator that drops the constraint keeps them.
// - A constraint is a labeled oneOf/anyOf: presence as `{ required: [...] }` branches, a container as one branch per
//   variant key, `not_all` as `not: { required: [...] }`, any other union as its member types.
// - A union is a plain oneOf/anyOf of its members, with their titles and its x-union-kind; an alias is its type.
// Generic type parameters keep their schema, and what the original schema says beyond its shape is kept:
// annotations, validation keywords, x-* extensions, `propertyNames`, the titles of map values, and generic
// instantiation sites (`allOf: [ $ref Generic, {...} ]`), which the model resolves to the generic type.
export default class ModelLowering {
  private readonly _model: ClientModel
  private _schemas: Record<string, any> = {}
  private readonly _generic = new Map<string, boolean>()
  private readonly _kept: string[] = []

  get kept (): string[] { return this._kept } // the types written as the spec writes them, because they are generic

  constructor (model: ClientModel) {
    this._model = model
  }

  lower (spec: Record<string, any>): number {
    const schemas = spec.components.schemas as Record<string, any>
    let lowered = 0
    this._schemas = schemas
    for (const [name, type] of Object.entries(this._model.types)) {
      if (type.type_kind === 'alias' && type.generic_parameter === true) continue
      // Generic types and their instantiations (`allOf: [ $ref Generic, { the shape with its parameters replaced } ]`)
      // are written as the spec writes them: the model resolves an instantiation to the generic type, which loses the
      // arguments.
      if (this.mentions_generics(schemas[name])) { this._kept.push(name); continue }
      const schema = this.entry(type)
      ModelLowering.merge_annotations(schema, schemas[name])
      ModelLowering.restore_variant_refs(schema, schemas[name])
      schemas[name] = schema
      lowered++
    }
    for (const [section, bodies] of [['responses', this._model.responses], ['requestBodies', this._model.request_bodies]] as const) {
      for (const [name, body] of Object.entries(bodies)) {
        const media = spec.components?.[section]?.[name]?.content?.[body.media_type]
        if (media?.schema === undefined || this.mentions_generics(media.schema)) continue
        const schema = this.expr(body.type)
        ModelLowering.merge_annotations(schema, media.schema)
        media.schema = schema
      }
    }
    return lowered
  }

  entry (type: TypeEntry): Record<string, any> {
    if (type.type_kind === 'object') return this.object(type, true)
    if (type.type_kind === 'alias') return this.expr(type.type)
    const members = type.variants !== undefined ? Object.values(type.variants) : (type.members ?? [])
    const union = this.union(members, type.exclusive, type.titles, type.union_kind, type.branch_versions)
    if (type.discriminator !== undefined) union.discriminator = { propertyName: type.discriminator }
    return union
  }

  expr (type: TypeExpr): Record<string, any> {
    if ('ref' in type) return { $ref: REF + type.ref }
    if ('scalar' in type) return type.format !== undefined ? { type: type.scalar, format: type.format } : { type: type.scalar }
    if ('enum' in type) return typeof type.enum[0] === 'string' ? { type: 'string', enum: [...type.enum] } : { enum: [...type.enum] }
    if ('array' in type) return 'any' in type.array ? { type: 'array' } : { type: 'array', items: this.expr(type.array) }
    if ('map' in type) return { type: 'object', additionalProperties: 'any' in type.map ? true : this.expr(type.map) }
    if ('union' in type) return this.union(type.union, type.exclusive, type.titles, type.union_kind, type.branch_versions)
    if ('object' in type) {
      const object = this.object(type.object, false)
      if (type.description !== undefined) object.description = type.description
      return object
    }
    return {}
  }

  union (members: TypeExpr[], exclusive: boolean, titles?: Array<string | null>, kind?: string,
    versions?: Array<Versions | null>): Record<string, any> {
    // A nullable scalar (`type: [string, 'null']` in the spec) is a type array again.
    if (members.length === 2 && titles === undefined && members.every((m) => 'scalar' in m && m.format === undefined) &&
        members.filter((m) => 'scalar' in m && m.scalar === 'null').length === 1) {
      return { type: members.map((m) => (m as { scalar: string }).scalar).sort() }
    }
    const branches = members.map((member, index) => {
      const branch = this.expr(member)
      if (typeof titles?.[index] === 'string') branch.title = titles[index]
      const v = versions?.[index]
      if (v !== null && v !== undefined) Object.assign(branch, ModelLowering.version_keywords(v))
      return branch
    })
    const union: Record<string, any> = { [exclusive ? 'oneOf' : 'anyOf']: branches }
    if (kind !== undefined && kind !== 'unclassified') union['x-union-kind'] = kind
    return union
  }

  // `named`: a component type, which stays an allOf when it has bases so that it remains its own type.
  object (shape: ObjectShape, named: boolean): Record<string, any> {
    const bases = shape.bases ?? []
    const own: Record<string, any> = { type: 'object' }
    const properties: Record<string, any> = {}
    const required: string[] = []
    for (const [name, declared] of Object.entries(shape.fields)) {
      // A presence branch's field that a base declares the same way is the base's field.
      const inherited = declared.declared_in ?? bases.find((b) => _.isEqual(this.shape_of(b)?.fields[name]?.type, declared.type))
      if (inherited === undefined) properties[name] = this.field(declared)
      const field: Field = { ...declared, declared_in: inherited }
      // An inherited field that this type makes required is required here too.
      if (field.required && (field.declared_in === undefined || !this.base_requires(field.declared_in, name))) required.push(name)
    }
    if (!_.isEmpty(properties)) own.properties = properties
    if (required.length > 0) own.required = required
    const additional = shape.additional_fields
    if (additional !== undefined && !bases.some((b) => _.isEqual(this.shape_of(b)?.additional_fields, additional))) {
      own.additionalProperties = 'any' in additional ? true : this.expr(additional)
    }
    const constraints = shape.constraints.map((c) => this.constraint(c, shape))
    if (bases.length === 0 && constraints.length === 0) return own
    const members: any[] = bases.map((b) => ({ $ref: REF + b }))
    // A named type with bases stays an allOf, so that it remains its own type; an empty own member adds nothing.
    if (Object.keys(own).length > 1 || (named && bases.length === 0)) members.push(own)
    members.push(...constraints)
    return members.length === 1 && !(named && bases.length > 0) ? members[0] : { allOf: members }
  }

  field (field: Field): Record<string, any> {
    const schema = this.expr(field.type)
    if (field.description !== undefined) schema.description = field.description
    if (field.versions !== undefined) Object.assign(schema, ModelLowering.version_keywords(field.versions))
    return schema
  }

  constraint (constraint: Constraint, shape?: ObjectShape): Record<string, any> {
    if ('variants' in constraint) {
      const branches = Object.entries(constraint.variants).map(([key, variant]) => {
        const properties: Record<string, any> = { [key]: this.expr(variant.value) }
        for (const [name, field] of Object.entries(variant.extra_fields)) properties[name] = this.field(field)
        const branch: Record<string, any> = { type: 'object', properties, required: [key] }
        if (variant.extra_constraints.length > 0) return { allOf: [branch, ...variant.extra_constraints.map((c) => this.constraint(c, shape))] }
        return branch
      })
      return { type: 'object', oneOf: branches, 'x-union-kind': 'container', 'x-variant-keys': Object.keys(constraint.variants) }
    }
    if ('keys' in constraint) return { not: { required: [...constraint.keys] } }
    if ('matches' in constraint) return this.union(constraint.types, constraint.matches === 'one_of', undefined, constraint.union_kind)
    const exclusive = constraint.one_of !== undefined
    const sets = (constraint.one_of ?? constraint.any_of) as string[][]
    const branches = sets.map((keys, index) => {
      // Each branch names the properties it requires, as the spec writes them, so that it reads on its own.
      const properties = Object.fromEntries(keys.filter((key) => shape?.fields[key] !== undefined)
        .map((key) => [key, this.expr((shape as ObjectShape).fields[key].type)]))
      const branch: Record<string, any> = _.isEmpty(properties) ? { type: 'object', required: [...keys] } : { type: 'object', properties, required: [...keys] }
      const nested = constraint.nested?.[index]
      if (nested !== null && nested !== undefined && nested.length > 0) branch.allOf = nested.map((c) => this.constraint(c, shape))
      return branch
    })
    return { [exclusive ? 'oneOf' : 'anyOf']: branches, 'x-union-kind': 'presence' }
  }

  // Whether a schema uses a generic type parameter or instantiates a generic type, in itself (not through the named
  // schemas it refers to, which are lowered on their own).
  mentions_generics (schema: any): boolean {
    if (schema === null || typeof schema !== 'object') return false
    if (Array.isArray(schema)) return schema.some((item) => this.mentions_generics(item))
    if (typeof schema.$ref === 'string') return this._schemas[(schema.$ref as string).split('/').pop() as string]?.['x-is-generic-type-parameter'] === true
    if (this.is_generic_instantiation(schema)) return true
    return Object.values(schema as object).some((value) => this.mentions_generics(value))
  }

  // Whether a schema instantiates a generic type: an allOf whose first member is a $ref to a schema that uses a
  // generic type parameter (x-is-generic-type-parameter), directly or through the schemas it refers to.
  is_generic_instantiation (schema: any): boolean {
    const members = schema?.allOf
    if (!Array.isArray(members) || members.length < 2 || typeof members[0]?.$ref !== 'string') return false
    return this.uses_parameters((members[0].$ref as string).split('/').pop() as string)
  }

  uses_parameters (name: string): boolean {
    const cached = this._generic.get(name)
    if (cached !== undefined) return cached
    this._generic.set(name, false) // a cycle adds nothing
    const target = this._schemas[name]
    let found = target?.['x-is-generic-type-parameter'] === true
    const visit = (node: any): void => {
      if (found || node === null || typeof node !== 'object') return
      if (typeof node.$ref === 'string') { found = this.uses_parameters((node.$ref as string).split('/').pop() as string); return }
      Object.values(node as object).forEach(visit)
    }
    if (!found) visit(target)
    this._generic.set(name, found)
    return found
  }

  // Puts back the named types of a container's variants (`$ref AdjacencyMatrixAggregation`), which the model
  // resolves to their content.
  static restore_variant_refs (lowered: any, original: any): void {
    const find = (schema: any): any => (Array.isArray(schema?.allOf) ? (schema.allOf as any[]).find((m) => m?.['x-union-kind'] === 'container') : undefined)
    const target = find(lowered); const source = find(original)
    if (target === undefined || source === undefined) return
    const source_keys = source['x-variant-keys'] as string[] | undefined; const source_branches = source.oneOf as any[] | undefined
    if (!Array.isArray(source_keys) || !Array.isArray(source_branches)) return
    ;(target['x-variant-keys'] as string[]).forEach((key, index) => {
      const branch = source_branches[source_keys.indexOf(key)]
      if (typeof branch?.$ref === 'string') target.oneOf[index] = _.cloneDeep(branch)
    })
  }

  shape_of (name: string): ObjectShape | undefined {
    const type = this._model.types[name]
    return type?.type_kind === 'object' ? type : undefined
  }

  base_requires (base: string, field: string): boolean {
    return this.shape_of(base)?.fields[field]?.required === true
  }

  static version_keywords (versions: Versions): Record<string, string> {
    const keywords: Record<string, string> = {}
    if (versions.added !== undefined) keywords['x-version-added'] = versions.added
    if (versions.removed !== undefined) keywords['x-version-removed'] = versions.removed
    if (versions.deprecated !== undefined) keywords['x-version-deprecated'] = versions.deprecated
    if (versions.deprecation_message !== undefined) keywords['x-deprecation-message'] = versions.deprecation_message
    return keywords
  }

  // Keeps what the original schema says beyond its shape, here and recursively in its properties, the value schema of
  // its additional properties (whose title names the map), its items and its union branches; and keeps generic
  // instantiation sites, which the model resolves to the generic type.
  static merge_annotations (lowered: Record<string, any>, original: any): void {
    if (!_.isPlainObject(original)) return
    for (const [key, value] of Object.entries(original as Record<string, any>)) {
      if (key === 'propertyNames' || ((ANNOTATIONS.has(key) || key.startsWith('x-')) && lowered[key] === undefined)) {
        if (key === 'format' && lowered.type === undefined) continue
        lowered[key] = _.cloneDeep(value)
      }
    }
    const original_properties = ModelLowering.properties_of(original)
    for (const [holder, name, property] of ModelLowering.lowered_properties(lowered)) {
      const original_property = original_properties[name]
      if (ModelLowering.is_instantiation_of(original_property, property)) holder[name] = _.cloneDeep(original_property)
      else if (_.isPlainObject(property)) ModelLowering.merge_annotations(property as Record<string, any>, original_property)
    }
    const original_additional = ModelLowering.find_keyword(original, 'additionalProperties')
    const holder = ModelLowering.find_holder(lowered, 'additionalProperties')
    if (_.isPlainObject(original_additional) && holder !== undefined) {
      if (typeof holder.additionalProperties === 'boolean') holder.additionalProperties = _.cloneDeep(original_additional)
      else ModelLowering.merge_annotations(holder.additionalProperties as Record<string, any>, original_additional)
    }
    const original_names = ModelLowering.find_keyword(original, 'propertyNames')
    if (original_names !== undefined && holder !== undefined && holder.propertyNames === undefined) holder.propertyNames = _.cloneDeep(original_names)
    if (original.items !== undefined && _.isPlainObject(lowered.items)) ModelLowering.merge_annotations(lowered.items as Record<string, any>, original.items)
    // Union branches, by position: their annotations, and `const` for a single-value enum written as `const`.
    for (const keyword of ['oneOf', 'anyOf']) {
      const branches = lowered[keyword]; const originals = original[keyword]
      if (!Array.isArray(branches) || !Array.isArray(originals) || branches.length !== originals.length) continue
      branches.forEach((branch: any, index: number) => {
        if (!_.isPlainObject(branch)) return
        if (originals[index]?.const !== undefined && Array.isArray(branch.enum) && branch.enum.length === 1) {
          branch.const = branch.enum[0]
          delete branch.enum
        }
        if (branch.$ref === undefined) ModelLowering.merge_annotations(branch as Record<string, any>, originals[index])
      })
    }
  }

  // Whether an original property is a generic instantiation that the model resolved to the generic type itself or,
  // for a generic union, to the specialized union alone.
  static is_instantiation_of (original: any, lowered: any): boolean {
    const members = original?.allOf
    if (!Array.isArray(members) || members.length < 2 || members[0]?.$ref === undefined) return false
    if (lowered?.$ref !== undefined) return lowered.$ref === members[0].$ref
    return (lowered?.oneOf !== undefined || lowered?.anyOf !== undefined) && (members[1]?.oneOf !== undefined || members[1]?.anyOf !== undefined)
  }

  // The properties declared by a schema and its inline allOf members (not those of referenced schemas).
  static properties_of (schema: any, into: Record<string, any> = {}): Record<string, any> {
    for (const [name, property] of Object.entries((schema?.properties ?? {}) as Record<string, any>)) into[name] ??= property
    for (const member of (schema?.allOf ?? []) as any[]) if (member?.$ref === undefined) ModelLowering.properties_of(member, into)
    return into
  }

  static lowered_properties (schema: Record<string, any>): Array<[Record<string, any>, string, any]> {
    const found: Array<[Record<string, any>, string, any]> = []
    if (_.isPlainObject(schema.properties)) for (const [name, p] of Object.entries(schema.properties as Record<string, any>)) found.push([schema.properties as Record<string, any>, name, p])
    for (const member of (schema.allOf ?? []) as any[]) if (_.isPlainObject(member) && member.$ref === undefined) found.push(...ModelLowering.lowered_properties(member as Record<string, any>))
    return found
  }

  static find_keyword (schema: any, keyword: string): any {
    if (schema?.[keyword] !== undefined) return schema[keyword]
    for (const member of (schema?.allOf ?? []) as any[]) {
      if (member?.$ref !== undefined) continue
      const found = ModelLowering.find_keyword(member, keyword)
      if (found !== undefined) return found
    }
    return undefined
  }

  static find_holder (schema: Record<string, any>, keyword: string): Record<string, any> | undefined {
    if (schema[keyword] !== undefined) return schema
    for (const member of (schema.allOf ?? []) as any[]) {
      if (!_.isPlainObject(member) || member.$ref !== undefined) continue
      const found = ModelLowering.find_holder(member as Record<string, any>, keyword)
      if (found !== undefined) return found
    }
    return undefined
  }
}
