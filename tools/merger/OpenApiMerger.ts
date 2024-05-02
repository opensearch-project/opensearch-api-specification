import { type OpenAPIV3 } from 'openapi-types'
import fs from 'fs'
import _ from 'lodash'
import yaml from 'yaml'
import { write_to_yaml } from '../helpers'
import SupersededOpsGenerator from './SupersededOpsGenerator'

// Create a single-file OpenAPI spec from multiple files for OpenAPI validation and programmatic consumption
export default class OpenApiMerger {
  root_path: string
  root_folder: string
  spec: Record<string, any>
  global_param_refs: OpenAPIV3.ReferenceObject[]

  paths: Record<string, Record<string, OpenAPIV3.PathItemObject>> = {} // namespace -> path -> path_item_object
  schemas: Record<string, Record<string, OpenAPIV3.SchemaObject>> = {} // category -> schema -> schema_object

  constructor (root_path: string) {
    this.root_path = fs.realpathSync(root_path)
    this.root_folder = this.root_path.split('/').slice(0, -1).join('/')
    this.spec = yaml.parse(fs.readFileSync(this.root_path, 'utf8'))
    const global_params: OpenAPIV3.ParameterObject = this.spec.components?.parameters ?? {}
    this.global_param_refs = Object.keys(global_params).map(param => ({ $ref: `#/components/parameters/${param}` }))
    this.spec.components = {
      parameters: global_params,
      requestBodies: {},
      responses: {},
      schemas: {}
    }
  }

  merge (output_path: string = ''): OpenAPIV3.Document {
    this.#merge_schemas()
    this.#merge_namespaces()
    this.#apply_global_params()
    this.#sort_spec_keys()
    this.#generate_replaced_ops()

    if (output_path !== '') write_to_yaml(output_path, this.spec)
    return this.spec as OpenAPIV3.Document
  }

  // Apply global parameters to all operations in the spec.
  #apply_global_params (): void {
    Object.entries(this.spec.paths as Document).forEach(([path, path_item]) => {
      Object.entries(path_item as Document).forEach(([method, operation]) => {
        const params = operation.parameters ?? []
        operation.parameters = [...params, ...Object.values(this.global_param_refs)]
      })
    })
  }

  // Merge files from <spec_root>/namespaces folder.
  #merge_namespaces (): void {
    const folder = `${this.root_folder}/namespaces`
    fs.readdirSync(folder).forEach(file => {
      const spec = yaml.parse(fs.readFileSync(`${folder}/${file}`, 'utf8'))
      const namespace = file.split('.yaml')[0]
      this.redirect_refs_in_namespace(spec)
      this.paths[namespace] = spec.paths
      this.spec.components.parameters = { ...this.spec.components.parameters, ...spec.components.parameters }
      this.spec.components.responses = { ...this.spec.components.responses, ...spec.components.responses }
      this.spec.components.requestBodies = { ...this.spec.components.requestBodies, ...spec.components.requestBodies }
    })

    Object.entries(this.spec.paths as Document).forEach(([path, ref_obj]) => {
      const ref: string = (ref_obj as Record<string, any>).$ref ?? ''
      const namespace = ref.match(/namespaces\/(.*)\.yaml/)?.[1] ?? ''
      if (namespace === '') throw new Error(`Invalid path reference: ${ref}`)
      this.spec.paths[path] = this.paths[namespace][path]
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
      const spec = yaml.parse(fs.readFileSync(`${folder}/${file}`, 'utf8'))
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

  #generate_replaced_ops (): void {
    const gen = new SupersededOpsGenerator(this.root_folder)
    gen.generate(this.spec)
  }
}
