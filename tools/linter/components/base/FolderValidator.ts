import fs from 'fs'
import ValidatorBase from './ValidatorBase'
import type FileValidator from './FileValidator'
import { type ValidationError } from '../../../types'

export default class FolderValidator<F extends FileValidator> extends ValidatorBase {
  folder_path: string
  files: F[]

  constructor (folder_path: string, file_type: new (file_path: string) => F) {
    const parts = folder_path.split('/').reverse()
    const folder_name = (parts[0] ?? parts[1]) + '/'
    super(folder_name, 'Folder')
    this.folder_path = folder_path
    this.files = fs.readdirSync(this.folder_path).sort()
      .filter((file) => file !== '.gitkeep')
      .map((file) => { return new file_type(`${this.folder_path}/${file}`) })
  }

  validate (): ValidationError[] {
    const file_errors = this.files.flatMap((file) => file.validate())
    if (file_errors.length > 0) return file_errors
    return this.validate_folder()
  }

  validate_folder (): ValidationError[] {
    throw new Error('Method not implemented.')
  }
}
