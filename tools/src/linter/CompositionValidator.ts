/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs'
import _ from 'lodash'
import OpenApiMerger from '../merger/OpenApiMerger'
import UnionClassifier from '../merger/UnionClassifier'
import UnionLabeler from '../merger/UnionLabeler'
import { read_yaml } from '../helpers'
import { type ValidationError } from '../types'
import { Logger, LogLevel } from '../Logger'

const GUIDE = 'CLIENT_GENERATOR_GUIDE.md#schema-composition'
const PRIMITIVE_TYPES = new Set(['string', 'number', 'integer', 'boolean', 'null'])

// Checks schema composition in the bundled spec, so that shapes client generators can't handle are caught on the
// spec pull request instead of in a client release. See the Schema Composition section of CLIENT_GENERATOR_GUIDE.md.
// - error: a oneOf/anyOf that can't be classified (no x-union-kind), unless it is on the allow-list of known ones
// - error: an allow-listed union that is now classified, so the allow-list only shrinks
// - error: allOf members that declare the same property with different primitive types (rule M3)
// - warning: properties next to allOf/oneOf/anyOf (rule N1); the bundled spec rewrites them, but allOf is clearer
export default class CompositionValidator {
  logger: Logger
  root_folder: string
  allowlist_file: string | undefined

  constructor (root_folder: string, logger: Logger, allowlist_file?: string) {
    this.logger = logger
    this.root_folder = root_folder
    this.allowlist_file = allowlist_file
  }

  validate (): ValidationError[] {
    const merger = new OpenApiMerger(this.root_folder, new Logger(LogLevel.error))
    const spec = merger.spec() as Record<string, any>
    for (const location of merger.normalized_compositions) {
      const { file, location: source_location } = this.source_of(location.replaceAll(':', '___'))
      this.logger.warn(`${file} ${source_location}: properties next to a composition keyword. Write them as an allOf member instead (${GUIDE}).`)
    }
    return [
      ...this.validate_unions(spec),
      ...this.validate_conflicts(spec)
    ]
  }

  validate_unions (spec: Record<string, any>): ValidationError[] {
    const { unclassified } = new UnionLabeler().label(spec)
    const allowed = new Set(this.allowlist())
    const errors = unclassified
      .filter((location) => !allowed.has(location))
      .map((location) => this.error(location, `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`))
    const still_unclassified = new Set(unclassified)
    const fixed = [...allowed].filter((location) => !still_unclassified.has(location))
      .map((location) => this.error(location, `This union is now classified. Remove it from ${this.allowlist_file} (${GUIDE}).`))
    return [...errors, ...fixed]
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

  allowlist (): string[] {
    if (this.allowlist_file === undefined || !fs.existsSync(this.allowlist_file)) return []
    const allowlist: { unclassified_unions?: string[] } = read_yaml(this.allowlist_file)
    return allowlist.unclassified_unions ?? []
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
