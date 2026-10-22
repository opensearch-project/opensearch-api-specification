/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'

// Kinds of unions, as defined in the "Classifying Unions" section of CLIENT_GENERATOR_GUIDE.md.
export type UnionKind = 'tagged' | 'container' | 'presence' | 'titled' | 'scalar' | 'one-or-many' | 'keyed-or-list' | 'shorthand'

export interface UnionClassification {
  kind: UnionKind | undefined // undefined means unclassified (U6)
  variant_keys?: string[] // for containers: the property that selects each branch, in branch order
}

// The parts of a branch that classification looks at, after following $refs and merging allOf.
interface ResolvedBranch {
  type?: string | string[]
  properties: Record<string, any>
  required: string[]
  title?: string
  is_scalar: boolean
  has_composition: boolean
}

const SCALAR_TYPES = new Set(['string', 'number', 'integer', 'boolean', 'null', 'array'])
const MAX_DEPTH = 16

// Classifies oneOf/anyOf unions of a bundled spec. Branches are resolved before they are classified (rule N3).
export default class UnionClassifier {
  private readonly _schemas: Record<string, any>

  constructor (schemas: Record<string, any>) {
    this._schemas = schemas
  }

  // `union` is the schema holding oneOf/anyOf. `object_part` is the merged object part of the allOf the union is a
  // member of, if any; a union that only constrains which of those properties are present is a presence constraint.
  classify (union: Record<string, any>, object_part?: { properties: Record<string, any> }): UnionClassification {
    const branches: any[] = union.oneOf ?? union.anyOf ?? []
    if (branches.length === 0) return { kind: undefined }
    if (union.discriminator !== undefined) return { kind: 'tagged' }

    const resolved = branches.map((branch) => this.resolve(branch))
    const variant_keys = this.container_keys(resolved)
    if (variant_keys !== undefined) return { kind: 'container', variant_keys }
    if (this.is_presence(resolved, object_part)) return { kind: 'presence' }
    if (branches.every((branch, index) => typeof (branch.title ?? resolved[index].title) === 'string')) return { kind: 'titled' }
    if (resolved.every((branch) => branch.is_scalar)) return { kind: 'scalar' }
    if (this.is_one_or_many(branches)) return { kind: 'one-or-many' }
    if (this.is_keyed_or_list(branches)) return { kind: 'keyed-or-list' }
    if (resolved.filter((branch) => !branch.is_scalar).length === 1) return { kind: 'shorthand' }
    return { kind: undefined }
  }

  // U2: every branch requires exactly one property, the names differ, and each value is an object.
  container_keys (branches: ResolvedBranch[]): string[] | undefined {
    const keys: string[] = []
    for (const branch of branches) {
      if (branch.is_scalar || branch.has_composition || branch.required.length !== 1) return undefined
      const key = branch.required[0]
      const value = branch.properties[key]
      if (value === undefined || this.resolve(value).is_scalar) return undefined
      keys.push(key)
    }
    return _.uniq(keys).length === keys.length ? keys : undefined
  }

  // U3: every branch only requires properties of the surrounding object part, or adds optional properties.
  is_presence (branches: ResolvedBranch[], object_part?: { properties: Record<string, any> }): boolean {
    if (object_part === undefined) return false
    const own = object_part.properties
    return branches.every((branch) => !branch.is_scalar && !branch.has_composition &&
      branch.required.every((key) => own[key] !== undefined))
  }

  // `T | T[]`: one branch is an array of the other.
  is_one_or_many (branches: any[]): boolean {
    if (branches.length !== 2) return false
    const [array, single] = this.dereference(branches[0]).type === 'array' ? branches : [branches[1], branches[0]]
    const items = this.dereference(array).items
    return this.dereference(array).type === 'array' && items !== undefined && _.isEqual(items, single)
  }

  // `Record<string, T> | T[]`: a map and a list of the same item.
  is_keyed_or_list (branches: any[]): boolean {
    if (branches.length !== 2) return false
    const [first, second] = branches.map((branch) => this.dereference(branch))
    const [array, map] = first.type === 'array' ? [first, second] : [second, first]
    return array.type === 'array' && _.isEmpty(map.properties) && _.isPlainObject(map.additionalProperties) &&
      _.isEqual(array.items, map.additionalProperties)
  }

  // Follows a chain of $refs to the schema it points to, without merging allOf.
  dereference (schema: any, depth: number = 0): any {
    if (depth > MAX_DEPTH) throw new Error('Schema $ref chain is too deep or cyclic')
    if (typeof schema?.$ref !== 'string') return schema
    const target = this._schemas[schema.$ref.split('/').pop() as string]
    if (target === undefined) throw new Error(`Unresolved $ref: ${schema.$ref}`)
    return this.dereference(target, depth + 1)
  }

  resolve (schema: any, depth: number = 0): ResolvedBranch {
    if (depth > MAX_DEPTH) throw new Error('Schema $ref or allOf chain is too deep or cyclic')
    if (typeof schema?.$ref === 'string') {
      const target = this._schemas[schema.$ref.split('/').pop() as string]
      if (target === undefined) throw new Error(`Unresolved $ref: ${schema.$ref}`)
      const resolved = this.resolve(target, depth + 1)
      return { ...resolved, title: schema.title ?? resolved.title }
    }
    const result: ResolvedBranch = {
      type: schema?.type,
      properties: { ...(schema?.properties ?? {}) },
      required: [...(schema?.required ?? [])],
      title: schema?.title,
      is_scalar: this.is_scalar(schema),
      has_composition: schema?.oneOf !== undefined || schema?.anyOf !== undefined
    }
    const branches: any[] = schema?.oneOf ?? schema?.anyOf ?? []
    if (branches.length > 0 && branches.every((branch) => this.resolve(branch, depth + 1).is_scalar)) result.is_scalar = true
    for (const member of (schema?.allOf ?? []) as any[]) {
      const resolved = this.resolve(member, depth + 1)
      result.properties = { ...result.properties, ...resolved.properties }
      result.required = _.uniq([...result.required, ...resolved.required])
      result.has_composition = result.has_composition || resolved.has_composition
      result.is_scalar = result.is_scalar && resolved.is_scalar
    }
    return result
  }

  is_scalar (schema: any): boolean {
    if (schema?.enum !== undefined || schema?.const !== undefined) return true
    const types: string[] = Array.isArray(schema?.type) ? schema.type : (schema?.type !== undefined ? [schema.type] : [])
    if (types.length > 0) return types.every((type) => SCALAR_TYPES.has(type))
    return false
  }
}
