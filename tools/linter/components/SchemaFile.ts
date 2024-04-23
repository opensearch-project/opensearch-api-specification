import FileValidator from './base/FileValidator'
import { type ValidationError } from '../../types'
import Schema from './Schema'
import { type OpenAPIV3 } from 'openapi-types'

const CATEGORY_REGEX = /^[a-z_]+\.[a-z_]+$/
const NAME_REGEX = /^[a-z]+[a-z_]*[a-z]+$/

export default class SchemaFile extends FileValidator {
  category: string
  _schemas: Schema[] | undefined

  constructor (file_path: string) {
    super(file_path)
    this.category = file_path.split('/').slice(-1)[0].replace('.yaml', '')
  }

  validate_file (): ValidationError[] {
    const category_error = this.validate_category()
    if (category_error) return [category_error]

    return [
      ...this.schemas().flatMap(s => s.validate())
    ]
  }

  schemas (): Schema[] {
    if (this._schemas) return this._schemas
    return Object.entries(this.spec().components?.schemas || {}).map(([name, spec]) => {
      return new Schema(this.file, name, spec as OpenAPIV3.SchemaObject)
    })
  }

  validate_category (category = this.category): ValidationError | void {
    if (category === '_common') return
    if (!category.match(CATEGORY_REGEX)) { return this.error(`Invalid category name '${category}'. Must match regex: /${CATEGORY_REGEX.source}/.`, 'File Name') }
    const name = category.split('.')[1]
    if (name !== '_common' && !name.match(NAME_REGEX)) { return this.error(`Invalid category name '${category}'. '${name}' does not match regex: /${NAME_REGEX.source}/.`, 'File Name') }
  }
}
