/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

// The resolved client model: what each type of the bundled spec looks like, with every $ref followed, every allOf
// merged and every union classified, so that client generators read fields and constraints instead of interpreting
// JSON Schema composition. See "Client Model" in CLIENT_GENERATOR_GUIDE.md.

export const MODEL_FORMAT = 'opensearch-client-model'
export const MODEL_VERSION = '0.2.0'

export type ScalarType = 'string' | 'number' | 'integer' | 'boolean' | 'null'

// The type of a field, a map value, an array item or a union member.
export type TypeExpr =
  | { ref: string } // a named type of the model
  | { scalar: ScalarType, format?: string }
  | { enum: Array<string | number | boolean | null> }
  | { array: TypeExpr }
  | { map: TypeExpr } // an object keyed by arbitrary names
  | { union: TypeExpr[], union_kind: string, exclusive: boolean, titles?: Array<string | null>, branch_versions?: Array<Versions | null> } // an inline union; `titles` and `branch_versions` by member, when any member has one
  | { object: ObjectShape, description?: string } // an inline object
  | { any: true } // any JSON value

export interface Field {
  type: TypeExpr
  required: boolean
  description?: string
  versions?: Versions
  declared_in?: string // the base (a named allOf member) the field is inherited from; absent for the type's own fields
}

// Version and deprecation metadata (x-version-added, x-version-removed, x-version-deprecated, x-deprecation-message).
export interface Versions {
  added?: string
  removed?: string
  deprecated?: string
  deprecation_message?: string
}

export interface ObjectShape {
  bases?: string[] // the named types merged in through allOf, in order; their fields carry `declared_in`
  fields: Record<string, Field>
  additional_fields?: TypeExpr // the type of keys not listed in `fields`
  constraints: Constraint[]
}

// Constraints on which fields of an object may be present together.
export type Constraint =
  | PresenceConstraint
  | ContainerConstraint
  | NotAllConstraint
  | MatchesConstraint

// The object must set the fields of exactly one (`one_of`) or at least one (`any_of`) of the key sets.
export interface PresenceConstraint {
  union_kind: 'presence'
  one_of?: string[][]
  any_of?: string[][]
}

// The object must set exactly one of the variant keys. A variant may allow further fields and constraints.
export interface ContainerConstraint {
  union_kind: 'container'
  variants: Record<string, ContainerVariant>
}

export interface ContainerVariant {
  value: TypeExpr // the type of the variant key's value
  extra_fields: Record<string, Field> // fields allowed only together with this variant
  extra_constraints: Constraint[]
}

// The object must not set all of these fields together.
export interface NotAllConstraint {
  union_kind: 'not_all'
  keys: string[]
}

// The object must also match one (`one_of`) or at least one (`any_of`) of these types. Used for unions inside an
// allOf that constrain more than which fields are present; `union_kind` is the union's x-union-kind label.
export interface MatchesConstraint {
  union_kind: string
  matches: 'one_of' | 'any_of'
  types: TypeExpr[]
}

export type TypeEntry = ObjectEntry | UnionEntry | AliasEntry

export interface ObjectEntry extends ObjectShape {
  type_kind: 'object'
  description?: string
  versions?: Versions
}

export interface UnionEntry {
  type_kind: 'union'
  union_kind: string // the x-union-kind label, or `unclassified`
  exclusive: boolean // oneOf (exactly one member matches) rather than anyOf
  discriminator?: string // tagged unions: the field whose value selects the variant
  default_variant?: string // tagged unions: the variant used when the discriminator is absent
  versions?: Versions
  variants?: Record<string, TypeExpr> // tagged and titled unions: members by tag value or title
  members?: TypeExpr[] // other unions
  titles?: Array<string | null> // each branch's own title, by position (members or variants), when any branch has one
  branch_versions?: Array<Versions | null> // each branch's version metadata, by position, when any branch has some
  description?: string
}

export interface AliasEntry {
  type_kind: 'alias'
  type: TypeExpr
  generic_parameter?: true // a generic type parameter (x-is-generic-type-parameter, e.g. TDocument): `type` is `any`
  description?: string
  versions?: Versions
}

// The JSON body of a response or request body component (components/responses, components/requestBodies).
export interface BodyEntry {
  media_type: string
  type: TypeExpr
  description?: string // the body schema's description
}

export interface Diagnostic {
  type: string // the model type the diagnostic is about
  message: string
}

export interface ClientModel {
  format: typeof MODEL_FORMAT
  version: typeof MODEL_VERSION
  types: Record<string, TypeEntry>
  responses: Record<string, BodyEntry> // by component name, e.g. `search___200`
  request_bodies: Record<string, BodyEntry>
  diagnostics: Diagnostic[]
}
