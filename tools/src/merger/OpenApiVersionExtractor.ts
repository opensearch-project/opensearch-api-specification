/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger } from '../Logger'
import { delete_matching_keys, write_yaml } from '../helpers'
import _ from 'lodash'
import { type OpenAPIV3 } from 'openapi-types'
import semver from 'semver'

// Extract a versioned API
export default class OpenApiVersionExtractor {
  private _spec?: Record<string, any>
  private _source_spec: OpenAPIV3.Document
  private _target_version?: string
  private _logger: Logger

  constructor(source_spec: OpenAPIV3.Document, target_version?: string, logger: Logger = new Logger()) {
    this._source_spec = source_spec
    this._target_version = target_version !== undefined ? semver.coerce(target_version)?.toString() : undefined
    this._logger = logger
    this._spec = undefined
  }

  extract(): OpenAPIV3.Document {
    if (this._spec) return this._spec as OpenAPIV3.Document
    if (this._target_version !== undefined) {
      this.#extract()
    } else {
      this._spec = this._source_spec
    }
    return this._spec as OpenAPIV3.Document
  }

  write_to(output_path: string): OpenApiVersionExtractor {
    this._logger.info(`Writing ${output_path} ...`)
    write_yaml(output_path, this.extract())
    return this
  }

  // Remove any refs and objects that reference them that are x-version-added/removed
  // incompatible with the target server version.
  #extract() : void {
    this._logger.info(`Extracting version ${this._target_version} ...`)

    this._spec = _.cloneDeep(this._source_spec)

    this.#remove_keys_not_matching_semver()

    this.#remove_unused_bodies()
    this.#remove_unused_parameters()
    this.#remove_unused_responses()
  }

  #exclude_per_semver(obj: any): boolean {
    if (this._target_version === undefined) return false

    const x_version_added = semver.coerce(obj['x-version-added'] as string)
    const x_version_removed = semver.coerce(obj['x-version-removed'] as string)

    if (x_version_added && !semver.satisfies(this._target_version, `>=${x_version_added?.toString()}`)) {
      return true
    } else if (x_version_removed && !semver.satisfies(this._target_version, `<${x_version_removed?.toString()}`)) {
      return true
    }

    return false
  }

  // Remove any elements that are x-version-added/removed incompatible with the target server version.
  #remove_keys_not_matching_semver(): void {
    if (this._target_version === undefined) return
    delete_matching_keys(this._spec, this.#exclude_per_semver.bind(this))
  }

  #remove_unused_bodies(): void {
    if (this._spec === undefined) return

    var used_bodies: string[] = []
    Object.entries(this._spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([method, method_item]) => {
        const ref = method_item.requestBody?.$ref
        if (ref !== undefined) {
          if (this._spec?.components.requestBodies[ref.split('/').pop()] !== undefined) {
            used_bodies = _.concat(used_bodies, method_item.requestBody.$ref)
          } else {
            delete path_item[method]
          }
        }
      })
    })

    this._spec.components.requestBodies = _.pickBy(this._spec.components.requestBodies, (_value, key) =>
      _.includes(used_bodies, `#/components/requestBodies/${key}`)
    )
  }

  #remove_unused_responses(): void {
    if (this._spec === undefined) return

    var used_responses: string[] = []
    Object.entries(this._spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([_method, method_item]) => {
        Object.entries(method_item.responses as Document).forEach(([response_code, response]) => {
          const ref = response.$ref
          if (response.$ref !== undefined) {
            if (this._spec?.components.responses[ref.split('/').pop()] !== undefined) {
              used_responses = _.concat(used_responses, ref)
            } else {
              delete method_item.responses[response_code]
            }
          }
        })
      })
    })

    this._spec.components.responses = _.pickBy(this._spec.components.responses, (_value, key) =>
      _.includes(used_responses, `#/components/responses/${key}`)
    )
  }

  #remove_unused_parameters(): void {
    if (this._spec === undefined) return

    var used_parameters: string[] = []
    Object.entries(this._spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([_method, method_item]) => {
        Object.entries(method_item.parameters as Document).forEach(([response_code, parameter]) => {
          const ref = parameter.$ref
          if (parameter.$ref !== undefined) {
            if (this._spec?.components.parameters[ref.split('/').pop()] !== undefined) {
              used_parameters = _.concat(used_parameters, parameter.$ref)
            } else {
              delete method_item.parameters[response_code]
            }
          }
        })
      })
    })

    this._spec.components.parameters = _.pickBy(this._spec.components.parameters, (_value, key) =>
      _.includes(used_parameters, `#/components/parameters/${key}`)
    )
  }
}
