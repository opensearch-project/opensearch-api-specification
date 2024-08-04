/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import { type OperationSpec, type ValidationError } from 'types'
import OperationGroup from './OperationGroup'
import _ from 'lodash'
import Operation from './Operation'
import { resolve_ref, sort_by_keys } from '../../helpers'
import FileValidator from './base/FileValidator'
import Info from './Info'

const HTTP_METHODS = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace']
const NAME_REGEX = /^[a-z]+[a-z_]*[a-z]+$/

export default class NamespaceFile extends FileValidator {
  namespace: string
  private _info: Info | undefined
  private _operation_groups: OperationGroup[] | undefined
  private _refs: Set<string> | undefined

  constructor (file_path: string) {
    super(file_path)
    this.namespace = file_path.split('/').slice(-1)[0].replace('.yaml', '')
  }

  validate_file (): ValidationError[] {
    const name_error = this.validate_name()
    if (name_error) return [name_error]
    const group_errors = this.operation_groups().flatMap((group) => group.validate())
    if (group_errors.length > 0) return group_errors

    return [
      this.validate_schemas(),
      ...this.validate_info(),
      ...this.validate_unresolved_refs(),
      ...this.validate_unused_refs(),
      ...this.validate_parameter_refs(),
      ...this.validate_order_of_operations()
    ].filter((e) => e) as ValidationError[]
  }

  info (): Info {
    if (this._info) return this._info
    this._info = new Info(this.file, this.file_path, this.spec().info)
    return this._info
  }

  operation_groups (): OperationGroup[] {
    if (this._operation_groups) return this._operation_groups
    const ops: Operation[] = _.entries(this.spec().paths).flatMap(([path, ops]) => {
      return _.entries(_.pick(ops, HTTP_METHODS)).map(([verb, op]) => {
        return new Operation(this.file, path, verb, op as OperationSpec)
      })
    })

    this._operation_groups = _.entries(_.groupBy(ops, (op) => op.group)).map(([group, ops]) => {
      return new OperationGroup(this.file, group, ops)
    })
    return this._operation_groups
  }

  refs (): Set<string> {
    if (this._refs) return this._refs
    this._refs = new Set<string>()
    const find_refs = (obj: Record<string, any>): void => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (obj.$ref != null) this._refs!.add(obj.$ref as string)
      _.values(obj).forEach((value) => { if (typeof value === 'object') find_refs(value as Record<string, any>) })
    }
    find_refs(this.spec().paths ?? {})
    return this._refs
  }

  validate_name (name = this.namespace): ValidationError | undefined {
    if (name === '_core') return
    if (!name.match(NAME_REGEX)) { return this.error(`Invalid namespace name '${name}'. Must match regex: /${NAME_REGEX.source}/.`, 'File Name') }
  }

  validate_schemas (): ValidationError | undefined {
    if (this.spec().components?.schemas) { return this.error('components/schemas is not allowed in namespace files', '#/components/schemas') }
  }

  validate_info(): ValidationError[] {
    return this.info().validate()
  }

  validate_unresolved_refs (): ValidationError[] {
    return Array.from(this.refs()).map((ref) => {
      if (resolve_ref(ref, this.spec()) === undefined) return this.error(`Unresolved reference: ${ref}`, ref)
    }).filter((e) => e) as ValidationError[]
  }

  validate_unused_refs (): ValidationError[] {
    return _.entries(this.spec().components ?? {}).flatMap(([type, collection]) => {
      return _.keys(collection).map((name) => {
        if (!this.refs().has(`#/components/${type}/${name}`)) { return this.error(`Unused ${type} component: ${name}`, `#/components/${type}/${name}`) }
      })
    }).filter((e) => e) as ValidationError[]
  }

  validate_parameter_refs (): ValidationError[] {
    const parameters = this.spec().components?.parameters as Record<string, OpenAPIV3.ParameterObject> | undefined
    if (!parameters) return []
    return _.entries(parameters).map(([name, p]) => {
      const group = name.split('::')[0]
      const expected = `${group}::${p.in}.${p.name}`
      if (name !== expected) {
        return this.error(
          `Parameter component '${name}' must be named '${expected}' since it is a ${p.in} parameter named '${p.name}'.`,
          `#/components/parameters/#${name}`)
      }
      if (!p.name.match(/^[a-zA-Z0-9._]+$/)) {
        return this.error(
          `Invalid parameter name '${p.name}'. A parameter's name can only contain alphanumerics, underscores, and periods.`,
          `#/components/parameters/#${name}`)
      }
    }).filter((e) => e) as ValidationError[]
  }

  validate_order_of_operations (): ValidationError[] {
    return _.entries(this.spec().paths).map(([path, p]) => {
      const current_keys = _.keys(p)
      sort_by_keys(p as Record<string, any>, HTTP_METHODS)
      const sorted_keys = _.keys(p)
      if (!_.isEqual(current_keys, sorted_keys)) {
        return this.error(
          `Operations must be sorted. Expected ${_.join(sorted_keys, ', ')}.`,
          path)
      }
    }).filter((e) => e) as ValidationError[]
  }
}
