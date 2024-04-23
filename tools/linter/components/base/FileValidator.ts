import ValidatorBase from './ValidatorBase'
import { ValidationError } from '../../../types'
import fs from 'fs'
import YAML from 'yaml'
import { OpenAPIV3 } from 'openapi-types'

export default class FileValidator extends ValidatorBase {
  file_path: string
  _spec: OpenAPIV3.Document | undefined

  constructor (file_path: string) {
    super(file_path.split('/').slice(-2).join('/'))
    this.file_path = file_path
  }

  spec (): OpenAPIV3.Document {
    if (this._spec) return this._spec
    return this._spec = YAML.parse(fs.readFileSync(this.file_path, 'utf8')) || {}
  }

  validate (...args: any[]): ValidationError[] {
    const extension_error = this.validate_extension()
    if (extension_error) return [extension_error]
    const yaml_error = this.validate_yaml()
    if (yaml_error) return [yaml_error]
    return this.validate_file()
  }

  validate_file (...args: any[]): ValidationError[] {
    throw new Error('Method not implemented.')
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
}
