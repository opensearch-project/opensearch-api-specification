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
  spec: Record<string, any>
  logger: Logger

  paths: Record<string, Record<string, OpenAPIV3.PathItemObject>> = {} // namespace -> path -> path_item_object
  schemas: Record<string, Record<string, OpenAPIV3.SchemaObject>> = {} // category -> schema -> schema_object

  constructor (root_folder: string, logger: Logger = new Logger()) {
    this.logger = logger
    this.root_folder = fs.realpathSync(root_folder)
    this.spec = {
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

  merge (output_path: string = ''): OpenAPIV3.Document {
    this.#merge_schemas()
    this.#merge_namespaces()
    this.#sort_spec_keys()
    this.#generate_global_params()
    this.#generate_superseded_ops()

    this.logger.info(`Writing ${output_path} ...`)

    if (output_path !== '') write_yaml(output_path, this.spec)
    return this.spec as OpenAPIV3.Document
  }

  // Merge files from <spec_root>/namespaces folder.
  #merge_namespaces (): void {
    const folder = `${this.root_folder}/namespaces`
    fs.readdirSync(folder).forEach(file => {
      this.logger.info(`Merging namespaces in ${folder}/${file} ...`)
      const spec = read_yaml(`${folder}/${file}`)
      this.redirect_refs_in_namespace(spec)
      this.spec.paths = { ...this.spec.paths, ...spec.paths }
      this.spec.components.parameters = { ...this.spec.components.parameters, ...spec.components.parameters }
      this.spec.components.responses = { ...this.spec.components.responses, ...spec.components.responses }
      this.spec.components.requestBodies = { ...this.spec.components.requestBodies, ...spec.components.requestBodies }
    })
  }

  // Redirect schema references in namespace files to local references in single-file spec.
  redirect_refs_in_namespace (obj: any): void {
    const ref: string = obj.$ref
    if (ref?.startsWith('../schemas/')) { obj.$ref = ref.replace('../schemas/', '#/components/schemas/').replace('.yaml#/components/schemas/', ':') }

    for (const key in obj) {
      if (typeof obj[key] === 'object') { this.redirect_refs_in_namespace(obj[key]) }
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
      this.schemas[category] = spec.components.schemas as Record<string, OpenAPIV3.SchemaObject>
    })

    Object.entries(this.schemas).forEach(([category, schemas]) => {
      Object.entries(schemas).forEach(([name, schema_obj]) => {
        this.spec.components.schemas[`${category}:${name}`] = schema_obj
      })
    })
  }

  // Redirect schema references in schema files to local references in single-file spec.
  redirect_refs_in_schema (category: string, obj: any): void {
    const ref: string = obj.$ref ?? ''
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
    this.spec.components.schemas = _.fromPairs(Object.entries(this.spec.components.schemas as Document).sort((a, b) => a[0].localeCompare(b[0])))
    this.spec.components.parameters = _.fromPairs(Object.entries(this.spec.components.parameters as Document).sort((a, b) => a[0].localeCompare(b[0])))
    this.spec.components.responses = _.fromPairs(Object.entries(this.spec.components.responses as Document).sort((a, b) => a[0].localeCompare(b[0])))
    this.spec.components.requestBodies = _.fromPairs(Object.entries(this.spec.components.requestBodies as Document).sort((a, b) => a[0].localeCompare(b[0])))

    this.spec.paths = _.fromPairs(Object.entries(this.spec.paths as Document).sort((a, b) => a[0].localeCompare(b[0])))
    Object.entries(this.spec.paths as Document).forEach(([path, path_item]) => {
      this.spec.paths[path] = _.fromPairs(Object.entries(path_item as Document).sort((a, b) => a[0].localeCompare(b[0])))
    })
  }

  // Generate global parameters from _global_params.yaml file.
  #generate_global_params (): void {
    const gen = new GlobalParamsGenerator(this.root_folder)
    gen.generate(this.spec)
  }

  // Generate superseded operations from _superseded_operations.yaml file.
  #generate_superseded_ops (): void {
    const gen = new SupersededOpsGenerator(this.root_folder, this.logger)
    gen.generate(this.spec)
  }
}
