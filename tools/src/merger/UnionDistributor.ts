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
// Nesting multiplies out to any depth: a branch that is again an object with a union member, inline or through a
// $ref, is rewritten and its branches take its place, so X ∧ (A ∨ (B ∧ (C ∨ D))) becomes
// (X ∧ A) ∨ (X ∧ B ∧ C) ∨ (X ∧ B ∧ D). The result is a oneOf only if every union it multiplies out is one.
// Left as they are: a presence constraint, which only requires properties the object declares (also nested:
// "with `script`, also `type` or `lang`"); an allOf that specializes a generic union (allOf: [ $ref Buckets, { oneOf: [...] } ], the
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

  // Rewrites an allOf with union members into a union of complete objects. `record`: report it in the result (a
  // branch rewritten while multiplying out an outer allOf is part of that one).
  rewrite (node: Record<string, any>, location: string, depth: number = 0, record: boolean = true): Record<string, any> {
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
    // A presence constraint adds no properties: a generator that drops it keeps every field and loses the constraint
    // only, so it stays a labeled allOf member instead of a union of near-identical objects.
    const declared = this.declared(parts)
    const constraints = unions.filter((union) => this.is_constraint(union.branches, declared))
    if (constraints.length > 0) {
      if (record) this._result.skipped.push({ location, reason: constraints.length === unions.length ? 'presence constraint' : 'presence constraint with other unions' })
      return node // with other unions too: left as it is, see `skipped`
    }
    if (refined_base && unions.length > 1) {
      if (record) this._result.skipped.push({ location, reason: 'specializes a generic union' })
      return node
    }
    const size = unions.reduce((product, union) => product * union.branches.length, 1)
    if (size > MAX_BRANCHES) {
      if (record) this._result.skipped.push({ location, reason: `${size} branches` })
      return node
    }

    for (const union of unions) union.branches = this.titled(union.branches, declared)
    let combinations: any[][] = [[]]
    for (const union of unions) {
      combinations = combinations.flatMap((combination) => union.branches.map((branch) => [...combination, branch]))
    }
    let exclusive = unions.every((union) => union.keyword === 'oneOf')
    const branches: any[] = []
    for (const combined of combinations.map((combination) => this.combine(parts, combination))) {
      const nested = this.multiply_out(combined, location, depth)
      if (nested === undefined) { branches.push(combined); continue }
      exclusive = exclusive && nested.keyword === 'oneOf'
      branches.push(...nested.branches)
    }
    if (branches.length > MAX_BRANCHES) {
      if (record) this._result.skipped.push({ location, reason: `${branches.length} branches` })
      return node
    }
    const keyword = exclusive ? 'oneOf' : 'anyOf'
    const result: Record<string, any> = _.omit(node, ['allOf'])
    result[keyword] = branches
    if (unions.length === 1 && unions[0].discriminator !== undefined) result.discriminator = unions[0].discriminator
    if (record) {
      this._result.rewritten.push(location)
      this._result.branches += branches.length
    }
    return result
  }

  // A combined branch that is again an object with a union member (an inline union, or a $ref to a schema that is a
  // union after distribution), rewritten into the branches that replace it, with the branch's title in front of
  // theirs. Undefined when it is none, or is left as it is (a presence constraint, a generic specialization).
  multiply_out (branch: any, location: string, depth: number): { keyword: 'oneOf' | 'anyOf', branches: any[] } | undefined {
    if (depth >= MAX_DEPTH || !_.isPlainObject(branch) || !Array.isArray(branch.allOf)) return undefined
    if (!(branch.allOf as any[]).some((member) => this.union_of(member) !== undefined)) return undefined
    const rewritten = this.rewrite(_.omit(branch, ['title']), location, depth + 1, false)
    const keyword = rewritten.oneOf !== undefined ? 'oneOf' : rewritten.anyOf !== undefined ? 'anyOf' : undefined
    if (keyword === undefined || rewritten.allOf !== undefined) return undefined
    const title = branch.title as string | undefined
    const branches = (rewritten[keyword] as any[]).map((nested) => {
      if (title === undefined) return nested
      return { ...nested, title: typeof nested.title === 'string' ? `${title}_${nested.title as string}` : title }
    })
    // titles repeated across the spliced branches don't name them apart
    if (title !== undefined && new Set(branches.map((b) => b.title)).size !== branches.length) branches.forEach((b) => { delete b.title })
    return { keyword, branches }
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

  // The properties the object parts declare, following $refs and allOf members.
  declared (parts: any[], depth: number = 0): Set<string> {
    const names = new Set<string>()
    if (depth > MAX_DEPTH) return names
    for (const part of parts) {
      let target = part
      if (typeof part?.$ref === 'string') target = this._schemas[(part.$ref as string).split('/').pop() as string]
      if (!_.isPlainObject(target)) continue
      Object.keys((target.properties ?? {}) as object).forEach((name) => names.add(name))
      if (Array.isArray(target.allOf)) this.declared(target.allOf as any[], depth + 1).forEach((name) => names.add(name))
    }
    return names
  }

  // Whether the branches add no properties to the object: they only require keys, and perhaps redeclare properties
  // the object declares, also through a nested presence constraint ("with `script`, also `type` or `lang`"). Dropping
  // such a union loses a check, never a field.
  is_constraint (branches: any[], declared: Set<string>, depth: number = 0): boolean {
    if (depth > MAX_DEPTH) return false
    return branches.every((branch) => _.isPlainObject(branch) && typeof branch.$ref !== 'string' &&
      Object.keys(branch as object).every((key) => ['type', 'required', 'properties', 'description', 'title', 'allOf', 'oneOf', 'anyOf'].includes(key) || key.startsWith('x-')) &&
      Object.keys((branch.properties ?? {}) as object).every((name) => declared.has(name)) &&
      ['allOf', 'oneOf', 'anyOf'].every((key) => branch[key] === undefined || (Array.isArray(branch[key]) && this.is_constraint(branch[key] as any[], declared, depth + 1))))
  }

  // The branches with a title each, so that the union they become can be labeled: a branch without one is named after
  // the one property it adds to the object (`field`, `script`). Branches are left as they are unless every one gets a
  // distinct title.
  titled (branches: any[], declared: Set<string>): any[] {
    const titles = branches.map((branch) => {
      if (typeof branch?.title === 'string') return branch.title as string
      if (!_.isPlainObject(branch) || typeof branch.$ref === 'string') return undefined
      const added = Object.keys((branch.properties ?? {}) as object).filter((name) => !declared.has(name))
      return added.length === 1 ? added[0] : undefined
    })
    if (titles.some((title) => title === undefined) || new Set(titles).size !== titles.length) return branches
    return branches.map((branch, index) => ({ ...branch, title: titles[index] }))
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
    // An empty object member (`{ type: object }`, a subtype without properties of its own) adds nothing to a branch
    // that has other members, so it isn't copied into every branch.
    const empty = (member: any): boolean => _.isEqual(member, { type: 'object' })
    if (members.some((member) => !empty(member))) _.remove(members, empty)
    const title = branches.map((branch) => branch?.title).filter((t) => t !== undefined)
    const combined: Record<string, any> = members.length === 1 ? _.cloneDeep(members[0]) : { allOf: _.cloneDeep(members) }
    if (title.length === branches.length && title.length > 0) combined.title = title.join('_')
    return combined
  }

  escape (key: string): string {
    return key.replaceAll('~', '~0').replaceAll('/', '~1')
  }
}
