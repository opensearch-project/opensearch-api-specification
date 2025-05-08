/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import ValidatorBase from './ValidatorBase'
import { type ValidationError } from 'types'
import { type OpenAPIV3_1 } from 'openapi-types'
import { read_yaml } from '../../../helpers'
import JsonSchemaValidator from "../../../_utils/JsonSchemaValidator";

export default class FileValidator<Spec = OpenAPIV3_1.Document> extends ValidatorBase {
  file_path: string
  has_json_schema: boolean = false
  protected _spec: Spec | undefined

  constructor (file_path: string) {
    super(file_path.split('/').slice(-2).join('/'))
    this.file_path = file_path
  }

  spec (): Spec {
    if (this._spec !== undefined) return this._spec
    this._spec = read_yaml<Spec>(this.file_path)
    return this._spec
  }

  validate (): ValidationError[] {
    const extension_error = this.validate_extension()
    if (extension_error) return [extension_error]
    const yaml_error = this.validate_yaml()
    if (yaml_error) return [yaml_error]
    const json_schema_error = this.validate_json_schema()
    if (json_schema_error) return [json_schema_error]
    return this.validate_file()
  }

  validate_file (): ValidationError[] {
    return []
  }

  validate_extension (): ValidationError | undefined {
    if (!this.file_path.endsWith('.yaml')) { return this.error('Invalid file extension. Only \'.yaml\' files are allowed.', 'File Extension') }
  }

  validate_yaml (): ValidationError | undefined {
    try {
      this.spec()
    } catch (e: any) {
      return this.error('Unable to read or parse YAML.', 'File Content')
    }
  }

  validate_json_schema (): ValidationError | undefined {
    if (!this.has_json_schema) return
    const json_schema_path: string = (this.spec() as any).$schema ?? ''
    if (json_schema_path === '') return this.error('JSON Schema is required but not found in this file.', '$schema')
    const schema = read_yaml(json_schema_path)
    delete schema.$schema
    const validator = new JsonSchemaValidator()
    const message = validator.validate_data(this.spec(), schema)
    if (message != null)
      return this.error(`File content does not match JSON schema found in '${json_schema_path}': ${message}`)
  }
}
