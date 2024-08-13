/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _, { extend, isEmpty } from 'lodash'
import { delete_matching_keys, find_refs, write_yaml } from '../helpers'
import { Logger } from '../Logger'
import { type OpenAPIV3 } from 'openapi-types'
import * as semver from '../_utils/semver'

// Extract a versioned API
export default class OpenApiVersionExtractor {
  private _spec?: Record<string, any>
  private _source_spec: OpenAPIV3.Document
  private _target_version: string
  private _logger: Logger

  constructor(source_spec: OpenAPIV3.Document, target_version: string, logger: Logger = new Logger()) {
    this._source_spec = source_spec
    this._target_version = semver.coerce(target_version)
    this._logger = logger
    this._spec = undefined
  }

  extract(): OpenAPIV3.Document {
    if (this._spec) return this._spec as OpenAPIV3.Document
    this._spec = _.cloneDeep(this._source_spec)
    this.#extract()
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
    this.#remove_keys_not_matching_semver()
    this.#remove_unused()
  }

  #exclude_per_semver(obj: any): boolean {
    const x_version_added = semver.coerce(obj['x-version-added'] as string)
    const x_version_removed = semver.coerce(obj['x-version-removed'] as string)

    if (x_version_added && !semver.satisfies(this._target_version, `>=${x_version_added.toString()}`)) {
      return true
    } else if (x_version_removed && !semver.satisfies(this._target_version, `<${x_version_removed.toString()}`)) {
      return true
    }

    return false
  }

  // Remove any elements that are x-version-added/removed incompatible with the target server version.
  #remove_keys_not_matching_semver(): void {
    delete_matching_keys(this._spec, this.#exclude_per_semver.bind(this))
  }

  #remove_unused(): void {
    if (this._spec === undefined) return

    // remove anything that's not referenced
    var references = find_refs(this._spec)

    this._spec.components = _.reduce(_.map(['parameters', 'requestBodies', 'responses', 'schemas'], (p) =>
    {
      return {
        [p]: _.pickBy(
          this._spec?.components?.[p], (_value, key) =>
            references.has(`#/components/${p}/${key}`)
        )
      }
    }
    ), extend)

    // collect what's left
    var remaining = _.flatMap(['schemas', 'parameters', 'responses', 'requestBodies'], (key) =>
      _.keys(this._spec?.components?.[key]).map((ref) => `#/components/${key}/${ref}`)
    )

    delete_matching_keys(this._spec, (obj) =>
      obj.$ref !== undefined && !_.includes(remaining, obj.$ref)
    )

    this._spec.paths = _.omitBy(this._spec.paths, isEmpty)
  }
}
