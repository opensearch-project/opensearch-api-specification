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
import _, { isEmpty } from 'lodash'
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

  // Remove any refs that are x-version-added/removed incompatible with the target server version.
  #extract() : void {
    this._logger.info(`Extracting version ${this._target_version} ...`)

    this._spec = _.cloneDeep(this._source_spec)

    this._spec.components = this._spec.components ?? {
      parameters: {},
      requestBodies: {},
      responses: {},
      schemas: {}
    }

    this.#remove_keys_not_matching_semver(this._spec.paths)

    // parameters
    const removed_params = this.#remove_keys_not_matching_semver(this._spec.components.parameters)
    const removed_parameter_refs = _.map(removed_params, (ref) => `#/components/parameters/${ref}`)
    Object.entries(this._spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([_method, method_item]) => {
        method_item.parameters = _.filter(method_item.parameters, (param) => !_.includes(removed_parameter_refs, param.$ref))
      })
    })

    // responses
    const removed_responses = this.#remove_keys_not_matching_semver(this._spec.components.responses)
    const removed_response_refs = _.map(removed_responses, (ref) => `#/components/responses/${ref}`)
    Object.entries(this._spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([_method, method_item]) => {
        method_item.responses = _.omitBy(method_item.responses, (param) => _.includes(removed_response_refs, param.$ref))
      })
    })

    this._spec.paths = _.omitBy(this._spec.paths, isEmpty)
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
  #remove_keys_not_matching_semver(obj: any): string[] {
    if (this._target_version === undefined) return []
    return delete_matching_keys(obj, this.#exclude_per_semver.bind(this))
  }
}
