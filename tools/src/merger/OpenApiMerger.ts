/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { type OpenAPIV3 } from 'openapi-types'
import fs from 'fs'
import _, { isEmpty } from 'lodash'
import { read_yaml, write_yaml } from '../helpers'
import SupersededOpsGenerator from './SupersededOpsGenerator'
import GlobalParamsGenerator from './GlobalParamsGenerator'
import { Logger } from '../Logger'
import * as semver from 'semver'

// Create a single-file OpenAPI spec from multiple files for OpenAPI validation and programmatic consumption
export default class OpenApiMerger {
  root_folder: string
  logger: Logger
  target_version?: string

  protected _spec: Record<string, any>
  protected _merged: boolean = false

  paths: Record<string, Record<string, OpenAPIV3.PathItemObject>> = {} // namespace -> path -> path_item_object
  schemas: Record<string, Record<string, OpenAPIV3.SchemaObject>> = {} // category -> schema -> schema_object

  constructor (root_folder: string, target_version?: string, logger: Logger = new Logger()) {
    this.logger = logger
    this.root_folder = fs.realpathSync(root_folder)
    this.target_version = target_version === undefined ? undefined : semver.coerce(target_version)?.toString()
    this._spec = {
      openapi: '3.1.0',
      info: read_yaml(`${this.root_folder}/_info.yaml`, true),
      paths: {},
      components: {
        parameters: {},
        requestBodies: {},
        responses: {},
        schemas: {}
      }
    }
  }

  write_to(output_path: string): OpenApiMerger {
    this.logger.info(`Writing ${output_path} ...`)
    write_yaml(output_path, this.spec())
    return this
  }

  spec(): OpenAPIV3.Document {
    if (!this._merged) {
      this.#merge_schemas()
      this.#merge_namespaces()
      this.#sort_spec_keys()
      this.#generate_global_params()
      this.#generate_superseded_ops()
      this._merged = true
    }

    return this._spec as OpenAPIV3.Document
  }

  // Merge files from <spec_root>/namespaces folder.
  #merge_namespaces (): void {
    const folder = `${this.root_folder}/namespaces`
    fs.readdirSync(folder).forEach(file => {
      this.logger.info(`Merging namespaces in ${folder}/${file} ...`)
      const spec = read_yaml(`${folder}/${file}`)
      this.#redirect_refs_in_namespace(spec)
      this._spec.paths = { ...this._spec.paths, ...spec.paths }
      this._spec.components.parameters = { ...this._spec.components.parameters, ...spec.components.parameters }
      this._spec.components.responses = { ...this._spec.components.responses, ...spec.components.responses }
      this._spec.components.requestBodies = { ...this._spec.components.requestBodies, ...spec.components.requestBodies }
    })

    this.#remove_refs_per_semver()
  }

  // Remove any refs that are x-version-added/removed incompatible with the target server version.
  #remove_refs_per_semver() : void {
    this.#remove_per_semver(this._spec.paths)

    // parameters
    const removed_params = this.#remove_per_semver(this._spec.components.parameters)
    const removed_parameter_refs = _.map(removed_params, (ref) => `#/components/parameters/${ref}`)
    Object.entries(this._spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([_method, method_item]) => {
        method_item.parameters = _.filter(method_item.parameters, (param) => !_.includes(removed_parameter_refs, param.$ref))
      })
    })

    // responses
    const removed_responses = this.#remove_per_semver(this._spec.components.responses)
    const removed_response_refs = _.map(removed_responses, (ref) => `#/components/responses/${ref}`)
    Object.entries(this._spec.paths as Document).forEach(([_path, path_item]) => {
      Object.entries(path_item as Document).forEach(([_method, method_item]) => {
        method_item.responses = _.omitBy(method_item.responses, (param) => _.includes(removed_response_refs, param.$ref))
      })
    })

    this._spec.paths = _.omitBy(this._spec.paths, isEmpty)
  }

  #exclude_per_semver(obj: any): boolean {
    if (this.target_version === undefined) return false

    const x_version_added = semver.coerce(obj['x-version-added'] as string)
    const x_version_removed = semver.coerce(obj['x-version-removed'] as string)

    if (x_version_added && !semver.satisfies(this.target_version, `>=${x_version_added?.toString()}`)) {
      return true
    } else if (x_version_removed && !semver.satisfies(this.target_version, `<${x_version_removed?.toString()}`)) {
      return true
    }

    return false
  }

  // Remove any elements that are x-version-added/removed incompatible with the target server version.
  #remove_per_semver(obj: any): string[] {
    let removed: string[] = []
    if (this.target_version === undefined) return removed

    for (const key in obj) {
      if (_.isObject(obj[key])) {
        if (this.#exclude_per_semver(obj[key])) {
          removed.push(key)
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete obj[key]
        } else {
          removed = _.concat(removed, this.#remove_per_semver(obj[key]))
        }
      }
    }

    return removed
  }

  // Redirect schema references in namespace files to local references in single-file spec.
  #redirect_refs_in_namespace (obj: any): void {
    const ref: string = obj?.$ref
    if (ref?.startsWith('../schemas/')) { obj.$ref = ref.replace('../schemas/', '#/components/schemas/').replace('.yaml#/components/schemas/', ':') }

    for (const key in obj) {
      if (typeof obj[key] === 'object') { this.#redirect_refs_in_namespace(obj[key]) }
    }
  }

  // Merge files from <spec_root>/schemas folder.
  #merge_schemas (): void {
    const folder = `${this.root_folder}/schemas`
    fs.readdirSync(folder).forEach(file => {
      this.logger.info(`Merging schema ${folder}/${file} ...`)
      const spec = read_yaml(`${folder}/${file}`)
      const category = file.split('.yaml')[0]
      this.redirect_refs_in_schema(category, spec)
      if (spec.components?.schemas !== undefined) {
        this.schemas[category] = spec.components?.schemas
      }
    })

    Object.entries(this.schemas).forEach(([category, schemas]) => {
      Object.entries(schemas).forEach(([name, schema_obj]) => {
        this._spec.components.schemas[`${category}:${name}`] = schema_obj
      })
    })
  }

  // Redirect schema references in schema files to local references in single-file spec.
  redirect_refs_in_schema (category: string, obj: any): void {
    const ref: string = obj?.$ref ?? ''
    if (ref !== '') {
      if (ref.startsWith('#/components/schemas')) { obj.$ref = `#/components/schemas/${category}:${ref.split('/').pop()}` } else {
        const other_category = ref.match(/(.*)\.yaml/)?.[1] ?? ''
        if (other_category === '') throw new Error(`Invalid schema reference: ${ref}`)
        obj.$ref = `#/components/schemas/${other_category}:${ref.split('/').pop()}`
      }
    }

    for (const key in obj) {
      if (typeof obj[key] === 'object') { this.redirect_refs_in_schema(category, obj[key]) }
    }
  }

  // Sort keys in the spec to make it easier to read and compare.
  #sort_spec_keys (): void {
    this._spec.components.schemas = _.fromPairs(Object.entries(this._spec.components.schemas as Document).sort((a, b) => a[0].localeCompare(b[0])))
    this._spec.components.parameters = _.fromPairs(Object.entries(this._spec.components.parameters as Document).sort((a, b) => a[0].localeCompare(b[0])))
    this._spec.components.responses = _.fromPairs(Object.entries(this._spec.components.responses as Document).sort((a, b) => a[0].localeCompare(b[0])))
    this._spec.components.requestBodies = _.fromPairs(Object.entries(this._spec.components.requestBodies as Document).sort((a, b) => a[0].localeCompare(b[0])))

    this._spec.paths = _.fromPairs(Object.entries(this._spec.paths as Document).sort((a, b) => a[0].localeCompare(b[0])))
    Object.entries(this._spec.paths as Document).forEach(([path, path_item]) => {
      this._spec.paths[path] = _.fromPairs(Object.entries(path_item as Document).sort((a, b) => a[0].localeCompare(b[0])))
    })
  }

  // Generate global parameters from _global_params.yaml file.
  #generate_global_params (): void {
    const gen = new GlobalParamsGenerator(this.root_folder)
    gen.generate(this._spec)
  }

  // Generate superseded operations from _superseded_operations.yaml file.
  #generate_superseded_ops (): void {
    const gen = new SupersededOpsGenerator(this.root_folder, this.logger)
    gen.generate(this._spec)
  }
}
