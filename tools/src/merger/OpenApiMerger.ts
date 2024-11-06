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
import _ from 'lodash'
import { read_yaml, write_yaml } from '../helpers'
import SupersededOpsGenerator from './SupersededOpsGenerator'
import GlobalParamsGenerator from './GlobalParamsGenerator'
import { Logger } from '../Logger'

// Create a single-file OpenAPI spec from multiple files for OpenAPI validation and programmatic consumption
export default class OpenApiMerger {
  root_folder: string
  logger: Logger

  protected _spec: Record<string, any>
  protected _merged: boolean = false

  paths: Record<string, Record<string, OpenAPIV3.PathItemObject>> = {} // namespace -> path -> path_item_object
  schemas: Record<string, Record<string, OpenAPIV3.SchemaObject>> = {} // category -> schema -> schema_object

  constructor (root_folder: string, logger: Logger = new Logger()) {
    this.logger = logger
    this.root_folder = fs.realpathSync(root_folder)
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
      this.#add_defaults()
      this.#fix_refs()
      this.#generate_global_params()
      this.#generate_superseded_ops()
      this.#normalize_fields()
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

  #fix_refs(obj: any = this._spec.components): void {
    if (obj?.$ref !== undefined) {
      if (obj?.description !== undefined) {
        delete obj?.description
      }
    }

    for (const key in obj) {
      var item = obj[key]
      if (_.isObject(item) || _.isArray(item)) {
        this.#fix_refs(item)
      }
    }
  }

  #normalize_key(key: string): string {
    return key
      .replaceAll('::', '___')
      .replaceAll('@', '___')
      .replaceAll(':', '___')
  }

  #normalize_fields(obj: any = this._spec): void {
    for (const key in obj) {
      var item = obj[key]

      if (item?.$ref !== undefined) {
        var renamed_ref = this.#normalize_key(item.$ref as string)
        if (renamed_ref != item.$ref) {
          item.$ref = renamed_ref
        }
      }

      var renamed_key = this.#normalize_key(key)
      if (renamed_key != key) {
        obj[renamed_key] = obj[key]
        delete obj[key]
      }

      if (_.isObject(item) || _.isArray(item)) {
        this.#normalize_fields(item)
      }
    }
  }

  #add_defaults(): void {
    // Add default descriptions
    Object.entries(this._spec.components.responses as Document).forEach(([_path, response_item]) => {
      if (response_item.description === undefined) response_item.description = ''
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
