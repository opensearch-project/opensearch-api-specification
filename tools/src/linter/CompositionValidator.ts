/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import OpenApiMerger from '../merger/OpenApiMerger'
import GenericLabeler from '../merger/GenericLabeler'
import UnionClassifier from '../merger/UnionClassifier'
import UnionLabeler from '../merger/UnionLabeler'
import { type ValidationError } from '../types'
import { Logger, LogLevel } from '../Logger'

const GUIDE = 'CLIENT_GENERATOR_GUIDE.md#schema-composition'
const PRIMITIVE_TYPES = new Set(['string', 'number', 'integer', 'boolean', 'null'])

// Checks schema composition in the bundled spec, so that shapes client generators can't handle are caught on the
// spec pull request instead of in a client release. See the Schema Composition section of CLIENT_GENERATOR_GUIDE.md.
// - error: properties next to allOf/oneOf/anyOf (rule N1); write them as an allOf member
// - error: a oneOf/anyOf that can't be classified (no x-union-kind)
// - error: allOf members that declare the same property with different primitive types (rule M3)
// - error: an allOf that isn't `[ $ref Base..., { own properties }, { constraint }... ]` (rule C1)
// - error: a union branch that is itself a union, other than a presence constraint inside a presence constraint (rule C2)
// - error: a generic instantiation that gives one type parameter two different arguments (rule C3)
// - error: a single value written as const outside a union branch, instead of enum: [x] (rule C4)
// - error: a nullable scalar written as a oneOf/anyOf with {type: null}, instead of type: [T, 'null'] (rule C5)
// - error: a union of scalar types written as a type array, instead of a oneOf (rule C6)
// A presence constraint may only list keys the object declares; one that doesn't isn't classified, so the first error
// above reports it.
export default class CompositionValidator {
  logger: Logger
  root_folder: string

  constructor (root_folder: string, logger: Logger) {
    this.logger = logger
    this.root_folder = root_folder
  }

  validate (): ValidationError[] {
    const merger = new OpenApiMerger(this.root_folder, new Logger(LogLevel.error))
    const spec = merger.spec() as Record<string, any>
    return [
      ...merger.normalized_compositions.map((location) => this.error(location.replaceAll(':', '___'),
        `Properties next to a composition keyword. Write them as an allOf member instead (${GUIDE}).`)),
      ...this.validate_unions(spec),
      ...this.validate_conflicts(spec),
      ...this.validate_shapes(spec),
      ...this.validate_generics(spec)
    ]
  }

  validate_unions (spec: Record<string, any>): ValidationError[] {
    return new UnionLabeler().label(spec).unclassified
      .map((location) => this.error(location, `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`))
  }

  validate_conflicts (spec: Record<string, any>): ValidationError[] {
    const classifier = new UnionClassifier((spec.components?.schemas ?? {}) as Record<string, any>)
    const errors: ValidationError[] = []
    const visit = (node: any, location: string): void => {
      if (Array.isArray(node)) { node.forEach((item, index) => { visit(item, `${location}/${index}`) }); return }
      if (!_.isPlainObject(node)) return
      if (Array.isArray(node.allOf)) {
        const conflict = this.find_conflict(classifier, node.allOf as any[])
        if (conflict !== undefined) errors.push(this.error(location, conflict))
      }
      for (const [key, value] of Object.entries(node as Record<string, any>)) {
        visit(value, `${location}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`)
      }
    }
    visit(spec.components, '#/components')
    visit(spec.paths, '#/paths')
    return errors
  }

  // Rules C1 and C2, on every allOf and every labeled union.
  validate_shapes (spec: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = []
    const visit = (node: any, location: string): void => {
      if (Array.isArray(node)) { node.forEach((item, index) => { visit(item, `${location}/${index}`) }); return }
      if (!_.isPlainObject(node)) return
      if (Array.isArray(node.allOf)) {
        const problem = this.find_object_problem(node.allOf as any[])
        if (problem !== undefined) errors.push(this.error(location, problem))
      }
      const value_problem = this.find_value_problem(node as Record<string, any>, location)
      if (value_problem !== undefined) errors.push(this.error(location, value_problem))
      const kind = node['x-union-kind']
      const branches = (node.oneOf ?? node.anyOf) as any[] | undefined
      if (typeof kind === 'string' && kind !== 'presence' && Array.isArray(branches)) {
        const keyword = node.oneOf !== undefined ? 'oneOf' : 'anyOf'
        branches.forEach((branch, index) => {
          if (this.is_union(branch)) {
            errors.push(this.error(`${location}/${keyword}/${index}`, `This union branch is itself a union. Give it a name, or flatten its branches into the outer union (${GUIDE}).`))
          }
        })
      }
      for (const [key, value] of Object.entries(node as Record<string, any>)) {
        visit(value, `${location}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`)
      }
    }
    visit(spec.components, '#/components')
    visit(spec.paths, '#/paths')
    return errors
  }

  // Rules C4 to C6: one way to write a single value, a nullable scalar and a union of scalar types.
  find_value_problem (node: Record<string, any>, location: string): string | undefined {
    if ('const' in node && !/\/(oneOf|anyOf)\/\d+$/.test(location)) {
      return `A single value is written as const. Write it as enum: [value]; const is for the documented values of a oneOf (${GUIDE}).`
    }
    for (const keyword of ['oneOf', 'anyOf']) {
      const branches = node[keyword]
      if (!Array.isArray(branches) || branches.length !== 2) continue
      const is_null = (b: any): boolean => _.isEqual(b, { type: 'null' })
      const is_plain_scalar = (b: any): boolean => _.isPlainObject(b) && Object.keys(b as object).every((k) => k === 'type' || k === 'format') &&
        typeof b.type === 'string' && PRIMITIVE_TYPES.has(b.type as string) && b.type !== 'null'
      if ((is_null(branches[0]) && is_plain_scalar(branches[1])) || (is_null(branches[1]) && is_plain_scalar(branches[0]))) {
        return `A nullable scalar is written as a ${keyword}. Write it as a type array with 'null' (${GUIDE}).`
      }
    }
    if (Array.isArray(node.type) && node.type.filter((type: string) => type !== 'null').length > 1) {
      return `Several types are written as a type array. Write them as a oneOf of one type each; a type array only adds 'null' (${GUIDE}).`
    }
    return undefined
  }

  // Rule C3: every generic instantiation can be labeled with x-type-arguments.
  validate_generics (spec: Record<string, any>): ValidationError[] {
    return new GenericLabeler().label(_.cloneDeep(spec)).unresolved
      .map((location) => this.error(location, `This instantiation of a generic type gives one type parameter two different schemas (${GUIDE}).`))
  }

  // Returns a message if an allOf isn't written as its bases ($refs), then at most one member with its own properties,
  // then its constraints (unions, or a container written as properties with maxProperties: 1).
  find_object_problem (members: any[]): string | undefined {
    const kinds = members.map((member) => this.member_kind(member))
    if (kinds.includes('nested')) return `An allOf member is itself an allOf. Merge its members into the outer allOf (${GUIDE}).`
    if (kinds.filter((kind) => kind === 'own').length > 1) return `Several allOf members declare their own properties. Declare them in one member (${GUIDE}).`
    if (kinds.lastIndexOf('ref') > kinds.findIndex((kind) => kind !== 'ref') && kinds.some((kind) => kind !== 'ref')) {
      return `A $ref follows an inline allOf member. List the bases ($ref members) first (${GUIDE}).`
    }
    return undefined
  }

  member_kind (member: any): 'ref' | 'own' | 'constraint' | 'nested' {
    if (typeof member?.$ref === 'string') return 'ref'
    if (member?.allOf !== undefined) return 'nested'
    if (member?.oneOf !== undefined || member?.anyOf !== undefined || member?.maxProperties === 1) return 'constraint'
    return 'own'
  }

  // Whether an inline schema is a union, directly or through an inline allOf member.
  is_union (schema: any): boolean {
    if (!_.isPlainObject(schema) || typeof schema.$ref === 'string') return false
    if (schema.oneOf !== undefined || schema.anyOf !== undefined) return true
    return ((schema.allOf ?? []) as any[]).some((member) => this.is_union(member))
  }

  // Returns a message if two allOf members declare a property with different primitive types.
  find_conflict (classifier: UnionClassifier, members: any[]): string | undefined {
    const seen = new Map<string, string>()
    for (const member of members) {
      for (const [name, property] of Object.entries(classifier.resolve(member).properties)) {
        const type = this.primitive_type(classifier.dereference(property))
        if (type === undefined) continue
        const existing = seen.get(name)
        if (existing !== undefined && existing !== type) {
          return `allOf members declare property '${name}' as both ${existing} and ${type}. Client generators can't satisfy both (${GUIDE}).`
        }
        seen.set(name, type)
      }
    }
    return undefined
  }

  primitive_type (schema: any): string | undefined {
    if (typeof schema?.type !== 'string' || !PRIMITIVE_TYPES.has(schema.type as string)) return undefined
    return schema.type === 'integer' ? 'number' : schema.type
  }

  // Maps a location in the bundled spec to the source file and location, like SchemasValidator does.
  source_of (location: string): { file: string, location: string } {
    const [, , section, key, ...rest] = location.split('/')
    const tail = rest.length > 0 ? `/${rest.join('/')}` : ''
    if (section === 'schemas') {
      const [category, name] = key.split('___')
      return { file: `schemas/${category}.yaml`, location: `#/components/schemas/${name}${tail}` }
    }
    if (section === 'requestBodies' || section === 'responses' || section === 'parameters') {
      const namespace = this.group_to_namespace(key.split('___')[0])
      const separator = section === 'responses' ? '@' : section === 'parameters' ? '::' : '___'
      return { file: `namespaces/${namespace}.yaml`, location: `#/components/${section}/${key.replace('___', separator)}${tail}` }
    }
    return { file: 'namespaces', location }
  }

  group_to_namespace (group: string): string {
    if (group === '_global') return '_global'
    const [, namespace] = group.split('.').reverse()
    return namespace ?? '_core'
  }

  error (location: string, message: string): ValidationError {
    return { ...this.source_of(location), message }
  }
}
