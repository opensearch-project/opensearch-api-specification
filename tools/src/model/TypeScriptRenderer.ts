/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import type { ClientModel, Constraint, Field, ObjectShape, TypeEntry, TypeExpr } from './types'

// Renders a client model as TypeScript declarations. It shows how little a generator needs once the model has
// resolved composition: no allOf/oneOf/anyOf logic, only a mapping of type kinds and constraints to the language.
// Constraints become checked types: exactly-one key sets and container variants exclude the other keys with
// `?: never`, so invalid combinations fail to compile.
export default class TypeScriptRenderer {
  render (model: ClientModel): string {
    const lines = [
      `// Generated from the OpenSearch client model ${model.version}. Do not edit.`,
      '/* eslint-disable */',
      'type __Never<K extends PropertyKey> = { [P in K]?: never }',
      ''
    ]
    for (const [name, entry] of Object.entries(model.types)) {
      if (entry.description !== undefined) lines.push(this.doc(entry.description, ''))
      lines.push(`export type ${this.identifier(name)} = ${this.entry(entry)}`, '')
    }
    return lines.join('\n')
  }

  entry (entry: TypeEntry): string {
    switch (entry.type_kind) {
      case 'object': return this.shape(entry)
      case 'alias': return this.expr(entry.type)
      case 'union': {
        const members = entry.variants !== undefined ? Object.values(entry.variants) : entry.members ?? []
        return members.length === 0 ? 'never' : members.map((m) => this.expr(m)).join(' | ')
      }
    }
  }

  expr (type: TypeExpr): string {
    if ('ref' in type) return this.identifier(type.ref)
    if ('scalar' in type) return type.scalar === 'integer' ? 'number' : type.scalar
    if ('enum' in type) return type.enum.length === 0 ? 'never' : type.enum.map((v) => JSON.stringify(v)).join(' | ')
    if ('array' in type) return `Array<${this.expr(type.array)}>`
    if ('map' in type) return `Record<string, ${this.expr(type.map)}>`
    if ('union' in type) return type.union.length === 0 ? 'never' : `(${type.union.map((m) => this.expr(m)).join(' | ')})`
    if ('object' in type) return this.shape(type.object)
    return 'unknown'
  }

  shape (shape: ObjectShape): string {
    const parts = [this.fields(shape.fields, shape.additional_fields)]
    for (const constraint of shape.constraints) parts.push(this.constraint(constraint, shape.fields))
    return parts.length === 1 ? parts[0] : parts.map((p) => `(${p})`).join(' & ')
  }

  fields (fields: Record<string, Field>, additional?: TypeExpr): string {
    const members = Object.entries(fields).map(([name, field]) =>
      `${JSON.stringify(name)}${field.required ? '' : '?'}: ${this.expr(field.type)}`)
    if (additional !== undefined) {
      // An index signature must accept the named fields' types too.
      const types = _.uniq([this.expr(additional), ...Object.values(fields).map((f) => this.expr(f.type))])
      members.push(`[key: string]: ${types.join(' | ')} | undefined`)
    }
    return members.length === 0 ? '{}' : `{ ${members.join('; ')} }`
  }

  constraint (constraint: Constraint, fields: Record<string, Field>): string {
    if (constraint.union_kind === 'presence' && ('one_of' in constraint || 'any_of' in constraint)) {
      const sets = ('one_of' in constraint ? constraint.one_of : constraint.any_of) as string[][]
      const exclusive = 'one_of' in constraint
      const all = _.uniq(sets.flat())
      return sets.map((keys) => {
        const present = keys.map((k) => `${JSON.stringify(k)}: ${this.expr(fields[k]?.type ?? { any: true })}`)
        const others = exclusive ? _.difference(all, keys) : []
        const absent = others.length > 0 ? ` & __Never<${others.map((k) => JSON.stringify(k)).join(' | ')}>` : ''
        return `{ ${present.join('; ')} }${absent}`
      }).join(' | ')
    }
    if (constraint.union_kind === 'container' && 'variants' in constraint) {
      const variants = Object.entries(constraint.variants)
      const every_key = _.uniq(variants.flatMap(([key, v]) => [key, ...Object.keys(v.extra_fields)]))
      return variants.map(([key, variant]) => {
        const own = { [key]: { type: variant.value, required: true }, ...variant.extra_fields }
        const others = _.difference(every_key, Object.keys(own))
        const parts = [this.fields(own)]
        if (others.length > 0) parts.push(`__Never<${others.map((k) => JSON.stringify(k)).join(' | ')}>`)
        for (const extra of variant.extra_constraints) parts.push(`(${this.constraint(extra, own)})`)
        return `(${parts.join(' & ')})`
      }).join(' | ')
    }
    if (constraint.union_kind === 'not_all' && 'keys' in constraint) {
      return constraint.keys.map((k) => `__Never<${JSON.stringify(k)}>`).join(' | ')
    }
    if ('matches' in constraint) {
      return constraint.types.length === 0 ? 'never' : constraint.types.map((t) => this.expr(t)).join(' | ')
    }
    return 'unknown'
  }

  identifier (name: string): string {
    return name.replace(/[^A-Za-z0-9_$]/g, '_')
  }

  doc (text: string, indent: string): string {
    return `${indent}/** ${text.replaceAll('*/', '*\\/').replace(/\s*\n\s*/g, ' ')} */`
  }
}
