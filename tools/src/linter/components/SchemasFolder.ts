import SchemaFile from './SchemaFile'
import FolderValidator from './base/FolderValidator'
import { type ValidationError } from 'types'

export default class SchemasFolder extends FolderValidator<SchemaFile> {
  constructor (folder_path: string) {
    super(folder_path, SchemaFile)
  }

  validate_folder (): ValidationError[] {
    return []
  }
}
