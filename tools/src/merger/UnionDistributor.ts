/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'

export interface DistributedUnions {
  rewritten: string[] // locations of allOfs rewritten into a union of complete objects
  skipped: Array<{ location: string, reason: string }> // allOfs with a union member that were left as they are
  branches: number // branches of the unions written
}

const MAX_BRANCHES = 256
const MAX_DEPTH = 32

// Removes unions from allOf members, so that a generator never has to combine an object with a union:
//   allOf: [ X, { oneOf: [A, B] } ]  =>  oneOf: [ allOf: [X, A], allOf: [X, B] ]
// X ∧ (A ∨ B) is (X ∧ A) ∨ (X ∧ B), so the rewrite is lossless. Several union members multiply out:
// X ∧ (A ∨ B) ∧ (C ∨ D) has four branches. The result is a oneOf when every union member is one (exactly one
// combination matches), and an anyOf otherwise.
// A schema that refers to a rewritten schema as a base (allOf: [ $ref MetricAggregationBase, {...} ]) now extends a
// union, so it is rewritten too, with the base's branches in place of the $ref.
// Left as they are: an allOf that specializes a generic union (allOf: [ $ref Buckets, { oneOf: [...] } ], the
// union member refines the base's branches instead of adding a constraint), and an allOf whose product would have
// more than MAX_BRANCHES branches.
export default class UnionDistributor {
  private _schemas: Record<string, any> = {}
  private readonly _state = new Map<string, 'pending' | 'done'>()
  private _result: DistributedUnions = { rewritten: [], skipped: [], branches: 0 }

  distribute (spec: Record<string, any>): DistributedUnions {
    this._schemas = (spec.components?.schemas ?? {}) as Record<string, any>
    this._state.clear()
    this._result = { rewritten: [], skipped: [], branches: 0 }
    for (const name of Object.keys(this._schemas)) this.schema(name)
    for (const section of ['parameters', 'requestBodies', 'responses']) {
      for (const [name, component] of Object.entries((spec.components?.[section] ?? {}) as Record<string, any>)) {
        this.visit(component, `#/components/${section}/${this.escape(name)}`, 0)
      }
    }
    this.visit(spec.paths, '#/paths', 0)
    return this._result
  }

  // Distributes a named schema once, before any schema that refers to it.
  schema (name: string): any {
    if (this._state.get(name) === undefined) {
      this._state.set(name, 'pending') // a cycle through allOf bases sees the schema as it is
      this._schemas[name] = this.visit(this._schemas[name], `#/components/schemas/${this.escape(name)}`, 0)
      this._state.set(name, 'done')
    }
    return this._schemas[name]
  }

  // Distributes every allOf in a node, innermost first, and returns the node (rewritten in place where possible).
  visit (node: any, location: string, depth: number): any {
    if (depth > MAX_DEPTH) return node
    if (Array.isArray(node)) {
      node.forEach((item, index) => { node[index] = this.visit(item, `${location}/${index}`, depth + 1) })
      return node
    }
    if (!_.isPlainObject(node)) return node
    for (const [key, value] of Object.entries(node as Record<string, any>)) {
      node[key] = this.visit(value, `${location}/${this.escape(key)}`, depth + 1)
    }
    return Array.isArray(node.allOf) ? this.rewrite(node as Record<string, any>, location) : node
  }

  rewrite (node: Record<string, any>, location: string): Record<string, any> {
    const members = node.allOf as any[]
    const unions: Array<{ keyword: 'oneOf' | 'anyOf', branches: any[], discriminator?: any }> = []
    const parts: any[] = []
    let refined_base = false
    for (const member of members) {
      const union = this.union_of(member)
      if (union === undefined) { parts.push(member); continue }
      if (typeof member.$ref === 'string') refined_base = true
      unions.push(union)
    }
    if (unions.length === 0) return node
    if (refined_base && unions.length > 1) {
      this._result.skipped.push({ location, reason: 'specializes a generic union' })
      return node
    }
    const size = unions.reduce((product, union) => product * union.branches.length, 1)
    if (size > MAX_BRANCHES) {
      this._result.skipped.push({ location, reason: `${size} branches` })
      return node
    }

    let combinations: any[][] = [[]]
    for (const union of unions) {
      combinations = combinations.flatMap((combination) => union.branches.map((branch) => [...combination, branch]))
    }
    const branches = combinations.map((combination) => this.combine(parts, combination))
    const keyword = unions.every((union) => union.keyword === 'oneOf') ? 'oneOf' : 'anyOf'
    const result: Record<string, any> = _.omit(node, ['allOf'])
    result[keyword] = branches
    if (unions.length === 1 && unions[0].discriminator !== undefined) result.discriminator = unions[0].discriminator
    this._result.rewritten.push(location)
    this._result.branches += branches.length
    return result
  }

  // The union a member stands for: an inline oneOf/anyOf (with nothing that isn't an annotation next to it), or a $ref
  // to a named schema that is one after distribution.
  union_of (member: any): { keyword: 'oneOf' | 'anyOf', branches: any[], discriminator?: any } | undefined {
    let target = member
    if (typeof member?.$ref === 'string') {
      const name = (member.$ref as string).split('/').pop() as string
      if (this._schemas[name] === undefined || this._state.get(name) === 'pending') return undefined
      target = this.schema(name)
    }
    if (!_.isPlainObject(target)) return undefined
    const keyword = target.oneOf !== undefined ? 'oneOf' : target.anyOf !== undefined ? 'anyOf' : undefined
    if (keyword === undefined || target.allOf !== undefined || !Array.isArray(target[keyword])) return undefined
    if (Object.keys(target as object).some((key) => !this.is_union_keyword(key))) return undefined
    return { keyword, branches: target[keyword] as any[], discriminator: target.discriminator }
  }

  // Keywords that may sit next to oneOf/anyOf in a union member: annotations, and `type: object`.
  is_union_keyword (key: string): boolean {
    return ['oneOf', 'anyOf', 'discriminator', 'description', 'title', 'type', 'deprecated'].includes(key) || key.startsWith('x-')
  }

  // One branch of the result: the object parts and one branch of every union.
  combine (parts: any[], branches: any[]): any {
    // A branch that is itself an allOf (the branch of a base that was rewritten) is spliced in, so that no allOf nests.
    const members = [...parts, ...branches.map((branch) => _.omit(branch, ['title']))]
      .flatMap((member) => _.isPlainObject(member) && Array.isArray(member.allOf) && Object.keys(member as object).length === 1 ? member.allOf as any[] : [member])
    const title = branches.map((branch) => branch?.title).filter((t) => t !== undefined)
    const combined: Record<string, any> = members.length === 1 ? _.cloneDeep(members[0]) : { allOf: _.cloneDeep(members) }
    if (title.length === branches.length && title.length > 0) combined.title = title.join('_')
    return combined
  }

  escape (key: string): string {
    return key.replaceAll('~', '~0').replaceAll('/', '~1')
  }
}
