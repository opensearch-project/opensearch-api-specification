import { type ParameterSpec, type ValidationError } from '../../types'
import FileValidator from './base/FileValidator'

export default class RootFile extends FileValidator {
  constructor (file_path: string) {
    super(file_path)
    this.file = file_path.split('/').pop() ?? ''
  }

  validate_file (): ValidationError[] {
    return [
      this.validate_paths(),
      this.validate_params()
    ].flat()
  }

  validate_paths (): ValidationError[] {
    return Object.entries(this.spec().paths).map(([path, spec]) => {
      if (spec?.$ref != null) return undefined
      return this.error('Every path must be a reference object to a path in a namespace file.', `Path: ${path}`)
    }).filter((e) => e) as ValidationError[]
  }

  validate_params (): ValidationError[] {
    const params = (this.spec().components?.parameters ?? {}) as Record<string, ParameterSpec>
    return Object.entries(params).map(([name, param]) => {
      const expected = `_global::${param.in}.${param.name}`
      if (name !== expected) { return this.error(`Parameters in root file must be in the format '_global::{in}.{name}'. Expected '${expected}'.`, `#/components/parameters/${name}`) }
      if (param['x-global'] !== true) { return this.error('Parameters in root file must have \'x-global\' extension set to true.', `#/components/parameters/${name}`) }
    }).filter((e) => e) as ValidationError[]
  }
}
