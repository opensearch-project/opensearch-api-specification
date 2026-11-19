/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'

export interface GenericLabels {
  sites: number // instantiations labeled with x-type-arguments
  unresolved: string[] // instantiations of a generic type whose arguments couldn't be determined
}

// A step from a schema to one of its parts: a property, the array items, the map values, or the union branch of a kind.
type Step = { property: string } | { items: true } | { values: true } | { branch: string }

interface Position { path: Step[], param: string }

const MAX_DEPTH = 16

// Labels every instantiation of a generic type in a bundled spec. A generic type is a schema that uses a generic type
// parameter (a schema with x-is-generic-type-parameter, e.g. TDocument), and the spec instantiates it as
//   allOf: [ $ref Generic, { the same shape, with each parameter replaced } ]
// e.g. `allOf: [ $ref Hit, { properties: { _source: $ref TDocument } } ]` or `allOf: [ $ref Buckets, { oneOf: [...] } ]`.
// The labeler finds, for every parameter of the generic type, the schema that takes its place, and writes it as
//   x-type-arguments: { <parameter schema name>: <schema> }
// so that a generator reads `Hit<TDocument>` or `Buckets<StringTermsBucket>` instead of working it out by comparing the
// two shapes. The label is additive: the schema itself is unchanged.
export default class GenericLabeler {
  private _schemas: Record<string, any> = {}
  private _params = new Set<string>()
  private readonly _positions = new Map<string, Position[]>()

  label (spec: Record<string, any>): GenericLabels {
    this._schemas = (spec.components?.schemas ?? {}) as Record<string, any>
    this._params = new Set(Object.keys(this._schemas).filter((name) => this._schemas[name]?.['x-is-generic-type-parameter'] === true))
    this._positions.clear()
    const result: GenericLabels = { sites: 0, unresolved: [] }
    const sites: Array<{ node: Record<string, any>, args: Record<string, any> }> = []

    const visit = (node: any, location: string): void => {
      if (Array.isArray(node)) {
        node.forEach((item, index) => { visit(item, `${location}/${index}`) })
        return
      }
      if (!_.isPlainObject(node)) return
      delete node['x-type-arguments'] // labels from an earlier run may be stale
      const base = this.generic_base(node as Record<string, any>)
      if (base !== undefined) {
        const args = this.arguments_of(base, (node.allOf as any[]).slice(1))
        if (args === undefined) result.unresolved.push(location)
        else if (!_.isEmpty(args)) sites.push({ node, args })
      }
      for (const [key, value] of Object.entries(node as Record<string, any>)) {
        visit(value, `${location}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`)
      }
    }
    visit(spec.components, '#/components')
    visit(spec.paths, '#/paths')
    // Labels are written last, so that they never change the input of another instantiation.
    for (const { node, args } of sites) node['x-type-arguments'] = args
    result.sites = sites.length
    return result
  }

  // The generic type a node instantiates: the first member of a 2+ member allOf, if it is a $ref to a generic type.
  generic_base (node: Record<string, any>): string | undefined {
    const members = node.allOf
    if (!Array.isArray(members) || members.length < 2 || typeof members[0]?.$ref !== 'string') return undefined
    const name = this.ref_name(members[0].$ref as string)
    if (this._params.has(name) || this._schemas[name] === undefined) return undefined
    return this.positions_of(name).length > 0 ? name : undefined
  }

  // The argument of every parameter of `base`: the schema the overlay members put in its place, or the parameter itself
  // when they leave it unbound (`SearchResponse` passes `SearchResult`'s TDocument on). Undefined when the overlay
  // gives one parameter two different arguments.
  arguments_of (base: string, overlay: any[]): Record<string, any> | undefined {
    const args: Record<string, any> = {}
    const positions = this.positions_of(base)
    for (const { path, param } of positions) {
      const argument = this.lookup(overlay, path)
      if (argument === undefined) continue
      if (args[param] !== undefined && !_.isEqual(args[param], argument)) return undefined
      args[param] = _.cloneDeep(argument)
    }
    for (const { param } of positions) args[param] ??= { $ref: `#/components/schemas/${param}` }
    return args
  }

  // Where a named schema uses generic type parameters, following the bases it inherits (allOf $refs) but not the
  // other types it refers to, which are separate types.
  positions_of (name: string): Position[] {
    const cached = this._positions.get(name)
    if (cached !== undefined) return cached
    this._positions.set(name, []) // a cycle through allOf bases adds nothing
    const positions = this.collect(this._schemas[name], [], new Set([name]), 0)
    const unique = _.uniqWith(positions, (a, b) => _.isEqual(a, b))
    this._positions.set(name, unique)
    return unique
  }

  collect (node: any, path: Step[], bases: Set<string>, depth: number): Position[] {
    if (!_.isPlainObject(node) || depth > MAX_DEPTH) return []
    if (typeof node.$ref === 'string') {
      const name = this.ref_name(node.$ref as string)
      return this._params.has(name) ? [{ path, param: name }] : []
    }
    const found: Position[] = []
    const members = (node.allOf ?? []) as any[]
    for (const [index, member] of members.entries()) {
      if (typeof member?.$ref === 'string' && !this._params.has(this.ref_name(member.$ref as string))) {
        const base = this.ref_name(member.$ref as string)
        if (bases.has(base)) continue
        const inherited = this.collect(this._schemas[base], [], new Set([...bases, base]), depth + 1)
        // An instantiation binds the parameters its other members specify: a parameter bound to another parameter is
        // still a parameter here, one bound to a concrete schema no longer is.
        const overlay = members.filter((_m, i) => i !== index)
        for (const position of inherited) {
          const argument = this.lookup(overlay, position.path)
          if (argument === undefined) {
            if (!this.replaced(overlay, position.path)) found.push({ path: [...path, ...position.path], param: position.param })
          }
          else if (typeof argument.$ref === 'string' && this._params.has(this.ref_name(argument.$ref as string))) {
            found.push({ path: [...path, ...position.path], param: this.ref_name(argument.$ref as string) })
          }
        }
      } else {
        found.push(...this.collect(member, path, bases, depth + 1))
      }
    }
    for (const [property, schema] of Object.entries((node.properties ?? {}) as Record<string, any>)) {
      found.push(...this.collect(schema, [...path, { property }], bases, depth + 1))
    }
    if (_.isPlainObject(node.items)) found.push(...this.collect(node.items, [...path, { items: true }], bases, depth + 1))
    if (_.isPlainObject(node.additionalProperties)) {
      found.push(...this.collect(node.additionalProperties, [...path, { values: true }], bases, depth + 1))
    }
    for (const branch of (node.oneOf ?? node.anyOf ?? []) as any[]) {
      found.push(...this.collect(branch, [...path, { branch: this.kind(branch) }], bases, depth + 1))
    }
    return found
  }

  // Whether the overlay replaces the union a position lies in with other branches (`buckets` redeclared as an array
  // replaces the map-or-array union, so its map branch no longer exists).
  replaced (overlay: any[], path: Step[]): boolean {
    const branch = path.findIndex((step) => 'branch' in step)
    return branch >= 0 && this.lookup(overlay, path.slice(0, branch)) !== undefined
  }

  // The schema at `path` in the overlay members, or undefined if they don't specify it.
  lookup (overlay: any[], path: Step[]): any {
    let nodes: any[] = overlay
    for (const step of path) {
      const next: any[] = []
      for (const node of nodes) next.push(...(this.step(node, step) as unknown[]))
      if (next.length === 0) return undefined
      nodes = next
    }
    const distinct = _.uniqWith(nodes, (a, b) => _.isEqual(a, b))
    return distinct.length === 1 ? distinct[0] : undefined
  }

  step (node: any, step: Step): any[] {
    if (!_.isPlainObject(node) || typeof node.$ref === 'string') return []
    const parts = [node, ...((node.allOf ?? []) as any[]).filter((m) => typeof m?.$ref !== 'string')]
    const out: any[] = []
    for (const part of parts) {
      if ('property' in step && part.properties?.[step.property] !== undefined) out.push(part.properties[step.property])
      if ('items' in step && _.isPlainObject(part.items)) out.push(part.items)
      if ('values' in step && _.isPlainObject(part.additionalProperties)) out.push(part.additionalProperties)
      if ('branch' in step) {
        const branches = (part.oneOf ?? part.anyOf) as any[] | undefined
        if (branches !== undefined) out.push(...(branches.filter((b) => this.kind(b) === step.branch) as unknown[]))
        else if (part === node && this.kind(node) === step.branch) out.push(node)
      }
    }
    return out
  }

  // The JSON kind of a union branch, to match a specialized branch with the generic one.
  kind (schema: any): string {
    const target = typeof schema?.$ref === 'string' ? this._schemas[this.ref_name(schema.$ref as string)] : schema
    if (target?.type === 'array' || target?.items !== undefined) return 'array'
    if (_.isPlainObject(target?.additionalProperties) && _.isEmpty(target?.properties)) return 'map'
    if (target?.type === 'object' || target?.properties !== undefined || target?.allOf !== undefined) return 'object'
    return typeof target?.type === 'string' ? target.type as string : 'other'
  }

  ref_name (ref: string): string {
    return ref.split('/').pop() as string
  }
}
